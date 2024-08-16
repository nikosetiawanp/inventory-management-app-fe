import { useState } from "react";
import {
  Button,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
  Select,
  Stack,
  Option,
} from "@mui/joy";

import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { Product } from "../../interfaces/interfaces";
import { SubmitHandler, useForm } from "react-hook-form";
import { InfoOutlined } from "@mui/icons-material";

export default function CreateProductButton() {
  const units = ["pcs", "kg"];

  const [open, setOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(units[0]);

  // POST
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();
  const createProduct = useMutation(
    async (data: Product) => {
      const dataToSubmit = {
        code: data.code,
        name: data.name,
        unit: selectedUnit,
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
        queryClient.invalidateQueries("products");
      },
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Product>();

  const onSubmit: SubmitHandler<Product> = async (data) => {
    try {
      await createProduct.mutateAsync(data);
      setOpen(false);
    } catch (error) {
      console.log("Mutation Error:", error);
    }
    // event?.target.reset();
    setOpen(false);
  };

  const handleTypeChange = (
    event: React.SyntheticEvent | null,
    newValue: string | null
  ) => {
    event;
    setSelectedUnit(newValue);
  };

  return (
    <>
      <Button
        startDecorator={<AddIcon />}
        variant="solid"
        onClick={() => setOpen(true)}
        fullWidth
      >
        Tambah Produk
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Tambah Produk</DialogTitle>
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
                    id="nama"
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
              {/* <TextField
                id="name"
                label="Nama"
                variant="outlined"
                {...register("name", { required: "Tidak boleh kosong" })}
                error={!!errors.name}
                helperText={errors.name?.message}
                required
              /> */}

              {/* SELECT */}
              <Stack spacing={0}>
                <FormLabel>Unit</FormLabel>
                <Select
                  value={selectedUnit}
                  onChange={handleTypeChange}
                  size="lg"
                >
                  {units.map((unit: string) => (
                    <Option value={unit}>{unit}</Option>
                  ))}
                </Select>
              </Stack>
              {/* <TextField
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
              </TextField> */}
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
                  disabled={createProduct.isLoading}
                >
                  Batal
                </Button>
                <Button
                  variant={"solid"}
                  type="button"
                  disabled={createProduct.isLoading}
                  onClick={handleSubmit(onSubmit)}
                  loading={createProduct.isLoading}
                >
                  Simpan
                </Button>
              </Stack>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </>
  );
}
