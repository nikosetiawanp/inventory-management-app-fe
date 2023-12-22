import { Button, Stack, TextField, Typography } from "@mui/material";
import Drawer from "../components/Drawer";

import AddIcon from "@mui/icons-material/Add";
import CreateProduct from "../components/dialogs/CreateProduct";

export default function ProductPage() {
  return (
    // PAGE
    <Stack direction={"row"} height={"100vh"} width={"100vw"}>
      {/* DRAWER */}
      <Drawer />

      {/* CONTENT */}
      <Stack padding={4} gap={2} width={1}>
        <Typography fontWeight={"bold"} variant="h4">
          Produk
        </Typography>
        <Stack direction={"row"} justifyContent={"space-between"} width={1}>
          <TextField
            id="outlined-basic"
            label="Cari"
            variant="outlined"
            size="small"
            sx={{ width: "400px" }}
          />
          <CreateProduct />
          {/* <Button startIcon={<AddIcon />} variant="contained">
            Tambah Produk
          </Button> */}
        </Stack>
      </Stack>
    </Stack>
  );
}
