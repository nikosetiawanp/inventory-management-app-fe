import { Dialog, Stack, Typography, TextField, Button } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { Vendor } from "../../interfaces/interfaces";

export default function CreateVendorForm(props: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Vendor>();

  const onSubmit: SubmitHandler<Vendor> = (data, event) => {
    console.log(data);
    event?.target.reset();
    props.setOpen(false);
  };

  return (
    <Dialog
      open={props.open}
      onClose={() => props.setOpen(false)}
      fullWidth
      maxWidth={"xs"}
    >
      {/* <DialogTitle fontWeight={"bold"}>Tambah Produk</DialogTitle> */}
      <form action="submit" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap={3} padding={4}>
          <Typography variant="h6">Tambah Vendor</Typography>

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
            id="address"
            label="Alamat"
            variant="outlined"
            {...register("address", { required: "Tidak boleh kosong" })}
            error={!!errors.address}
            helperText={errors.address?.message}
            required
          />
          <TextField
            id="phone"
            label="Nomor telepon"
            variant="outlined"
            {...register("phone", { required: "Tidak boleh kosong" })}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            required
          />

          <TextField
            id="email"
            label="Email"
            variant="outlined"
            {...register("email", {
              required: "Tidak boleh kosong",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Masukkan format email yang benar",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            required
          />

          <Stack
            direction={"row"}
            width={1}
            justifyContent={"flex-end"}
            gap={1}
          >
            <Button onClick={() => props.setOpen(false)} type="button">
              Batal
            </Button>
            <Button variant={"contained"} type="submit">
              Simpan
            </Button>
          </Stack>
        </Stack>
      </form>
    </Dialog>
  );
}
