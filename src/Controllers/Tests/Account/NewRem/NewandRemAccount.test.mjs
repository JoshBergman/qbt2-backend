import request from "supertest";
import app from "../../../../Index.mjs";

let server;
beforeAll(() => {
  server = app.listen(5000, () => {});
});

afterAll((done) => {
  server.close(done);
});

test("Create new test account /qbt/api/account/new", async () => {
  const validBody = {
    email: "TestAdd@TestAdd.com",
    password: "testAdd",
    expenses: [
      ["Car", 600],
      ["House", 1200],
    ],
  };
  const response = await request(app)
    .post("/qbt/api/account/new")
    .send(validBody);

  const expectedResponse = {
    error: false,
  };

  expect(response.status).toBe(200);
  expect(response.body).toEqual(expectedResponse);
});

test("Delete a test account /qbt/api/account/delete", async () => {
  const validBody = {
    email: "TestAdd@TestAdd.com",
    password: "testAdd",
  };

  const response = await request(app)
    .delete("/qbt/api/account/delete")
    .send(validBody);

  const expectedResponse = {
    error: false,
  };

  expect(response.status).toBe(200);
  expect(response.body).toEqual(expectedResponse);
});
