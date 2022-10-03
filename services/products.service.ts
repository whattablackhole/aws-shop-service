import AWS from "aws-sdk";
import { ProductTableItem, StocksTableItem } from "../infrastructure/interfaces/db-data";
import { v4 as uuidv4 } from "uuid";
import { ApiError } from "../infrastructure/api-error";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const productService = {
  getProductData: async () => {
    const products = await dynamoDb
      .scan({
        TableName: "Products",
      })
      .promise();
    const stocks = await dynamoDb
      .scan({
        TableName: "Stocks",
      })
      .promise();
    products.Items?.forEach((product) => {
      const stockItem = stocks.Items?.find(
        (s) => s.product_id === product.id
      ) as StocksTableItem;
      if (stockItem) {
        product["count"] = stockItem.count;
      }
    });
    return Promise.resolve(products.Items);
  },
  getProductDataById: async (id: string) => {
    return dynamoDb
      .get({
        TableName: "Products",
        Key: {
          id,
        },
      })
      .promise()
      .then(async (product) => {
        if (product.Item?.id === id) {
          const stock = await dynamoDb
            .get({
              TableName: "Stocks",
              Key: {
                product_id: id,
              },
            })
            .promise();
          if (stock) {
            product.Item.count = stock.Item?.count;
          }
          return product.Item as ProductTableItem;
        }
        throw new Error("No item with such id");
      });
  },

  uploadProduct: async (productPayload: object) => {
    const result = await dynamoDb
      .put({
        TableName: "Products",
        Item: {
          id: uuidv4(),
          ...productPayload,
        },
      })
      .promise()
      .catch((err) => {
        throw new ApiError(
          err.name ?? "db error",
          500,
          err.message ?? "unkown db error"
        );
      });
    if (result.$response.error) {
      throw new ApiError(
        result.$response.error.name ?? "db error",
        500,
        result.$response.error.message ?? "unkown db error"
      );
    }
  },
};

export default productService;
