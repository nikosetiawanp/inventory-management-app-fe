import {
  Button,
  Dialog,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Product } from "../../interfaces/interfaces";
import CreateProductForm from "../dialogs/CreateProductForm";

export default function CreateProduct() {
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
