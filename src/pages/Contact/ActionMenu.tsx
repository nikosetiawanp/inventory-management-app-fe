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
  Autocomplete,
} from "@mui/joy";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { Alert, Contact } from "../../interfaces/interfaces";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { provinces } from "../../public/ProvinceData";

export default function ActionMenu(props: {
  contact: Contact;
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
            BACKEND_URL + `contacts/` + props.contact?.id
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

  const UpdateModal = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<Contact>();

    const [selectedProvince, setSelectedProvince] = useState<string>(
      props.contact?.province
    );
    const [selectedCity, setSelectedCity] = useState<any>();
    const cities =
      provinces.find((province) => province.name == selectedProvince)?.cities ||
      [];

    const updateContact = useMutation(
      async (data: Contact) => {
        const dataToSubmit = {
          code: data.code,
          name: data.name,
          email: data.email,
          phone: data.phone,
          province: selectedProvince,
          city: selectedCity,
          address: data.address,
          type: props.contact?.type,
        };

        try {
          const response = await axios.put(
            BACKEND_URL + "contacts/" + props.contact?.id,
            dataToSubmit
          );
          props.setAlert({
            open: true,
            color: "success",
            message: "Data berhasil disimpan",
          });
          return response.data;
        } catch (error: any) {
          console.log(error);
          props.setAlert({
            open: true,
            color: "danger",
            message: `${error}`,
          });
          if (error?.code == "ERR_BAD_RESPONSE")
            props.setAlert({
              open: true,
              color: "danger",
              message: `${error}`,
            });
          throw new Error("Network response was not ok");
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("contacts");
        },
      }
    );

    const onSubmit: SubmitHandler<Contact> = async (data) => {
      try {
        await updateContact.mutateAsync(data);
        setUpdateOpen(false);
      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
      setSelectedCity("");
    }, [selectedProvince]);

    return (
      <Modal open={updateOpen} onClose={() => setUpdateOpen(false)}>
        <ModalDialog>
          <DialogTitle>
            {props.contact?.type == "V"
              ? "Ubah Kontak Vendor"
              : "Ubah Kontak Customer"}
          </DialogTitle>
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
                    defaultValue={props.contact?.code}
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
                    id="name"
                    placeholder="Nama"
                    {...register("name", { required: "Tidak boleh kosong" })}
                    error={!!errors.name}
                    size="lg"
                    defaultValue={props.contact?.name}
                  />
                  {errors.name?.message && (
                    <FormHelperText>
                      <InfoOutlined />
                      {errors.name?.message}
                    </FormHelperText>
                  )}
                </Stack>
              </FormControl>

              <FormControl error={errors.email?.message !== ""}>
                <Stack spacing={0}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    id="email"
                    placeholder="Email"
                    {...register("email", { required: "Tidak boleh kosong" })}
                    error={!!errors.email}
                    size="lg"
                    defaultValue={props.contact?.email}
                  />
                  {errors.email?.message && (
                    <FormHelperText>
                      <InfoOutlined />
                      {errors.email?.message}
                    </FormHelperText>
                  )}
                </Stack>
              </FormControl>

              <FormControl error={errors.phone?.message !== ""}>
                <Stack spacing={0}>
                  <FormLabel>Nomor Telepon</FormLabel>
                  <Input
                    id="phone"
                    placeholder="Nomor Telepon"
                    {...register("phone", { required: "Tidak boleh kosong" })}
                    error={!!errors.phone}
                    size="lg"
                    defaultValue={props.contact?.phone}
                  />
                  {errors.phone?.message && (
                    <FormHelperText>
                      <InfoOutlined />
                      {errors.phone?.message}
                    </FormHelperText>
                  )}
                </Stack>
              </FormControl>

              {/* PROVINSI */}
              <Stack direction={"row"} width={1} gap={2}>
                <Stack spacing={0}>
                  <FormLabel>Provinsi</FormLabel>{" "}
                  <Autocomplete
                    autoComplete
                    size="lg"
                    placeholder="Provinsi"
                    options={provinces.map((province) => province.name)}
                    onChange={(_, newValue) =>
                      setSelectedProvince(newValue as any)
                    }
                    defaultValue={props.contact?.province}
                  />
                </Stack>

                <Stack spacing={0}>
                  <FormLabel>Kota</FormLabel>
                  <Autocomplete
                    size="lg"
                    placeholder="Kota"
                    value={selectedCity}
                    options={cities}
                    onChange={(_, newValue) => setSelectedCity(newValue as any)}
                    defaultValue={props.contact?.city}
                  />
                </Stack>
              </Stack>
              {/* ALAMAT */}
              <FormControl error={errors.address?.message !== ""}>
                <Stack spacing={0}>
                  <FormLabel>Alamat</FormLabel>
                  <Input
                    id="address"
                    placeholder="Alamat"
                    {...register("address", {
                      required: "Tidak boleh kosong",
                    })}
                    error={!!errors.address}
                    size="lg"
                    defaultValue={props.contact?.address}
                  />
                  {errors.address?.message && (
                    <FormHelperText>
                      <InfoOutlined />
                      {errors.address?.message}
                    </FormHelperText>
                  )}
                </Stack>
              </FormControl>

              {/* ACTIONS */}
            </Stack>
          </form>
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
            >
              Batal
            </Button>
            <Button
              variant={"solid"}
              disabled={updateContact.isLoading}
              type="button"
              onClick={handleSubmit(onSubmit)}
              loading={updateContact.isLoading}
            >
              Simpan
            </Button>
          </Stack>
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
            <DeleteIcon fontSize="small" color="error" />{" "}
            <Typography color="danger">Hapus</Typography>
          </MenuItem>
        </Menu>
      </Dropdown>
      <UpdateModal />
      <DeleteConfirmDialog />
    </div>
  );
}
