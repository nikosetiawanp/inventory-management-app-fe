import {
  Button,
  Dialog,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

export default function CreateProduct() {
  const units = ["pcs", "kg"];

  const [open, setOpen] = useState(false);
  const [unit, setUnit] = useState("");

  return (
    <>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        onClick={() => setOpen(true)}
      >
        Tambah Produk
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth={"sm"}
      >
        {/* <DialogTitle fontWeight={"bold"}>Tambah Produk</DialogTitle> */}
        <Stack gap={3} padding={4}>
          <Typography variant="h6">Tambah Produk</Typography>
          <TextField id="kode" label="Kode" variant="outlined" />
          <TextField id="name" label="Nama" variant="outlined" />

          {/* SELECT */}
          <TextField
            id="unit"
            value={unit}
            label="Unit"
            select
            onChange={(event) => setUnit(event.target.value)}
          >
            {units.map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </TextField>
          <Stack
            direction={"row"}
            width={1}
            justifyContent={"flex-end"}
            gap={1}
          >
            <Button onClick={() => setOpen(false)}>Batal</Button>
            <Button variant={"contained"}>Simpan</Button>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
}
