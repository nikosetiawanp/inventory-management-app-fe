import { Button, Dialog, DialogTitle } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

export default function CreateProduct() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button startIcon={<AddIcon />} variant="contained">
        Tambah Produk
      </Button>

      <Dialog>
        <DialogTitle>Tambah Produk</DialogTitle>
      </Dialog>
    </>
  );
}
