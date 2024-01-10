import {
  Dialog,
  Stack,
  Typography,
  TextField,
  Button,
  Autocomplete,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  CreatePurchaseRequisition,
  Purchase,
  Vendor,
} from "../../interfaces/interfaces";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { useState } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function CreatePurchaseRequisitionForm(props: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Purchase>();

  // GET VENDOR LIST
  const getVendors = async () => {
    const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
    const response = await axios.get(BACKEND_URL + "vendors/");
    return response.data.data;
  };
  const { error, data } = useQuery({
    queryKey: ["vendors"],
    queryFn: () => getVendors(),
    refetchOnWindowFocus: false,
  });

  // VENDOR
  const [selectedVendor, setSelectedVendor] = useState<Vendor>();
  const handleVendorChange = (event: any, value: any) => {
    setSelectedVendor(value);
    setValue("vendor", value ? value.id : "");
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
        throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("purchases");
      },
    }
  );

  const { isLoading } = createPurchase;

  const onSubmit: SubmitHandler<CreatePurchaseRequisition> = async (
    data,
    event
  ) => {
    const dataToSubmit: any = {
      vendorId: selectedVendor?.id,
      prDate: formattedDate,
      prNumber: data?.prNumber,
      status: "PR",
    };

    try {
      await createPurchase.mutateAsync(dataToSubmit);
      props.setOpen(false);
    } catch (error) {
      console.log("Mutation Error:", error);
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={() => props.setOpen(false)}
      fullWidth
      maxWidth={"xs"}
    >
      {/* <DialogTitle fontWeight={"bold"}>Tambah Produk</DialogTitle> */}
      <form action="submit" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack gap={3} padding={4}>
          <Typography variant="h6">Buat Purchase Requisition</Typography>

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

          {/* AUTOCOMPLETE */}
          <Autocomplete
            id="vendor"
            options={data ? data : []}
            autoHighlight
            getOptionLabel={(option) => option.name}
            value={selectedVendor}
            onChange={handleVendorChange}
            renderOption={(props, option) => (
              <Box
                component="li"
                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                {...props}
              >
                {option.code} - {option.name}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Vendor"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "new-password",
                }}
                {...register("vendor", { required: "Tidak boleh kosong" })}
                required
                error={!!errors.vendor}
                helperText={errors.vendor?.message}
              />
            )}
          />

          {/* NOMOR SURAT */}
          <TextField
            id="prNumber"
            label="Nomor Surat"
            variant="outlined"
            {...register("prNumber", { required: "Tidak boleh kosong" })}
            error={!!errors.prNumber}
            helperText={errors.prNumber?.message}
            required
          />

          <Stack
            direction={"row"}
            width={1}
            justifyContent={"flex-end"}
            gap={1}
          >
            <Button onClick={() => props.setOpen(false)} type="button">
              Batal
            </Button>
            <Button variant={"contained"} type="submit" disabled={isLoading}>
              {isLoading
                ? // <CircularProgress color="inherit" size={15} />
                  "Menyimpan"
                : "Simpan"}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Dialog>
  );
}
