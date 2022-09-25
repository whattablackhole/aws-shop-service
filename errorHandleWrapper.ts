export function errorHandleWrapper(func: (...args: any) => any) {
  return async (...args) => {
    try {
      return await func(...args);
    } catch (err) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: err instanceof Error ? err.message : "unknown error",
        }),
      };
    }
  };
}
