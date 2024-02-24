import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { Invoice } from "../../interfaces/interfaces";

export default function CreateDebt(props: {
  debtAmount: number;
  invoice: Invoice;
}) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = (event: any) => {
    event.stopPropagation();
    setOpen(true);
  };
  const handleClose = (event: any) => {
    event?.stopPropagation();
    setOpen(false);
  };
  // CREATE INVOICE
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();

  const dataToSubmit = {
    debtAmount: props.debtAmount,
    invoiceId: props.invoice.id,
  };

  const createDebt = useMutation(
    async (data: any) => {
      try {
        const response = await axios.post(BACKEND_URL + "debts/", data);
        setOpen(false);
        return response.data;
      } catch (error) {
        throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("debts");
      },
    }
  );

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Buat Hutang
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Buat Hutang?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Anda yakin ingin membuat hutang dari faktur ini?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Batal</Button>
          <Button
            color={createDebt.isLoading ? "inherit" : "primary"}
            onClick={() => {
              createDebt.mutateAsync(dataToSubmit);
            }}
            autoFocus
            disabled={createDebt.isLoading}
            variant="contained"
          >
            {createDebt.isLoading ? "Membuat Hutang" : "Buat Hutang"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
