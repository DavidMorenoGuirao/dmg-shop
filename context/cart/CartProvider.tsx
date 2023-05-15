import { FC, ReactNode, useEffect, useReducer, useState } from 'react';
import Cookie from 'js-cookie'

import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces';
import { CartContext, cartReducer } from './';
import { dmgApi } from '../../api';
import axios from 'axios';


export interface CartState {
    isLoaded: boolean;  //indica si el token del carrito esta cargado o no
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;

    shippingAddress?: ShippingAddress;
}


const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined
}


interface Props {
    children: ReactNode;
}


export const CartProvider:FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer( cartReducer, CART_INITIAL_STATE );
    const [isMounted, setIsMounted] = useState(false);

    // Efecto
    useEffect(() => {
        try {
            if (!isMounted) {
                const cookieProducts = JSON.parse(Cookie.get("cart") ?? "[]");
                dispatch({ type: 'Cart - LoadCart from cookies | storage', payload: cookieProducts });
                setIsMounted(true);            
            }
        }catch (error) {
            dispatch({ type: 'Cart - LoadCart from cookies | storage', payload: [] });
            setIsMounted(true);
        }        
    }, [isMounted, dispatch]);


    useEffect(() => {
        if (isMounted) Cookie.set("cart", JSON.stringify(state.cart));
    }, [state.cart, isMounted]);

    

    useEffect(() => {
        if (isMounted && Cookie.get('firstName')) {
            const shippingAddress = {
                firstName: Cookie.get('firstName') || '',
                lastName : Cookie.get('lastName')  || '',
                address  : Cookie.get('address')   || '',
                address2 : Cookie.get('address2')  || '',
                zip      : Cookie.get('zip')       || '',
                city     : Cookie.get('city')      || '',
                country  : Cookie.get('country')   || '',
                phone    : Cookie.get('phone')     || '', 
            }
            dispatch({ type: 'Cart - LoadAddress from cookies', payload: shippingAddress });
        }
    }, [ isMounted, Cookie.get('firstName') ]);  


    useEffect(() => {
        const numberOfItems = state.cart.reduce (( prev, current ) => prev + current.quantity, 0);

        const subTotal = state.cart.reduce (( prev, current ) => (current.price * current.quantity) + prev, 0);

        const taxtRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

        const orderSummary = {
            numberOfItems,
            subTotal,
            tax: subTotal * taxtRate,
            total: subTotal * ( 1 + taxtRate )
        }
        
        dispatch({ type: 'Cart - Update order summary', payload: orderSummary });
        
    }, [state.cart]);

    
    const addProductToCart = ( product: ICartProduct ) => {
                   
        const productsInCarts = state.cart.some( p => p._id === product._id );
        if ( !productsInCarts ) return dispatch({ type: 'Cart - Update products in cart', payload: [ ...state.cart, product ] });

        const productInCartButDifferenSize = state.cart.some( p => p._id === product._id && p.size === product.size );
        if ( !productInCartButDifferenSize ) return dispatch({ type: 'Cart - Update products in cart', payload: [ ...state.cart, product ] });

        //Acumular
        const updatedProducts = state.cart.map( p => {
            if ( p._id !== product._id ) return p;
            if ( p.size !== product.size ) return p;

            //Actualizar la cantidad
            p.quantity += product.quantity;
            return p;
        } );

        dispatch({ type: 'Cart - Update products in cart', payload: updatedProducts });    
    }


    const upgradeCartQuantity = (product: ICartProduct) => {
        dispatch({ type:'Cart - Change cart quantity', payload: product })
    }


    const removeCartProduct = (product: ICartProduct) => {
        dispatch({ type:'Cart - Remove product in cart', payload: product })
    }   


    const updateAddress = (address: ShippingAddress) => {
        Cookie.set('firstName', address.firstName );
        Cookie.set('lastName', address.lastName);
        Cookie.set('address', address.address);
        Cookie.set('address2', address.address2 || '');
        Cookie.set('zip', address.zip);
        Cookie.set('city', address.city);
        Cookie.set('country', address.country);
        Cookie.set('phone', address.phone);

        dispatch({ type:'Cart - Update address', payload: address })
    }
    

    const createOrder = async ():Promise<{ hasError: boolean; message: string}> => {

        if ( !state.shippingAddress ){
            throw new Error('CartProvider - No hay direccion de entrega');
        }

        const body: IOrder = {
            orderItems: state.cart.map( p =>({
                ...p,
                size: p.size!,            
                
            })),
            shippingAddress: state.shippingAddress,
            numberOfItems: state.numberOfItems,
            subTotal: state.subTotal,
            tax: state.tax,
            total: state.total,
            isPaid: false,            
        }


        try {
            const { data } = await dmgApi.post<IOrder>('/orders', body);
            
            //dispatch de una accion (vaciar carrito, limpiar state, etc)
            dispatch({ type: 'Cart - Order Complete' });

            return {
                hasError: false,
                message: data._id!
            };
            
        } catch (error) {
            if( axios.isAxiosError(error) ) {
                return {
                    hasError: true,
                    message: error.message
                }
            }
            return{
                hasError: true,
                message: 'Error no controlado, hable con el administrador'
            }
        }
    }
        


    return (
        <CartContext.Provider value={{
            ...state,

            //Methods
            addProductToCart,
            upgradeCartQuantity,
            removeCartProduct,
            updateAddress,

            //Orders
            createOrder,
        
        }}>
            { children }
        </CartContext.Provider>
    );
}