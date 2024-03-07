import { Button, Dialog, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import dayjs from "dayjs";
import { Account, Cash } from "../../interfaces/interfaces";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SelectContact from "../select/SelectContact";
import SelectAccount from "../select/SelectAccount";

export default function CreateCash() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Cash>();
  const [open, setOpen] = useState(false);

  //   SELECT ACCOUNT
  const [selectedAccount, setSelectedAccount] = useState<Account>();
  const handleAccountChange = (event: any, value: Account) => {
    setSelectedAccount(value);
    setValue("contact" as any, value ? value.id : "");
  };

  //   CREATE CASH
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();
  const createPurchase = useMutation(
    async (data: Cash) => {
      try {
        const response = await axios.post(BACKEND_URL + "purchases/", data);
        return response.data;
      } catch (error) {
        console.log(error);
        throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("purchases");
      },
    }
  );
  const onSubmit: SubmitHandler<Cash> = async (data, event) => {
    const dataToSubmit: any = {
      //   number: data.number,
      //   date: formattedDate,
      //   expectedArrival: null,
      //   isApproved: false,
      //   isDone: false,
      //   contactId: selectedContact?.id,
    };

    try {
      await createPurchase.mutateAsync(dataToSubmit);
      setOpen(false);
    } catch (error) {
      console.log("Mutation Error:", error);
    }
  };

  //   DATE
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");

  return (
    <>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ height: "auto" }}
      >
        Catat Kas
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
            <Typography variant="h6">Catat Kas</Typography>
            {/* DATE PICKER */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Tanggal"
                value={selectedDate}
                onChange={(newValue: any) => setSelectedDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{
                  field: { clearable: true },
                }}
              />
            </LocalizationProvider>

            <SelectAccount
              selectedAccount={selectedAccount}
              setSelectedAccount={setSelectedAccount}
              handleAccountChange={handleAccountChange}
            />

            {/* AUTOCOMPLETE */}
          </Stack>
        </form>
      </Dialog>
    </>
  );
}
