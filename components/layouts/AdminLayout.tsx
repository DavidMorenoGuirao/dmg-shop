import { PropsWithChildren, FC } from "react";

import { SideMenu } from "../ui";
import { AdminNavbar } from "../admin";
import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";

interface Props {
  title: string;
  subTitle: string;
  icon?: JSX.Element;
}

export const AdminLayout: FC<PropsWithChildren<Props>> = ({
  children,
  title,
  subTitle,
  icon,
}) => {
  return (
    <>
      <nav>
        <AdminNavbar />
      </nav>

      <SideMenu />

      <main
        style={{
          margin: "80px auto",
          maxWidth: "1440px",
          padding: "0 30px",
        }}
      >
        <Box display={"flex"} flexDirection={"column"}>
          <Typography variant="h1" component="h1">
            {icon} {title}
          </Typography>
          <Typography variant="h2" sx={{ mb: 1 }}>
            {subTitle}
          </Typography>
        </Box>

        <Box className="fadeIn">{children}</Box>
      </main>
    </>
  );
};
