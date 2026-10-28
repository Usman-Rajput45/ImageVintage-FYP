// Shared test setup: set the env vars the app needs BEFORE any app module is required.
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret_for_unit_tests";
process.env.MONGO_URI = process.env.TEST_MONGO_URI || "mongodb://127.0.0.1:27017/visiontag_test";
process.env.AZURE_VISION_KEY = "test-key";
process.env.AZURE_VISION_ENDPOINT = "https://example.cognitiveservices.azure.com/";
process.env.CLIENT_ORIGIN = "http://localhost:5173";

// Fake Azure Computer Vision v3.2 response (0-1 confidences, like the real API)
const fakeAzureResponse = {
  data: {
    tags: [
      { name: "dog", confidence: 0.985 },
      { name: "grass", confidence: 0.9 },
      { name: "outdoor", confidence: 0.8 },
    ],
    description: { captions: [{ text: "a dog sitting on grass", confidence: 0.9 }] },
  },
};

module.exports = { fakeAzureResponse };
