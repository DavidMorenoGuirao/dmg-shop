import NextLink from "next/link";
import { useContext, useState } from "react";
import { useRouter } from "next/router";

// import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from "@mui/material"
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import { Link as MuiLink } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

// import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material";
import ClearOutlined from "@mui/icons-material/ClearOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import { UiContext } from "../../context/ui/UiContext";
import { CartContext } from "../../context/cart/CartContext";

export const Navbar = () => {
  const { asPath, push } = useRouter();
  const { toggleSideMenu } = useContext(UiContext);
  const { numberOfItems } = useContext(CartContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSerachVisible] = useState(false);

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    push(`/search/${searchTerm}`);
  };

  // autofocus username input
  const textFieldInputFocus = (inputRef: any) => {
    if (inputRef && inputRef.node !== null) {
      setTimeout(() => {
        inputRef.focus();
      }, 100);
    }
    return inputRef;
  };
  let textFieldProps = { inputRef: textFieldInputFocus };

  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/" passHref legacyBehavior>
          <MuiLink display="flex" alignItems="center">
            <Typography variant="h6">Dmg |</Typography>
            <Typography sx={{ ml: 0.5 }}>Shop</Typography>
          </MuiLink>
        </NextLink>

        <Box flex={1} />
        {/* Ojito con esto 'Box' que nos sirve mucho para el responsive  */}

        <Box
          sx={{
            display: isSearchVisible ? "none" : { xs: "none", sm: "block" },
          }}
          className="fadeIn"
        >
          <NextLink href="/category/men" passHref legacyBehavior>
            <MuiLink>
              <Button color={asPath.includes("/men") ? "primary" : "info"}>
                Hombres
              </Button>
            </MuiLink>
          </NextLink>

          <NextLink href="/category/women" passHref legacyBehavior>
            <MuiLink>
              <Button color={asPath.includes("/women") ? "primary" : "info"}>
                Mujeres
              </Button>
            </MuiLink>
          </NextLink>

          <NextLink href="/category/kid" passHref legacyBehavior>
            <MuiLink>
              <Button color={asPath.includes("/kid") ? "primary" : "info"}>
                Niños
              </Button>
            </MuiLink>
          </NextLink>
        </Box>

        <Box flex={1} />

        {/* Para pantallas grandes */}

        {isSearchVisible === true ? (
          <Input
            sx={{ display: { xs: "none", sm: "flex" } }}
            className="fadeIn"
            {...textFieldProps}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // onKeyUp={ (e) => e.key === 'Enter' && onSearchTerm() }
            onKeyUp={(e) => (e.key === "Enter" ? onSearchTerm() : null)}
            type="text"
            placeholder="Buscar..."
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setIsSerachVisible(false)}>
                  <ClearOutlined />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <IconButton
            className="fadeIn"
            sx={{ display: { xs: "none", sm: "flex" } }}
            onClick={() => setIsSerachVisible(true)}
          >
            <SearchOutlined />
          </IconButton>
        )}

        {/* Para pantallas pequeñas */}
        <IconButton
          sx={{ display: { xs: "flex", sm: "none" } }}
          onClick={toggleSideMenu}
        >
          <SearchOutlined />
        </IconButton>

        <NextLink href="/cart" passHref legacyBehavior>
          <MuiLink>
            <IconButton>
              <Badge
                badgeContent={numberOfItems < 10 ? numberOfItems : "+9"}
                color={"secondary"}
              >
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </MuiLink>
        </NextLink>

        <Button onClick={toggleSideMenu}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};
