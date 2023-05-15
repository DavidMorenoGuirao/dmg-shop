import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';

// Definimos el tipo de respuesta de la API
type Data =
| {message: string}
| IProduct[];

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    // Manejamos las peticiones GET
    switch (req.method) {
        case 'GET':
            return searchProducts(req, res);

        // En caso de que sea cualquier otra petición, devolvemos un error
        default:
            return res.status(400).json({ message: 'Solicitud incorrecta' })
    }
    
}

const searchProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    // Obtenemos el parámetro "q" de la URL, que contiene el texto de búsqueda
    let { q = '' } = req.query;
    
    // Si no se ha especificado un parámetro "q" en la URL, devolvemos un error
    if (q.length === 0) {
        return res.status(400).json({ message: 'Debe especificar el texto de búsqueda' });
    }
    
    // Convertimos el texto de búsqueda a minúsculas
    q = q.toString().toLowerCase();
    
    // Conectamos a la base de datos
    await db.connect();
    
    // Buscamos los productos que coinciden con el texto de búsqueda
    const products = await Product.find({
        $text: {
            $search: q
        }
    })
    .select('title images price inStock slug -_id')
    .lean();
    
    // Desconectamos de la base de datos
    await db.disconnect();

    // Devolvemos la lista de productos que coinciden con la búsqueda
    return res.status(200).json( products );
}
