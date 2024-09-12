import { Stack, Tab, TabList, TabPanel, Tabs } from "@mui/joy";

import Typography from "@mui/joy/Typography";

import { useState } from "react";
import { Alert } from "../../interfaces/interfaces";
import Drawer from "../../components/Drawer";

import AlertSnackbar from "../../components/AlertSnackbar";
import ContactTab from "./ContactTab";

export default function ContactPage() {
  // FILTER
  const [tabTitle, setTabTitle] = useState("Daftar Vendor");
  const handleTabChange = (event: any, newValue: number) => {
    event;
    const titles = ["Daftar Vendor", "Daftar Customer"];
    setTabTitle(titles[newValue]);
  };

  // ALERT
  const [alert, setAlert] = useState<Alert>({
    open: false,
    color: "success",
    message: "Data berhasil dibuat",
  });

  return (
    // PAGE
    <Stack direction={"row"} height={"100vh"} width={"100vw"}>
      {/* DRAWER */}
      <Drawer />
      {/* CONTENT */}
      <Stack padding={4} gap={2} width={1}>
        <Typography fontWeight={"bold"} level="h4">
          {tabTitle}
        </Typography>

        <Tabs
          defaultValue={0}
          sx={{ backgroundColor: "transparent" }}
          onChange={handleTabChange as any}
        >
          <TabList>
            <Tab color="primary" value={0}>
              Vendor
            </Tab>
            <Tab color="primary" value={1}>
              Customer
            </Tab>
          </TabList>
          <TabPanel value={0} sx={{ paddingX: 0 }}>
            <ContactTab type={"V"} setAlert={setAlert} />
          </TabPanel>
          <TabPanel value={1} sx={{ paddingX: 0 }}>
            <ContactTab type={"C"} setAlert={setAlert} />
          </TabPanel>
        </Tabs>
      </Stack>
      <AlertSnackbar alert={alert} setAlert={setAlert} />
    </Stack>
  );
}
