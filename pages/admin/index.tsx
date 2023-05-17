import React, { useEffect, useState } from "react";

import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import AttachMoneyOutlined from "@mui/icons-material/AttachMoneyOutlined";
import CancelPresentationOutlined from "@mui/icons-material/CancelPresentationOutlined";
import CategoryOutlined from "@mui/icons-material/CategoryOutlined";
import CreditCardOffOutlined from "@mui/icons-material/CreditCardOffOutlined";
import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import GroupOutlined from "@mui/icons-material/GroupOutlined";
import ProductionQuantityLimitsOutlined from "@mui/icons-material/ProductionQuantityLimitsOutlined";
import Grid from "@mui/material/Grid";

import { NextPage } from "next";
import AdminLayout from "../../components/layouts/AdminLayout";
import SummaryTile from "../../components/admin/SummaryTile";
import useSWR from "swr";
import { DashboardSummaryResponse } from "../../interfaces/dashboard";

//
const DashboardPage: NextPage = () => {
  const [refreshIn, setRefreshIn] = useState(30);
  const { data, error } = useSWR<DashboardSummaryResponse>(
    "/api/admin/dashboard",
    {
      refreshInterval: 30 * 1000,
    }
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn((refreshIn) => (refreshIn > 0 ? refreshIn - 1 : 30));
    }, 1000);

    // Esta funcion limpia el intervalo
    return () => clearInterval(interval);
  }, []);

  if (!error && !data) {
    return <></>;
  }

  return (
    <AdminLayout
      title="Dashboard"
      subTitle="Estadisticas generales"
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTile
          title={data?.numberOfOrders || 0}
          subTitle={"Ordenes totales"}
          icon={
            <CreditCardOffOutlined color="secondary" sx={{ fontSize: 40 }} />
          }
        />

        <SummaryTile
          title={data?.paidOrders || 0}
          subTitle={"Ordenes pagadas"}
          icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={data?.notPaidOrders || 0}
          subTitle={"Ordenes pendientes"}
          icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={data?.numberOfClients || 0}
          subTitle={"Clientes"}
          icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={data?.numberOfProducts || 0}
          subTitle={"Productos"}
          icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={data?.productsWithNoInventory || 0}
          subTitle={"Sin existencias"}
          icon={
            <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />
          }
        />

        <SummaryTile
          title={data?.lowInventory || 0}
          subTitle={"Bajo inventario"}
          icon={
            <ProductionQuantityLimitsOutlined
              color="warning"
              sx={{ fontSize: 40 }}
            />
          }
        />

        <SummaryTile
          title={refreshIn}
          subTitle={"Actualización en:"}
          icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;
