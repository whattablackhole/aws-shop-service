import { errorHandleWrapper } from "../errorHandleWrapper";
import productService from "../services/products.service";

export const getProductsList = errorHandleWrapper(async function () {
  const products = await productService.getProductData();

  if (!products.length) {
    throw new Error("Requested data doesn't exist anymore");
  }

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: null,
  };

  try {
    response.body = JSON.stringify(products);
  } catch (err) {
    throw new Error(
      "Server has problems with getting the latest data! Please try again"
    );
  }

  return response;
});
