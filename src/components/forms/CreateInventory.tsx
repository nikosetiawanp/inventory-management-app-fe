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
  Inventory,
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

export default function CreateInventoryArrival(props: { type: "A" | "D" }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inventory>();

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

  // DATE
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");

  // POST INVENTORY HISTORY
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createInventoryHistory = useMutation(
    async (data: Inventory) => {
      // const dataToSubmit = {
      //   date: formattedDate,
      //   type: "A",
      //   letterNumber: data.letterNumber,
      //   purchaseId: data.purchaseId,
      // };
      setIsSubmitting(true);

      try {
        const response = await axios.post(BACKEND_URL + "inventories", data);
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
        queryClient.invalidateQueries(`inventories`);
      },
    }
  );

  const onSubmit: SubmitHandler<Inventory> = async (
    data: Inventory,
    event: any
  ) => {
    const dataToSubmit = {
      date: formattedDate,
      letterNumber: data.letterNumber,
      type: props.type,
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
        {props.type == "A" ? "Catat Gudang Masuk" : "Catat Gudang Keluar"}
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
              id="letterNumber"
              label="Nomor Surat"
              variant="outlined"
              {...register("letterNumber", { required: "Tidak boleh kosong" })}
              error={!!errors.letterNumber}
              helperText={errors.letterNumber?.message}
              required
            />
            {/* PURCHASE */}
            <SelectPurchase
              selectedPurchase={selectedPurchase}
              setSelectedPurchase={setSelectedPurchase}
              handlePurchaseChange={handlePurchaseChange}
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
