import { Settings } from "@mui/icons-material";
import {
  Dialog,
  Stack,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  IconButton,
  TableBody,
  InputAdornment,
  TextField,
} from "@mui/material";
import MorePurchaseButton from "../buttons/MorePurchaseButton";
import NewItemRow from "../rows/NewItemRow";
import { Item, Product, Purchase } from "../../interfaces/interfaces";
import AddIcon from "@mui/icons-material/Add";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { ClearIcon } from "@mui/x-date-pickers";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

export default function PurchaseDetailDialog(props: {
  open: boolean;
  setOpen: any;
  purchase: Purchase;
}) {
  // TOTAL PRICE
  const calculateTotal = (
    quantity: number,
    price: number,
    discount: number,
    tax: number
  ) => {
    const priceTotal = quantity * price;
    const discountTotal = priceTotal * (discount / 100);
    const taxTotal = priceTotal * (tax / 100);

    const result = priceTotal - discountTotal + taxTotal;
    return result;
  };

  const calculateSum = (items: Item[]) => {
    const totals = items.map((item) =>
      calculateTotal(item.quantity, item.price, item.discount, item.tax)
    );
    let sum = 0;

    totals.forEach((price) => {
      sum += price;
    });

    return sum;
  };

  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  //   FORM
  const { control, handleSubmit, reset } = useForm();
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: "items",
  });

  const clearFieldsArray = () => {};

  // POST
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();
  const createItems = useMutation(
    async (data: Product) => {
      try {
        const response = await axios.post(BACKEND_URL + "items/bulk", data);
        return response.data;
      } catch (error) {
        throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("purchase");
      },
    }
  );

  const { isLoading } = createItems;

  const onSubmit: SubmitHandler<Item> = async (data, event) => {
    try {
      await createItems.mutateAsync(data.items);
      alert("saved");
    } catch (error) {
      console.log("Mutation Error:", error);
    }
  };

  const NewItem = ({ update, index, value, control }: any) => {
    const { register } = control;

    return (
      <TableRow>
        {/* PRODUCT */}
        <TableCell>
          <TextField
            id={`items[${index}].productId`}
            variant="outlined"
            size="small"
            {...register(`items[${index}].productId`, {
              required: "Tidak boleh kosong",
            })}
            // error={!!errors?.[`items[${index}].productId`]}
            //             helperText={errors?.[`items[${index}].productId`]?.message}
          />
        </TableCell>
        {/* QUANTITY */}
        <TableCell width={75}>
          <TextField
            id={`items[${index}].quantity`}
            variant="outlined"
            size="small"
            {...register(`items[${index}].quantity`, {
              required: "Tidak boleh kosong",
            })}
          />
        </TableCell>
        {/* UNIT */}
        <TableCell align="center">kg</TableCell>
        {/* PRICE */}
        <TableCell width={200}>
          <TextField
            id={`items[${index}].price`}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Rp</InputAdornment>
              ),
            }}
            {...register(`items[${index}].price`, {
              required: "Tidak boleh kosong",
            })}
          />
        </TableCell>
        {/* DISCOUNT */}
        <TableCell width={80}>
          <TextField
            id={`items[${index}].discount`}
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            {...register(`items[${index}].discount`, {
              required: "Tidak boleh kosong",
            })}
          />
        </TableCell>
        {/* TAX */}
        <TableCell width={80}>
          <TextField
            id={`items[${index}].tax`}
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            {...register(`items[${index}].tax`, {
              required: "Tidak boleh kosong",
            })}
          />
        </TableCell>
        {/* TOTAL */}
        <TableCell align="right"></TableCell>
        {/* REMOVE */}
        <TableCell width={10}>
          <IconButton size="small" onClick={() => remove(index)}>
            <ClearIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Dialog
      open={props.open}
      onClose={() => props.setOpen(false)}
      fullWidth
      maxWidth={"lg"}
    >
      <Stack padding={3}>
        {/* HEADER */}
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          marginBottom={2}
        >
          {/* TITLE */}
          <Stack>
            <Typography variant="h4">{props.purchase.prNumber}</Typography>
            <Typography variant="body1">{props.purchase.prDate}</Typography>
            <Typography variant="body1">
              {props.purchase.vendor.name}
            </Typography>
          </Stack>
          {/* BUTTONS */}
          <Stack direction="row" alignItems={"center"} gap={2}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => {
                append({
                  quantity: "",
                  price: "",
                  discount: "",
                  tax: "",
                  purchaseId: props.purchase.id,
                  productId: "",
                });
              }}
            >
              Tambah Item
            </Button>
            {fields.length > 0 ? (
              <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                Simpan
              </Button>
            ) : (
              <>
                <Button variant="outlined">Pindahkan ke PO</Button>
                <MorePurchaseButton />
              </>
            )}
          </Stack>
        </Stack>

        {/* TABLE */}
        <TableContainer
          sx={{
            backgroundColor: "white",
            height: 500,
          }}
        >
          <Table stickyHeader>
            {/* TABLE HEAD */}
            <TableHead
              sx={{
                position: "sticky",
                backgroundColor: "white",
                top: 0,
                borderBottom: 1,
                borderColor: "divider",
                zIndex: 50,
              }}
            >
              <TableRow>
                <TableCell>Produk</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="center">Unit</TableCell>
                <TableCell align="right" width={100}>
                  Harga
                </TableCell>
                <TableCell align="center">Diskon</TableCell>
                <TableCell align="center">Pajak</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell width={10}>
                  <IconButton size="small">
                    <Settings fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody
              sx={{
                position: "sticky",
                backgroundColor: "white",
                borderColor: "divider",
                width: 1,
                overflowY: "scroll",
                maxHeight: 100,
              }}
            >
              {/* NEW ITEM */}
              {fields.map((field, index) => (
                <NewItem
                  key={field.id}
                  control={control}
                  update={update}
                  index={index}
                  value={field}
                />
              ))}

              {props.purchase.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.product.name}</TableCell>

                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="center">pcs</TableCell>
                  <TableCell align="right">
                    {currencyFormatter.format(item.price)}
                  </TableCell>

                  {/* <EditableCell /> */}
                  <TableCell align="center">{item.discount}%</TableCell>
                  <TableCell align="center">{item.tax}%</TableCell>
                  <TableCell align="right">
                    {currencyFormatter.format(
                      calculateTotal(
                        item.quantity,
                        item.price,
                        item.discount,
                        item.tax
                      )
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* FOOTER */}
        <Stack
          position={"sticky"}
          bottom={0}
          direction={"row"}
          justifyContent={"space-between"}
          bgcolor={"white"}
          padding={2}
          borderTop={1}
          borderColor={"divider"}
        >
          <Typography fontWeight={"bold"} variant="body1">
            Total
          </Typography>
          <Typography fontWeight={"bold"} variant="body1">
            {currencyFormatter.format(calculateSum(props.purchase.items))}
          </Typography>
        </Stack>
      </Stack>
    </Dialog>
  );
}
