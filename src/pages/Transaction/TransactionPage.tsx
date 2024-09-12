import { Stack, Tab, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import { useState } from "react";

import Drawer from "../../components/Drawer";
import TransactionTab from "./TransactionTab";
import { Alert } from "../../interfaces/interfaces";
import AlertSnackbar from "../../components/AlertSnackbar";

export default function TransactionPage(props: { type: "P" | "S" }) {
  const [tabTitle, setTabTitle] = useState("Purchase Order");

  const handleTabChange = (event: any, newValue: number) => {
    event;
    const titles =
      props.type == "P"
        ? ["Purchase Requisition", "Purchase Order", "Selesai"]
        : ["Sales Requisition", "Sales Order", "Selesai"];
    setTabTitle(titles[newValue]);
  };

  // ALERT
  const [alert, setAlert] = useState<Alert>({
    open: false,
    color: "success",
    message: "Data berhasil dibuat",
  });

  return (
    <Stack direction={"row"} height={"100vh"} width={"100vw"}>
      <Drawer />
      <Stack padding={4} gap={2} width={1}>
        <Typography fontWeight={"bold"} level="h4">
          {tabTitle}
        </Typography>

        <Tabs
          defaultValue={0}
          onChange={handleTabChange as any}
          sx={{ backgroundColor: "transparent" }}
        >
          <TabList>
            <Tab color="primary" value={0}>
              {props.type == "P" ? "Purchase Requisition" : "Sales Requisition"}
            </Tab>

            <Tab color="primary" value={1}>
              {props.type == "P" ? "Purchase Order" : "Sales Order"}
            </Tab>
            <Tab color="primary" value={2}>
              {props.type == "P" ? "Selesai" : "Selesai"}
            </Tab>
          </TabList>
          <TabPanel value={0} sx={{ paddingX: 0 }}>
            <TransactionTab
              type={props.type}
              isApproved={0}
              isDone={0}
              setAlert={setAlert}
            />
          </TabPanel>
          <TabPanel value={1} sx={{ paddingX: 0 }}>
            <TransactionTab
              type={props.type}
              isApproved={1}
              isDone={0}
              setAlert={setAlert}
            />
          </TabPanel>
          <TabPanel value={2} sx={{ paddingX: 0 }}>
            <TransactionTab
              type={props.type}
              isApproved={1}
              isDone={1}
              setAlert={setAlert}
            />
          </TabPanel>
        </Tabs>
      </Stack>
      <AlertSnackbar alert={alert} setAlert={setAlert} />
    </Stack>
  );
}
