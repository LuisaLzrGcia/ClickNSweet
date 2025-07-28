import { products } from "../data/db";

export function loadProductData(productId) {
  try {
    const productData = products.find((product) => (product.id = productId));
    return productData;
  } catch (error) {
    console.log(error);
  }
}
