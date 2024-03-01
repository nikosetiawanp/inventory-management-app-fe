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
import RowSkeleton from "../skeletons/RowSkeleton";
import { useEffect, useState } from "react";
import NewPurchaseItem from "../rows/NewPurchaseItem";
import CreateInvoice from "../buttons/CreateInvoice";
import PurchaseDetailRow from "../rows/PurchaseDetailRow";
import ApprovePurchase from "../buttons/ApprovePurchase";

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

  const calculateSum = (purchaseItems: PurchaseItem[]) => {
    if (!purchaseItems) return 0;
    const totals = purchaseItems?.map((item: PurchaseItem) =>
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
            <Typography variant="body1">Purchase Order</Typography>
            <Typography variant="h3" fontWeight="bold">
              {props.purchase.number}
            </Typography>
            <Stack direction={"row"} gap={0.5}>
              <Typography variant="body1">Vendor :</Typography>
              <Typography>{props.purchase.contact.name}</Typography>
            </Stack>
            <Typography variant="body1">
              Tanggal : {formatDate(props.purchase.date)}
            </Typography>
            <Typography variant="body1">
              Estimasi Kedatangan : {formatDate(props.purchase.expectedArrival)}
            </Typography>
          </Stack>

          {/* BUTTONS */}
          <Stack direction="row" alignItems={"center"} gap={2}>
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
                {props.purchase.isApproved ? (
                  <CreateInvoice
                    inventories={inventoriesQuery.data}
                    purchase={props.purchase}
                  />
                ) : (
                  <ApprovePurchase
                    refetch={props.refetch}
                    purchase={props.purchase}
                  />
                )}
                {/* <MorePurchaseButton /> */}
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
          <Table stickyHeader size="small">
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
                <TableCell align="center">Datang</TableCell>

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
              {purchaseItemsQuery.isLoading ? (
                <RowSkeleton rows={15} columns={8} />
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
              {/* <TableRow> */}
              <Button
                variant="text"
                // startIcon={<AddIcon />}
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
                Tambah Produk
              </Button>
              {/* </TableRow> */}
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
