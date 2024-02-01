import {
  Button,
  CircularProgress,
  Dialog,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { Inventory } from "../../interfaces/interfaces";

export default function CreateInvoice(props: { inventory: Inventory }) {
  const [open, setOpen] = useState(false);

  // DATE
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<any>();

  // CREATE INVOICE
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();
  const createInvoice = useMutation(
    async (data: any) => {
      try {
        const response = await axios.post(
          BACKEND_URL + "inventories/" + props.inventory.id,
          data
        );
        // props.refetch();
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

  const onSubmit: SubmitHandler<any> = async (data, event) => {
    const dataToSubmit = {
      date: props.inventory.date,
      letterNumber: props.inventory.letterNumber,
      type: props.inventory.type,
      description: props.inventory.description,
      purchaseId: props.inventory.purchaseId,
      invoiceNumber: data?.invoiceNumber,
      dueDate: formattedDate,
    };

    try {
      await createInvoice.mutateAsync(dataToSubmit);
      console.log(dataToSubmit);
      setOpen(false);
    } catch (error) {
      console.log("Mutation Error:", error);
    }
    event?.target.reset();
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => {
          setOpen(true);
        }}
      >
        Buat Faktur
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth={"xs"}
      >
        <form action="submit" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack gap={3} padding={4}>
            <Typography variant="h6">Buat Faktur</Typography>
            {/* DATE PICKER */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Tanggal Jatuh Tempo"
                value={selectedDate}
                onChange={(newValue: any) => setSelectedDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{
                  field: { clearable: true },
                }}
              />
            </LocalizationProvider>
            {/* NOMOR PO */}
            <TextField
              id="invoiceNumber"
              label="Nomor Faktur"
              variant="outlined"
              {...register("invoiceNumber", { required: "Tidak boleh kosong" })}
              error={!!errors.invoiceNumber}
              helperText={errors.invoiceNumber?.message as any}
              required
            />

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
                disabled={createInvoice.isLoading}
              >
                {createInvoice.isLoading ? (
                  <CircularProgress color="inherit" size={15} />
                ) : (
                  "Simpan"
                )}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Dialog>
    </>
  );
}
