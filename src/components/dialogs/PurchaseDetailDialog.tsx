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
} from "@mui/material";
import MorePurchaseButton from "../buttons/MorePurchaseButton";

import {
  PurchaseItem,
  Product,
  Purchase,
  Inventory,
  InventoryItem,
} from "../../interfaces/interfaces";
import AddIcon from "@mui/icons-material/Add";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import MoveToPurchaseOrder from "../buttons/MoveToPurchaseOrder";
import RowSkeleton from "../skeletons/RowSkeleton";
import { useEffect, useState } from "react";
import NewPurchaseItem from "../rows/NewPurchaseItem";
import CreateInvoice from "../buttons/CreateInvoice";
import PurchaseDetailRow from "../rows/PurchaseDetailRow";

export default function PurchaseDetailDialog(props: {
  open: boolean;
  setOpen: any;
  purchase: Purchase;
  refetch: any;
}) {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();

  //   FORM
  const { control, handleSubmit, watch, setValue } = useForm();
  const { fields, append, prepend, update, remove } = useFieldArray({
    control,
    name: "purchaseItems",
  });

  // GET ITEMS
  const getPurchaseItems = async () => {
    const response = await axios.get(
      BACKEND_URL + `purchase-items?purchaseId=${props.purchase.id}`
    );
    return response.data.data;
  };
  const purchaseItemsQuery = useQuery({
    queryKey: [`purchaseItems.${props.purchase.id}`],
    queryFn: () => getPurchaseItems(),
    refetchOnWindowFocus: false,
    enabled: props.open,
  });

  // GET PRODUCTS
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

  // GET INVENTORIES
  const getInventories = async () => {
    const response = await axios.get(
      BACKEND_URL + `inventories?purchaseId=${props.purchase.id}`
    );

    console.log(response.data.data);

    return response.data.data;
  };
  const inventoriesQuery = useQuery({
    queryKey: ["inventories"],
    queryFn: getInventories,
    refetchOnWindowFocus: false,
    enabled: props.open,
  });

  // const getTotalArrived = (productId: any) => {
  //   const inventoryItems = inventoriesQuery?.data?.map(
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

  useEffect(() => {
    // console.log(inventoryItems);
  }, [inventoriesQuery.isLoading]);

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

  const calculateSum = (items: PurchaseItem[]) => {
    if (!items) return 0;
    const totals = items?.map((item: PurchaseItem) =>
      calculateTotal(item.quantity, item.prPrice, item.discount, item.tax)
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
    async (data: PurchaseItem[]) => {
      setIsSubmitting(true);
      try {
        const response = await axios.post(
          BACKEND_URL + "purchase-items/bulk",
          data
        );
        setIsSubmitting(false);
        return response.data;
      } catch (error) {
        setIsSubmitting(false);
        throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`purchaseItems.${props.purchase.id}`);
      },
    }
  );

  const onSubmit: SubmitHandler<any> = async (
    data: { purchaseItems: PurchaseItem[] },
    event
  ) => {
    try {
      console.log(data.purchaseItems);
      await createItems.mutateAsync(data.purchaseItems);
      clearFieldsArray();
    } catch (error) {
      console.log("Mutation Error:", error);
    }
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
            {props.purchase.status == "PR" && fields.length == 0 ? (
              <MoveToPurchaseOrder
                purchase={props.purchase}
                refetch={props.refetch}
              />
            ) : null}

            {props.purchase.status == "PO" && fields.length == 0 ? (
              <CreateInvoice inventory={inventoriesQuery.data} />
            ) : null}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => {
                append({
                  quantity: 0,
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

            {/* SAVE BUTTON */}

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
                {/* <TableCell align="center">Unit</TableCell> */}
                <TableCell align="right" width={100}>
                  Harga PR
                </TableCell>

                {props.purchase.status == "PO" ? (
                  <TableCell align="right" width={100}>
                    Harga PO
                  </TableCell>
                ) : null}

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
              {purchaseItemsQuery.isLoading ? (
                <RowSkeleton
                  rows={15}
                  columns={props.purchase.status == "PR" ? 8 : 9}
                />
              ) : (
                purchaseItemsQuery.data?.map(
                  (purchaseItem: PurchaseItem, index: number) => (
                    <PurchaseDetailRow
                      key={index}
                      purchaseItem={purchaseItem}
                      index={index}
                      purchase={props.purchase}
                      inventories={inventoriesQuery.data}
                    />
                    // <TableRow key={index}>
                    //   <TableCell>{item.product.name}</TableCell>

                    //   <TableCell align="center">
                    //     {item.quantity} {item.product.unit}
                    //   </TableCell>
                    //   {/* <TableCell align="center">pcs</TableCell> */}
                    //   <TableCell align="right">
                    //     {currencyFormatter.format(item.prPrice)}
                    //   </TableCell>
                    //   <TableCell align="center">
                    //     {item.poPrice
                    //       ? currencyFormatter.format(item.poPrice)
                    //       : currencyFormatter.format(item.prPrice)}
                    //   </TableCell>

                    //   <TableCell align="center">{item.discount}%</TableCell>
                    //   <TableCell align="center">{item.tax}%</TableCell>
                    //   <TableCell align="right">
                    //     {currencyFormatter.format(
                    //       calculateTotal(
                    //         item.quantity,
                    //         item.prPrice,
                    //         item.discount,
                    //         item.tax
                    //       )
                    //     )}
                    //   </TableCell>

                    //   {props.purchase.status == "PO" ? (
                    //     <TableCell align="center">
                    //       <Chip
                    //         size="small"
                    //         variant="filled"
                    //         color={
                    //           getTotalArrived(item.productId) == 0
                    //             ? "error"
                    //             : getTotalArrived(item.productId) >=
                    //               item.quantity
                    //             ? "success"
                    //             : "warning"
                    //         }
                    //         label={
                    //           getTotalArrived(item.productId) == 0
                    //             ? "Belum datang"
                    //             : getTotalArrived(item.productId) ==
                    //               item.quantity
                    //             ? "Lengkap"
                    //             : getTotalArrived(item.productId) >
                    //               item.quantity
                    //             ? `Kelebihan ${
                    //                 getTotalArrived(item.productId) -
                    //                 item.quantity
                    //               }`
                    //             : `Kurang ${
                    //                 item.quantity -
                    //                 getTotalArrived(item.productId)
                    //               }`
                    //         }
                    //       />
                    //     </TableCell>
                    //   ) : null}

                    //   <TableCell align="center">
                    //     <MoreVert fontSize="small" />
                    //   </TableCell>
                    // </TableRow>
                  )
                )
              )}
              {fields.map((field, index) => (
                <NewPurchaseItem
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
                  setValue={setValue}
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
            {currencyFormatter.format(
              calculateSum(purchaseItemsQuery.data as any)
            )}
          </Typography>
        </Stack>
      </Stack>
    </Dialog>
  );
}
