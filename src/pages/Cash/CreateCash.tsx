import { Button, Dialog, Stack, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import dayjs from "dayjs";
import { Account, Cash } from "../../interfaces/interfaces";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SelectAccount from "../../components/select/SelectAccount";
import { useNotification } from "../../App";

export default function CreateCash() {
  const { triggerAlert } = useNotification();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Cash>();
  const [open, setOpen] = useState(false);

  //   SELECT ACCOUNT
  const [selectedAccount, setSelectedAccount] = useState<Account>();
  const handleAccountChange = (value: Account) => {
    setSelectedAccount(value);
    setValue("contact" as any, value ? value.id : "");
  };

  //   CREATE CASH
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const queryClient = useQueryClient();
  const createCash = useMutation(
    async (data: Cash) => {
      try {
        const response = await axios.post(BACKEND_URL + "cashes/", data);
        triggerAlert({ message: "Data berhasil disimpan", color: "success" });
        return response.data;
      } catch (error: any) {
        console.log(error);
        triggerAlert({ message: `Error: ${error.message}`, color: "danger" });
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("cashes");
      },
    }
  );
  const onSubmit: SubmitHandler<Cash> = async (data) => {
    const dataToSubmit: any = {
      date: formattedDate,
      number: data.number,
      description: data.description,
      amount: data.amount,
      accountId: selectedAccount?.id,
    };

    try {
      await createCash.mutateAsync(dataToSubmit);
      setOpen(false);
    } catch (error) {
      console.log("Mutation Error:", error);
    }
  };

  //   DATE
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");

  return (
    <>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ height: "auto" }}
      >
        Catat Kas
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth={"xs"}
      >
        <form
          action="submit"
          onSubmit={handleSubmit(onSubmit as any)}
          noValidate
        >
          <Stack gap={3} padding={4}>
            <Typography variant="h6">Catat Kas</Typography>
            {/* DATE PICKER */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Tanggal"
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
              label="Nomor"
              variant="outlined"
              {...register("number", { required: "Tidak boleh kosong" })}
              error={!!errors.number}
              helperText={errors.number?.message}
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
            <TextField
              id="amount"
              label="Jumlah"
              variant="outlined"
              {...register("amount", { required: "Tidak boleh kosong" })}
              error={!!errors.amount}
              helperText={errors.amount?.message}
              required
            />
            <SelectAccount
              selectedAccount={selectedAccount}
              setSelectedAccount={setSelectedAccount}
              handleAccountChange={handleAccountChange}
            />

            {/* ACTIONS */}
            <Stack
              direction={"row"}
              width={1}
              justifyContent={"flex-end"}
              gap={1}
            >
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
                disabled={createCash.isLoading}
              >
                {createCash.isLoading ? "Menunggu" : "Simpan"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Dialog>
    </>
  );
}
