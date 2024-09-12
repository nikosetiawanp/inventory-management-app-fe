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
  FormLabel,
  Select,
  FormControl,
  Input,
  FormHelperText,
  Option,
} from "@mui/joy";
import { useState } from "react";
import { Alert, Product } from "../../interfaces/interfaces";
import { useMutation, useQueryClient } from "react-query";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";

export default function ActionMenu(props: {
  product: Product;
  setAlert: React.Dispatch<React.SetStateAction<Alert>>;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";

  const queryClient = useQueryClient();

  const DeleteConfirmDialog = () => {
    const { mutate: deleteData } = useMutation(
      async () => {
        try {
          const response = await axios.delete(
            BACKEND_URL + `products/` + props.product?.id
          );
          props.setAlert({
            open: true,
            color: "success",
            message: "Data berhasil dihapus",
          });
          return response.data;
        } catch (error: any) {
          props.setAlert({
            open: true,
            color: "danger",
            message: "Terjadi kesalahan, mohon coba kembali",
          });
          console.log(error);
          if (error?.code == "ERR_BAD_RESPONSE") {
            props.setAlert({
              open: true,
              color: "danger",
              message: "Terjadi kesalahan, mohon coba kembali",
            });
            throw new Error("Network response was not ok");
          }
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("products");
        },
      }
    );
    return (
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>Hapus {props.product?.name}?</DialogTitle>
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

  const UpdateModal = () => {
    const units = ["pcs", "kg"];
    const [selectedUnit, setSelectedUnit] = useState<string | null>(
      props.product?.unit
    );
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<Product>();
    const updateProduct = useMutation(
      async (data: Product) => {
        const dataToSubmit = {
          code: data?.code,
          name: data?.name,
          unit: selectedUnit,
          quantity: 0,
        };
        try {
          const response = await axios.patch(
            BACKEND_URL + "products/" + props.product?.id,
            dataToSubmit
          );
          props.setAlert({
            open: true,
            color: "success",
            message: "Data berhasil diubah",
          });
          return response.data;
        } catch (error) {
          props.setAlert({
            open: true,
            color: "danger",
            message: "Terjadi kesalahan, mohon coba kembali",
          });
          throw new Error("Network response was not ok");
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("products");
        },
      }
    );

    const onSubmit: SubmitHandler<Product> = async (data) => {
      try {
        await updateProduct.mutateAsync(data);
        setUpdateOpen(false);
      } catch (error) {
        console.log("Mutation Error:", error);
      }
      setUpdateOpen(false);
    };

    const handleTypeChange = (
      event: React.SyntheticEvent | null,
      newValue: string | null
    ) => {
      event;
      setSelectedUnit(newValue);
    };
    return (
      <Modal open={updateOpen} onClose={() => setUpdateOpen(false)}>
        <ModalDialog>
          <DialogTitle>Ubah Produk</DialogTitle>
          <form
            action="submit"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            style={{ overflow: "scroll" }}
          >
            <Stack spacing={2}>
              <FormControl error={errors.code?.message !== ""}>
                <Stack spacing={0}>
                  <FormLabel>Kode</FormLabel>
                  <Input
                    id="kode"
                    placeholder="Kode"
                    {...register("code", { required: "Tidak boleh kosong" })}
                    error={!!errors.code}
                    size="lg"
                    defaultValue={props.product?.code}
                  />
                  {errors.code?.message && (
                    <FormHelperText>
                      <InfoOutlined />
                      {errors.code?.message}
                    </FormHelperText>
                  )}
                </Stack>
              </FormControl>

              <FormControl error={errors.name?.message !== ""}>
                <Stack spacing={0}>
                  <FormLabel>Nama</FormLabel>
                  <Input
                    id="nama"
                    placeholder="Nama"
                    {...register("name", { required: "Tidak boleh kosong" })}
                    error={!!errors.name}
                    size="lg"
                    defaultValue={props.product?.name}
                  />
                  {errors.name?.message && (
                    <FormHelperText>
                      <InfoOutlined />
                      {errors.name?.message}
                    </FormHelperText>
                  )}
                </Stack>
              </FormControl>

              {/* SELECT */}
              <Stack spacing={0}>
                <FormLabel>Unit</FormLabel>
                <Select
                  value={selectedUnit}
                  onChange={handleTypeChange}
                  size="lg"
                  defaultValue={props.product?.unit}
                >
                  {units.map((unit: string, index: number) => (
                    <Option key={index} value={unit}>
                      {unit}
                    </Option>
                  ))}
                </Select>
              </Stack>

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
                  disabled={updateProduct.isLoading}
                >
                  Batal
                </Button>
                <Button
                  variant={"solid"}
                  type="button"
                  disabled={updateProduct.isLoading}
                  onClick={handleSubmit(onSubmit)}
                  loading={updateProduct.isLoading}
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
