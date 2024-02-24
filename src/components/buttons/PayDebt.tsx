import {
  Button,
  Dialog,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { register } from "module";
import { useState } from "react";
import { Debt, DebtPayment } from "../../interfaces/interfaces";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

export default function PayDebt(props: { debt: Debt }) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Debt>();

  //   UPDATE DEBT
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();
  const updateDebt = useMutation(
    async (data: Debt) => {
      try {
        const response = await axios.post(BACKEND_URL + "debt-payments/", data);
        setOpen(false);
        return response.data;
      } catch (error) {
        throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`debts`);
      },
    }
  );

  const onSubmit: SubmitHandler<any> = async (data: any, event: any) => {
    const dataToSubmit = {
      receiptNumber: data.receiptNumber,
      paidDate: formattedDate,
      paidAmount: data.paidAmount,
      balance: 0,
      debtId: props.debt.id,
    };
    try {
      console.log(dataToSubmit);
      await updateDebt.mutateAsync(dataToSubmit as any);
    } catch (error) {
      console.log("Mutation Error:", error);
    }
  };

  return (
    <>
      <Button variant="contained" size="small" onClick={() => setOpen(true)}>
        Bayar
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth={"xs"}
      >
        <form action="submit" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack gap={3} padding={4}>
            <Typography variant="h6">Buat Pembayaran</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Tanggal pembayaran"
                value={selectedDate}
                onChange={(newValue: any) => setSelectedDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{
                  field: { clearable: true },
                }}
              />
            </LocalizationProvider>
            <TextField
              id="receiptNumber"
              label="Nomor Bukti"
              variant="outlined"
              {...register("receiptNumber", { required: "Tidak boleh kosong" })}
              error={!!errors.receiptNumber}
              helperText={errors.receiptNumber?.message}
              required
            />
            <TextField
              id="paidAmount"
              label="Jumlah Pembayaran"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Rp</InputAdornment>
                ),
              }}
              {...register("paidAmount", { required: "Tidak boleh kosong" })}
              error={!!errors.paidAmount}
              helperText={errors.paidAmount?.message}
              required
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
                disabled={updateDebt.isLoading}
              >
                {updateDebt.isLoading ? "Menyimpan" : "Simpan"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Dialog>
    </>
  );
}
