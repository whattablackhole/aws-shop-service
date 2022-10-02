const productPayloadSchema = {
  properties: {
    description: {
      type: "string",
    },
    price: { type: "number" },
    title: { type: "string" },
  },
  required: ["title", "description", "price"],
};

export default productPayloadSchema;
