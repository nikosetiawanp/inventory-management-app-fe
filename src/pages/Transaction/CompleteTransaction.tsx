import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  ModalDialog,
} from "@mui/joy";
import React, { useState } from "react";
import { Transaction } from "../../interfaces/interfaces";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

export default function ApproveTransaction(props: {
  refetch(): any;
  transaction: Transaction;
}) {
  const [open, setOpen] = useState(false);

  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();
  const approvePurchase = useMutation(
    async (data: Transaction) => {
      const dataToSubmit = {
        number: data?.number,
        date: data?.date,
        expectedArrival: null,
        isApproved: true,
        isDone: true,
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
    <React.Fragment>
      <Button
        variant="solid"
        color="primary"
        onClick={() => setOpen(true)}
        size="sm"
      >
        Selesaikan
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>Approve {props.transaction.number}?</DialogTitle>
          <DialogContent>
            Anda yakin ingin menyelesaikan transaksi {props.transaction.number}?
          </DialogContent>
          <DialogActions>
            <Button
              variant="solid"
              color="primary"
              onClick={() => approvePurchase.mutateAsync(props.transaction)}
            >
              OK
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
