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
import { Debt } from "../../interfaces/interfaces";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import CompleteDebt from "./CompleteDebt";

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
        const response = await axios.post(BACKEND_URL + "payments/", data);
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
      date: formattedDate,
      amount: data.amount,
      debtId: props.debt.id,

      number: "0000",
      description: null,
      accountId: 1,
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
              id="amount"
              label="Jumlah Pembayaran"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Rp</InputAdornment>
                ),
              }}
              {...register("amount", { required: "Tidak boleh kosong" })}
              error={!!errors.amount}
              helperText={errors.amount?.message}
              required
            />

            {/* ACTIONS */}
            <Stack
              direction={"row"}
              width={1}
              justifyContent={"flex-end"}
              gap={1}
            >
              <CompleteDebt debt={props.debt} />
              <Button
                onClick={() => setOpen(false)}
                type="button"
                sx={{ marginLeft: "auto" }}
              >
                Batal
              </Button>
              <Button
                variant={"contained"}
                type="submit"
                disabled={updateDebt.isLoading}
              >
                {updateDebt.isLoading ? "Menunggu" : "Bayar"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Dialog>
    </>
  );
}
