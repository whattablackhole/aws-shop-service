import { S3 } from "aws-sdk";
import { APIGatewayEvent } from "aws-lambda";

const s3 = new S3({ region: "eu-west-1", signatureVersion: "v4" });

export const importProductsFile = async (request: APIGatewayEvent) => {
  try {
    const fileName = request.queryStringParameters.name;
    const bucketParams = {
      Bucket: `wbh-imports`,
      Key: `uploaded/${fileName}`,
      Expires: 100000,
    };

    const signedURL = await s3.getSignedUrl("putObject", bucketParams);
    
    const response = {
      statusCode: 200,
      body: signedURL,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Encoding": "UTF-8",
        ContentType: "text/csv",
      },
    };

    return response;
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
