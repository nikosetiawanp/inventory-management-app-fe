import {
  Button,
  CircularProgress,
  Dialog,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import dayjs from "dayjs";
import { watch } from "fs";
import { register } from "module";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { Purchase } from "../../interfaces/interfaces";

export default function MoveToPurchaseRequisition(props: {
  purchase: Purchase;
  refetch: any;
}) {
  const [open, setOpen] = useState(false);

  // DATE
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");

  // POST
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();
  const moveToPurchaseOrder = useMutation(
    async (data: any) => {
      try {
        const response = await axios.put(
          BACKEND_URL + "purchases/" + props.purchase.id,
          data
        );
        props.refetch();
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

  const { isLoading } = moveToPurchaseOrder;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<any>();

  const onSubmit: SubmitHandler<any> = async (data, event) => {
    const dataToSubmit = {
      vendorId: props.purchase.vendorId,
      prNumber: props.purchase.prNumber,
      prDate: props.purchase.prDate,
      poNumber: data?.poNumber,
      poDate: formattedDate,
      status: "PO",
    };
    try {
      await moveToPurchaseOrder.mutateAsync(dataToSubmit);
      setOpen(false);
    } catch (error) {
      console.log("Mutation Error:", error);
    }
    event?.target.reset();
    setOpen(false);
  };
  return (
    <>
      <Button variant="outlined" type="button" onClick={() => setOpen(true)}>
        Pindahkan ke PO
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth={"xs"}
      >
        <form action="submit" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack gap={3} padding={4}>
            <Typography variant="h6">Pindahkan ke PO</Typography>
            {/* DATE PICKER */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Tanggal PR"
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
              id="poNumber"
              label="Nomor PO"
              variant="outlined"
              {...register("poNumber", { required: "Tidak boleh kosong" })}
              error={!!errors.poNumber}
              helperText={errors.poNumber?.message as any}
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
              <Button variant={"contained"} type="submit" disabled={isLoading}>
                {isLoading ? (
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
