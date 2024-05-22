import {
  TableRow,
  TableCell,
  TextField,
  InputAdornment,
  Stack,
  IconButton,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Inventory,
  Transaction,
  TransactionItem,
} from "../../interfaces/interfaces";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

export default function EditTransactionItemRow(props: {
  transactionItem: TransactionItem;
  editing: boolean;
  setEditing: any;
  inventories: Inventory[];
  transaction: Transaction;
}) {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm();

  const updateTransactionItem = useMutation(
    async (data: TransactionItem) => {
      const dataToSubmit = {
        quantity: data.quantity,
        price: data.price,
        discount: data.discount,
        tax: data.tax,
        transactionId: props.transactionItem?.transactionId,
        productId: props.transactionItem?.productId,
      };

      console.log(dataToSubmit);

      try {
        const response = await axios.put(
          BACKEND_URL + "transaction-items/" + props.transactionItem?.id,
          dataToSubmit
        );

        return response.data;
      } catch (error) {
        throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          `transactionItems.${props.transaction.id}`
        );
      },
    }
  );

  const onSubmit: SubmitHandler<TransactionItem> = async (data, event) => {
    try {
      await updateTransactionItem.mutateAsync(data);
      props.setEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  // FORMAT CURRENCY
  // const currencyFormatter = new Intl.NumberFormat("id-ID", {
  //   style: "currency",
  //   currency: "IDR",
  // });

  // // TOTAL ARRIVED
  // const getTotalArrived = (productId: any) => {
  //   const inventoryItems = props.inventories.map(
  //     (inventory: Inventory) => inventory.inventoryItems
  //   );
  //   const filteredByProductId = [...inventoryItems.flat()]
  //     .filter((inventoryItem: any) => inventoryItem.productId == productId)
  //     .map((item: any) => item.quantity);

  //   const total = filteredByProductId.reduce(
  //     (accumulator, currentValue) => accumulator + currentValue,
  //     0
  //   );
  //   return total;
  // };

  return (
    <TableRow>
      <TableCell>{props.transactionItem?.product?.name}</TableCell>
      <TableCell width={100}>
        <TextField
          id={`quantity`}
          variant="outlined"
          size="small"
          defaultValue={props.transactionItem?.quantity}
          {...register(`quantity`, {
            required: "Tidak boleh kosong",
          })}
          sx={{ textAlign: "center" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {props.transactionItem?.product?.unit}
              </InputAdornment>
            ),
          }}
        />
      </TableCell>
      <TableCell width={50}></TableCell>
      <TableCell align="center" width={200}>
        <TextField
          id={`price`}
          variant="outlined"
          size="small"
          defaultValue={props.transactionItem?.price}
          {...register(`price`, {
            required: "Tidak boleh kosong",
          })}
          sx={{ textAlign: "center" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">Rp</InputAdornment>
            ),
          }}
        />
      </TableCell>

      <TableCell width={80}>
        <TextField
          id={`discount`}
          variant="outlined"
          size="small"
          defaultValue={props.transactionItem?.discount}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          {...register(`discount`, {
            required: "Tidak boleh kosong",
          })}
        />
      </TableCell>
      <TableCell width={80}>
        <TextField
          id={`tax`}
          variant="outlined"
          size="small"
          defaultValue={props.transactionItem?.tax}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          {...register(`tax`, {
            required: "Tidak boleh kosong",
          })}
        />
      </TableCell>
      <TableCell></TableCell>
      <TableCell align="center">
        <Stack direction="row" justifyContent="center">
          <IconButton
            size="small"
            color="primary"
            onClick={handleSubmit(onSubmit as any)}
          >
            <CheckIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => props.setEditing(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
