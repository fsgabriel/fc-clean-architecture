import { Sequelize } from "sequelize-typescript";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import CreateProductUseCase from "../create/create.product.usecase";

describe("Test update product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const createUsecase = new CreateProductUseCase(productRepository);
    const product = await createUsecase.execute({
      name: "Product",
      price: 10,
      type: "a",
    });

    const input = {
      id: product.id,
      name: "Product Update",
      price: 300,
    };

    const result = await usecase.execute(input);

    expect(result).toEqual({
      id: product.id,
      name: "Product Update",
      price: 300,
    });
  });
});
