import {
  Dialog,
  Stack,
  Typography,
  TextField,
  Button,
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
} from "@mui/material";
import { Purchase, Vendor } from "../../interfaces/interfaces";
import { SubmitHandler, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import axios from "axios";
import { useState } from "react";

export default function CreatePurchaseRequisitionForm(props: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setValue,
  } = useForm<Purchase>();

  const onSubmit: SubmitHandler<Purchase> = (data, event) => {
    const dataToSubmit = {
      vendorId: selectedVendor?.id,
      prDate: "",
      prNumber: data.prNumber,
    };
  };

  const getVendors = async () => {
    // FETCHING DATA
    const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
    const response = await axios.get(BACKEND_URL + "vendors/");
    return response.data.data;
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["vendor"],
    queryFn: () => getVendors(),
  });

  const [selectedVendor, setSelectedVendor] = useState<Vendor>();
  const handleVendorChange = (event: any, value: any) => {
    setSelectedVendor(value);
    setValue("vendor", value ? value.id : "");
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

          {/* AUTOCOMPLETE */}
          <Autocomplete
            id="vendor"
            options={data}
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
            <Button variant={"contained"} type="submit">
              Simpan
            </Button>
          </Stack>
        </Stack>
      </form>
    </Dialog>
  );
}
