import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next'
import { getSession, signIn } from 'next-auth/react';
import NextLink from 'next/link';

// import { Box, Button, Grid, Link, TextField, Typography } from '@mui/material'
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Chip from '@mui/material/Chip';
import ErrorOutline from '@mui/icons-material/ErrorOutline';

import { AuthLayout } from '../../components/layouts'
import { validations } from '../../utils';
import { AuthContext } from '../../context';


type FormData = {
    name: string;
    email: string;
    password: string;
};


const RegisterPage = () => {
    
    const router = useRouter();
    const { registerUser } = useContext( AuthContext );

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState( false );
    const [errorMessage, setErrorMessage] = useState('');

    const onRegisterForm = async( { name, email, password }: FormData ) => {

        setShowError( false );
        const { hasError, message} = await registerUser( name, email, password );

        if ( hasError ) {
            setShowError( true );
            setErrorMessage( message! );
            setTimeout(() =>  setShowError( false ) , 3000);            
            return;
        }

        //navegar a la pantalla donde se encontraba el user
        // const destination = router.query.p?.toString() || '/';
        // router.replace( destination );

        await signIn('credentials', { email, password });
    }

    return (
        <AuthLayout title={'Ingresar'}>
            <form onSubmit={ handleSubmit(onRegisterForm) } noValidate>
                <Box sx={{ width: 350, padding:'10px 20px'}}>
                    <Grid container spacing={2}>

                        <Grid item xs={12}>
                            <Typography variant="h1" component='h1'>Crear cuenta</Typography>
                            <Chip
                                label="Email o contraseña incorrectos"
                                color="error"
                                icon={ <ErrorOutline />}
                                className="fadeIn"
                                sx={{ display: showError ? 'flex' : 'none' }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Nombre Completo"
                                variant="filled"
                                fullWidth
                                {
                                    ...register('name', {
                                        required: 'Este campo es requerido',
                                        minLength: { value: 2, message: 'Minimo 2 caracteres' },
                                    })
                                }
                                error={ !!errors.name }
                                helperText={ errors.name?.message }                              
                            />
                        </Grid>
                        
                        <Grid item xs={12}>                            
                            <TextField
                                type="email"
                                label="Correo"
                                variant="filled"
                                fullWidth
                                {
                                    ...register('email', {
                                        required: 'Este campo es requerido',
                                        validate: validations.isEmail
                                    })
                                }
                                error={ !!errors.email }  //erros.email es un objeto, para poder pasarlo como booleano le ponemos la doble negacion al principio
                                helperText={ errors.email?.message }
                            />
                        </Grid>

                        <Grid item xs={12}>                           
                            <TextField
                                label="Contraseña"
                                type="password"
                                variant="filled"
                                fullWidth
                                {
                                    ...register('password', {
                                        required: 'Este campo es requerido',
                                        minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
                                    })
                                }
                                error={ !!errors.password }
                                helperText={ errors.password?.message }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                color='secondary'
                                className='circular-btn'
                                size='large'
                                fullWidth
                                
                            >
                                Registrar
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <NextLink
                                href={ router.query.p ? `/auth/login?p=${ router.query.p }` : '/auth/login' }
                                passHref
                            >
                                <Link variant="body2" color="textSecondary" component="a" underline="always">
                                    ¿Ya tienes una cuenta? Inicia sesion
                                </Link>

                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </form>

        </AuthLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// When creas user y lo autentificas, se redirecciona a la pagina que estaba antes de crear el user

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    
    const session = await getSession({ req });
    // console.log({session});
    

    const { p = '/' } = query;

    if ( session ) {
        return{
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}


export default RegisterPage