import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ReactNode, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { Contact } from "../../interfaces/interfaces";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { provinceData } from "../../public/ProvinceData";

export default function CreateContact() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<Contact>();

  const [open, setOpen] = useState(false);
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();

  const createContact = useMutation(
    async (data: Contact) => {
      console.log(data);

      //   try {
      //     const response = await axios.post(BACKEND_URL + "vendors/", data);
      //     return response.data;
      //   } catch (error: any) {
      //     console.log(error);
      //     if (error?.code == "ERR_BAD_RESPONSE")
      //       throw new Error("Network response was not ok");
      //   }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("vendors");
      },
    }
  );

  const onSubmit: SubmitHandler<Contact> = async (data, event) => {
    try {
      await createContact.mutateAsync(data);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const [selectedProvince, setSelectedProvince] = useState<any>();
  const [selectedCity, setSelectedCity] = useState<any>();

  useEffect(() => {
    setSelectedCity("");
  }, [selectedProvince]);

  return (
    <>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ height: "auto" }}
      >
        Tambah Kontak
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth={"xs"}
      >
        <form action="submit" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack gap={3} padding={4}>
            <Typography variant="h6">Tambah Kontak</Typography>
            <TextField
              id="kode"
              label="Kode"
              variant="outlined"
              {...register("code", { required: "Tidak boleh kosong" })}
              error={!!errors.code}
              helperText={errors.code?.message}
              required
            />
            <TextField
              id="name"
              label="Nama"
              variant="outlined"
              {...register("name", { required: "Tidak boleh kosong" })}
              error={!!errors.name}
              helperText={errors.name?.message}
              required
            />
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              {...register("email", {
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Masukkan format email yang benar",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              id="phone"
              label="Nomor telepon"
              variant="outlined"
              {...register("phone")}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />

            {/* PROVINSI */}
            <Autocomplete
              options={provinceData}
              getOptionLabel={(option) => option.provinsi}
              renderInput={(params) => (
                <TextField {...params} label="Provinsi" />
              )}
              defaultValue={provinceData[0]}
              value={selectedProvince?.kota}
              onChange={(_, newValue) => setSelectedProvince(newValue as any)}
              ListboxProps={{
                style: {
                  maxHeight: "150px",
                },
              }}
            />

            {/* KOTA */}
            <Controller
              name="city"
              control={control}
              defaultValue={selectedCity}
              disabled={selectedProvince?.kota.length == 0}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  defaultValue={selectedCity}
                  options={
                    selectedProvince?.kota
                      ? selectedProvince?.kota
                      : provinceData[0]?.kota
                  }
                  value={selectedCity as any}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField {...params} label="Kota/Kabupaten" />
                  )}
                  onChange={(_, newValue) => setSelectedCity(newValue as any)}
                  ListboxProps={{
                    style: {
                      maxHeight: "150px",
                    },
                  }}
                />
              )}
            />
            {/* ALAMAT */}
            <TextField
              id="address"
              label="Alamat"
              variant="outlined"
              {...register("address")}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
            {/* SUPPLIER? */}
            <FormControlLabel control={<Checkbox />} label="Supplier" />
            {/* ACTIONS */}
            <Stack
              direction={"row"}
              width={1}
              justifyContent={"flex-end"}
              gap={1}
            >
              <Button onClick={() => setOpen(false)} type="button">
                Batal
              </Button>
              <Button
                variant={"contained"}
                disabled={createContact.isLoading}
                type="button"
                onClick={handleSubmit(onSubmit)}
              >
                {createContact.isLoading ? "Menyimpan" : "Simpan"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Dialog>
    </>
  );
}
