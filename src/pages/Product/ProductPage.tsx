import { Stack, Tabs, Typography } from "@mui/joy";
import Drawer from "../../components/Drawer";
import ProductListTab from "./ProductListTab";

export default function ProductPage() {
  return (
    <Stack direction={"row"} height={"100vh"} width={"100vw"}>
      <Drawer />
      <Stack padding={4} gap={2} width={1}>
        <Typography fontWeight={"bold"} level="h4">
          Produk
        </Typography>
        <Tabs defaultValue={0} sx={{ backgroundColor: "transparent" }}>
          <ProductListTab />
        </Tabs>
      </Stack>
    </Stack>
  );
}
