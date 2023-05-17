import { useState } from "react";
import { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";

import { PayPalButtons } from "@paypal/react-paypal-js";

import CartList from "../../components/cart/CartList";
import OrderSummary from "../../components/cart/OrderSummary";
import ShopLayout from "../../components/layouts/ShopLayout";
import { dbOrders } from "../../database";
import { IOrder } from "../../interfaces";
import { dmgApi } from "../../api";
//
export type OrderResponseBody = {
  id: string;
  status:
    | "COMPLETED"
    | "SAVED"
    | "APPROVED"
    | "VOIDED"
    | "PAYER_ACTION_REQUIRED"
    | "CREATED";
};

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const router = useRouter();

  const [isPaying, setIsPaying] = useState(false);

  const { shippingAddress } = order;

  const onOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== "COMPLETED") {
      return alert("There are not pay on Paypal");
    }

    setIsPaying(true);

    try {
      const { data } = await dmgApi.post("/orders/pay", {
        transactionId: details.id,
        orderId: order._id,
      });

      router.reload();
    } catch (error) {
      setIsPaying(true);

      console.log(error);
      alert("Error");
    }
  };

  return (
    <ShopLayout title="Order Summary" pageDescription="Summary of the Order">
      <Typography variant="h1" component="h1">
        Order: {order._id}
      </Typography>

      {order.isPaid ? (
        <Chip
          sx={{ my: 2, padding: 2 }}
          label="Paid Order"
          variant="outlined"
          color="success"
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          sx={{ my: 2, padding: 2 }}
          label="OutStanding"
          variant="outlined"
          color="error"
          icon={<CreditCardOffOutlined />}
        />
      )}

      <Grid container sx={{ mt: 3 }}>
        <Grid item xs={12} sm={7}>
          <CartList products={order.orderItems} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Summary ({order.numberOfItems}{" "}
                {order.numberOfItems > 1 ? "products" : "product"})
              </Typography>

              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Delivery address</Typography>
              </Box>

              <Typography>
                {shippingAddress.firstName} {shippingAddress.lastName}
              </Typography>
              <Typography>
                {shippingAddress.address}{" "}
                {shippingAddress.address2
                  ? `, ${shippingAddress.address2}`
                  : ""}
              </Typography>
              <Typography>
                {shippingAddress.city}, {shippingAddress.zip}
              </Typography>
              <Typography>{shippingAddress.country}</Typography>
              <Typography>{shippingAddress.phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <OrderSummary
                summaryData={{
                  numberOfItems: order.numberOfItems,
                  subTotal: order.subTotal,
                  total: order.total,
                  tax: order.tax,
                }}
              />

              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                <Box
                  display="flex"
                  justifyContent="center"
                  className="fadeIn"
                  sx={{ display: isPaying ? "flex" : "none" }}
                >
                  <CircularProgress />
                </Box>

                <Box
                  sx={{ display: isPaying ? "none" : "flex", flex: 1 }}
                  flexDirection="column"
                >
                  {order.isPaid ? (
                    <Chip
                      sx={{ my: 2, padding: 2 }}
                      label="Paid Order"
                      variant="outlined"
                      color="success"
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: `${order.total}`,
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order!.capture().then((details) => {
                          onOrderCompleted(details);
                        });
                      }}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = "" } = query as { id: string };

  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      },
    };
  }

  const order = await dbOrders.getOrderById(id);

  if (!order) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }

  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;

// import React, { useState } from "react";
// import { GetServerSideProps, NextPage } from "next";

// import Box from "@mui/material/Box";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import Chip from "@mui/material/Chip";
// import CircularProgress from "@mui/material/CircularProgress";
// import Divider from "@mui/material/Divider";
// import Grid from "@mui/material/Grid";
// import Link from "@mui/material/Link";
// import Typography from "@mui/material/Typography";

// import CartList from "../../components/cart/CartList";
// import OrderSummary from "../../components/cart/OrderSummary";
// import ShopLayout from "../../components/layouts/ShopLayout";
// import NextLink from "next/link";
// import {
//   CreditCardOffOutlined,
//   CreditScoreOutlined,
// } from "@mui/icons-material";
// import { getSession } from "next-auth/react";
// import { authOptions } from "../api/auth/[...nextauth]";
// import { getOrderById } from "../../database/dbOrders";
// import { IOrder } from "../../interfaces/order";
// import countries from "../../utils/countries";
// // import { PayPalButtons } from "@paypal/react-paypal-js";
// import {
//   PayPalScriptProvider,
//   PayPalButtons,
//   usePayPalScriptReducer,
// } from "@paypal/react-paypal-js";
// import dmgApi from "../../api/dmgApi";
// import { useRouter } from "next/router";

// //
// export type OrderResponseBody = {
//   id: string;
//   status:
//     | "COMPLETED"
//     | "SAVED"
//     | "APPROVED"
//     | "VOIDED"
//     | "PAYER_ACTION_REQUIRED"
//     | "CREATED";
// };

