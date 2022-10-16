import { S3, SQS } from "aws-sdk";
const csv = require("csv-parser");

const s3 = new S3({ region: "eu-west-1", signatureVersion: "v4" });
const sqs = new SQS({ region: "eu-west-1" });

export const importFileParser = async (request: any) => {
  const bucketName = request.Records[0].s3.bucket.name;
  const key = request.Records[0].s3.object.key;

  const streamEnd = new Promise((resolve) => {
    const readStream = s3
      .getObject({
        Bucket: bucketName,
        Key: key,
      })
      .createReadStream();
    readStream
      .pipe(csv())
      .on("data", async (data) => {
        sqs.sendMessage(
          {
            QueueUrl:
              "https://sqs.eu-west-1.amazonaws.com/048768189929/products-sqs-queue",
            MessageBody: JSON.stringify(data),
          },
          () => {}
        );
      })
      .on("error", (error) => {
        console.log(error);
        resolve({ statusCode: 500 });
      })
      .on("end", () => {
        resolve({ statusCode: 200 });
      });
  });

  let result = await streamEnd;

  try {
    await s3
      .copyObject({
        Bucket: bucketName,
        CopySource: bucketName + "/" + key,
        Key: key.replace("uploaded", "parsed"),
      })
      .promise();

    await s3
      .deleteObject({
        Bucket: bucketName,
        Key: key,
      })
      .promise();
  } catch (err) {
    result = {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }

  return result;
};
