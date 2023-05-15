import { PeopleOutline } from "@mui/icons-material";
import { AdminLayout } from "../../components/layouts";

import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import useSWR from "swr";
import { IUser } from "../../interfaces/user";
import { Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { dmgApi } from "../../api";
import { useState, useEffect } from "react";

const UserPage = () => {
  const { data, error } = useSWR<IUser[]>("/api/admin/users");
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  if (!data && !error) return <></>;

  const onRoleUpdated = async (userId: string, newRole: string) => {
    const previusUsers = users.map((user) => ({ ...user }));
    const updatedUsers = users.map((user) => ({
      ...user,
      role: user._id === userId ? newRole : user.role,
    }));

    // colocandolo aqui se actualiza en el front inmediatamente
    setUsers(updatedUsers);

    try {
      await dmgApi.put("/admin/users", { userId, role: newRole });
    } catch (error) {
      setUsers(previusUsers);
      console.log(error);
      alert("Error al actualizar el rol del usuario");
    }
  };

  const colums: GridColDef[] = [
    { field: "email", headerName: "correo", width: 250 },
    { field: "name", headerName: "Nombre completo", width: 300 },
    {
      field: "role",
      headerName: "Rol",
      width: 300,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Select
            value={params.row.role}
            label="Rol"
            sx={{ width: 300 }}
            onChange={({ target }) =>
              onRoleUpdated(params.row.id, target.value)
            }
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="client">Client</MenuItem>
            <MenuItem value="colaborator">Colaborator</MenuItem>
            <MenuItem value="SEO">SEO</MenuItem>
          </Select>
        );
      },
    },
  ];

  // const colums: GridColDef[] = [
  //   { field: "email", headerName: "correo", width: 250 },
  //   { field: "name", headerName: "Nombre completo", width: 300 },
  //   {
  //     field: "role",
  //     headerName: "Rol",
  //     width: 300,
  //     renderCell: ({ row }: GridValueGetterParams) => {
  //       return (
  //         <Select
  //           value={row.role}
  //           label="Rol"
  //           sx={{ width: 300 }}
  //           onChange={({ target }) => onRoleUpdated(row.id, target.value)}
  //         >
  //           <MenuItem value="admin">Admin</MenuItem>
  //           <MenuItem value="client">Client</MenuItem>
  //           <MenuItem value="colaborator">Colaborator</MenuItem>
  //           <MenuItem value="SEO">SEO</MenuItem>
  //         </Select>
  //       );
  //     },
  //   },
  // ];

  const rows = users.map((user) => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }));

  return (
    <AdminLayout
      title={"Usuarios"}
      subTitle={"Mantenimiento de usuarios"}
      icon={<PeopleOutline />}
    >
      <Grid container className="fadeIn" p={4}>
        <Grid
          item
          xs={12}
          sx={{ height: 650, width: "100%", justifyContent: "center" }}
        >
          <DataGrid
            rows={rows}
            columns={colums}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default UserPage;
