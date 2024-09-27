import { MoreVert } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Invoice } from "../../interfaces/interfaces";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

const DeleteInvoice = (props: { invoice: Invoice }) => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = (event: any) => {
    event.stopPropagation();
    setOpen(true);
  };
  const handleClose = (event: any) => {
    event?.stopPropagation();
    setOpen(false);
  };

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const queryClient = useQueryClient();
  const deleteInvoice = useMutation(
    async (id: number | any) => {
      try {
        const response = await axios.delete(BACKEND_URL + "invoices/" + id);
        return response.data;
      } catch (error: any) {
        console.log(error);
        if (error?.code == "ERR_BAD_RESPONSE")
          throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("invoices");
      },
    }
  );

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
        <DialogTitle id="alert-dialog-title">Hapus ABXKSKJD?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Data yang sudah dihapus tidak dapat dikembalikan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Batal</Button>
          <Button
            color={deleteInvoice.isLoading ? "inherit" : "error"}
            onClick={() => {
              deleteInvoice.mutateAsync(props.invoice.id);
            }}
            autoFocus
            disabled={deleteInvoice.isLoading}
          >
            {deleteInvoice.isLoading
              ? "Menghapus"
              : // <CircularProgress color="inherit" size={15} />
                "Hapus"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default function InvoiceOptionButton(props: { invoice: Invoice }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event: any) => {
    event.stopPropagation();
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <MoreVert fontSize="small" />
      </IconButton>

      <Menu
        id="demo-positioned-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ubah</ListItemText>
        </MenuItem>
        <DeleteInvoice invoice={props.invoice} />
      </Menu>
    </>
  );
}
