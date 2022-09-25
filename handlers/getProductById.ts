import { APIGatewayEvent, APIGatewayProxyHandler } from "aws-lambda";
import { errorHandleWrapper } from "../errorHandleWrapper";
import productService from "../services/products.service";

export const getProductById = errorHandleWrapper(async function (
  event: APIGatewayEvent
) {
  const productId = event.pathParameters["id"];

  if (!productId) {
    throw new Error("Bad request id!");
  }

  const product = await productService.getProductDataById(productId);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(product),
  };
}) as APIGatewayProxyHandler;
