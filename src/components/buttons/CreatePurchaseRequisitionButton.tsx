import { useState } from "react";
import { Button } from "@mui/material";
import CreatePurchaseRequisitionForm from "../forms/CreatePurchaseRequisitionForm";

import AddIcon from "@mui/icons-material/Add";

export default function CreatePurchaseRequisitionButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ marginLeft: "auto" }}
      >
        Buat Purchase Requisition
      </Button>

      <CreatePurchaseRequisitionForm open={open} setOpen={setOpen} />
    </>
  );
}
