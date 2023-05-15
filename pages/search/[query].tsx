import type { NextPage, GetServerSideProps } from 'next'

// import { Box, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { ShopLayout } from '../../components/layouts';

import { ProductList } from '../../components/products';

import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces';





interface Props {
    products: IProduct[];
    foundProducts: boolean;
    query: string;
}


const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
    console.log(foundProducts);
    

    
  return (
    <ShopLayout title={'Dmg-Shop - Search'} pageDescription={'Ecommerce de practica NextJS'}>
        <Typography variant='h1' component='h1'>Buscar productos</Typography>

        {
            foundProducts
               ? (
                    <Box display='flex'>
                        <Typography variant='h2' sx={{ mb: 1 }} >{ products.length } productos con el termino: </Typography>
                        <Typography variant='h2' sx={{ ml: 1 }} color='secondary' textTransform='capitalize'>{ query }</Typography>
                    </Box>
               )
               : (
                    <Box display='flex'>
                        <Typography variant='h2' sx={{ mb: 1 }}>No se encontraron productos con el termino:</Typography>
                        <Typography variant='h2' sx={{ ml: 1 }} color='secondary' textTransform='capitalize'>{ query }</Typography>
                    </Box>
               ) 
        }


        <ProductList products={ products } />

    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({params}) => {


    const { query = '' } = params as { query : string}  // your fetch function here 

    if ( query.length === 0 ) {
        return{
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }


    let products = await dbProducts.getProductsByTerm(query);

    const foundProducts = products.length > 0 ;

    // TODO: retornar otros productos cuando en la busqueda no encuentre nada
    if ( !foundProducts ) {
        // products = await dbProducts.getAllProducts();
        products = await dbProducts.getProductsByTerm('shirt');
    }

    return {
        props: {
            products,
            foundProducts,
            query
        }
    }
}

export default SearchPage;
