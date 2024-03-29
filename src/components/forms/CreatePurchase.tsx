import { Dialog, Stack, Typography, TextField, Button } from "@mui/material";
import { Purchase, Contact } from "../../interfaces/interfaces";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useState } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import SelectContact from "../select/SelectContact";
import AddIcon from "@mui/icons-material/Add";

export default function CreatePurchase() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Purchase>();

  const [open, setOpen] = useState(false);

  // CONTACT
  const [selectedContact, setSelectedContact] = useState<Contact>();
  const handleContactChange = (event: any, value: Contact) => {
    setSelectedContact(value);
    setValue("contact" as any, value ? value.id : "");
  };

  // DATE
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");

  // POST
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();
  const createPurchase = useMutation(
    async (data: Purchase) => {
      try {
        const response = await axios.post(BACKEND_URL + "purchases/", data);
        return response.data;
      } catch (error) {
        console.log(error);
        throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("purchases");
      },
    }
  );

  const onSubmit: SubmitHandler<Purchase> = async (data, event) => {
    const dataToSubmit: any = {
      number: data.number,
      date: formattedDate,
      expectedArrival: null,
      isApproved: false,
      isDone: false,
      contactId: selectedContact?.id,
    };

    try {
      await createPurchase.mutateAsync(dataToSubmit);
      setOpen(false);
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
        Buat Purchase Order
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
            <Typography variant="h6">Buat Purchase Requisition</Typography>
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

            {/* AUTOCOMPLETE */}
            <SelectContact
              selectedContact={selectedContact}
              setSelectedContact={setSelectedContact}
              handleContactChange={handleContactChange}
            />

            {/* NOMOR SURAT */}
            <TextField
              id="number"
              label="Nomor"
              variant="outlined"
              {...register("number", { required: "Tidak boleh kosong" })}
              error={!!errors.number}
              helperText={errors.number?.message}
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
                disabled={createPurchase.isLoading}
              >
                {createPurchase.isLoading ? "Menyimpan" : "Simpan"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Dialog>
    </>
  );
}
