import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  InventoryHistory,
  Product,
  Purchase,
  Vendor,
} from "../../interfaces/interfaces";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import SelectPurchase from "../select/SelectPurchase";

export default function CreateInventoryArrival() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<InventoryHistory>();

  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const [open, setOpen] = useState(false);
  // VENDOR
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );
  const handlePurchaseChange = (event: any, value: any) => {
    setSelectedPurchase(value);
    setValue("vendor", value ? value.id : "");
  };

  // PRODUCT
  const [selectedProduct, setSelectedProduct] = useState<Vendor>();
  const handleProductChange = (event: any, value: any) => {
    setSelectedProduct(value);
    setValue("product", value ? value.id : "");
  };

  const getProducts = async () => {
    const response = await axios.get(BACKEND_URL + `products`);
    return response.data.data;
  };
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    refetchOnWindowFocus: false,
    enabled: open,
  });

  // DATE
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");

  // POST INVENTORY HISTORY
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createInventoryHistory = useMutation(
    async (data: Product) => {
      setIsSubmitting(true);
      try {
        const response = await axios.post(
          BACKEND_URL + "inventory-histories",
          data
        );
        setIsSubmitting(false);
        setOpen(false);
        return response.data;
      } catch (error) {
        setIsSubmitting(false);
        throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`inventoryhistories`);
      },
    }
  );

  const onSubmit: SubmitHandler<InventoryHistory> = async (
    data: InventoryHistory,
    event: any
  ) => {
    const dataToSubmit = {
      date: formattedDate,
      type: "A",
      quantity: data.quantity,
      stockAfter: 100,
      productId: selectedProduct?.id,
      purchaseId: selectedPurchase?.id,
    };
    try {
      console.log(dataToSubmit);
      await createInventoryHistory.mutateAsync(dataToSubmit as any);
    } catch (error) {
      console.log("Mutation Error:", error);
    }
  };

  return (
    <>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ marginLeft: "auto" }}
        size="small"
      >
        Catat Gudang Masuk
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth={"xs"}
      >
        <form action="submit" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack gap={3} padding={4}>
            <Typography variant="h6">Catat Gudang Masuk</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Tanggal masuk"
                value={selectedDate}
                onChange={(newValue: any) => setSelectedDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{
                  field: { clearable: true },
                }}
              />
            </LocalizationProvider>
            <TextField
              id="quantity"
              label="Quantity"
              variant="outlined"
              {...register("quantity", { required: "Tidak boleh kosong" })}
              error={!!errors.quantity}
              helperText={errors.quantity?.message}
              required
            />
            {/* PURCHASE */}
            <SelectPurchase
              selectedPurchase={selectedPurchase}
              setSelectedPurchase={setSelectedPurchase}
              handlePurchaseChange={handlePurchaseChange}
            />
            {/* AUTOCOMPLETE PRODUCT */}
            <Autocomplete
              id="product"
              options={productsQuery.data ? productsQuery.data : []}
              autoHighlight
              getOptionLabel={(option) => `${option?.code} - ${option?.name}`}
              value={selectedProduct}
              onChange={handleProductChange}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                  {...props}
                >
                  {option.code} - {option.name}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Produk"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "new-password",
                  }}
                  {...register("product", { required: "Tidak boleh kosong" })}
                  required
                  error={!!errors.product}
                  helperText={errors.product?.message}
                />
              )}
            />
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
                type="submit"
                disabled={createInventoryHistory.isLoading}
              >
                {createInventoryHistory.isLoading ? "Menyimpan" : "Simpan"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Dialog>
    </>
  );
}
