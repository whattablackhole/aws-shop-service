import { APIGatewayEvent } from "aws-lambda";
import { lambdaHandlerWrapper } from "../helpers/lambda-handler-wrapper";
import { validateBySchema } from "../helpers/validators";
import { ApiError } from "../infrastructure/api-error";
import productPayloadSchema from "../infrastructure/schemas/productSchema";
import productService from "../services/products.service";

export const createProduct = lambdaHandlerWrapper(
  async (event: APIGatewayEvent) => {
    if (!event.body) {
      throw new ApiError(
        "ValidationError",
        400,
        "Invalid object payload type!"
      );
    }
    const newProduct = JSON.parse(event.body);
    const isValidProductInfo = validateBySchema(
      newProduct,
      productPayloadSchema
    );

    if (isValidProductInfo) {
      await productService.uploadProduct(newProduct);
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          message: "Product successfuly uploaded!",
        }),
      };
    } else {
      throw new ApiError(
        "ValidationError",
        400,
        "Invalid object payload type!"
      );
    }
  }
);
