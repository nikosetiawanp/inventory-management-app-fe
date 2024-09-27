import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Modal,
  ModalDialog,
  Button,
} from "@mui/joy";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

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
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [open, setOpen] = useState(false);

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

  return (
    <>
      {props.variant == "menu-item" ? (
        <MenuItem
          onClick={() => {
            setOpen(true);
            setOpen(true);

            alert(open);
          }}
        >
          <DeleteIcon fontSize="small" color="error" />
          Hapus
        </MenuItem>
      ) : null}

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog" layout="center">
          <DialogTitle>
            <WarningRoundedIcon />
            Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>
            Are you sure you want to discard all of your notes?
          </DialogContent>
          <DialogActions>
            <Button
              variant="solid"
              color="danger"
              onClick={() => setOpen(false)}
              loading={deleteRecord.isLoading}
            >
              Discard notes
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setOpen(false)}
              disabled={deleteRecord.isLoading}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </>
  );
}
