import React from "react";
import Typography from "@mui/material/Typography";
import ShopLayout from "../../components/layouts/ShopLayout";
import useProducts from "../../hooks/useProducts";
import FullScreenLoading from "../../components/ui/FullScreenLoading";
import ProductList from "../../components/products/ProductList";

const MenPage = () => {
  const { products, isLoading } = useProducts("/products?gender=men");
  return (
    <ShopLayout
      title="Teslo-Shop - Hombres"
      pageDescription="Encuentra los mejores productos para Hombres!"
    >
      <Typography variant="h1" component="h1" color="textPrimary">
        Seccion
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Para Hombres
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default MenPage;
