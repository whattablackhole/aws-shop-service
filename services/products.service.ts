import products from "./products.json";

const productService = {
  getProductData: () => {
    return Promise.resolve(products);
  },
  getProductDataById: (id: string) => {
    return new Promise((res: (val: any) => void, rej: (error: any) => void) => {
      const product = products.find((i) => i.id === id);
      if (!product) {
        return rej(new Error("No product with such id"));
      }

      return res(product);
    });
  },
};

export default productService;
