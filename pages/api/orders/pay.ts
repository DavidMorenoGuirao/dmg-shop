// import axios from "axios";
// import type { NextApiRequest, NextApiResponse } from "next";
// import { db } from "../../../database";
// import { IPaypal } from "../../../interfaces";
// import Order from "../../../models/Order";

// type Data =
//   | {
//       message: string;
//     }
//   | { token: string };

// const handler = (req: NextApiRequest, res: NextApiResponse<Data>) => {
//   switch (req.method) {
//     case "POST":
//       return payOrder(req, res);
//     default:
//       return res.status(400).json({ message: "Method Not Allowed" });
//   }
// };

// const getPaypalBearerToken = async (): Promise<string | null> => {
//   const paypalClient = process.env.NEXT_PUBLIC_PAYPAL_CLIENT;
//   const paypalSecret = process.env.PAYPAL_SECRET;
//   const paypalOAuthRoute = process.env.PAYPAL_OAUTH_URL || "";
//   try {
//     const body = new URLSearchParams("grant_type=client_credentials");
//     const base64Token = Buffer.from(
//       `${paypalClient}:${paypalSecret}`,
//       "utf-8"
//     ).toString("base64");

//     const { data } = await axios.post(paypalOAuthRoute, body, {
//       headers: {
//         Authorization: `Basic ${base64Token}`,
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });
//     return data.access_token;
//   } catch (error) {
//     return null;
//   }
// };

// const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
//   const { transactionId = "", orderId = "" } = req.body;
//   const paypalBearerToken = await getPaypalBearerToken();
//   if (!paypalBearerToken) {
//     return res
//       .status(400)
//       .json({ message: "No se pudo confirmar el token de paypal" });
//   }
//   const paypalOrdersRoute = process.env.PAYPAL_ORDERS_URL || "";
//   const { data } = await axios.get<PaypalOrderStatusResponse>(
//     `${paypalOrdersRoute}/${transactionId}`,
//     {
//       headers: {
//         Authorization: `Bearer ${paypalBearerToken}`,
//       },
//     }
//   );

//   if (data.status !== "COMPLETED") {
//     return res.status(401).json({ message: "Orden no reconocida" });
//   }

//   connect();
//   const dbOrder = await Order.findById(orderId);
//   if (!dbOrder) {
//     disconnect();
//     return res
//       .status(404)
//       .json({ message: "Orden no existe en nuestra base de datos" });
//   }
//   if (dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
//     disconnect();
//     return res
//       .status(404)
//       .json({ message: "Los montos de paypal y nuestra orden no son iguales" });
//   }
//   dbOrder.transactionId = transactionId;
//   dbOrder.isPaid = true;
//   await dbOrder.save();
//   disconnect();
//   return res.status(200).json({ message: "Orden pagada" });
// };

// export default handler;

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { db } from "../../../database";
import { IPaypal } from "../../../interfaces";
import { Order } from "../../../models";

// Definimos el tipo de datos que se enviará como respuesta
type Data = {
  message: string;
};

// Manejador de la solicitud
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      // Si la solicitud es de tipo POST, llamamos a la función payOrder para procesar el pago
      return payOrder(req, res);
    default:
      // Si no es de tipo POST, devolvemos una respuesta con un estado 405 y un mensaje de error
      res.status(405).json({ message: "Method Not Allowed" });
  }

  // Siempre se devuelve una respuesta, en este caso solo un mensaje de ejemplo
  res.status(200).json({ message: "Example" });
}

// Función para obtener el token de autenticación de PayPal
const getPaypalBearerToken = async (): Promise<string | null> => {
  // Obtenemos las credenciales de la API de PayPal del archivo de entorno
  const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID2;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET2;

  // Codificamos las credenciales en base64 y creamos un cuerpo de solicitud con el grant_type requerido
  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT}:${PAYPAL_SECRET}`,
    "utf8"
  ).toString("base64");
  const body = new URLSearchParams("grant_type=client_credentials");

  try {
    // Enviamos la solicitud de autenticación a la API de PayPal y devolvemos el token de acceso
    const { data } = await axios.post(
      process.env.PAYPAL_OAUTH_URL || "",
      body,
      {
        headers: {
          Authorization: `Basic ${base64Token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return data.access_token;
  } catch (error) {
    // Si hay un error, lo imprimimos en la consola y devolvemos un valor nulo
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
    } else {
      console.log(error);
    }

    return null;
  }
};

// Función para procesar el pago de una orden
const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  // TODO: validar sesión de usuario

  // TODO: validar mongoID

  // Obtenemos el token de autenticación de PayPal
  const paypalBearerToken = await getPaypalBearerToken();

  if (!paypalBearerToken) {
    // Si no se pudo obtener el token, devolvemos una respuesta con un estado 400 y un mensaje de error
    return res.status(400).json({ message: "Paypal Bearer Token not found" });
  }

  // Obtenemos el ID de la transacción y el ID de la orden que se están pagando
  const { transactionId = "", orderId = "" } = req.body;

  // Obtenemos el estado de la orden desde la API de PayPal
  const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(
    `${process.env.PAYPAL_ORDERS_URL}/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${paypalBearerToken}`,
      },
    }
  );

  // Verificamos que la orden esté completada
  if (data.status !== "COMPLETED") {
    // Si la orden no está completada, devolvemos una respuesta con un estado 400 y un mensaje de error
    return res.status(400).json({ message: "Orden no reconocida" });
  }

  // Buscamos la orden correspondiente en la base de datos
  await db.connect();
  const dbOrder = await Order.findById(orderId);

  if (!dbOrder) {
    await db.disconnect();
    // Si la orden no existe en la base de datos, devolvemos una respuesta con un estado 400 y un mensaje de error
    return res.status(400).json({ message: "Orden existe en bd" });
  }

  // Verificamos que el total de la orden en la base de datos coincida con el total de la orden en PayPal
  if (dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
    await db.disconnect();
    // Si los totales no coinciden, devolvemos una respuesta con un estado 400 y un mensaje de error
    return res.status(400).json({ message: "Las cantidades no encajan" });
  }

  // Actualizamos la orden en la base de datos con la información de la transacción de PayPal y marcamos la orden como pagada
  dbOrder.transactionId = transactionId;
  dbOrder.isPaid = true;
  await dbOrder.save();

  // TODO: enviar correo de confirmacion de pago

  await db.disconnect();
  // Devolvemos una respuesta con un estado 200 y un mensaje de éxito
  res.status(200).json({ message: "Orden pagada" });
};
