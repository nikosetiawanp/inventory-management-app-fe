import {
  Button,
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
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
export default function DeleteRecord(props: {
  id: number;
  param: string;
  queryKey: string;
  label: string;
  variant: "button" | "menu-item";
  disabled?: boolean;
}) {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const [open, setOpen] = useState(false);
  const handleClickOpen = (event: any) => {
    event.stopPropagation();
    setOpen(true);
  };
  const handleClose = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    setOpen(false);
  };

  const queryClient = useQueryClient();
  const deleteRecord = useMutation(
    async (id: number) => {
      try {
        const response = await axios.delete(
          BACKEND_URL + `${props.param}/` + id
        );
        return response.data;
      } catch (error: any) {
        console.log(error);
        if (error?.code == "ERR_BAD_RESPONSE")
          throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(props.queryKey);
      },
    }
  );

  const { isLoading } = deleteRecord;

  return (
    <>
      {props.variant == "menu-item" ? (
        <MenuItem onClick={handleClickOpen}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: "error.main" }}>Hapus</ListItemText>
        </MenuItem>
      ) : null}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Hapus {props.label}?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Data yang sudah dihapus tidak dapat dikembalikan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Batal</Button>
          <Button
            color={isLoading ? "inherit" : "error"}
            onClick={() => {
              deleteRecord.mutateAsync(props.id);
            }}
            autoFocus
            disabled={isLoading}
          >
            {isLoading ? "Menghapus" : "Hapus"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
