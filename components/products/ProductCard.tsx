
import { FC, useMemo, useState } from 'react';
import NextLink from "next/link";

// import { Grid, Card, CardActionArea, CardMedia, Box, Typography, Link, Chip } from '@mui/material'
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";


import { IProduct } from '../../interfaces'

interface Props {
    product: IProduct;
}

export const ProductCard: FC<Props> = ({ product }) => {

    // con esto vamos a hacer que detecte cuando el mouse esta haciendo hover sobre el producto
    const [isHovered, setIsHovered] = useState(false)
    
    const [isImageLoaded, setIsImageLoaded] = useState(false)

    //con esto hacemos que la imagen cambien segun el estado del mouse, si esta haciendo hover o no
    const productImage = useMemo(() => {
        return isHovered
            ? `/products/${product.images[1]}`
            : `/products/${product.images[0]}`

    }, [isHovered, product.images])

    return (
        <Grid /*HOLA QUE TAL*/
            item
            xs={6}
            sm={4}
            onMouseEnter={ () => setIsHovered(true) }    
            onMouseLeave={ () => setIsHovered(false) }    
        >
            <Card>
                <NextLink href={`/product/${ product.slug }`} passHref prefetch={ false }>
                    <Link>
                        <CardActionArea>
                            {
                                (product.inStock === 0 ) && (
                                   <Chip
                                        label="No esta disponible"
                                        color="primary"
                                        sx={{ position: 'absolute', zIndex: 99, top: '10px', left: '10px' }}
                                    /> 
                                )
                            }
                            
                            <CardMedia
                                component='img'
                                className='fadeIn'
                                image={ productImage }
                                alt={ product.title }
                                onLoad={ () => setIsImageLoaded(true) }
                                
                            />               
                        </CardActionArea>
                    </Link>
                </NextLink>    
            </Card>

            <Box sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none' }} className='fadeIn'>
                <Typography fontWeight={600}>{ product.title }</Typography>
                <Typography fontWeight={500}>{ `$${product.price}` }</Typography>
            </Box>
        </Grid>
    )
}
