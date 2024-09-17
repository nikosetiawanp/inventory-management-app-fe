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
  FormControl,
  FormLabel,
  Autocomplete,
  AutocompleteOption,
  ListItemContent,
  Chip,
  Input,
  FormHelperText,
} from "@mui/joy";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { Inventory, Transaction } from "../../interfaces/interfaces";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { formatDate } from "../../helpers/dateHelpers";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SubmitHandler, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { useNotification } from "../../App";

export default function ActionMenu(props: { inventory: Inventory }) {
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
            BACKEND_URL + `inventories/` + props.inventory?.id
          );
          triggerAlert({ message: "Data berhasil dihapus", color: "success" });
          return response.data;
        } catch (error: any) {
          triggerAlert({ message: "Data berhasil dihapus", color: "success" });
          console.log(error);
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("inventories");
        },
      }
    );
    return (
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>Hapus {props.inventory?.number}?</DialogTitle>
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
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<Inventory>();

    // VENDOR
    const [selectedTransaction, setSelectedTransaction] =
      useState<Transaction | null>(props.inventory?.transaction);

    // DATE
    const [selectedDate, setSelectedDate] = useState(
      dayjs(props.inventory?.date)
    );

    const formattedDate = formatDate(selectedDate, "YYYY-MM-DD");

    const updateInventory = useMutation(
      async (data: Inventory) => {
        try {
          const response = await axios.put(
            BACKEND_URL + "inventories/" + props.inventory?.id,
            data
          );
          triggerAlert({ message: "Data berhasil diubah", color: "success" });
          setUpdateOpen(false);
          return response.data;
        } catch (error) {
          triggerAlert({ message: "Data berhasil dihapus", color: "success" });
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
        type: props.inventory?.type,
        description: data.description,
        transactionId: props.inventory?.transactionId,
      };
      try {
        console.log(dataToSubmit);
        await updateInventory.mutateAsync(dataToSubmit as any);
      } catch (error) {
        console.log("Mutation Error:", error);
      }
    };

    return (
      <Modal open={updateOpen} onClose={() => setUpdateOpen(false)}>
        <ModalDialog>
          <DialogTitle>
            {props.inventory?.type == "A"
              ? "Ubah Gudang Masuk"
              : "Ubah Gudang Keluar"}
          </DialogTitle>
          <form
            action="submit"
            onSubmit={handleSubmit(onSubmit as any)}
            noValidate
            style={{ overflow: "scroll" }}
          >
            <Stack spacing={2}>
              {/* TRANSACTION */}
              <FormControl>
                <Stack>
                  <FormLabel>
                    {props.inventory?.type == "A" ? "Nomor PO" : "Nomor SO"}
                  </FormLabel>{" "}
                  <Autocomplete
                    id="number"
                    size="lg"
                    placeholder={
                      props.inventory?.type == "A" ? "Nomor PO" : "Nomor SO"
                    }
                    value={selectedTransaction}
                    onChange={(event, newValue) => {
                      event;
                      setSelectedTransaction(newValue);
                    }}
                    inputValue={props.inventory?.transaction?.number || ""}
                    getOptionLabel={(option: Transaction) => option.number}
                    options={[]}
                    disabled
                    defaultValue={props.inventory?.transaction}
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
                    defaultValue={props.inventory?.number}
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
                    defaultValue={props.inventory?.receiptNumber}
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
                    defaultValue={
                      props.inventory?.description
                        ? props.inventory?.description
                        : ""
                    }
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
                  onClick={() => setUpdateOpen(false)}
                  type="button"
                  variant="outlined"
                  color="neutral"
                >
                  Batal
                </Button>
                <Button
                  variant={"solid"}
                  loading={updateInventory.isLoading}
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
          <MenuItem onClick={() => setUpdateOpen(true)}>
            <EditIcon fontSize="small" color="inherit" />
            <Typography color="neutral">Ubah</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setDeleteOpen(true);
            }}
          >
            <DeleteIcon fontSize="small" color="error" />
            <Typography color="danger">Hapus</Typography>
          </MenuItem>
        </Menu>
      </Dropdown>
      <UpdateModal />
      <DeleteConfirmDialog />
    </div>
  );
}
