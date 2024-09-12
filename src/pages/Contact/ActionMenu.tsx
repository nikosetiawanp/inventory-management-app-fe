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
import { Alert, Contact } from "../../interfaces/interfaces";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

export default function ActionMenu(props: {
  contact: Contact;
  setAlert: React.Dispatch<React.SetStateAction<Alert>>;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";

  const openAlert = (status: "success" | "error") => {
    props.setAlert({
      open: true,
      color: status == "success" ? "success" : "danger",
      message:
        status == "success"
          ? "Data berhasil dihapus"
          : "Terjadi kesalahan, mohon coba kembali",
    });
  };
  const queryClient = useQueryClient();
  const { mutate: deleteData } = useMutation(
    async () => {
      try {
        const response = await axios.delete(
          BACKEND_URL + `contacts/` + props.contact?.id
        );
        openAlert("success");
        return response.data;
      } catch (error: any) {
        openAlert("error");
        console.log(error);
        if (error?.code == "ERR_BAD_RESPONSE")
          throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("contacts");
      },
    }
  );

  const DeleteConfirmDialog = () => {
    return (
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>Hapus {props.contact?.name}?</DialogTitle>
          <Divider />
          <DialogContent>
            Data yang sudah dihapus tidak dapat dikembalikan.
          </DialogContent>
          <DialogActions>
            <Button
              variant="solid"
              color="danger"
              onClick={() => deleteData()} // Call the mutate function here
            >
              Hapus
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setDeleteOpen(false)}
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
          slotProps={{ root: { variant: "plain", color: "neutral" } }}
          size="sm"
        >
          <MoreVert />
        </MenuButton>
        <Menu sx={{ zIndex: 1300 }}>
          <MenuItem onClick={() => setDeleteOpen(true)}>
            <DeleteIcon fontSize="small" color="error" />{" "}
            <Typography color="danger">Hapus</Typography>
          </MenuItem>
        </Menu>
      </Dropdown>
      <DeleteConfirmDialog />
    </div>
  );
}
