
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';

import { dbUsers } from '../../../database';

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}


export default NextAuth({
  
  providers: [

    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correo:', type: 'email', placeholder: 'correo@google.com'  },
        password: { label: 'Contraseña:', type: 'password', placeholder: 'Contraseña'  }
      },
        async authorize( credentials ) {
          console.log('esto es credential: ',{ credentials });
          // validar credenciales contra la base de datos
          const user = await dbUsers.checkUserEmailPassword(
              credentials!.email,
              credentials!.password);
          if (user) {
              return {
                  id: user._id,
                  email: user.email,
                  name: user.name,
                  role: user.role,
              };
          } else {
              return null;
          }
      }
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    


  ],

  // Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  // Callbacks
  jwt: {
    // secret: process.env.JWT_SECRET_SEED, // deprecated
  },
  
  session: {
    maxAge: 2592000, /// 30d
    strategy: 'jwt',
    updateAge: 86400, // cada día
  },

  
  callbacks: {
    
    async jwt({ token,account,user,profile }) {
      console.log('token:', token);
      console.log('account:', account);
      console.log('user:', user);
      console.log('profile:', profile);

      if ( account ) {
        token.accessToken = account.access_token;
        switch( account.type ) {
          case 'oauth': 
            token.user = await dbUsers.oAUthToDbuser( user?.email || '', user?.name || '' );
          break;

          case 'credentials':
            token.user = user;                      
          break;
        }

      }
      console.log('token:', token);
      return token;
      
    },

    async session({ session, token, user }){    
         
        session.accessToken = token.accessToken as any;
        session.user = token.user as any;
      
        console.log('session:', session);
      return session;
    }    

  }

});