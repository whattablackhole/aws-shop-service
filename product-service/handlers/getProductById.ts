import { APIGatewayEvent, APIGatewayProxyHandler } from "aws-lambda";
import { lambdaHandlerWrapper } from "../helpers/lambda-handler-wrapper";
import productService from "../services/products.service";

export const getProductById = lambdaHandlerWrapper(async function (
  event: APIGatewayEvent
) {
  const productId = event.pathParameters?.["id"];

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
    body: JSON.stringify(product, null, 2),
  };
}) as APIGatewayProxyHandler;
