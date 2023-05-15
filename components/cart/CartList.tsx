import { FC, useContext } from "react";
import NextLink from "next/link";

// import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material" //me va muy lento en dev
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import { ItemCounter } from "../ui";
import { CartContext } from "../../context";
import { ICartProduct, IOrderItem } from "../../interfaces";


interface Props {
    editable?: boolean;
    products?: IOrderItem[];
}


export const CartList: FC<Props> = ({ editable = false, products }) => {

    const { cart, upgradeCartQuantity, removeCartProduct } = useContext( CartContext );

    const onNewCartQuantityValue = ( product: ICartProduct, newQuantityValue: number ) => {
        product.quantity = newQuantityValue;
        upgradeCartQuantity( product );
    }

    const onRemoveCartProduct = ( product: ICartProduct ) => {

    }

    const productsToShow = products ? products : cart;


  return (
    <>
        {
            productsToShow.map(product => (                
                <Grid container spacing={ 2 } key={ product.slug + product.size } sx={{ mb:1 }}>

                    <Grid item xs={ 3 }>
                        {/* llevar a la pag del producto, creo que sera: `/product/${product.slug}`*/}
                        <NextLink href={`/product/${product.slug}`} passHref>
                            <Link>
                                <CardActionArea>
                                    <CardMedia
                                        image={`/products/${ product.image}`}
                                        component="img"
                                        sx={{ borderRadius: '5px' }}
                                    />
                                </CardActionArea>
                            </Link>
                        </NextLink>
                    </Grid>
                        
                    <Grid item xs={ 7 }>
                        <Box display='flex' flexDirection='column'>
                            <Typography variant='body1'>{ product.title }</Typography>
                            <Typography variant='body1'>Talla: <strong>{product.size}</strong></Typography>

                            {/* condicional */}
                            {
                                editable
                                ? (
                                    <ItemCounter
                                        currentValue={ product.quantity }
                                        maxValue={ 10 }
                                        updateQuantity={( value ) => onNewCartQuantityValue(product as ICartProduct, value ) }                                       
                                    />
                                )                                 
                                :(
                                    <Typography variant="h5">{ product.quantity } { product.quantity > 1 ? 'productos':'producto'}</Typography>
                                ) 
                            }   
                            
                        </Box>
                    </Grid>

                    <Grid item xs={ 2 } display='flex' alignItems='center' flexDirection='column'>
                        <Typography variant="subtitle1"> { `$${ product.price }`}</Typography>
                        
                        {/* editable */}
                        {
                            editable && (
                                <Button
                                    variant="text"
                                    color='secondary'
                                    onClick={ () => removeCartProduct(product as ICartProduct) }
                                >
                                    Eliminar
                                </Button>
                            )
                        }                        
                    </Grid>
                </Grid>                
            ))
        }
    
    </>       
  )
}
