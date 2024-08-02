import { Stack, Tab, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import Drawer from "../../components/Drawer";

import UnpaidDebtTab from "./UnpaidDebtTab";
import MonthlyReportTab from "./MonthlyReportTab";
import VendorReportTab from "./VendorReportTab";
import MultiVendorReportTab from "./MultiVendorReportTab";

export default function DebtPage() {
  return (
    <Stack
      direction={"row"}
      height={"100vh"}
      width={"100vw"}
      sx={{ backgroundColor: "background" }}
    >
      <Drawer />
      <Stack padding={4} gap={2} width={1}>
        <Typography fontWeight={"bold"} level="h4">
          Hutang
        </Typography>
        <Tabs defaultValue={0} sx={{ backgroundColor: "transparent" }}>
          <TabList>
            <Tab color="primary" value={0}>
              Belum Lunas
            </Tab>
            <Tab color="primary" value={1}>
              Laporan Bulanan
            </Tab>
            <Tab color="primary" value={2}>
              Laporan Per Vendor
            </Tab>
            <Tab color="primary" value={3}>
              Laporan Multi Vendor
            </Tab>
          </TabList>
          <TabPanel value={0} sx={{ paddingX: 0 }}>
            <UnpaidDebtTab />
          </TabPanel>
          <TabPanel value={1} sx={{ paddingX: 0 }}>
            <MonthlyReportTab />
          </TabPanel>
          <TabPanel value={2} sx={{ paddingX: 0 }}>
            <VendorReportTab />
          </TabPanel>
          <TabPanel value={3} sx={{ paddingX: 0 }}>
            <MultiVendorReportTab />
          </TabPanel>
        </Tabs>
      </Stack>
    </Stack>
  );
}
