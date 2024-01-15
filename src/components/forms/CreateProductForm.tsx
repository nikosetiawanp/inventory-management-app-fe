import {
  Dialog,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import { Product } from "../../interfaces/interfaces";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useQueryClient, useMutation } from "react-query";

export default function CreateProductForm(props: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const units = ["pcs", "kg"];

  // POST
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();
  const createProduct = useMutation(
    async (data: Product) => {
      const dataToSubmit = {
        code: data.code,
        name: data.name,
        unit: data.unit,
        quantity: 0,
      };

      try {
        const response = await axios.post(
          BACKEND_URL + "products/",
          dataToSubmit
        );
        return response.data;
      } catch (error) {
        throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("product");
      },
    }
  );

  const { isLoading } = createProduct;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Product>();

  const onSubmit: SubmitHandler<Product> = async (data, event) => {
    try {
      await createProduct.mutateAsync(data);
      props.setOpen(false);
    } catch (error) {
      console.log("Mutation Error:", error);
    }
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
            <Button variant={"contained"} type="submit" disabled={isLoading}>
              {isLoading
                ? "Menyimpan"
                : // <CircularProgress color="inherit" size={15} />
                  "Simpan"}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Dialog>
  );
}
