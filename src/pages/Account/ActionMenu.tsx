import { InfoOutlined, MoreVert } from "@mui/icons-material";
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
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
} from "@mui/joy";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { Account } from "../../interfaces/interfaces";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNotification } from "../../App";

export default function ActionMenu(props: { account: Account }) {
  const { triggerAlert } = useNotification();
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();

  const DeleteConfirmDialog = () => {
    const { mutate: deleteData } = useMutation(
      async () => {
        try {
          const response = await axios.delete(
            BACKEND_URL + `accounts/` + props.account?.id
          );
          triggerAlert({ message: "Data berhasil dihapus", color: "success" });
          return response.data;
        } catch (error: any) {
          triggerAlert({ message: `Error: ${error.message}`, color: "danger" });
          console.log(error);
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("accounts");
        },
      }
    );

    return (
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>Hapus {props.account?.name}?</DialogTitle>
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
              onClick={() => setDeleteOpen(false)}
            >
              Batal
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    );
  };

  const UpdateModal = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<Account>();

    const updateAccount = useMutation(
      async (data: Account) => {
        try {
          const response = await axios.put(
            BACKEND_URL + "accounts/" + props.account?.id,
            data
          );
          triggerAlert({ message: "Data berhasil diubah", color: "success" });
          return response.data;
        } catch (error: any) {
          triggerAlert({ message: `Error: ${error.message}`, color: "danger" });
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("accounts");
        },
      }
    );

    const onSubmit: SubmitHandler<Account> = async (data) => {
      try {
        await updateAccount.mutateAsync(data);
        setUpdateOpen(false);
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <Modal open={updateOpen} onClose={() => setUpdateOpen(false)}>
        <ModalDialog>
          <DialogTitle>Ubah Akun</DialogTitle>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            style={{ overflow: "scroll" }}
          >
            <Stack spacing={2}>
              <FormControl error={!!errors.number}>
                <Stack spacing={0}>
                  <FormLabel>Nomor</FormLabel>
                  <Input
                    id="number"
                    placeholder="Nomor"
                    {...register("number", {
                      required: "Tidak boleh kosong",
                    })}
                    error={!!errors.number}
                    size="lg"
                    defaultValue={props.account?.number}
                  />
                  {errors.number?.message && (
                    <FormHelperText>
                      <InfoOutlined />
                      {errors.number?.message}
                    </FormHelperText>
                  )}
                </Stack>
              </FormControl>

              <FormControl error={!!errors.name}>
                <Stack spacing={0}>
                  <FormLabel>Nama</FormLabel>
                  <Input
                    id="name"
                    placeholder="Nama"
                    {...register("name", { required: "Tidak boleh kosong" })}
                    error={!!errors.name}
                    size="lg"
                    defaultValue={props.account?.name}
                  />
                  {errors.name?.message && (
                    <FormHelperText>
                      <InfoOutlined />
                      {errors.name?.message}
                    </FormHelperText>
                  )}
                </Stack>
              </FormControl>

              <Stack
                direction={"row"}
                width={1}
                justifyContent={"flex-end"}
                gap={1}
              >
                <Button
                  onClick={() => setUpdateOpen(false)}
                  type="button"
                  variant="outlined"
                  color="neutral"
                  disabled={updateAccount.isLoading}
                >
                  Batal
                </Button>
                <Button
                  variant={"solid"}
                  type="submit"
                  disabled={updateAccount.isLoading}
                  loading={updateAccount.isLoading}
                >
                  Simpan
                </Button>
              </Stack>
            </Stack>
          </form>
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
          <MenuItem onClick={() => setUpdateOpen(true)}>
            <EditIcon fontSize="small" color="inherit" />
            <Typography color="neutral">Ubah</Typography>
          </MenuItem>
          <MenuItem onClick={() => setDeleteOpen(true)}>
            <DeleteIcon fontSize="small" color="error" />
            <Typography color="danger">Hapus</Typography>
          </MenuItem>
        </Menu>
      </Dropdown>
      <UpdateModal />
      <DeleteConfirmDialog />
    </div>
  );
}
