import { Stack, Tab, TabList, TabPanel, Tabs, Typography } from "@mui/joy";

import Drawer from "../../components/Drawer";

import PendingPurchaseTab from "./PendingTransactionTab";
import ApprovedTransactionTab from "./ApprovedTransactionTab";
import CompletedTransactionTab from "./CompletedTransactionTab";

export default function SalesPage() {
  return (
    // PAGE
    <Stack direction={"row"} height={"100vh"} width={"100vw"}>
      {/* DRAWER */}
      <Drawer />

      {/* CONTENT */}
      <Stack padding={4} gap={2} width={1}>
        <Typography fontWeight={"bold"} level="h4">
          Penjualan
        </Typography>
        {/* TABS */}
        <Tabs defaultValue={0} sx={{ backgroundColor: "transparent" }}>
          <TabList>
            <Tab color="primary" value={0}>
              Pending
            </Tab>

            <Tab color="primary" value={1}>
              Approved
            </Tab>
            <Tab color="primary" value={2}>
              Selesai
            </Tab>
          </TabList>
          <TabPanel value={0} sx={{ paddingX: 0 }}>
            <PendingPurchaseTab type="S" />
          </TabPanel>
          <TabPanel value={1} sx={{ paddingX: 0 }}>
            <ApprovedTransactionTab type="S" />
          </TabPanel>
          <TabPanel value={2} sx={{ paddingX: 0 }}>
            <CompletedTransactionTab type="S" />
          </TabPanel>
        </Tabs>
      </Stack>
    </Stack>
  );
}
