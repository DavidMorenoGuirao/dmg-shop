import jwt from "jsonwebtoken";

export const singToken = ( _id: string, email: string ) => {

  if ( !process.env.JWT_SECRET_SEED ){
      throw new Error("No hay semilla de JWT - Revisar archivo .env");
  }

  return jwt.sign(
    //payload  
      { _id, email },

    //Seed
      process.env.JWT_SECRET_SEED,

    //Opciones
      { expiresIn: "30d" },

  )
  
}



export const isValidToken = ( token: string ):Promise<string> => {

  if ( !process.env.JWT_SECRET_SEED ){
    throw new Error( "No hay semilla de JWT - Revisar archivo .env" );
  }

  if ( token.length < 10 ){
    return Promise.reject( "JWT no válido" );
  }

  return new Promise( (resolve, reject) => {

    try {
      jwt.verify( token, process.env.JWT_SECRET_SEED || '', ( err, payload ) => {
        if ( err ) return reject( err );
         const { _id } = payload as { _id:string };
          resolve( _id );
      })      
    } catch ( error ) {
        reject( 'JWT no es valido' );
    }
  })
}