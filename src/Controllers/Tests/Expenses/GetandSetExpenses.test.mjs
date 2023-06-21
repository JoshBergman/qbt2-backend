import request from "supertest";
import app from "../../../Index.mjs";

let server;
beforeAll(() => {
  server = app.listen(5001, () => {});
});

afterAll((done) => {
  server.close(done);
});

test("Sets Expenses /qbt/api/expenses/set", async () => {
  const validBody = {
    email: "expensesTesting@Test.email",
    sessionID: "C8F9lVsb2X",
    expenses: [
      ["Updatede Expenses", 100],
      ["I Guess It Worked", 3300],
    ],
  };

  const response = await request(app)
    .post("/qbt/api/expenses/set")
    .send(validBody);

  const expectedResponse = {
    error: false,
  };

  expect(response.status).toBe(200);
  expect(response.body).toEqual(expectedResponse);
});

test("Retrieves Expenses /qbt/api/expenses/get", async () => {
  const validBody = {
    email: "expensesTesting@Test.email",
    sessionID: "C8F9lVsb2X",
  };
  const response = await request(app)
    .get("/qbt/api/expenses/get")
    .send(validBody);

  const expectedResponse = {
    error: false,
    expenses: [
      ["Updatede Expenses", 100],
      ["I Guess It Worked", 3300],
    ],
  };

  expect(response.status).toBe(200);
  expect(response.body).toEqual(expectedResponse);
});
