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

export default function CreateTransaction(props: {
  type: "purchase" | "sales";
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Transaction>();

  const [open, setOpen] = useState(false);
  const getContacts = async () => {
    const response = await axios.get(
      BACKEND_URL + `contacts?type=${props.type == "purchase" ? "V" : "C"}`
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
      type: props.type == "purchase" ? "P" : props.type == "sales" ? "S" : null,
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
        startDecorator={<AddIcon />}
        variant="solid"
        onClick={() => setOpen(true)}
      >
        {props.type == "purchase" ? "Buat Purchase Order" : "Buat Sales Order"}
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>
            {props.type == "purchase"
              ? "Buat Purchase Order"
              : "Buat Sales Order"}
          </DialogTitle>
          <form
            action="submit"
            onSubmit={handleSubmit(onSubmit as any)}
            noValidate
            style={{ overflow: "scroll" }}
          >
            <Stack spacing={2}>
              {/* DATE PICKER */}
              <Stack>
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
              <FormControl error={!selectedContact}>
                <Stack>
                  <FormLabel>
                    {props.type == "purchase" ? "Vendor" : "Customer"}
                  </FormLabel>{" "}
                  <Autocomplete
                    id="contact"
                    size="lg"
                    placeholder={
                      props.type == "purchase"
                        ? "Pilih Vendor"
                        : "Pilih Customer"
                    }
                    value={selectedContact}
                    onChange={(event, newValue) => {
                      event;
                      setSelectedContact(newValue);
                    }}
                    inputValue={selectedContact?.name}
                    getOptionLabel={(option: Contact) => option.name}
                    options={contactsQuery.data}
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
                  <FormLabel>Nomor</FormLabel>
                  <Input
                    id="number"
                    placeholder="Nomor"
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
