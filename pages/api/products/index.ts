import type { NextApiRequest, NextApiResponse } from "next";
import { SHOP_CONSTANTS } from "../../../database/constans";
import { connect, disconnect } from "../../../database/db";
import { IProduct } from "../../../interfaces/products";
import Product from "../../../models/Product";

type Data =
  | IProduct[]
  | {
      message: string;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProducts(req, res);
    default:
      return res.status(400).json({ message: "Bad Request" });
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { gender = "all" } = req.query;

  let condition = {};
  if (
    gender !== "all" &&
    SHOP_CONSTANTS.validGender.includes(gender as string)
  ) {
    condition = { gender };
  }

  await connect();
  const products = await Product.find(condition)
    .select("title images price inStock slug -_id")
    .lean();

  const updatedProducts = products.map((product) => {
    product.images = product.images.map((image) => {
      return image.includes("http")
        ? image
        : `${process.env.HOST_NAME || ""}/products/${image}`;
    });
    return product;
  });
  await disconnect();
  res.status(200).json(updatedProducts);
};
