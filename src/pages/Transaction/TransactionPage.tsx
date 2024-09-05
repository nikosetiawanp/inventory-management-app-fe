import { Stack, Tab, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import { useState } from "react";

import Drawer from "../../components/Drawer";

import PendingPurchaseTab from "./PendingTransactionTab";
import ApprovedTransactionTab from "./ApprovedTransactionTab";
import CompletedTransactionTab from "./CompletedTransactionTab";

export default function TransactionPage(props: { type: "P" | "S" }) {
  const [tabTitle, setTabTitle] = useState("Purchase Order");

  const handleTabChange = (event: any, newValue: number) => {
    event;
    const titles =
      props.type == "P"
        ? ["Purchase Requisition", "Purchase Order", "Pembelian"]
        : ["Sales Requisition", "Sales Order", "Penjualan"];
    setTabTitle(titles[newValue]);
  };

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
              {props.type == "P" ? "Pembelian" : "Penjualan"}
            </Tab>
          </TabList>
          <TabPanel value={0} sx={{ paddingX: 0 }}>
            <PendingPurchaseTab type={props.type} />
          </TabPanel>
          <TabPanel value={1} sx={{ paddingX: 0 }}>
            <ApprovedTransactionTab type={props.type} />
          </TabPanel>
          <TabPanel value={2} sx={{ paddingX: 0 }}>
            <CompletedTransactionTab type={props.type} />
          </TabPanel>
        </Tabs>
      </Stack>
    </Stack>
  );
}
