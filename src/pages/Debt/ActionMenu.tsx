import { MoreVert } from "@mui/icons-material";
import {
  Dropdown,
  MenuButton,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Modal,
  ModalDialog,
  DialogTitle,
  Divider,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/joy";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { Alert, Debt } from "../../interfaces/interfaces";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

export default function ActionMenu(props: {
  debt: Debt;
  setAlert: React.Dispatch<React.SetStateAction<Alert>>;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";

  const queryClient = useQueryClient();

  const DeleteConfirmDialog = () => {
    const { mutate: deleteData } = useMutation(
      async () => {
        try {
          const response = await axios.delete(
            BACKEND_URL + `debts/` + props.debt?.id
          );
          props.setAlert({
            open: true,
            color: "success",
            message: `Data berhasil dihapus`,
          });
          return response.data;
        } catch (error: any) {
          props.setAlert({
            open: true,
            color: "danger",
            message: `${error}`,
          });
          console.log(error);
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("debts");
        },
      }
    );
    return (
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>Hapus {props.debt?.invoice?.number}?</DialogTitle>
          <Divider />
          <DialogContent>
            Data yang sudah dihapus tidak dapat dikembalikan.
          </DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={() => deleteData()}>
              Hapus
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={(e: any) => {
                e.preventDefault();
                e.stopPropagation();
                setDeleteOpen(false);
              }}
            >
              Batal
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    );
  };

  return (
    <div onClick={(e: any) => e.stopPropagation()}>
      <Dropdown>
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{
            root: {
              variant: "plain",
              color: "neutral",
            },
          }}
          size="sm"
        >
          <MoreVert />
        </MenuButton>
        <Menu sx={{ zIndex: 1300 }}>
          <MenuItem
            onClick={() => {
              setDeleteOpen(true);
            }}
          >
            <DeleteIcon fontSize="small" color="error" />{" "}
            <Typography color="danger">Hapus</Typography>
          </MenuItem>
        </Menu>
      </Dropdown>
      <DeleteConfirmDialog />
    </div>
  );
}
