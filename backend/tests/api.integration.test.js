// Integration tests — need a running MongoDB. They are SKIPPED unless TEST_MONGO_URI is set, e.g.:
//   TEST_MONGO_URI=mongodb://127.0.0.1:27017/visiontag_test npm test
const { test, before, after } = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { fakeAzureResponse } = require("./helpers");

const enabled = Boolean(process.env.TEST_MONGO_URI);
const skip = enabled ? false : "set TEST_MONGO_URI to run API integration tests";

let request, app, mongoose, token, analysisId;
const user = { fullName: "Test User", email: `test_${Date.now()}@example.com`, password: "Password123" };

const imageFile = () => {
  const file = path.join(os.tmpdir(), `vt-int-${Date.now()}.png`);
  fs.writeFileSync(file, Buffer.from("89504e470d0a1a0a", "hex"));
  return file;
};

before(async () => {
  if (!enabled) return;
  require("axios").post = async () => fakeAzureResponse; // never call the real Azure API in tests
  request = require("supertest");
  mongoose = require("mongoose");
  app = require("../src/app");
  await mongoose.connect(process.env.MONGO_URI);
});

after(async () => {
  if (!enabled) return;
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

test("UC-02 register", { skip }, async () => {
  const res = await request(app).post("/api/auth/register").send(user);
  assert.strictEqual(res.status, 201);
});

test("UC-02 duplicate email is rejected", { skip }, async () => {
  const res = await request(app).post("/api/auth/register").send(user);
  assert.strictEqual(res.status, 409);
});

test("UC-03 login with wrong password fails, correct password returns JWT", { skip }, async () => {
  const bad = await request(app).post("/api/auth/login").send({ email: user.email, password: "wrongpass1" });
  assert.strictEqual(bad.status, 401);
  const ok = await request(app).post("/api/auth/login").send({ email: user.email, password: user.password });
  assert.strictEqual(ok.status, 200);
  token = ok.body.data?.token || ok.body.token;
  assert.ok(token);
});

test("UC-06 guest analysis returns tags and is NOT saved (FR-10)", { skip }, async () => {
  const res = await request(app).post("/api/images/analyze").attach("image", imageFile());
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.data.saved, false);
  assert.ok(res.body.data.tags.length > 0);
});

test("FR-03 non-image upload is rejected", { skip }, async () => {
  const txt = path.join(os.tmpdir(), "x.txt");
  fs.writeFileSync(txt, "hello");
  const res = await request(app).post("/api/images/analyze").attach("image", txt);
  assert.strictEqual(res.status, 400);
});

test("UC-01 logged-in analysis is saved", { skip }, async () => {
  const res = await request(app).post("/api/images/analyze").set("Authorization", `Bearer ${token}`).attach("image", imageFile());
  assert.strictEqual(res.status, 201);
  analysisId = res.body.data.id;
  assert.ok(analysisId);
});

test("UC-04 / UC-08 history list and tag filter", { skip }, async () => {
  const all = await request(app).get("/api/history").set("Authorization", `Bearer ${token}`);
  assert.strictEqual(all.body.data.length, 1);
  const hit = await request(app).get("/api/history?tag=do").set("Authorization", `Bearer ${token}`);
  assert.strictEqual(hit.body.data.length, 1);
  const miss = await request(app).get("/api/history?tag=zzzz").set("Authorization", `Bearer ${token}`);
  assert.strictEqual(miss.body.data.length, 0);
});

test("History requires authentication", { skip }, async () => {
  const res = await request(app).get("/api/history");
  assert.strictEqual(res.status, 401);
});

test("UC-07 edit tags marks entry as user-edited", { skip }, async () => {
  const res = await request(app)
    .put(`/api/analyses/${analysisId}/tags`)
    .set("Authorization", `Bearer ${token}`)
    .send({ tags: [{ label: "puppy", confidence: 99 }] });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.data.editedByUser, true);
});

test("UC-12 export as JSON", { skip }, async () => {
  const res = await request(app).get(`/api/analyses/${analysisId}/export?format=json`).set("Authorization", `Bearer ${token}`);
  assert.strictEqual(res.status, 200);
});

test("UC-05 delete entry, FR-09 clear history", { skip }, async () => {
  const del = await request(app).delete(`/api/history/${analysisId}`).set("Authorization", `Bearer ${token}`);
  assert.strictEqual(del.status, 200);
  const clear = await request(app).delete("/api/history").set("Authorization", `Bearer ${token}`);
  assert.strictEqual(clear.status, 200);
});

test("UC-11 profile get/update", { skip }, async () => {
  const get = await request(app).get("/api/users/profile").set("Authorization", `Bearer ${token}`);
  assert.strictEqual(get.status, 200);
  assert.ok(!JSON.stringify(get.body).includes("passwordHash"));
  const put = await request(app).put("/api/users/profile").set("Authorization", `Bearer ${token}`).send({ fullName: "Renamed" });
  assert.strictEqual(put.status, 200);
});

test("UC-09 logout blacklists the token (FR-13)", { skip }, async () => {
  const out = await request(app).post("/api/auth/logout").set("Authorization", `Bearer ${token}`);
  assert.strictEqual(out.status, 200);
  const after = await request(app).get("/api/history").set("Authorization", `Bearer ${token}`);
  assert.strictEqual(after.status, 401);
});
