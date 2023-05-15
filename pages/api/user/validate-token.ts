import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { db } from '../../../database'
import { User } from '../../../models'
import { jwt } from '../../../utils'

type Data =
| { message: string }
| {
    token: string;
    user: {
        email: string;
        name: string;
        role: string;
    };
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch ( req.method ) {
        case 'GET':
            return checkJWT(req, res)

        default:
            return res.status(400).json({ message: 'Bad request' })        
    }    
}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { token = '' } = req.cookies;

    let userId = '';

    try {
        userId = await jwt.isValidToken( token );
    } catch (error) {
        return res.status(401).json({ message: 'Token de autorización no es valido' })        
    }

    //Entonces, si tenemos un userId valido, nos conectamos a la bd:
    await db.connect();
    //busdcamos el usuario en la bd:
    const user = await User.findById( userId ).lean();
    //y nos desconectamos de la bd:
    await db.disconnect();

    //si el usuario no existe enviamos este error:
    if(!user) {
        return res.status(400).json({ message: 'No existe el usuarrio con ese ID' })
    }  
    
    //si el usuario existe, primero extraemos los datos que necesitemos del usuario:   
    const { _id, email, role, name } = user;
    //y entonces enviamos el token y el usuario:
    return res.status(200).json({        
        token: jwt.singToken( _id, email), //jwt
        user:{
            email,
            role,
            name,
        }        
    })
}
