import {
  TableRow,
  TableCell,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Inventory,
  InventoryItem,
  Purchase,
  PurchaseItem,
} from "../../interfaces/interfaces";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

export default function EditPurchaseItemRow(props: {
  purchaseItem: PurchaseItem;
  editing: boolean;
  setEditing: any;
  inventories: Inventory[];
  purchase: Purchase;
}) {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const updatePurchaseItem = useMutation(
    async (data: PurchaseItem) => {
      const dataToSubmit = {
        quantity: data.quantity,
        prPrice: data.prPrice ? data.prPrice : props.purchaseItem.prPrice,
        poPrice: data.poPrice ? data.poPrice : null,
        discount: data.discount,
        tax: data.tax,
        purchaseId: props.purchaseItem.purchaseId,
        productId: props.purchaseItem.productId,
      };

      try {
        const response = await axios.patch(
          BACKEND_URL + "purchase-items/" + props.purchaseItem.id,
          dataToSubmit
        );

        return response.data;
      } catch (error) {
        throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`purchaseItems.${props.purchase.id}`);
      },
    }
  );

  const onSubmit: SubmitHandler<PurchaseItem> = async (data, event) => {
    try {
      await updatePurchaseItem.mutateAsync(data);
      console.log("Success");
      props.setEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  // FORMAT CURRENCY
  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  // TOTAL ARRIVED
  const getTotalArrived = (productId: any) => {
    const inventoryItems = props.inventories.map(
      (inventory: Inventory) => inventory.inventoryItems
    );
    const filteredByProductId = [...inventoryItems.flat()]
      .filter((inventoryItem: any) => inventoryItem.productId == productId)
      .map((item: any) => item.quantity);

    const total = filteredByProductId.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    return total;
  };

  return (
    <TableRow>
      <TableCell>{props.purchaseItem?.product?.name}</TableCell>
      <TableCell>
        <TextField
          id={`quantity`}
          variant="outlined"
          size="small"
          defaultValue={props.purchaseItem.quantity}
          {...register(`quantity`, {
            required: "Tidak boleh kosong",
          })}
          sx={{ textAlign: "center" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {props.purchaseItem?.product?.unit}
              </InputAdornment>
            ),
          }}
        />
      </TableCell>
      <TableCell align="center">
        {props.purchase.status == "PO" ? (
          currencyFormatter.format(props.purchaseItem.prPrice)
        ) : (
          <TextField
            id={`prPrice`}
            variant="outlined"
            size="small"
            defaultValue={props.purchaseItem.prPrice}
            {...register(`prPrice`, {
              required: "Tidak boleh kosong",
            })}
            sx={{ textAlign: "center" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Rp</InputAdornment>
              ),
            }}
          />
        )}
      </TableCell>
      <TableCell>
        <TextField
          id={`poPrice`}
          variant="outlined"
          size="small"
          defaultValue={
            props.purchaseItem.poPrice
              ? props.purchaseItem.poPrice
              : props.purchaseItem.prPrice
          }
          {...register(`poPrice`, {
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
      <TableCell>
        <TextField
          id={`discount`}
          variant="outlined"
          size="small"
          defaultValue={props.purchaseItem.discount}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          {...register(`discount`, {
            required: "Tidak boleh kosong",
          })}
        />
      </TableCell>
      <TableCell>
        <TextField
          id={`tax`}
          variant="outlined"
          size="small"
          defaultValue={props.purchaseItem.tax}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          {...register(`tax`, {
            required: "Tidak boleh kosong",
          })}
        />
      </TableCell>
      <TableCell></TableCell>
      <TableCell>
        <Chip
          size="small"
          variant="filled"
          color={
            getTotalArrived(props.purchaseItem.productId) == 0
              ? "error"
              : getTotalArrived(props.purchaseItem.productId) >=
                props.purchaseItem.quantity
              ? "success"
              : "warning"
          }
          label={
            getTotalArrived(props.purchaseItem.productId) == 0
              ? "Belum datang"
              : getTotalArrived(props.purchaseItem.productId) ==
                props.purchaseItem.quantity
              ? "Lengkap"
              : getTotalArrived(props.purchaseItem.productId) >
                props.purchaseItem.quantity
              ? `Kelebihan ${
                  getTotalArrived(props.purchaseItem.productId) -
                  props.purchaseItem.quantity
                }`
              : `Kurang ${
                  props.purchaseItem.quantity -
                  getTotalArrived(props.purchaseItem.productId)
                }`
          }
        />
      </TableCell>
      <TableCell align="center">
        <Stack direction="row">
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
