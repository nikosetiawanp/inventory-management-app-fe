import { Stack, Tab, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import Drawer from "../../components/Drawer";
import { useState } from "react";
import InventoryTab from "./InventoryTab";
import ProductSummaryTab from "./ProductSummaryTab";
import ProductHistoryTab from "./ProductHistoryTab";
import { Alert } from "../../interfaces/interfaces";
import AlertSnackbar from "../../components/AlertSnackbar";

export default function InventoryPage() {
  // FILTER
  const [tabTitle, setTabTitle] = useState("Gudang Masuk");
  const handleTabChange = (event: any, newValue: number) => {
    event;
    const titles = [
      "Gudang Masuk",
      "Gudang Keluar",
      "Rangkuman Stok",
      "Histori Stok",
    ];
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
              Gudang Masuk
            </Tab>
            <Tab color="primary" value={1}>
              Gudang Keluar
            </Tab>
            <Tab color="primary" value={2}>
              Rangkuman Stok
            </Tab>
            <Tab color="primary" value={3}>
              Histori Stok
            </Tab>
          </TabList>
          <TabPanel value={0} sx={{ paddingX: 0 }}>
            <InventoryTab type="A" setAlert={setAlert} />
          </TabPanel>
          <TabPanel value={1} sx={{ paddingX: 0 }}>
            <InventoryTab type="D" setAlert={setAlert} />
          </TabPanel>
          <TabPanel value={2} sx={{ paddingX: 0 }}>
            <ProductSummaryTab />
          </TabPanel>
          <TabPanel value={3} sx={{ paddingX: 0 }}>
            <ProductHistoryTab />
          </TabPanel>
        </Tabs>
      </Stack>
      <AlertSnackbar alert={alert} setAlert={setAlert} />
    </Stack>
  );
}
