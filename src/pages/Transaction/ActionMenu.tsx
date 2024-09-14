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
  Autocomplete,
  AutocompleteOption,
  ListItemContent,
  FormHelperText,
  Input,
} from "@mui/joy";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { Contact, Transaction } from "../../interfaces/interfaces";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { SubmitHandler, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNotification } from "../../App";

export default function ActionMenu(props: { transaction: Transaction }) {
  const { triggerAlert } = useNotification();

  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";

  const queryClient = useQueryClient();

  const DeleteConfirmDialog = () => {
    const { mutate: deleteData } = useMutation(
      async () => {
        try {
          const response = await axios.delete(
            BACKEND_URL + `transactions/` + props.transaction?.id
          );
          triggerAlert({ message: "Data berhasil dihapus", color: "success" });

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
    return (
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>Hapus {props.transaction?.number}?</DialogTitle>
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
    const [selectedContact, setSelectedContact] = useState<Contact | null>(
      props.transaction?.contact
    );
    const [selectedDate, setSelectedDate] = useState(
      dayjs(props.transaction?.date)
    );
    const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<Transaction>();

    const updateTransaction = useMutation(
      async (data: Transaction) => {
        try {
          const response = await axios.put(
            BACKEND_URL + "transactions/" + props.transaction?.id,
            data
          );
          triggerAlert({ message: "Data berhasil diubah", color: "success" });
          return response.data;
        } catch (error: any) {
          triggerAlert({ message: `Error: ${error.message}`, color: "danger" });
          console.log(error);
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
        type: props.transaction?.type,
        date: formattedDate,
        expectedArrival: null,
        isApproved: false,
        isDone: false,
        contactId: selectedContact?.id,
      };

      try {
        await updateTransaction.mutateAsync(dataToSubmit);
        setUpdateOpen(false);
      } catch (error) {
        console.log("Mutation Error:", error);
      }
    };

    const getContacts = async () => {
      const response = await axios.get(
        BACKEND_URL +
          `contacts?` +
          `type=${props.transaction?.type == "P" ? "V" : "C"}`
      );
      return response.data.data;
    };
    const contactsQuery = useQuery({
      queryKey: ["contacts"],
      queryFn: getContacts,
      refetchOnWindowFocus: false,
      enabled: updateOpen,
    });

    return (
      <Modal open={updateOpen} onClose={() => setUpdateOpen(false)}>
        <ModalDialog>
          <DialogTitle>
            {props.transaction?.type == "P"
              ? "Ubah Purchase Order"
              : "Ubah Sales Order"}
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
                    {props.transaction?.type == "P" ? "Vendor" : "Customer"}
                  </FormLabel>{" "}
                  <Autocomplete
                    id="contact"
                    size="lg"
                    placeholder={
                      props.transaction?.type == "P"
                        ? "Pilih Vendor"
                        : "Pilih Customer"
                    }
                    value={selectedContact}
                    defaultValue={props.transaction?.contact}
                    onChange={(event, newValue) => {
                      event;
                      setSelectedContact(newValue);
                    }}
                    inputValue={selectedContact?.name || ""}
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
                    {props.transaction?.type == "P" ? "Nomor PO" : "Nomor SO"}
                  </FormLabel>
                  <Input
                    id="number"
                    placeholder={
                      props.transaction?.type == "P" ? "Nomor PO" : "Nomor SO"
                    }
                    {...register("number", { required: "Tidak boleh kosong" })}
                    error={!!errors.number}
                    size="lg"
                    defaultValue={props.transaction?.number}
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
                  onClick={() => setUpdateOpen(false)}
                  type="button"
                  disabled={updateTransaction?.isLoading}
                >
                  Batal
                </Button>
                <Button
                  variant={"solid"}
                  type="submit"
                  disabled={updateTransaction?.isLoading}
                  loading={updateTransaction?.isLoading}
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
          disabled={props.transaction?.isApproved || props.transaction?.isDone}
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
      <UpdateModal />
      <DeleteConfirmDialog />
    </div>
  );
}
