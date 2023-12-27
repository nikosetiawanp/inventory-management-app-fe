import {
  Dialog,
  Stack,
  Typography,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import { Purchase } from "../../interfaces/interfaces";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

const vendors = [
  {
    id: "",
    code: "SCT05",
    name: "PT Sinar Kreasi Teknologi",
    email: "",
    address: "",
    phone: "",
  },
  {
    id: "",
    code: "ABS30",
    name: "PT Aman Bahagia Sentosa",
    email: "",
    address: "",
    phone: "",
  },
];

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
  } = useForm<Purchase>();

  const onSubmit: SubmitHandler<Purchase> = (data, event) => {
    console.log(data);
    event?.target.reset();
    props.setOpen(false);
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

          {/* VENDOR */}
          <Controller
            name="vendor"
            control={control}
            defaultValue={vendors[0]}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={vendors}
                getOptionLabel={(vendor) => `${vendor.code} - ${vendor.name}`}
                onChange={(_, selectedOption) => field.onChange(selectedOption)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Vendor"
                    variant="outlined"
                    error={!!errors.vendor}
                    helperText={errors.vendor?.message || ""}
                  />
                )}
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
