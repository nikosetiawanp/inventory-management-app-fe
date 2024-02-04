import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import CreateVendorForm from "../forms/CreateVendorForm";

export default function CreateVendorButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ height: "auto" }}
      >
        Tambah Vendor
      </Button>
      <CreateVendorForm open={open} setOpen={setOpen} />
    </>
  );
}
