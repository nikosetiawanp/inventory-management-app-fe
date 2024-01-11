import { MoreVert, Settings } from "@mui/icons-material";
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
  Chip,
  Autocomplete,
  Box,
  InputAdornment,
  TextField,
} from "@mui/material";
import MorePurchaseButton from "../buttons/MorePurchaseButton";

import { Item, Product, Purchase } from "../../interfaces/interfaces";
import AddIcon from "@mui/icons-material/Add";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import MoveToPurchaseOrder from "../buttons/MoveToPurchaseOrder";
import RowSkeleton from "../skeletons/RowSkeleton";
import { useEffect, useState } from "react";
import NewItem from "../rows/NewItem";
import { ClearIcon } from "@mui/x-date-pickers";

export default function PurchaseDetailDialog(props: {
  open: boolean;
  setOpen: any;
  purchase: Purchase;
  refetch: any;
}) {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();

  //   FORM
  const { control, handleSubmit, watch } = useForm();
  const { fields, append, prepend, update, remove } = useFieldArray({
    control,
    name: "items",
  });

  // GET ITEMS
  const getItems = async () => {
    const response = await axios.get(
      BACKEND_URL + `items?purchaseId=${props.purchase.id}`
    );
    return response.data.data;
  };
  const { isLoading, error, data } = useQuery({
    queryKey: [`items.${props.purchase.id}`],
    queryFn: () => getItems(),
    refetchOnWindowFocus: false,
    enabled: props.open,
  });

  // GET VENDORS
  const getProducts = async () => {
    const response = await axios.get(BACKEND_URL + `products`);
    return response.data.data;
  };

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    refetchOnWindowFocus: false,
    enabled: fields?.length > 0,
  });

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
    if (!items) return 0;

    const totals = items?.map((item: Item) =>
      calculateTotal(item.quantity, item.price, item.discount, item.tax)
    );
    let sum = 0;

    totals.forEach((price: number) => {
      sum += price;
    });
    return sum;
  };

  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  const clearFieldsArray = () => {
    for (let i = 0; i < fields.length; i++) {
      if (fields.length > 0) {
        remove(0);
      } else return;
    }
  };
  // FORMAT DATE
  const formatDate = (inputDate: string) => {
    const date = new Date(inputDate);
    const options: any = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    const formattedDate = date.toLocaleDateString("id-ID", options);
    const [day, month, year] = formattedDate.split(" ");
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const monthIndex = monthNames.indexOf(month);
    if (monthIndex !== -1) {
      const indonesianMonth = monthNames[monthIndex];
      return `${day} ${indonesianMonth} ${year}`;
    }

    return formattedDate;
  };

  // POST
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createItems = useMutation(
    async (data: Product) => {
      setIsSubmitting(true);
      try {
        const response = await axios.post(BACKEND_URL + "items/bulk", data);
        setIsSubmitting(false);
        return response.data;
      } catch (error) {
        setIsSubmitting(false);
        throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`items.${props.purchase.id}`);
      },
    }
  );

  const onSubmit: SubmitHandler<Item> = async (data: { items: any }, event) => {
    try {
      console.log(data);

      await createItems.mutateAsync(data.items);
      clearFieldsArray();
    } catch (error) {
      console.log("Mutation Error:", error);
    }
  };

  useEffect(() => {
    // console.log(fields);
  }, []);

  const NewItem2 = ({ update, index, value, control }: any) => {
    const { register, setValue, watch } = control;
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
      null
    );

    return (
      <TableRow>
        {/* PRODUCT */}
        <TableCell>
          <Autocomplete
            id={`items[${index}].productId`}
            autoHighlight
            options={productsQuery.data ? productsQuery.data : []}
            getOptionLabel={(option: Product) => `${option.id}`}
            value={selectedProduct}
            onChange={(event, value) => {
              setSelectedProduct(value);
            }}
            renderOption={(props, option) => (
              <Box
                component="li"
                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                {...props}
              >
                <Typography variant="body2">
                  {option.code} - {option.name}
                </Typography>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                }}
                {...register(`items[${index}].productId`, {
                  required: "Tidak boleh kosong",
                })}
                required
                size="small"
              />
            )}
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
        {props.purchase.status == "PO" ? (
          <TableCell align="right"></TableCell>
        ) : null}
        {/* REMOVE */}
        <TableCell></TableCell>
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
            <Typography variant="h4">
              {props.purchase.status == "PR"
                ? props.purchase.prNumber
                : props.purchase.poNumber}
            </Typography>
            <Typography variant="body1">
              {props.purchase.status == "PR"
                ? formatDate(props.purchase.prDate)
                : formatDate(props.purchase.poDate)}
            </Typography>
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
              <Button
                variant="contained"
                onClick={handleSubmit(onSubmit as any)}
                type="submit"
                disabled={isSubmitting}
                sx={{ minHeight: "100%" }}
              >
                {isSubmitting
                  ? "Menyimpan"
                  : // <CircularProgress color="inherit" size={15} />
                    "Simpan"}
              </Button>
            ) : (
              <>
                {props.purchase.status == "PR" ? (
                  <MoveToPurchaseOrder
                    purchase={props.purchase}
                    refetch={props.refetch}
                  />
                ) : null}

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
                {props.purchase.status == "PO" ? (
                  <TableCell align="center">Status</TableCell>
                ) : null}
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

              {isLoading ? (
                <RowSkeleton
                  rows={15}
                  columns={props.purchase.status == "PR" ? 8 : 9}
                />
              ) : (
                data?.map((item: Item, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{item.product.name}</TableCell>

                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="center">pcs</TableCell>
                    <TableCell align="right">
                      {currencyFormatter.format(item.price)}
                    </TableCell>

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

                    {props.purchase.status == "PO" ? (
                      <TableCell align="center">
                        <Chip
                          size="small"
                          variant="filled"
                          color="error"
                          label="Pending"
                        />
                      </TableCell>
                    ) : null}

                    <TableCell align="center">
                      <MoreVert fontSize="small" />
                    </TableCell>
                  </TableRow>
                ))
              )}
              {fields.map((field, index) => (
                <NewItem
                  key={field.id}
                  control={control}
                  update={update}
                  index={index}
                  value={field}
                  remove={remove}
                  products={productsQuery.data}
                  purchase={props.purchase}
                  watch={watch}
                  fields={fields}
                />
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
            {currencyFormatter.format(calculateSum(data))}
          </Typography>
        </Stack>
      </Stack>
    </Dialog>
  );
}
