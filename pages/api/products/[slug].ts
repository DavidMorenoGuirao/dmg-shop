import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database'; // se importa la instancia de la base de datos
import { IProduct } from '../../../interfaces'; // se importa la interfaz de los productos
import { Product } from '../../../models'; // se importa el modelo de los productos

// Definimos el tipo de los datos que se van a devolver, que pueden ser un mensaje o un producto
type Data = 
| { message: string }
| IProduct;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getProductsBySlug(req, res);
        default:
            return res.status(400).json({ message: 'Bad request' });
    }
}

// Función que busca un producto por su slug
const getProductsBySlug = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    await db.connect(); // Conecta a la base de datos
    const { slug } = req.query; // Obtiene el slug del producto de los parámetros de la solicitud
    const product = await Product.findOne({ slug }).lean(); // Busca el producto en la base de datos y lo asigna a la variable 'product'
    await db.disconnect(); // Desconecta de la base de datos

    if (!product) { // Si el producto no existe, devuelve un mensaje de error
        return res.status(400).json({ message: 'Producto no existe' });
    }

    return res.status(200).json(product); // Devuelve el producto encontrado
}
