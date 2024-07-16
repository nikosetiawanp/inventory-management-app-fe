import { Dialog, Stack, Typography, TextField, Button } from "@mui/material";
import { Transaction, Contact } from "../../interfaces/interfaces";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useState } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import SelectContact from "../../components/select/SelectContact";
import AddIcon from "@mui/icons-material/Add";

export default function CreateTransaction(props: { type: "P" | "S" }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Transaction>();

  const [open, setOpen] = useState(false);

  // CONTACT
  const [selectedContact, setSelectedContact] = useState<Contact>();
  const handleContactChange = (value: Contact) => {
    setSelectedContact(value);
    setValue("contact" as any, value ? value.id : "");
  };

  // DATE
  const [selectedDate, setSelectedDate] = useState(dayjs());
  // const [expectedArrival, setExpectedArrival] = useState(null);

  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
  // const formattedExpectedArrival = dayjs(expectedArrival).format("YYYY-MM-DD");

  // POST
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();
  const createTransaction = useMutation(
    async (data: Transaction) => {
      try {
        const response = await axios.post(BACKEND_URL + "transactions/", data);
        return response.data;
      } catch (error) {
        console.log(error);
        throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("transactions");
      },
    }
  );

  const onSubmit: SubmitHandler<Transaction> = async (data) => {
    const dataToSubmit: any = {
      number: data.number,
      type: props.type,
      date: formattedDate,
      expectedArrival: null,
      isApproved: false,
      isDone: false,
      contactId: selectedContact?.id,
    };

    console.log(dataToSubmit);

    try {
      await createTransaction.mutateAsync(dataToSubmit);
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
        {props.type == "P" ? "Buat Purchase Order" : "Buat Sales Order"}
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
            <Typography variant="h6">
              {props.type == "P" ? "Buat Purchase Order" : "Buat Sales Order"}
            </Typography>
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
              type={props.type}
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
                disabled={createTransaction.isLoading}
              >
                {createTransaction.isLoading ? "Menyimpan" : "Simpan"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Dialog>
    </>
  );
}
