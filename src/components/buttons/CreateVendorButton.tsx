import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import CreateVendorForm from "../dialogs/CreateVendorForm";

export default function CreateProduct() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        onClick={() => setOpen(true)}
      >
        Tambah Vendor
      </Button>
      <CreateVendorForm open={open} setOpen={setOpen} />
    </>
  );
}
