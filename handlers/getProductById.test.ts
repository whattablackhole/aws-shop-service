import { getProductById } from "./getProductById";

jest.mock("../services/products.json", () => ({
  __esModule: true,
  default: [
    { id: "1", name: "Best Product" },
    { id: "2", name: "zara jeanss" },
    { id: "3", name: "stradivari" },
    { id: "4" },
  ],
}));

describe("Lambda handler - getProductById", () => {
  it("should return product by specified id", async () => {
    const expectedResponse = {
      body: JSON.stringify({ id: "1", name: "Best Product" }),
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*",
      },
    };
    const result = await getProductById(
      {
        pathParameters: {
          id: "1",
        },
      } as any,
      {} as any,
      {} as any
    );
    expect(result).toEqual(expectedResponse);
  });
});
