import {
  Button,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
  Stack,
} from "@mui/joy";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useState } from "react";
import { Cash, Debt } from "../../interfaces/interfaces";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { formatDate } from "../../helpers/dateHelpers";
import { InfoOutlined } from "@mui/icons-material";
import { useNotification } from "../../App";

export default function CreatePayment(props: { debt: Debt }) {
  const { triggerAlert } = useNotification();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Cash>();

  // CREATE CASH
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

  //   CREATE PAYMENT
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const queryClient = useQueryClient();
  const createPayment = useMutation(
    async (data: Cash) => {
      try {
        const response = await axios.post(BACKEND_URL + "payments/", data);
        setOpen(false);
        return response.data;
      } catch (error: any) {
        console.error(
          "Error posting payment:",
          error.response ? error.response.data : error.message
        );
        throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`debts`);
      },
    }
  );

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    const dataToSubmit = {
      date: formatDate(selectedDate, "YYYY-MM-DD"),
      number: data.number,
      description: data.description,
      amount: data.amount,
      debtId: props.debt.id,
      contactId: props.debt.contactId,
      accountId: props.debt.type == "D" ? 1 : 2,
    };
    try {
      await createCash.mutateAsync(dataToSubmit as any);
      await createPayment.mutateAsync(dataToSubmit as any);
    } catch (error) {
      console.log("Mutation Error:", error);
    }
  };

  return (
    <>
      <Button variant="plain" size="sm" onClick={() => setOpen(true)}>
        Bayar
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Buat Pembayaran</DialogTitle>
          <form action="submit" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Tanggal pembayaran"
                  value={selectedDate}
                  onChange={(newValue: any) => setSelectedDate(newValue)}
                  format="DD/MM/YYYY"
                  slotProps={{
                    field: { clearable: true },
                  }}
                  minDate={dayjs(props?.debt?.invoice?.date)}
                  maxDate={dayjs()}
                />
              </LocalizationProvider>
              <FormControl error={errors.amount?.message !== ""}>
                <Stack spacing={0}>
                  <FormLabel>Jumlah</FormLabel>
                  <Input
                    id="amount"
                    placeholder="Jumlah"
                    {...register("amount", { required: "Tidak boleh kosong" })}
                    error={!!errors.amount}
                    size="lg"
                    startDecorator="Rp"
                  />
                  {errors.amount?.message && (
                    <FormHelperText>
                      <InfoOutlined />
                      {errors.amount?.message}
                    </FormHelperText>
                  )}
                </Stack>
              </FormControl>

              <FormControl error={errors.number?.message !== ""}>
                <Stack spacing={0}>
                  <FormLabel>Nomor Kas</FormLabel>
                  <Input
                    id="nama"
                    placeholder="Nomor Kas"
                    {...register("number", { required: "Tidak boleh kosong" })}
                    error={!!errors.number}
                    size="lg"
                  />
                  {errors.number?.message && (
                    <FormHelperText>
                      <InfoOutlined />
                      {errors.number?.message}
                    </FormHelperText>
                  )}
                </Stack>
              </FormControl>

              <FormControl error={errors.description?.message !== ""}>
                <Stack spacing={0}>
                  <FormLabel>Deskripsi</FormLabel>
                  <Input
                    id="description"
                    placeholder="Deskripsi"
                    {...register("description", {
                      required: "Tidak boleh kosong",
                    })}
                    error={!!errors.description}
                    size="lg"
                  />
                  {errors.description?.message && (
                    <FormHelperText>
                      <InfoOutlined />
                      {errors.description?.message}
                    </FormHelperText>
                  )}
                </Stack>
              </FormControl>

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
                  variant="outlined"
                  color="neutral"
                  sx={{ marginLeft: "auto" }}
                >
                  Batal
                </Button>
                <Button
                  variant="solid"
                  type="submit"
                  disabled={createPayment.isLoading}
                >
                  {createPayment.isLoading ? "Menunggu" : "Bayar"}
                </Button>
              </Stack>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </>
  );
}
