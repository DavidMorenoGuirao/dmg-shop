import Typography from "@mui/material/Typography";
import { NextPage } from "next";
import ShopLayout from "../components/layouts/ShopLayout";
import ProductList from "../components/products/ProductList";
import FullScreenLoading from "../components/ui/FullScreenLoading";
import useProducts from "../hooks/useProducts";

const HomePage: NextPage = () => {
  const { products, isLoading, isError } = useProducts("/products");

  if (isError) return <div>failed to load</div>;

  return (
    <ShopLayout
      title="DmgShop - Home"
      pageDescription="Encuentra los mejores productos!"
    >
      <Typography variant="h1" component="h1" color="textPrimary">
        Tienda
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Todos los productos
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default HomePage;
