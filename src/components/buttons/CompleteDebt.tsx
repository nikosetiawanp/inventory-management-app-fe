import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Debt } from "../../interfaces/interfaces";
import axios from "axios";

export default function CompleteDebt(props: { debt: Debt }) {
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

  const completeDebt = useMutation(
    async (data: Debt) => {
      const dataToSubmit = {
        id: props.debt.id,
        amount: props.debt.amount,
        isPaid: true,
        invoiceId: props.debt.invoiceId,
        contactId: props.debt.contactId,
      };
      try {
        const response = await axios.put(
          BACKEND_URL + "debts/" + props.debt.id,
          dataToSubmit
        );
        // props.refetch();
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
      <Button onClick={handleClickOpen}>Selesaikan Hutang</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Selesaikan Hutang?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Anda yakin ingin menyelesaikan hutang ini?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Batal</Button>
          <Button
            variant="contained"
            color={completeDebt.isLoading ? "inherit" : "primary"}
            onClick={() => {
              completeDebt.mutateAsync(props.debt);
            }}
            autoFocus
            disabled={completeDebt.isLoading}
          >
            {completeDebt.isLoading ? "Menunggu" : "Selesaikan"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
