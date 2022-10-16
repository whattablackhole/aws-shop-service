const productPayloadSchema = {
  properties: {
    description: {
      type: "string",
    },
    price: { type: "number" },
    title: { type: "string" },
    count: { type: "number" },
  },
  required: ["title", "description", "price", "count"],
};

export default productPayloadSchema;
