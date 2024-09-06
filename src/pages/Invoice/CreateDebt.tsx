import { Box, Button, Modal, ModalDialog, Typography } from "@mui/joy";
import axios from "axios";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Debt, Invoice } from "../../interfaces/interfaces";

export default function CreateDebt(props: {
  debtAmount: number;
  invoice: Invoice;
  type: "P" | "S";
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
    amount: props.debtAmount,
    type: props.type == "P" ? "D" : "R",
    isPaid: false,
    invoiceId: props.invoice?.id,
    contactId: props.invoice?.transaction?.contactId,
  };

  const createDebt = useMutation(
    async (data: Debt) => {
      try {
        const response = await axios.post(BACKEND_URL + "debts/", data);
        handleClose(event);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("debts");
        queryClient.invalidateQueries("invoices");
      },
    }
  );

  return (
    <>
      <Button
        variant="solid"
        onClick={() => handleClickOpen(event)}
        disabled={props.invoice?.debts?.length > 0}
      >
        {props.type == "P" ? "Buat Hutang" : "Buat Piutang"}
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          aria-labelledby="nested-modal-title"
          aria-describedby="nested-modal-description"
          sx={(theme) => ({
            [theme.breakpoints.only("xs")]: {
              top: "unset",
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: 0,
              transform: "none",
              maxWidth: "unset",
            },
          })}
        >
          <Typography id="nested-modal-title" level="h2">
            <b>{props.type == "P" ? "Buat Hutang?" : "Buat Piutang?"}</b>{" "}
          </Typography>
          <Typography id="nested-modal-description" textColor="text.tertiary">
            {props.type == "P"
              ? `Anda yakin ingin membuat hutang dari faktur ${props.invoice.number}?`
              : `Anda yakin ingin membuat piutang dari faktur ${props.invoice.number}?`}
          </Typography>
          <Box
            sx={{
              mt: 1,
              display: "flex",
              gap: 1,
              flexDirection: { xs: "column", sm: "row-reverse" },
            }}
          >
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setOpen(false)}
              disabled={createDebt.isLoading}
            >
              Batal
            </Button>
            <Button
              variant="solid"
              color="primary"
              loading={createDebt.isLoading}
              onClick={() => {
                createDebt.mutateAsync(dataToSubmit as any);
              }}
            >
              {props.type == "P" ? "Buat Hutang" : "Buat Piutang"}
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </>
  );
}
