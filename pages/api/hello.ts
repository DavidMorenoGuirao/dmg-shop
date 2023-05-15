import type { NextApiRequest, NextApiResponse } from 'next'

// definimos el tipo de dato de la respuesta del endpoint
type Data = {
  name: string
}

// definimos el manejador del endpoint
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // enviamos una respuesta con un objeto JSON que contiene un nombre
  res.status(200).json({ name: 'John Doe' })
}


// En este código estamos creando un endpoint utilizando Next.js, el cual responde a una petición HTTP y devuelve un objeto JSON que contiene el nombre de una persona.

// La función handler es el manejador del endpoint y toma dos argumentos: req es la solicitud HTTP entrante y res es la respuesta HTTP que enviaremos al cliente.

// El tipo Data es una interfaz que define la forma de los datos que se enviarán en la respuesta. En este caso, solo estamos enviando un nombre como cadena de texto.

// Dentro del manejador del endpoint, utilizamos el método json del objeto res para enviar la respuesta al cliente. La respuesta es un objeto JSON que contiene un nombre. La función status establece el código de estado HTTP de la respuesta en 200, lo que indica que la solicitud se completó con éxito.