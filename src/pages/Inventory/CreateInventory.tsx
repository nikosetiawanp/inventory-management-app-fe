import { Button, Dialog, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { SubmitHandler, useForm } from "react-hook-form";
import { Inventory, Transaction } from "../../interfaces/interfaces";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import SelectTransaction from "../../components/select/SelectTransaction";

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
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const handlePurchaseChange = (value: any) => {
    setSelectedTransaction(value);
    setValue("contact", value ? value.id : "");
  };

  // DATE
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");

  // POST INVENTORY HISTORY
  const queryClient = useQueryClient();

  const createInventoryHistory = useMutation(
    async (data: Inventory) => {
      try {
        const response = await axios.post(BACKEND_URL + "inventories", data);
        setOpen(false);
        return response.data;
      } catch (error) {
        throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`inventories`);
      },
    }
  );

  const onSubmit: SubmitHandler<Inventory> = async (data: Inventory) => {
    const dataToSubmit = {
      number: data.number,
      date: formattedDate,
      receiptNumber: data.receiptNumber,
      type: props.type,
      description: data.description,
      transactionId: selectedTransaction?.id,
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
            <Typography variant="h6">
              {props.type == "A" ? "Catat Gudang Masuk" : "Catat Gudang Keluar"}
            </Typography>
            {/* PURCHASE */}
            <SelectTransaction
              selectedPurchase={selectedTransaction}
              setSelectedPurchase={setSelectedTransaction}
              handlePurchaseChange={handlePurchaseChange}
            />
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
              id="number"
              label="Nomor LPB"
              variant="outlined"
              {...register("number", { required: "Tidak boleh kosong" })}
              error={!!errors.number}
              helperText={errors.number?.message}
              required
            />
            <TextField
              id="receiptNumber"
              label="Nomor Faktur"
              variant="outlined"
              {...register("receiptNumber", { required: "Tidak boleh kosong" })}
              error={!!errors.receiptNumber}
              helperText={errors.receiptNumber?.message}
              required
            />
            <TextField
              id="description"
              label="Deskripsi"
              variant="outlined"
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
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
