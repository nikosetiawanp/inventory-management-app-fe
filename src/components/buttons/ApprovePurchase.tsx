import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";
import { Purchase } from "../../interfaces/interfaces";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

export default function ApprovePurchase(props: {
  refetch(): any;
  purchase: Purchase;
}) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = (event: any) => {
    event.stopPropagation();
    setOpen(true);
  };
  const handleClose = (event: any) => {
    event.stopPropagation();
    setOpen(false);
  };

  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();
  const approvePurchase = useMutation(
    async (data: Purchase) => {
      const dataToSubmit = {
        number: props.purchase.number,
        date: props.purchase.date,
        expectedArrival: props.purchase.expectedArrival,
        isApproved: true,
        isDone: false,
        contactId: props.purchase.contactId,
      };
      try {
        const response = await axios.put(
          BACKEND_URL + "transactions/" + props.purchase.id,
          dataToSubmit
        );
        props.refetch();
        return response.data;
      } catch (error) {
        throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("products");
      },
    }
  );
  return (
    <>
      <Button variant="contained" onClick={handleClickOpen}>
        Approve
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Approve {props.purchase.number}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Anda yakin ingin menandai {props.purchase.number} sudah diapprove?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Batal</Button>
          <Button
            variant="contained"
            color={approvePurchase.isLoading ? "inherit" : "primary"}
            onClick={() => {
              approvePurchase.mutateAsync(props.purchase);
            }}
            autoFocus
            disabled={approvePurchase.isLoading}
          >
            {approvePurchase.isLoading ? "Menghapus" : "Approve"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
