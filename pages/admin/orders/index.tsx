import React from "react";
import { NextPage } from "next";
import useSWR from "swr";

import ConfirmationNumberOutlined from "@mui/icons-material/ConfirmationNumberOutlined";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

import AdminLayout from "../../../components/layouts/AdminLayout";
import { IOrder } from "../../../interfaces/order";
import { IUser } from "../../../interfaces/user";

//
const columns: GridColDef[] = [
  { field: "id", headerName: "Order ID", width: 230 },
  { field: "email", headerName: "Correo", width: 200 },
  { field: "name", headerName: "Nombre Completo", width: 250 },
  { field: "total", headerName: "Monto total", width: 150 },
  {
    field: "isPaid",
    headerName: "Pagada",
    width: 110,
    // @ts-ignore
    renderCell: ({ row }: GridValueGetterParams) => {
      return row.isPaid ? (
        <Chip variant="outlined" label="Pagada" color="success" />
      ) : (
        <Chip variant="outlined" label="Pendiente" color="error" />
      );
    },
  },
  {
    field: "inStock",
    headerName: "Productos",
    align: "center",
    width: 110,
  },
  {
    field: "check",
    headerName: "Ver orden",
    // @ts-ignore
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
          Ver orden
        </a>
      );
    },
  },
  { field: "createdAt", headerName: "Creada en", width: 228 },
];

const OrdersPage: NextPage = () => {
  const { data = [], error } = useSWR<IOrder[]>("/api/admin/orders");

  if (!data && !error) return <></>;

  const rows = data.map(
    ({ _id, user, total, isPaid, numberOfItems, createdAt }) => ({
      id: _id,
      email: (user as IUser).email,
      name: (user as IUser).name,
      total,
      isPaid,
      inStock: numberOfItems,
      createdAt,
    })
  );

  return (
    <AdminLayout
      title={"Ordenes"}
      subTitle={"Mantenimiento de ordenes"}
      icon={<ConfirmationNumberOutlined />}
    >
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default OrdersPage;
