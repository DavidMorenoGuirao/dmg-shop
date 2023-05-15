import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { User } from '../../../models';
import { IUser } from '../../../interfaces/user';
import { isValidObjectId } from 'mongoose';

type Data = 
| { message: string }
| IUser[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getUsers(req, res);
        case 'PUT':
            return updateUser(req, res);

        default:
           return res.status(400).json({ message: 'Bad request' })
    }    
    
}


const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    await db.connect();
    // buscar todos los usuarios y devolverlos en formato json sin la contraseña
    const users = await User.find().select('-password').lean();  
    await db.disconnect();

    return res.status(200).json( users );
}

const updateUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {    
    const {userId = '', role = ''} = req.body;
    // validar que el id sea un objectId de mongo
    if ( !isValidObjectId(userId) ){
        // console.log('esto es: ', userId)
        return res.status(400).json({ message: 'No existe usuario con ese Id' })
    }

    const validRoles = ['admin', 'client', 'colaborator', 'SEO'];
    if ( !validRoles.includes(role) ){
        return res.status(400).json({ message: 'No existe rol con ese nombre' + validRoles.join(', ') })
    }

    await db.connect();
    
    const user = await User.findById( userId );

    if ( !user ){
        return res.status(404).json({ message: 'Usuario no encontrado: ' + userId })
    }

    user.role = role;
    await user.save();
    await db.disconnect();

    return res.status(200).json( { message: 'Usuario actualizado'} );
}

