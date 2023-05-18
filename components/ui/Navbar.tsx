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
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

// import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material";
import ClearOutlined from "@mui/icons-material/ClearOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import { UiContext } from "../../context/ui/UiContext";
import { CartContext } from "../../context/cart/CartContext";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 50,
  height: 26,
  padding: 8,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      border: "1px solid white",
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 21 21"><path fill="${encodeURIComponent(
          "white"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#896A5" : "#ab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "black" : "black",
    width: 22,
    height: 22,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "white"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));

export const Navbar = () => {
  const { asPath, push } = useRouter();
  const { toggleSideMenu, isDarkTheme, toggleTheme } = useContext(UiContext);
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
        <FormGroup>
          <FormControlLabel
            control={
              <MaterialUISwitch
                sx={{ m: 1 }}
                checked={isDarkTheme}
                onChange={toggleTheme}
              />
            }
            label=""
          />
        </FormGroup>
        {/* <Switch checked={isDarkTheme} onChange={toggleTheme} size="small" /> */}
        {/* Para pantallas grandes */}

        {isSearchVisible === true ? (
          <Input
            sx={{ display: { xs: "none", sm: "flex" } }}
            className="fadeIn"
            {...textFieldProps}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // onKeyUp={(e) => e.key === "Enter" && onSearchTerm()}
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
