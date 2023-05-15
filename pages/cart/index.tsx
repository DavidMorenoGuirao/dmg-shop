import { useContext, useEffect } from "react";

// import { Box, Button, Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { CartContext } from "../../context";
import { ShopLayout } from "../../components/layouts";
import { CartList, OrderSummary } from "../../components/cart";
import { useRouter } from "next/router";


const CartPage = () => {

    const { isLoaded, cart } = useContext( CartContext );
    const router = useRouter();

    

    useEffect(() => {
      if ( isLoaded && cart.length === 0 ) {
        router.replace("/cart/empty");
      }        
      
    
    }, [ isLoaded, cart, router ]);

    if ( !isLoaded || cart.length === 0 ) {
      return (
        <></>
      )
    }
    

  return (
    <ShopLayout title='Carrito'pageDescription={'Carrito de compras de la tienda'}>
        <Typography variant="h1" component="h1">Carrito</Typography>

        <Grid container>
            <Grid item xs={12} sm={ 7 }>
                {/* CartList */}
                <CartList editable/>
            </Grid>
            <Grid item xs={12} sm={ 5 }>
                <Card className="summary-card">
                    <CardContent>
                        <Typography variant="h2" component="h2">Orden</Typography>
                        <Divider sx={{ my: 1 }} />

                        {/* Order summary */}
                        <OrderSummary />

                        <Box sx={{ mt: 3 }}>
                            <Button
                              color="secondary"
                              className="circular-btn"
                              fullWidth
                              href="/checkout/address"
                            >
                                Checkout
                            </Button>


                        </Box>
                    </CardContent>
                </Card>
            </Grid>

        </Grid>


    </ShopLayout>
  )
}

export default CartPage;