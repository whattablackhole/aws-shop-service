const { catalogBatchProcess } = require("./handlers/catalogBatchProcess");
const { getProductById } = require("./handlers/getProductById");
const { getProductsList } = require("./handlers/getProductsList");
const { createProduct } = require("./handlers/createProduct");

export { getProductById, getProductsList, createProduct, catalogBatchProcess };
