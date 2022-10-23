export const basicAuthorizer = async (event: any, ctx, cb) => {
  if (event["type"] != "TOKEN") {
    return cb("Unauthorized", null);
  }

  try {
    let effect;
    const [prefix, token] = event.authorizationToken.split(" ");

    if (prefix !== "Basic") {
      const policy = generatePolicy(token, event.methodArn, "Deny");

      return cb(null, policy);
    }

    const buff = Buffer.from(token, "base64");
    const plainCreds = buff.toString("utf-8").split(":");
    const username = plainCreds[0];
    const password = plainCreds[1];

    console.log(`username: ${username} and password: ${password}`);

    const storedUserPassword = process.env[username];

    effect =
      !storedUserPassword || storedUserPassword != password ? "Deny" : "Allow";

    const policy = generatePolicy(token, event.methodArn, effect);

    cb(null, policy);
  } catch (err) {
    return cb("Unauthorized", null);
  }
};

const generatePolicy = (principalId, resource, effect = "Allow") => {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};
