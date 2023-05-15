import type { NextPage } from 'next'
// import { Typography } from '@mui/material'
import Typography from '@mui/material/Typography';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';



const WomenPage: NextPage = () => {
  

  const { products, isLoading } = useProducts('/products?gender=women');


  return (
    <ShopLayout title={'Dmg-Shop - Women secction'} pageDescription={'Seccion mujeres'}>
        <Typography variant='h1' component='h1'>Seccion</Typography>
        <Typography variant='h2' sx={{ mb: 1 }}>Para Mujeres</Typography>
        
        
        {
          isLoading
            ? <FullScreenLoading />
            : <ProductList products={ products } />
        }
    
        <ProductList
          products={ products }
        />

    </ShopLayout>
  )
}

export default WomenPage;
