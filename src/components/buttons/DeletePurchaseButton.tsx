import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItemIcon,
  ListItemText,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import { Product, Purchase } from "../../interfaces/interfaces";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";

export default function DeletePurchaseButton(props: { purchase: Purchase }) {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const [open, setOpen] = useState(false);
  const handleClickOpen = (event: any) => {
    event.stopPropagation();
    setOpen(true);
  };
  const handleClose = (event: any) => {
    event.stopPropagation();
    setOpen(false);
  };

  const queryClient = useQueryClient();
  const deletePurchase = useMutation(
    async (id: number | any) => {
      try {
        const response = await axios.delete(BACKEND_URL + "purchases/" + id);
        return response.data;
      } catch (error: any) {
        console.log(error);
        if (error?.code == "ERR_BAD_RESPONSE")
          throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("purchases");
      },
    }
  );

  const { isLoading } = deletePurchase;

  return (
    <>
      <MenuItem onClick={handleClickOpen}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText sx={{ color: "error.main" }}>Hapus</ListItemText>
      </MenuItem>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Hapus {props.purchase.number}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Data yang sudah dihapus tidak dapat dikembalikan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Batal</Button>
          <Button
            color={isLoading ? "inherit" : "error"}
            onClick={(event: any) => {
              event.stopPropagation();
              deletePurchase.mutateAsync(props.purchase.id);
            }}
            autoFocus
            disabled={isLoading}
          >
            {isLoading
              ? "Menghapus"
              : // <CircularProgress color="inherit" size={15} />
                "Hapus"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
