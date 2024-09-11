import {
  Button,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
  Stack,
} from "@mui/joy";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Account } from "../../interfaces/interfaces";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { InfoOutlined } from "@mui/icons-material";

export default function CreateAccount() {
  const {
    register,
    handleSubmit,
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

  const onSubmit: SubmitHandler<Account> = async (data) => {
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
        startDecorator={<AddIcon />}
        variant="solid"
        onClick={() => setOpen(true)}
        sx={{ whiteSpace: "nowrap" }}
      >
        Buat Akun
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Buat Akun</DialogTitle>

          <form
            action="submit"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            style={{ overflow: "scroll" }}
          >
            <Stack spacing={2}>
              <FormControl error={errors.number?.message !== ""}>
                <Stack spacing={0}>
                  <FormLabel>Nama</FormLabel>
                  <Input
                    id="number"
                    placeholder="Nomor"
                    {...register("number", {
                      required: "Tidak boleh kosong",
                    })}
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

              <FormControl error={errors.name?.message !== ""}>
                <Stack spacing={0}>
                  <FormLabel>Nama</FormLabel>
                  <Input
                    id="nama"
                    placeholder="Nama"
                    {...register("name", { required: "Tidak boleh kosong" })}
                    error={!!errors.name}
                    size="lg"
                  />
                  {errors.name?.message && (
                    <FormHelperText>
                      <InfoOutlined />
                      {errors.name?.message}
                    </FormHelperText>
                  )}
                </Stack>
              </FormControl>

              {/* ACTIONS */}
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
                  disabled={createAccount.isLoading}
                >
                  Batal
                </Button>
                <Button
                  variant={"solid"}
                  type="button"
                  disabled={createAccount.isLoading}
                  onClick={handleSubmit(onSubmit)}
                  loading={createAccount.isLoading}
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
