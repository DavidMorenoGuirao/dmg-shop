import type { NextPage } from 'next'
// import { Typography } from '@mui/material'
import Typography from "@mui/material/Typography";

import { ShopLayout } from '../components/layouts'

import { ProductList } from '../components/products'
import { useProducts } from '../hooks'

import { FullScreenLoading } from '../components/ui'


const HomePage: NextPage = () => {

  const { products, isLoading } = useProducts('/products');


  return (
    
    <ShopLayout title={'Dmg-Shop - Home'} pageDescription={'Ecommerce de practica NextJS'}>
        <Typography variant='h1' component='h1'>Tienda</Typography>
        <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos</Typography>
        
        
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

export default HomePage
