import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONTANTS } from '../../../database';
import { IProduct } from '../../../interfaces/products';
import { Product } from '../../../models';

// Definimos el tipo de datos que puede devolver nuestra API
type Data = 
| {message: string}
| IProduct[]

// Definimos el manejador de la ruta para nuestra API
export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    // Manejamos las peticiones HTTP que llegan a nuestra API
    switch (req.method) {
        case 'GET':
            return getProducts(req, res);

        default:
            return res.status(400).json({ message: 'Bad request' })
    }
}

// Definimos la función para obtener los productos
const getProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    // Obtenemos el género de los productos que queremos obtener (o "all" si no se especifica nada)
    const { gender = 'all' } = req.query;

    let condition ={};

    // Si se especificó un género válido, lo agregamos a las condiciones de búsqueda
    if (gender !== 'all' && SHOP_CONTANTS.validGender.includes(`${gender}`)){
       condition = { gender };
    }

    // Nos conectamos a la base de datos, buscamos los productos que coincidan con las condiciones, 
    // los seleccionamos y los devolvemos como respuesta a la petición
    await db.connect();
    const products = await Product.find(condition)
                                .select('title images price inStock slug -_id')
                                .lean();
    await db.disconnect();

    return res.status(200).json( products );
}
