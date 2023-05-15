
import NextLink from "next/link";

// import { RemoveShoppingCartOutlined } from "@mui/icons-material"
import RemoveShoppingCartOutlined from "@mui/icons-material/RemoveShoppingCartOutlined"

// import { Box, Link, Typography } from "@mui/material"
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import { ShopLayout } from "../../components/layouts"


const EmptyPage = () => {
  return (
    <ShopLayout title="Carrito vacio" pageDescription="No tienes articulos en tu carrito de compras">
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height='calc(100vh - 200px)'
            sx={{ flexDirection: { xs: 'column', sm: 'row'} }}
        >
            <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
            <Box display='flex' flexDirection='column' alignItems='center'>
                <Typography>Su carrito esta vacio</Typography>
                <NextLink href="/" passHref>
                    <Link typography="h4" color='secondary'>
                        Regresar
                    </Link>
                </NextLink>
            </Box>

        </Box>

    </ShopLayout>
  )
}

export default EmptyPage