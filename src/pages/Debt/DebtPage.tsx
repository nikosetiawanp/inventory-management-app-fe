import { Stack, Tab, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import Drawer from "../../components/Drawer";
import UnpaidDebtTab from "./UnpaidDebtTab";
import MonthlyReportTab from "./MonthlyReportTab";
import MultiVendorReportTab from "./MultiVendorReportTab";
import { useState } from "react";
import { Alert } from "../../interfaces/interfaces";
import AlertSnackbar from "../../components/AlertSnackbar";

export default function DebtPage(props: { type: "D" | "R" }) {
  // ALERT
  const [alert, setAlert] = useState<Alert>({
    open: false,
    color: "success",
    message: "Data berhasil dibuat",
  });
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
          {props.type == "D" ? "Hutang" : "Piutang"}
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
              Laporan Multi Vendor
            </Tab>
          </TabList>
          <TabPanel value={0} sx={{ paddingX: 0 }}>
            <UnpaidDebtTab type={props.type} setAlert={setAlert} />
          </TabPanel>
          <TabPanel value={1} sx={{ paddingX: 0 }}>
            <MonthlyReportTab type={props.type} />
          </TabPanel>

          <TabPanel value={2} sx={{ paddingX: 0 }}>
            <MultiVendorReportTab type={props.type} />
          </TabPanel>
        </Tabs>
      </Stack>
      <AlertSnackbar alert={alert} setAlert={setAlert} />
    </Stack>
  );
}