// interface Props {
//   order: IOrder;
// }

// const OrderPage: NextPage<Props> = ({ order }) => {
//   const router = useRouter();
//   const [isPaying, setIsPaying] = useState(false);
//   const { shippingAddress } = order;

//   const onOrderCompleted = async (details: OrderResponseBody) => {
//     if (details.status !== "COMPLETED") {
//       return alert("Pago no completado");
//     }
//     setIsPaying(true);
//     try {
//       await dmgApi.post(`/orders/pay`, {
//         transactionId: details.id,
//         orderId: order._id,
//       });
//       router.reload();
//     } catch (error) {
//       setIsPaying(false);
//       alert("Error");
//     }
//   };

//   return (
//     <ShopLayout
//       title={`Resumen de la orden ${order._id}`}
//       pageDescription="Resumen de la orden"
//     >
//       <Typography variant="h1" component="h1">
//         Orden: {order._id}
//       </Typography>

//       {order.isPaid ? (
//         <Chip
//           sx={{ my: 6, mx: 2 }}
//           label="Orden pagada"
//           variant="outlined"
//           color="success"
//           icon={<CreditScoreOutlined />}
//         />
//       ) : (
//         <Chip
//           sx={{ my: 6, mx: 2 }}
//           label="Pendiende de pago"
//           variant="outlined"
//           color="error"
//           icon={<CreditCardOffOutlined />}
//         />
//       )}

//       <Grid container className="fadeIn" p={2}>
//         <Grid item xs={12} sm={7}>
//           <CartList products={order.orderItems} />
//         </Grid>

//         <Grid item xs={12} sm={5}>
//           <Card className="summary-card">
//             <CardContent>
//               <Typography variant="h2">
//                 Resumen ({order.numberOfItems}{" "}
//                 {order.numberOfItems < 2 ? "productos" : "producto"})
//               </Typography>
//               <Divider sx={{ my: 1 }} />

//               <Box display="flex" justifyContent="space-between" mt={1}>
//                 <Typography variant="subtitle1">
//                   Direccion de entrega
//                 </Typography>
//                 <NextLink href="/checkout/address" passHref legacyBehavior>
//                   <Link underline="always">Editar</Link>
//                 </NextLink>
//               </Box>

//               <Typography>{`${shippingAddress.firstName} ${shippingAddress.lastName}`}</Typography>
//               <Typography>{shippingAddress.address}</Typography>
//               {shippingAddress.address2 && (
//                 <Typography>{shippingAddress.address2}</Typography>
//               )}
//               <Typography>
//                 {shippingAddress.city} {shippingAddress.zip}
//               </Typography>
//               <Typography>
//                 {
//                   countries.find(({ code }) => code === shippingAddress.country)
//                     ?.name
//                 }
//               </Typography>
//               <Typography>{shippingAddress.phone}</Typography>

//               <Divider sx={{ my: 1 }} />

//               <OrderSummary
//                 summaryData={{
//                   numberOfItems: order.numberOfItems,
//                   subTotal: order.subTotal,
//                   total: order.total,
//                   tax: order.tax,
//                 }}
//               />

//               <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
//                 <Box
//                   display="flex"
//                   justifyContent="center"
//                   className="fadeIn"
//                   sx={{ display: isPaying ? "none" : "flex" }}
//                 >
//                   <CircularProgress />
//                 </Box>

//                 <Box
//                   flexDirection="column"
//                   sx={{
//                     display: isPaying ? "flex" : "flex",
//                     flex: 1,
//                   }}
//                 >
//                   {order.isPaid ? (
//                     <Chip
//                       sx={{ my: 2 }}
//                       label="Orden pagada"
//                       variant="outlined"
//                       color="success"
//                       icon={<CreditScoreOutlined />}
//                     />
//                   ) : (
//                     <PayPalButtons
//                       createOrder={(data, actions) => {
//                         return actions.order.create({
//                           purchase_units: [
//                             {
//                               amount: {
//                                 value: order.total.toString(),
//                               },
//                             },
//                           ],
//                         });
//                       }}
//                       onApprove={(data, actions) => {
//                         return actions.order!.capture().then((details) => {
//                           onOrderCompleted(details);
//                         });
//                       }}
//                     />
//                   )}
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </ShopLayout>
//   );
// };

// export const getServerSideProps: GetServerSideProps = async ({
//   req,
//   res,
//   query,
// }) => {
//   const { id = "" } = query;
//   const session = await getServerSession(req, res, authOptions);
//   if (!session) {
//     return {
//       redirect: {
//         destination: `/auth/login?p='orders/${id}`,
//         permanent: false,
//       },
//     };
//   }

//   const order = await getOrderById(id.toString());

//   if (!order || order.user !== session.user._id) {
//     return {
//       redirect: {
//         destination: `/orders/history`,
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       order,
//     },
//   };
// };

// export default OrderPage;
