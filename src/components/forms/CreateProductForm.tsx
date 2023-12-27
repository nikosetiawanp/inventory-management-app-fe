import {
  Dialog,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { Product } from "../../interfaces/interfaces";
import { SubmitHandler, useForm } from "react-hook-form";

export default function CreateProductForm(props: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const units = ["pcs", "kg"];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Product>();

  const onSubmit: SubmitHandler<Product> = (data, event) => {
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
          <Typography variant="h6">Tambah Produk</Typography>

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

          {/* SELECT */}
          <TextField
            id="unit"
            value={watch("unit", "pcs")}
            label="Unit"
            select
            {...register("unit", { required: "Tidak boleh kosong" })}
            error={!!errors.unit}
            helperText={errors.unit?.message}
            required
          >
            {units.map((unit: string, index) => (
              <MenuItem key={index} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </TextField>
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
