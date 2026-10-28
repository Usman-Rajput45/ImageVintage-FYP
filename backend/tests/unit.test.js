// Unit tests — need NO database. Run with: npm test
const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { fakeAzureResponse } = require("./helpers");

const axios = require("axios");
const { analyzeImageFile } = require("../src/features/image-analysis/azureVision.service");
const { isEmail, required, minLength, email } = require("../src/utils/validate");

const tempImage = () => {
  const file = path.join(os.tmpdir(), `vt-test-${Date.now()}.jpg`);
  fs.writeFileSync(file, Buffer.from([0xff, 0xd8, 0xff, 0xd9]));
  return file;
};

test("TC-01 Azure response is parsed into tags (0-100 scale), caption and average (FR-04/05/06)", async () => {
  axios.post = async () => fakeAzureResponse;
  const result = await analyzeImageFile(tempImage());
  assert.deepStrictEqual(result.tags[0], { label: "dog", confidence: 98.5 });
  assert.strictEqual(result.tags.length, 3);
  assert.strictEqual(result.caption, "a dog sitting on grass");
  assert.strictEqual(result.confidenceAvg, 89.5);
});

test("TC-02 tags are sorted by confidence, highest first", async () => {
  axios.post = async () => ({
    data: { tags: [{ name: "a", confidence: 0.2 }, { name: "b", confidence: 0.9 }], description: { captions: [] } },
  });
  const result = await analyzeImageFile(tempImage());
  assert.strictEqual(result.tags[0].label, "b");
  assert.strictEqual(result.caption, "No description available.");
});

test("TC-03 Azure timeout becomes a 504 error (FR-07)", async () => {
  axios.post = async () => {
    const err = new Error("timeout");
    err.code = "ECONNABORTED";
    throw err;
  };
  await assert.rejects(() => analyzeImageFile(tempImage()), (err) => err.statusCode === 504 || err.status === 504);
});

test("TC-04 Azure outage becomes a 502 error (FR-07)", async () => {
  axios.post = async () => {
    const err = new Error("boom");
    err.response = { status: 500, data: {} };
    throw err;
  };
  await assert.rejects(() => analyzeImageFile(tempImage()), (err) => err.statusCode === 502 || err.status === 502);
});

test("TC-05 email validation (FR-01)", () => {
  assert.ok(isEmail("user@example.com"));
  assert.ok(!isEmail("not-an-email"));
  assert.strictEqual(email()("bad"), "Please provide a valid email address.");
});

test("TC-06 required / minLength validators (FR-01)", () => {
  assert.ok(required("Name")(""));
  assert.strictEqual(required("Name")("Ali"), null);
  assert.ok(minLength(8, "Password")("short"));
  assert.strictEqual(minLength(8, "Password")("longenough"), null);
});
