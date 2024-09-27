import {
  Stack,
  Button,
  Modal,
  ModalDialog,
  DialogTitle,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Autocomplete,
  AutocompleteOption,
  ListItemContent,
} from "@mui/joy";
import { Transaction, Contact } from "../../interfaces/interfaces";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { useState } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import { InfoOutlined } from "@mui/icons-material";
import { useNotification } from "../../App";

export default function CreateTransaction(props: { type: "P" | "S" }) {
  const { triggerAlert } = useNotification();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Transaction>();

  const [open, setOpen] = useState(false);
  const getContacts = async () => {
    const response = await axios.get(
      BACKEND_URL + `contacts?type=${props.type == "P" ? "V" : "C"}`
    );
    return response.data.data;
  };
  const contactsQuery = useQuery({
    queryKey: ["contacts"],
    queryFn: getContacts,
    refetchOnWindowFocus: false,
    enabled: open,
  });

  // CONTACT
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // DATE
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");

  // POST
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const queryClient = useQueryClient();
  const createTransaction = useMutation(
    async (data: Transaction) => {
      try {
        const response = await axios.post(BACKEND_URL + "transactions/", data);
        triggerAlert({ message: "Data berhasil disimpan", color: "success" });
        return response.data;
      } catch (error: any) {
        console.log(error);
        triggerAlert({ message: `Error: ${error.message}`, color: "danger" });
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
      type: props.type == "P" ? "P" : props.type == "S" ? "S" : null,
      date: formattedDate,
      expectedArrival: null,
      isApproved: false,
      isDone: false,
      contactId: selectedContact?.id,
    };

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
        startDecorator={<AddIcon />}
        variant="solid"
        onClick={() => setOpen(true)}
      >
        {props.type == "P" ? "Buat Purchase Order" : "Buat Sales Order"}
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>
            {props.type == "P" ? "Buat Purchase Order" : "Buat Sales Order"}
          </DialogTitle>
          <form
            action="submit"
            onSubmit={handleSubmit(onSubmit as any)}
            noValidate
            style={{ overflow: "scroll" }}
          >
            <Stack spacing={2}>
              {/* DATE PICKER */}
              <Stack spacing={1}>
                <FormLabel>Tanggal</FormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={selectedDate}
                    onChange={(newValue: any) => setSelectedDate(newValue)}
                    format="DD/MM/YYYY"
                    slotProps={{
                      field: { clearable: true },
                      textField: {
                        size: "small",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Stack>

              {/* AUTOCOMPLETE */}
              <FormControl>
                <Stack>
                  <FormLabel>
                    {props.type == "P" ? "Vendor" : "Customer"}
                  </FormLabel>{" "}
                  <Autocomplete
                    id="contact"
                    size="lg"
                    placeholder={
                      props.type == "P" ? "Pilih Vendor" : "Pilih Customer"
                    }
                    value={selectedContact}
                    onChange={(event, newValue) => {
                      event;
                      setSelectedContact(newValue);
                    }}
                    inputValue={selectedContact?.name}
                    getOptionLabel={(option: Contact) => option.name}
                    options={contactsQuery.data ? contactsQuery.data : []}
                    renderOption={(props, option: Contact) => (
                      <AutocompleteOption {...props} key={option.id}>
                        <ListItemContent sx={{ fontSize: "sm" }}>
                          {option.name}
                        </ListItemContent>
                      </AutocompleteOption>
                    )}
                  />
                  {errors.contact?.message && (
                    <FormHelperText>
                      <InfoOutlined />
                      {errors.contact?.message}
                    </FormHelperText>
                  )}
                </Stack>
              </FormControl>

              {/* NOMOR */}
              <FormControl error={errors.number?.message !== ""}>
                <Stack>
                  <FormLabel>
                    {props.type == "P" ? "Nomor PO" : "Nomor SO"}
                  </FormLabel>
                  <Input
                    id="number"
                    placeholder={props.type == "P" ? "Nomor PO" : "Nomor SO"}
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

              <Stack
                direction={"row"}
                width={1}
                justifyContent={"flex-end"}
                gap={1}
              >
                <Button
                  variant="outlined"
                  color="neutral"
                  onClick={() => setOpen(false)}
                  type="button"
                  disabled={createTransaction.isLoading}
                >
                  Batal
                </Button>
                <Button
                  variant={"solid"}
                  type="submit"
                  disabled={createTransaction.isLoading}
                  loading={createTransaction.isLoading}
                >
                  Simpan
                </Button>
              </Stack>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </>
  );
}
