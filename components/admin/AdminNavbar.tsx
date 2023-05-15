import NextLink from "next/link";
import { useContext } from "react";

// import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from "@mui/material"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Link from "@mui/material/Link"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"

import { UiContext } from "../../context";



export const AdminNavbar = () => {

    const { toggleSidebar } = useContext(UiContext);
   

    return (
    <AppBar>
        <Toolbar>
            <NextLink href='/' passHref>
                <Link display='flex' alignItems='center'>
                    <Typography variant="h6">Dmg |</Typography>
                    <Typography sx={{ml: 0.5 }}>Shop</Typography>                    
                </Link>
            </NextLink>

            <Box flex={ 1 }/>           

            <Button onClick={ toggleSidebar }>Menu</Button>
            
        </Toolbar>
    </AppBar>
    )
}
