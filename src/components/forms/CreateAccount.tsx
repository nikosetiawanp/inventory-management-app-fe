import { Button, Dialog, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Account, Contact } from "../../interfaces/interfaces";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

export default function CreateAccount() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<Account>();
  const [open, setOpen] = useState(false);
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();

  const createAccount = useMutation(
    async (data: Account) => {
      const dataToSubmit = {
        number: data.number,
        name: data.name,
      };
      console.log(dataToSubmit);

      try {
        const response = await axios.post(
          BACKEND_URL + "accounts/",
          dataToSubmit
        );
        return response.data;
      } catch (error: any) {
        console.log(error);
        if (error?.code == "ERR_BAD_RESPONSE")
          throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("accounts");
      },
    }
  );

  const onSubmit: SubmitHandler<Account> = async (data, event) => {
    try {
      await createAccount.mutateAsync(data);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ height: "auto" }}
      >
        Tambah Akun
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth={"xs"}
      >
        <form
          action="submit"
          onSubmit={handleSubmit(onSubmit as any)}
          noValidate
        >
          <Stack gap={3} padding={4}>
            <Typography variant="h6">Buat Akun</Typography>
            <TextField
              id="number"
              label="Nomor"
              variant="outlined"
              {...register("number", { required: "Tidak boleh kosong" })}
              error={!!errors.number}
              helperText={errors.number?.message}
              required
            />
            <TextField
              id="name"
              label="Nama"
              variant="outlined"
              {...register("name", { required: "Tidak boleh kosong" })}
              error={!!errors.name}
              helperText={errors.name?.message}
              required
            />

            {/* ACTIONS */}
            <Stack
              direction={"row"}
              width={1}
              justifyContent={"flex-end"}
              gap={1}
            >
              <Button onClick={() => setOpen(false)} type="button">
                Batal
              </Button>
              <Button
                variant={"contained"}
                disabled={createAccount.isLoading}
                type="button"
                onClick={handleSubmit(onSubmit)}
              >
                {createAccount.isLoading ? "Menyimpan" : "Simpan"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Dialog>
    </>
  );
}
