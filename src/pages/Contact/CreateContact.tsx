import {
  Autocomplete,
  Button,
  DialogTitle,
  FormControl,
  Modal,
  ModalDialog,
  Stack,
} from "@mui/joy";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { Contact } from "../../interfaces/interfaces";
import { SubmitHandler, useForm } from "react-hook-form";
import { provinces } from "../../public/ProvinceData";
import { FormHelperText, FormLabel, Input } from "@mui/joy";
import AddIcon from "@mui/icons-material/Add";
import { InfoOutlined } from "@mui/icons-material";
import { useNotification } from "../../App";

export default function CreateContact(props: { type: "V" | "C" }) {
  const { triggerAlert } = useNotification();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Contact>();

  const [open, setOpen] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const queryClient = useQueryClient();

  const [selectedProvince, setSelectedProvince] = useState<string>();
  const [selectedCity, setSelectedCity] = useState<any>();
  const cities =
    provinces.find((province) => province.name == selectedProvince)?.cities ||
    [];

  const createContact = useMutation(
    async (data: Contact) => {
      const dataToSubmit = {
        code: data.code,
        name: data.name,
        email: data.email,
        phone: data.phone,
        province: selectedProvince,
        city: selectedCity,
        address: data.address,
        type: props.type,
      };

      try {
        const response = await axios.post(
          BACKEND_URL + "contacts/",
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
        queryClient.invalidateQueries("contacts");
      },
    }
  );

  const onSubmit: SubmitHandler<Contact> = async (data) => {
    try {
      await createContact.mutateAsync(data);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setSelectedCity("");
  }, [selectedProvince]);

  return (
    <>
      <Button
        startDecorator={<AddIcon />}
        variant="solid"
        onClick={() => setOpen(true)}
        sx={{ whiteSpace: "nowrap" }}
      >
        {props.type == "V" ? "Tambah Vendor" : "Tambah Customer"}
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>
            {props.type == "V"
              ? "Tambah Kontak Vendor"
              : "Tambah Kontak Customer"}
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
                    {...register("address", { required: "Tidak boleh kosong" })}
                    error={!!errors.address}
                    size="lg"
                  />
                  {errors.address?.message && (
                    <FormHelperText>
                      <InfoOutlined />
                      {errors.address?.message}
                    </FormHelperText>
                  )}
                </Stack>
              </FormControl>

              {/* SUPPLIER? */}
              <FormControl></FormControl>
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
              onClick={() => setOpen(false)}
              type="button"
              variant="outlined"
              color="neutral"
            >
              Batal
            </Button>
            <Button
              variant={"solid"}
              disabled={createContact.isLoading}
              type="button"
              onClick={handleSubmit(onSubmit)}
              loading={createContact?.isLoading}
            >
              Simpan{" "}
            </Button>
          </Stack>
        </ModalDialog>
      </Modal>
    </>
  );
}
