import {
  Autocomplete,
  AutocompleteOption,
  Button,
  Chip,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  ListItemContent,
  Modal,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { Inventory, Transaction } from "../../interfaces/interfaces";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { formatDate } from "../../helpers/dateHelpers";
import { InfoOutlined } from "@mui/icons-material";

export default function CreateInvoice(props: {
  inventories: Inventory[];
  transaction: Transaction;
}) {
  const [open, setOpen] = useState(false);

  // INVENTORY
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(
    null
  );

  // DATE
  const [selectedDueDate, setSelectedDueDate] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();

  // CREATE INVOICE
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();
  const createInvoice = useMutation(
    async (data: any) => {
      try {
        const response = await axios.post(BACKEND_URL + "invoices/", data);
        return response.data;
      } catch (error) {
        throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("invoices");
      },
    }
  );

  const onSubmit: SubmitHandler<any> = async (data, event) => {
    const dataToSubmit = {
      number: data.number,
      date: formatDate(dayjs(), "YYYY-MM-DD"),
      dueDate: formatDate(selectedDueDate, "YYYY-MM-DD"),
      transactionId: props.transaction.id,
      inventoryId: selectedInventory?.id,
    };

    console.log(dataToSubmit);

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
        variant="solid"
        onClick={() => {
          setOpen(true);
        }}
        startDecorator={<ReceiptIcon />}
      >
        Buat Faktur
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Buat Faktur</DialogTitle>

          <form action="submit" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2}>
              {/* TANGGAL JATUH TEMPO */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={1}>
                  <FormLabel>Tanggal Jatuh Tempo</FormLabel>

                  <DatePicker
                    value={selectedDueDate}
                    onChange={(newValue: any) => setSelectedDueDate(newValue)}
                    minDate={dayjs()}
                    slotProps={{
                      field: { clearable: true },
                      textField: {
                        size: "small",
                      },
                    }}
                    format="DD/MM/YYYY"
                  />
                </Stack>
              </LocalizationProvider>

              {/* NOMOR PO */}
              <FormControl>
                <Stack spacing={0}>
                  <FormLabel>Nomor Faktur</FormLabel>
                  <Input
                    id="number"
                    placeholder="Nomor Faktur"
                    {...register("number", {
                      required: "Tidak boleh kosong",
                    })}
                    error={!!errors.number}
                    size="lg"
                  />
                  {errors?.number?.message && (
                    <FormHelperText>
                      <InfoOutlined color="error" />
                      <Typography color="danger">{`${errors.number?.message}`}</Typography>
                    </FormHelperText>
                  )}
                </Stack>
              </FormControl>

              <FormControl>
                <Stack>
                  <FormLabel>Nomor Surat Jalan</FormLabel>{" "}
                  <Autocomplete
                    id="number"
                    size="lg"
                    placeholder={"Nomor Surat Jalan"}
                    value={selectedInventory}
                    onChange={(event, newValue) => {
                      event;
                      setSelectedInventory(newValue);
                    }}
                    inputValue={selectedInventory?.number}
                    getOptionLabel={(option: Inventory) => option.number}
                    options={props.inventories ? props.inventories : []}
                    getOptionDisabled={(option: Inventory) =>
                      option.invoices.length > 0
                    }
                    renderOption={(props, option: Inventory) => (
                      <AutocompleteOption {...props}>
                        <ListItemContent>
                          <Stack direction="column">
                            <h3>{option.number}</h3>
                            <Typography>{option.receiptNumber}</Typography>
                          </Stack>
                        </ListItemContent>
                        <Chip variant="outlined" size="sm">
                          {formatDate(option.date, "DD MMM YYYY")}
                        </Chip>
                      </AutocompleteOption>
                    )}
                  />
                </Stack>
              </FormControl>

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
                >
                  Batal
                </Button>
                <Button
                  variant={"solid"}
                  type="submit"
                  disabled={createInvoice.isLoading}
                  loading={createInvoice.isLoading}
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
