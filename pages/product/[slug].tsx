import { useContext, useState } from "react"
import { NextPage, GetStaticProps, GetStaticPaths } from "next"
import { useRouter } from "next/router"

// import { Button, Chip, Grid, Typography } from "@mui/material"
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

// import { Box } from "@mui/system"
import Box from "@mui/system/Box"

import { CartContext } from "../../context"

import { ShopLayout } from "../../components/layouts"
import { ProductSlideShow, SizeSelector } from "../../components/products"
import { ItemCounter } from "../../components/ui"
import { ICartProduct, IProduct, ISize } from "../../interfaces"
import { dbProducts } from "../../database"


interface Props{
    product: IProduct; 
  }

const ProductPage:NextPage<Props> = ({ product }) => {

  const router = useRouter();
  const { addProductToCart } = useContext( CartContext );
  
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title, 
    gender: product.gender,
    quantity: 1,
  })

  const selectedSize = ( size: ISize ) => {
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      size      
    }))    
  }

  const OnUpdateQuantity = ( quantity: number ) => {
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      quantity      
    }))    
  }

  const onAddProduct = () => {
    if ( !tempCartProduct.size ) { return };

    addProductToCart(tempCartProduct);  
    router.push('/cart');
  } 

  return (
    <ShopLayout title={ product.title } pageDescription={ product.description }>
      <Grid container spacing={3}>

        <Grid item xs={ 12 } sm={ 7 }>
          {/* Slider */}
          <ProductSlideShow
            images={ product.images }
          />
        </Grid>

        <Grid item xs={ 12 } sm={ 5 }>
          <Box display='flex' flexDirection='column'>

            {/* titulos */}
            <Typography variant='h1' component='h1'>{ product.title}</Typography>
            <Typography variant='subtitle1' component='h2'>{ `$${product.price}`}</Typography>

            {/* Cantidad (el my: es margin arriba y abajo) */}
            <Box sx={{ my: 2 }}>

              <Typography variant='subtitle2'>Cantidad</Typography>
              
              {/* ItemCounter */}
              <ItemCounter
                currentValue={ tempCartProduct.quantity }
                updateQuantity={ OnUpdateQuantity }                           
                maxValue={product.inStock > 10 ? 10 : product.inStock}
              />
              {/* Size Selector */}
              <SizeSelector                
                sizes={ product.sizes}
                selectedSize={ tempCartProduct.size }
                onSelectedSize={ selectedSize }
              />

            </Box>

            {/* Agregar al carrito */}
            {
              (product.inStock > 0 )
              ?(
                  <Button
                    color="secondary"
                    className="circular-btn"
                    onClick={ onAddProduct }
                  >
                    {
                      tempCartProduct.size
                      ? 'Agregar al carrito'
                      : 'Seleccione una talla'
                    }
                  </Button>
              ) 
              :
                <Chip label="No hay disponibles" color="error" variant="outlined" />                
            }
            
            {/* Descripcion */}
            <Box sx={{ mt:3 }}>
              <Typography variant='subtitle2'>Descripción</Typography>
              <Typography variant='body2'>{ product.description }</Typography>

            </Box>



          </Box>
        </Grid>

      </Grid>


    </ShopLayout>
  )
}

//GetServerSideProps

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
// * No usar esto. SSR.
// export const getServerSideProps: GetServerSideProps = async ({ params }) => {

//   const { slug = '' } = params as { slug: string };
//   const product = await dbProducts.getProductsBySlug( slug );

//   if( !product ){
//     return{
//       redirect: {
//         destination: '/',
//         permanent: false,
//       }
//     }
//   }

//   return {
//     props: {
//       product,
//     }
//   }
// }

//getStaticPaths:

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async (ctx) => {

  const productSlugs = await dbProducts.getAllProductSlugs();
  
  return {
    paths: productSlugs.map( ({ slug }) => ({
      params: {
        slug
      }
    })),
    fallback: 'blocking',    
  }

}

//getStaticProps:
// You should use getStaticProps if you’re statically pre-rendering pages that use dynamic routes
export const getStaticProps: GetStaticProps = async ({ params }) => {

  const { slug ="" } = params as { slug: string };

  const product = await dbProducts.getProductsBySlug( slug );
  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }  
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24,    
  }
}

export default ProductPage