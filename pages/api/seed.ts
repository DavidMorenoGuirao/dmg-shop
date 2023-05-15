import { NextApiRequest, NextApiResponse } from "next"
import { db, seedDatabase } from "../../database"

import { Order, Product } from "../../models"
import User from "../../models/User"

type Data = {
    message: string
}

export default async function handler( req: NextApiRequest, res: NextApiResponse<Data>) {
    // Si estamos en producción, el proceso no se ejecuta
    if ( process.env.NODE_ENV === 'production') {
        return res.status(401).json({ message: 'No tiene acceso a este servicio' })        
    }

    // Conectamos a la base de datos
    await db.connect();

    // Borramos todos los usuarios y añadimos los dos usuarios de ejemplo
    await User.deleteMany();
    await User.insertMany(seedDatabase.initialData.users);

    // Borramos todos los productos y añadimos los dos productos de ejemplo
    await Product.deleteMany();
    await Product.insertMany(seedDatabase.initialData.products);

    // Borramos todos los pedidos
    await Order.deleteMany();

    // Desconectamos de la base de datos
    await db.disconnect();

    // Enviamos la respuesta
    res.status(200).json({ message: 'Proceso realizado correctamente' })
}
