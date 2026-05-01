import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../app.module";
import request from "supertest";

describe("TeamsController", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("POST /teams", async () => {
    const payload = {
      name: "Toronto Maple Leafs",
      value: "NHL Team",
    };

    const response = await request(app.getHttpServer())
      .post("/teams")
      .send(payload)
      .expect(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(payload.name);
    expect(response.body.value).toBe(payload.value);
  });

  it("GET /teams should include created team", async () => {
    const response = await request(app.getHttpServer())
      .get("/teams")
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toEqual({
      id: expect.any(String),
      name: "Toronto Maple Leafs",
      value: "NHL Team",
      createdAt: expect.any(String),
    });
  });
});
