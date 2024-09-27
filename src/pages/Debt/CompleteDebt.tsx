import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  Modal,
  ModalDialog,
} from "@mui/joy";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Debt } from "../../interfaces/interfaces";
import axios from "axios";
import { useNotification } from "../../App";

export default function CompleteDebt(props: { debt: Debt }) {
  const { triggerAlert } = useNotification();
  const [open, setOpen] = useState(false);
  const handleClickOpen = (event: any) => {
    event.stopPropagation();
    setOpen(true);
  };

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const queryClient = useQueryClient();

  const completeDebt = useMutation(
    async (debt: Debt) => {
      const dataToSubmit = {
        id: debt.id,
        amount: debt.amount,
        isPaid: true,
        invoiceId: debt.invoiceId,
        contactId: debt.contactId,
      };
      try {
        const response = await axios.put(
          BACKEND_URL + "debts/" + debt.id,
          dataToSubmit
        );
        triggerAlert({ message: "Data berhasil disimpan", color: "success" });
        return response.data;
      } catch (error: any) {
        console.log(error);
        triggerAlert({ message: `Error: ${error.message}`, color: "danger" });
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
      <Button
        variant="solid"
        size="sm"
        color="success"
        onClick={handleClickOpen}
      >
        Selesaikan
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
          <DialogTitle> Selesaikan Hutang?</DialogTitle>
          <DialogContent>
            Anda yakin ingin menyelesaikan hutang ini?
          </DialogContent>
          <Box
            sx={{
              mt: 1,
              display: "flex",
              gap: 1,
              justifyContent: "flex-end",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setOpen(false)}
              disabled={completeDebt.isLoading}
            >
              Batal
            </Button>
            <Button
              variant="solid"
              color="primary"
              onClick={() => {
                completeDebt.mutateAsync(props.debt);
              }}
              loading={completeDebt.isLoading}
            >
              Selesaikan
            </Button>
          </Box>
        </ModalDialog>
        {/* <DialogActions>
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
        </DialogActions> */}
      </Modal>
    </>
  );
}
