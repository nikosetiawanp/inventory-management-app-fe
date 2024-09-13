import { InfoOutlined, MoreVert } from "@mui/icons-material";
import {
  Dropdown,
  MenuButton,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Modal,
  ModalDialog,
  DialogTitle,
  Divider,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  FormLabel,
  FormControl,
  Input,
  FormHelperText,
  Autocomplete,
  AutocompleteOption,
  ListItemContent,
  Chip,
} from "@mui/joy";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { Alert, Inventory, Invoice } from "../../interfaces/interfaces";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { SubmitHandler, useForm } from "react-hook-form";
import { formatDate } from "../../helpers/dateHelpers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function ActionMenu(props: {
  invoice: Invoice;
  setAlert: React.Dispatch<React.SetStateAction<Alert>>;
}) {
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";

  const queryClient = useQueryClient();
  const { mutate: deleteData } = useMutation(
    async () => {
      try {
        const response = await axios.delete(
          BACKEND_URL + `invoices/` + props.invoice?.id
        );
        props.setAlert({
          open: true,
          color: "success",
          message: "Data berhasil diubah",
        });
        return response.data;
      } catch (error: any) {
        props.setAlert({
          open: true,
          color: "danger",
          message: `${error}`,
        });
        console.log(error);
        if (error?.code == "ERR_BAD_RESPONSE") {
          props.setAlert({
            open: true,
            color: "danger",
            message: `${error}`,
          });
          throw new Error("Network response was not ok");
        }
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("invoices");
      },
    }
  );

  const DeleteConfirmDialog = () => {
    return (
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>Hapus {props.invoice?.number}?</DialogTitle>
          <Divider />
          <DialogContent>
            Data yang sudah dihapus tidak dapat dikembalikan.
          </DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={() => deleteData()}>
              Hapus
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={(e: any) => {
                e.preventDefault();
                e.stopPropagation();
                setDeleteOpen(false);
              }}
            >
              Batal
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    );
  };

  const UpdateModal = () => {
    // INVENTORY
    const [selectedInventory, setSelectedInventory] =
      useState<Inventory | null>(props.invoice?.inventory);
    // DATE
    const [selectedDueDate, setSelectedDueDate] = useState(
      dayjs(props.invoice?.dueDate)
    );
    // props.invoice?.dueDate
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<any>();
    const updateInvoice = useMutation(
      async (data: any) => {
        console.log(data);

        try {
          const response = await axios.put(
            BACKEND_URL + "invoices/" + props.invoice?.id,
            data
          );
          props.setAlert({
            open: true,
            color: "success",
            message: "Data berhasil diubah",
          });
          return response.data;
        } catch (error: any) {
          props.setAlert({
            open: true,
            color: "danger",
            message: `${error}`,
          });
          console.log(error);

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
        date: formatDate(props.invoice?.date, "YYYY-MM-DD"),
        dueDate: formatDate(selectedDueDate, "YYYY-MM-DD"),
        transactionId: props.invoice?.transactionId,
        inventoryId: props.invoice?.inventoryId,
      };

      try {
        await updateInvoice.mutateAsync(dataToSubmit);
        console.log(dataToSubmit);
        setUpdateOpen(false);
      } catch (error) {
        console.log("Mutation Error:", error);
      }
      event?.target.reset();
      setUpdateOpen(false);
    };
    return (
      <Modal open={updateOpen} onClose={() => setUpdateOpen(false)}>
        <ModalDialog>
          <DialogTitle>Ubah Faktur</DialogTitle>

          <form action="submit" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2}>
              {/* TANGGAL JATUH TEMPO */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={1}>
                  <FormLabel>Tanggal Jatuh Tempo</FormLabel>
                  <DatePicker
                    value={selectedDueDate}
                    onChange={(newValue: any) => setSelectedDueDate(newValue)}
                    // minDate={dayjs()}
                    slotProps={{
                      field: { clearable: true },
                      textField: {
                        size: "small",
                      },
                    }}
                    defaultValue={dayjs(props.invoice?.dueDate)}
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
                    defaultValue={props.invoice?.number}
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
                    disabled
                    onChange={(event, newValue) => {
                      event;
                      setSelectedInventory(newValue);
                    }}
                    inputValue={selectedInventory?.number}
                    getOptionLabel={(option: Inventory) => option.number}
                    options={[]}
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
                  onClick={() => setUpdateOpen(false)}
                  type="button"
                  variant="outlined"
                  color="neutral"
                >
                  Batal
                </Button>
                <Button
                  variant={"solid"}
                  type="submit"
                  disabled={updateInvoice.isLoading}
                  loading={updateInvoice.isLoading}
                >
                  Simpan
                </Button>
              </Stack>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    );
  };

  return (
    <div onClick={(e: any) => e.stopPropagation()}>
      <Dropdown>
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{
            root: {
              variant: "plain",
              color: "neutral",
            },
          }}
          size="sm"
        >
          <MoreVert />
        </MenuButton>
        <Menu sx={{ zIndex: 1300 }}>
          <MenuItem
            onClick={() => {
              setUpdateOpen(true);
            }}
          >
            <EditIcon fontSize="small" color="inherit" />{" "}
            <Typography color="neutral">Ubah</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setDeleteOpen(true);
            }}
          >
            <DeleteIcon fontSize="small" color="error" />{" "}
            <Typography color="danger">Hapus</Typography>
          </MenuItem>
        </Menu>
      </Dropdown>
      <DeleteConfirmDialog />
      <UpdateModal />
    </div>
  );
}
