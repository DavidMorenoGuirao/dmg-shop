import { FC } from "react";

// import { Grid } from "@mui/material"
import Grid from "@mui/material/Grid"

import { IProduct } from "../../interfaces";
import { ProductCard } from "./ProductCard";

interface Props {
    products: IProduct[];
}

export const ProductList: FC<Props> = ({ products }) => {
  return (
    <Grid container spacing={ 4 } p={4}>
        {
            products.map( product => (
                <ProductCard
                    key={ product.slug }
                    product={product}
                />
            ))
        }
    </Grid>
  )
}
