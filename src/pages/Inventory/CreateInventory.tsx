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
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { SubmitHandler, useForm } from "react-hook-form";
import { Inventory, Transaction } from "../../interfaces/interfaces";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { InfoOutlined } from "@mui/icons-material";
import { formatDate } from "../../helpers/dateHelpers";
import { useNotification } from "../../App";

export default function CreateInventoryArrival(props: { type: "A" | "D" }) {
  const { triggerAlert } = useNotification();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inventory>();

  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const [open, setOpen] = useState(false);
  // VENDOR
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  // DATE
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");

  // POST INVENTORY HISTORY
  const queryClient = useQueryClient();

  const createInventory = useMutation(
    async (data: Inventory) => {
      try {
        const response = await axios.post(BACKEND_URL + "inventories", data);
        setOpen(false);
        triggerAlert({ message: "Data berhasil disimpan", color: "success" });
        return response.data;
      } catch (error: any) {
        triggerAlert({ message: `Error: ${error.message}`, color: "danger" });
        console.log(error);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`inventories`);
      },
    }
  );

  const onSubmit: SubmitHandler<Inventory> = async (data: Inventory) => {
    const dataToSubmit = {
      number: data.number,
      date: formattedDate,
      receiptNumber: data.receiptNumber,
      type: props.type,
      description: data.description,
      transactionId: selectedTransaction?.id,
    };
    try {
      console.log(dataToSubmit);
      await createInventory.mutateAsync(dataToSubmit as any);
    } catch (error) {
      console.log("Mutation Error:", error);
    }
  };

  // TRANSACTIONS
  const type = props.type == "A" ? "P" : "S";
  const getTransactions = async () => {
    const response = await axios.get(
      BACKEND_URL +
        "transactions?" +
        `type=${type}` +
        `&isApproved=1` +
        `&isDone=0`
    );

    return response.data.data;
  };

  const transactionsQuery = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(),
    refetchOnWindowFocus: false,
    enabled: true,
  });

  useEffect(() => {}, []);

  return (
    <>
      <Button
        startDecorator={<AddIcon />}
        variant="solid"
        onClick={() => setOpen(true)}
      >
        {props.type == "A" ? "Catat Gudang Masuk" : "Catat Gudang Keluar"}
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>
            {props.type == "A" ? "Catat Gudang Masuk" : "Catat Gudang Keluar"}
          </DialogTitle>
          <form
            action="submit"
            onSubmit={handleSubmit(onSubmit as any)}
            noValidate
            style={{ overflow: "scroll" }}
          >
            <Stack spacing={2}>
              {/* PURCHASE */}
              <FormControl>
                <Stack>
                  <FormLabel>
                    {props.type == "A" ? "Nomor PO" : "Nomor SO"}
                  </FormLabel>{" "}
                  <Autocomplete
                    id="number"
                    size="lg"
                    placeholder={props.type == "A" ? "Nomor PO" : "Nomor SO"}
                    value={selectedTransaction}
                    onChange={(event, newValue) => {
                      event;
                      setSelectedTransaction(newValue);
                    }}
                    inputValue={
                      selectedTransaction?.number && selectedTransaction?.number
                    }
                    getOptionLabel={(option: Transaction) => option.number}
                    options={
                      transactionsQuery.data ? transactionsQuery?.data : []
                    }
                    renderOption={(props, option: Transaction) => (
                      <AutocompleteOption {...props} key={option.id}>
                        <ListItemContent>
                          <Stack direction="column">
                            <h3>{option.number}</h3>
                            <Typography>{option.contact.name}</Typography>
                          </Stack>
                        </ListItemContent>
                        <Stack spacing={1}>
                          <Chip variant="outlined" size="sm">
                            {formatDate(option.date, "DD MMM YYYY")}
                          </Chip>
                        </Stack>
                      </AutocompleteOption>
                    )}
                  />
                </Stack>
              </FormControl>
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
              <FormControl error={errors.number?.message !== ""}>
                <Stack spacing={0}>
                  <FormLabel>Nomor LPB</FormLabel>
                  <Input
                    id="number"
                    placeholder="Nama"
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
              <FormControl error={errors.receiptNumber?.message !== ""}>
                <Stack spacing={0}>
                  <FormLabel>Nomor Faktur</FormLabel>
                  <Input
                    id="receiptNumber"
                    placeholder="Nomor Faktur"
                    {...register("receiptNumber", {
                      required: "Tidak boleh kosong",
                    })}
                    error={!!errors.receiptNumber}
                    size="lg"
                  />
                  {errors.receiptNumber?.message && (
                    <FormHelperText>
                      <InfoOutlined />
                      {errors.receiptNumber?.message}
                    </FormHelperText>
                  )}
                </Stack>
              </FormControl>

              <FormControl error={errors.description?.message !== ""}>
                <Stack spacing={0}>
                  <FormLabel>Deskripsi</FormLabel>
                  <Input
                    id="description"
                    placeholder="Nama"
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
                  loading={createInventory.isLoading}
                  type="button"
                  onClick={handleSubmit(onSubmit)}
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
