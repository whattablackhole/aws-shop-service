import { getProductsList } from "./getProductsList";

jest.mock("../services/products.json", () => ({
  __esModule: true,
  default: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
}));

describe("Lambda handler - getProductsList", () => {
  it("should return products list", async () => {
    const expectedResponse = {
      body: JSON.stringify([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]),
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*",
      },
    };

    const result = await getProductsList();
    expect(result).toEqual(expectedResponse);
  });
});
