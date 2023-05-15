import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { db } from '../../../database';
import { IOrder } from '../../../interfaces';
import { Order, Product } from '../../../models';

// Definimos el tipo de datos que se enviará como respuesta
type Data = 
| {message: string}
| IOrder;

// Manejador de la solicitud
export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
        
    switch (req.method) {
        case 'POST':
            // Si la solicitud es de tipo POST, llamamos a la función createOrder
            return createOrder( req, res );
        
        default:
            // Si no es de tipo POST, devolvemos una respuesta con un estado 400 y un mensaje de error
            return res.status(400).json({ message: 'Bad request' })

    }      
}

// Función para crear una nueva orden
const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    // Obtenemos el cuerpo de la solicitud y asignamos sus propiedades a las variables "orderItems" y "total"
    const { orderItems, total } = req.body as IOrder;

    // Verificamos que haya una sesión activa (un usuario logeado)
    const session: any = await getSession({ req });
    console.log("esto es session: --> ",session)
    if (!session) {
        // Si no hay una sesión activa, devolvemos una respuesta con un estado 401 y un mensaje de error
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Creamos un arreglo con los IDs de los productos que el cliente quiere comprar
    const productsIds = orderItems.map( product => product._id );
    
    // Realizamos una consulta a la base de datos para obtener la información de los productos correspondientes
    await db.connect();
    const dbProducts = await Product.find({ _id: { $in: productsIds }});

    try {
        // Calculamos el subtotal de la orden sumando el precio de cada producto multiplicado por su cantidad
        const subTotal = orderItems.reduce( ( prev, current ) => {
            // Buscamos el producto correspondiente en la base de datos
            const currentPrice = dbProducts.find( prod => prod.id === current._id )?.price;
            if ( !currentPrice ) {
                // Si el producto no se encuentra en la base de datos, lanzamos un error
                throw new Error('Producto no encontrado, revise su carrito');
            }
            // Calculamos el precio total de este producto y lo sumamos al subtotal
            return (currentPrice * current.quantity) + prev
        }, 0);

        // Obtenemos la tasa de impuestos del archivo de entorno y calculamos el total de la orden
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const backendTotal = subTotal * ( taxRate + 1 );

        // Verificamos que el total enviado por el cliente coincida con el total calculado
        if (total !== backendTotal) {
            throw new Error('El total no coincide con el calculado');
        }

        // Si todo está bien, creamos una nueva orden y la guardamos en la base de datos
        const userId = session.user.id;
        const newOrder = new Order({...req.body, isPaid: false, user: userId });
        newOrder.total= Math.round( newOrder.total * 100 ) / 100; //Esto es para redondear el total a 2 decimales

        await newOrder.save();
        await db.disconnect();

        // Devolvemos la nueva orden como respuesta
        return res.status(201).json( newOrder );

    } catch (error: any) {
        // Si ocurre un error, desconectamos de la base de datos y devolvemos una respuesta con un estado 400 y un mensaje de error
        await db.disconnect();
        console.log('hola',error);
        res.status(400).json({ message: error.message || 'Revise logs del servidor'});
        
    }
}