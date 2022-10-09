import { ApiError } from "../infrastructure/api-error";

export function lambdaHandlerWrapper(func: (...args: any) => any) {
  return async (...args) => {
    console.log("LAMBDA REQUEST:", args[0]);
    console.log("LAMBDA ARGUMENTS:", ...args);
    try {
      return await func(...args);
    } catch (err) {
      return {
        statusCode: err instanceof ApiError ? err.statusCode : 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          message: err instanceof Error ? err.message : "unknown error",
        }),
      };
    }
  };
}
