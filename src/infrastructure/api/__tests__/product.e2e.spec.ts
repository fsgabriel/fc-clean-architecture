import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  const createProducts = async (name: string, price: number) => {
    const response = await request(app).post("/product").send({
      name: name,
      price: price,
      type: "a",
    });

    expect(response.status).toBe(200);
  };

  it("should create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "Mouse",
      price: 20,
      type: "a",
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Mouse");
    expect(response.body.price).toBe(20);
  });

  it("should error on create product", async () => {
    const response = await request(app)
      .post("/product")
      .send({ name: "invalid" });

    expect(response.status).toBe(500);
  });

  it("should list all products", async () => {
    await createProducts("Headset", 30);
    await createProducts("Mouse", 10);

    const responseJson = await request(app)
      .get("/product")
      .set("Accept", "application/json")
      .send();

    expect(responseJson.status).toBe(200);
    expect(responseJson.body.products[0].name).toBe("Headset");
    expect(responseJson.body.products[0].price).toBe(30);

    expect(responseJson.body.products[1].name).toBe("Mouse");
    expect(responseJson.body.products[1].price).toBe(10);

    const responseXML = await request(app)
      .get("/product")
      .set("Accept", "application/xml")
      .send();

    expect(responseXML.status).toBe(200);
    expect(responseXML.text).toContain(
      `<?xml version="1.0" encoding="UTF-8"?>`,
    );
    expect(responseXML.text).toContain(`<products>`);
    expect(responseXML.text).toContain(`<product>`);
    expect(responseXML.text).toContain(`<name>Headset</name>`);
    expect(responseXML.text).toContain(`<price>30</price>`);
    expect(responseXML.text).toContain(`</product>`);
    expect(responseXML.text).toContain(`<product>`);
    expect(responseXML.text).toContain(`<name>Mouse</name>`);
    expect(responseXML.text).toContain(`<price>10</price>`);
    expect(responseXML.text).toContain(`</product>`);
    expect(responseXML.text).toContain(`</products>`);
  });
});
