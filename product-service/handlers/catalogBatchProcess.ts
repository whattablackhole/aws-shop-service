import sns from "aws-sdk/clients/sns";
import { lambdaHandlerWrapper } from "../helpers/lambda-handler-wrapper";
import { validateBySchema } from "../helpers/validators";
import { ApiError } from "../infrastructure/api-error";
import { ProductTableItem } from "../infrastructure/interfaces/db-data";
import productPayloadSchema from "../infrastructure/schemas/productSchema";
import productService from "../services/products.service";

export const catalogBatchProcess = lambdaHandlerWrapper(async function (
  event: any
) {
  const snsClient = new sns({ region: "eu-west-1" });

  const products: ProductTableItem[] = event.Records.map((r) => {
    const product = JSON.parse(r.body);
    return {
      description: product.description,
      price: parseInt(product.price),
      title: product.title,
      count: parseInt(product.count),
    } as ProductTableItem;
  });

  const isValidPayload = products.every((p) => {
    return validateBySchema(p, productPayloadSchema);
  });

  if (!isValidPayload) {
    throw new ApiError("ValidationError", 400, "Invalid object payload type!");
  }

  productService.uploadProducts(products);

  snsClient.publish(
    {
      Subject: "Hello! New Products were created!",
      Message: JSON.stringify(products),
      TopicArn: process.env.SNS_URL,
    },
    () => {}
  );

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };
});
