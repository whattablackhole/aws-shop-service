import productService from "../services/products.service";
import { catalogBatchProcess } from "./catalogBatchProcess";

const snsMock = {
  publish: jest.fn(),
};

jest.mock("aws-sdk/clients/sns", () => {
  return function () {
    return snsMock;
  };
});

describe("Lambda handler - catalogBatchProcess", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should upload products list if records contain required fields", async () => {
    const uploadProductsSpy = jest.spyOn(productService, "uploadProducts");
    const expectedProducts = [
      {
        description: "testDescription",
        price: 100,
        title: "testTitle",
        count: 5,
      },
      {
        description: "testDescription",
        price: 100,
        title: "testTitle",
        count: 5,
      },
    ];
    const event = {
      Records: [
        {
          body: JSON.stringify(expectedProducts[0]),
        },
        {
          body: JSON.stringify(expectedProducts[1]),
        },
      ],
    };

    const result = await catalogBatchProcess(event);
    expect(result).toEqual({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    });
    expect(snsMock.publish).toBeCalledWith(
      {
        Subject: "Hello! New Products were created!",
        Message: JSON.stringify(expectedProducts),
        TopicArn: process.env.SNS_URL,
      },
      expect.any(Function)
    );
    expect(uploadProductsSpy).toHaveBeenCalledWith(expectedProducts);
  });

  it("should not upload products list if some of record does`nt contain required fields", async () => {
    const uploadProductsSpy = jest.spyOn(productService, "uploadProducts");
    const expectedProducts = [
      {
        description: "testDescription",
        price: 100,
        count: 5,
      },
      {
        description: "testDescription",
        price: 100,
        count: 5,
      },
    ];
    const event = {
      Records: [
        {
          body: JSON.stringify(expectedProducts[0]),
        },
        {
          body: JSON.stringify(expectedProducts[1]),
        },
      ],
    };

    const result = await catalogBatchProcess(event);

    expect(result).toEqual({
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: "Invalid object payload type!",
      }),
    });
    expect(snsMock.publish).not.toBeCalled();
    expect(uploadProductsSpy).not.toBeCalled();
  });
});
