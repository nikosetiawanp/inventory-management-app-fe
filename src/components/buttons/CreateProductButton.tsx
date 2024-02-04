import { useState } from "react";
import { Button } from "@mui/material";
import CreateProductForm from "../forms/CreateProductForm";

import AddIcon from "@mui/icons-material/Add";

export default function CreateProductButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        onClick={() => setOpen(true)}
      >
        Tambah Produk
      </Button>

      <CreateProductForm open={open} setOpen={setOpen} />
    </>
  );
}
