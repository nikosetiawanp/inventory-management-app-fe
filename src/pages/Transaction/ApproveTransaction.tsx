import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";
import { Transaction } from "../../interfaces/interfaces";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

export default function ApproveTransaction(props: {
  refetch(): any;
  transaction: Transaction;
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
    async (data: Transaction) => {
      const dataToSubmit = {
        number: data?.number,
        date: data?.date,
        expectedArrival: null,
        isApproved: true,
        isDone: false,
        contactId: data?.contactId,
        type: props.transaction.type,
      };
      console.log(dataToSubmit);

      try {
        const response = await axios.put(
          BACKEND_URL + "transactions/" + data.id,
          dataToSubmit
        );
        props.refetch();
        return response.data;
      } catch (error) {
        console.log(error);
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
          Approve {props.transaction.number}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Anda yakin ingin menandai {props.transaction.number} sudah
            diapprove?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Batal</Button>
          <Button
            variant="contained"
            color={approvePurchase.isLoading ? "inherit" : "primary"}
            onClick={() => {
              approvePurchase.mutateAsync(props.transaction);
            }}
            autoFocus
            disabled={approvePurchase.isLoading}
          >
            {approvePurchase.isLoading ? "Mengupdate" : "Approve"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
