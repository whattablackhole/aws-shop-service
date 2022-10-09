import { lambdaHandlerWrapper } from "../helpers/lambda-handler-wrapper";
import productService from "../services/products.service";

export const getProductsList = lambdaHandlerWrapper(async function () {
  const products = await productService.getProductData();

  if (!products?.length) {
    throw new Error("Requested data doesn't exist anymore");
  }

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: '',
  };

  try {
    response.body = JSON.stringify(products, null, 2);
  } catch (err) {
    throw new Error(
      "Server has problems with getting the latest data! Please try again"
    );
  }

  return response;
});
