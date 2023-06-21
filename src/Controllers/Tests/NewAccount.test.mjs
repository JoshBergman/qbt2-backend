import request from "supertest";
import app from "../../Index.mjs";

let server;

beforeAll(() => {
  server = app.listen(5000, () => {
    console.log("Server started");
  });
});

afterAll((done) => {
  server.close(done);
});

test("GET /api/endpoint should return the expected data", async () => {
  // Send a GET request to the API endpoint using Supertest
  const response = await request(app).get("/qbt/api/account/test");

  // Perform assertions to check the expected response
  const expectedResponse = {
    error: false,
    msg: "Hello it may have worked finally.",
  };
  expect(response.status).toBe(200);
  expect(response.body).toEqual(expectedResponse);
});
