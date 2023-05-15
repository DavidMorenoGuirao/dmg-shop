
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    res.status(400).json({ message: 'Debe especificar el query de busqueda' })
}

//esto es para cuando el la barra ded busqueda pongas una direccion erronea y salga el mensaje especificado