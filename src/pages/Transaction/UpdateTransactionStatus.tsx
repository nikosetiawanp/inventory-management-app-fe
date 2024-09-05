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

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function UpdateTransactionStatus(props: {
  refetch(): any;
  transaction: Transaction;
  purpose: "approve" | "complete";
  dialogOpen: boolean;
  setDialogOpen: any;
}) {
  const [open, setOpen] = useState(false);

  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();
  const updateStatus = useMutation(
    async (data: Transaction) => {
      const dataToSubmit = {
        number: data?.number,
        date: data?.date,
        expectedArrival: null,
        isApproved: true,
        isDone: props.purpose == "approve" ? false : true,
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
        setOpen(false);
        props.setDialogOpen(false);
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
        size="md"
        startDecorator={<CheckCircleIcon fontSize="small" />}
      >
        {props.purpose == "approve" ? "Approve" : "Selesaikan"}
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            {props.purpose == "approve"
              ? `Approve ${props.transaction.number}?`
              : `Selesaikan ${props.transaction.number}?`}
          </DialogTitle>
          <DialogContent>
            {props.purpose == "approve"
              ? `Anda yakin ingin menandai ${props.transaction.number} sudah
            diapprove?`
              : `Anda yakin ingin menyelesaikan transaksi ${props.transaction.number}?`}
          </DialogContent>
          <DialogActions>
            <Button
              variant="solid"
              color="primary"
              onClick={() => updateStatus.mutateAsync(props.transaction)}
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
