import { Stack, Tab, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import Drawer from "../../components/Drawer";

import ProductListTab from "./ProductListTab";
import ProductHistoryTab from "./ProductHistoryTab";
import ProductSummaryTab from "./ProductSummaryTab";

export default function ProductPage() {
  return (
    <Stack direction={"row"} height={"100vh"} width={"100vw"}>
      <Drawer />
      <Stack padding={4} gap={2} width={1}>
        <Typography fontWeight={"bold"} level="h4">
          Produk
        </Typography>
        <Tabs defaultValue={0} sx={{ backgroundColor: "transparent" }}>
          <TabList>
            <Tab color="primary" value={0}>
              Daftar Produk
            </Tab>

            <Tab color="primary" value={1}>
              Rangkuman Stok
            </Tab>
            <Tab color="primary" value={2}>
              Histori Stok
            </Tab>
          </TabList>
          <TabPanel value={0} sx={{ paddingX: 0 }}>
            <ProductListTab />
          </TabPanel>
          <TabPanel value={1} sx={{ paddingX: 0 }}>
            <ProductSummaryTab />
          </TabPanel>
          <TabPanel value={2} sx={{ paddingX: 0 }}>
            <ProductHistoryTab />
          </TabPanel>
        </Tabs>
      </Stack>
    </Stack>
  );
}
