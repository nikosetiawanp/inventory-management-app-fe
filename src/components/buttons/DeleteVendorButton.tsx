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
import { useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import { Vendor } from "../../interfaces/interfaces";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

export default function DeleteVendorButton(props: { vendor: Vendor }) {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const queryClient = useQueryClient();
  const deleteVendor = useMutation(
    async (id: number | any) => {
      try {
        const response = await axios.delete(BACKEND_URL + "vendors/" + id);
        return response.data;
      } catch (error: any) {
        console.log(error);
        if (error?.code == "ERR_BAD_RESPONSE")
          throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("vendor");
      },
    }
  );

  const { isLoading } = deleteVendor;

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
          Hapus {props.vendor.code}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Data yang sudah dihapus tidak dapat dikembalikan.
            {/* Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running. */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Batal</Button>
          <Button
            color={isLoading ? "inherit" : "error"}
            onClick={() => {
              deleteVendor.mutateAsync(props.vendor.id);
            }}
            autoFocus
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress color="inherit" size={15} />
            ) : (
              "Hapus"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
