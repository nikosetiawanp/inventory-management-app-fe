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
  TransactionItem,
  Inventory,
  InventoryItem,
  Invoice,
} from "../../interfaces/interfaces";
import AddIcon from "@mui/icons-material/Add";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import RowSkeleton from "../skeletons/RowSkeleton";
import { useEffect, useState } from "react";
import NewInventoryItem from "../rows/NewInventoryItem";
import CreateInvoice from "../buttons/CreateInvoice";
import CreateDebt from "../buttons/CreateDebt";

export default function InvoiceDetailDialog(props: {
  open: boolean;
  setOpen: any;
  invoice: Invoice;
}) {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();

  //   FORM
  const { control, handleSubmit, watch, setValue } = useForm();
  const { fields, append, prepend, update, remove } = useFieldArray({
    control,
    name: "inventoryItems",
  });

  // GET INVENTORY ITEMS
  const getInventoryItems = async () => {
    const response = await axios.get(
      BACKEND_URL + `inventory-items?inventoryId=${props.invoice.inventoryId}`
    );
    return response.data.data;
  };
  const inventoryItemsQuery = useQuery({
    queryKey: [`inventoryItems.${props.invoice.inventoryId}`],
    queryFn: () => getInventoryItems(),
    refetchOnWindowFocus: false,
    enabled: props.open,
  });

  // GET PURCHASE ITEMS
  const getTransactionItems = async () => {
    const response = await axios.get(
      BACKEND_URL +
        `transaction-items?transactionId=${props.invoice?.transactionId}`
    );

    return response.data.data;
  };
  const purchaseItemsQuery = useQuery({
    queryKey: [`purchaseItems.${props.invoice?.transactionId}`],
    queryFn: () => getTransactionItems(),
    refetchOnWindowFocus: false,
    enabled: props.open,
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

  // FORMAT CURRENCY
  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  // FIND PURCHASE ITEM
  const findPurchaseItem = (inventoryItem: InventoryItem) => {
    const foundPurchaseItem: TransactionItem = purchaseItemsQuery?.data?.find(
      (transactionItem: TransactionItem) =>
        transactionItem.productId == inventoryItem.productId
    );

    return foundPurchaseItem;
  };

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

  const calculateSum = (inventoryItems: InventoryItem[]) => {
    if (!inventoryItems) return 0;
    const totals = inventoryItems?.map((inventoryItem: InventoryItem) =>
      calculateTotal(
        inventoryItem.quantity,
        findPurchaseItem(inventoryItem)?.price,
        findPurchaseItem(inventoryItem)?.discount,
        findPurchaseItem(inventoryItem)?.tax
      )
    );

    let sum = 0;
    totals.forEach((price: number) => {
      sum += price;
    });
    return sum;
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
            <Typography variant="h4">{props.invoice?.number}</Typography>
            <Typography variant="body1">
              {formatDate(props.invoice?.inventory.date)}
            </Typography>
            <Typography variant="body1">
              Jatuh tempo : {formatDate(props.invoice?.dueDate)}
            </Typography>
            <Typography variant="body1">
              {props.invoice?.inventory.number}
            </Typography>
          </Stack>
          {/* BUTTONS */}
          <Stack direction="row" gap={2}>
            {/* <Typography>{props.inventory.invoiceNumber}</Typography> */}
            <CreateDebt
              debtAmount={calculateSum(inventoryItemsQuery?.data)}
              invoice={props.invoice}
            />
            {/* <Button variant="contained" onClick={() => {}}>
              Buat Hutang
            </Button> */}
            <MorePurchaseButton />
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

                <TableCell align="right">Harga</TableCell>
                <TableCell align="center">Diskon</TableCell>
                <TableCell align="center">Pajak</TableCell>
                <TableCell align="right">Total</TableCell>
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
              {inventoryItemsQuery.isLoading ? (
                <RowSkeleton rows={15} columns={8} />
              ) : (
                inventoryItemsQuery.data?.map(
                  (inventoryItem: InventoryItem, index: number) => (
                    <TableRow key={index}>
                      {/* PRODUK */}
                      <TableCell>{inventoryItem.product.name}</TableCell>
                      {/* QUANTITY */}
                      <TableCell align="center">
                        {inventoryItem.quantity} {inventoryItem.product.unit}
                      </TableCell>

                      {/* HARGA */}
                      <TableCell align="right">
                        {currencyFormatter.format(
                          findPurchaseItem(inventoryItem)?.price
                        )}
                        {/* {findPurchaseItem(inventoryItem).price
                          ? currencyFormatter.format(
                              findPurchaseItem(inventoryItem).price
                            )
                          : currencyFormatter.format(
                              findPurchaseItem(inventoryItem).price
                            )} */}
                      </TableCell>

                      <TableCell align="center">
                        {findPurchaseItem(inventoryItem).discount}%
                      </TableCell>
                      <TableCell align="center">
                        {findPurchaseItem(inventoryItem).tax}%
                      </TableCell>
                      <TableCell align="right">
                        {currencyFormatter.format(
                          calculateTotal(
                            inventoryItem.quantity,
                            findPurchaseItem(inventoryItem)?.price,
                            findPurchaseItem(inventoryItem)?.discount,
                            findPurchaseItem(inventoryItem)?.tax
                          )
                        )}
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
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
            {currencyFormatter.format(calculateSum(inventoryItemsQuery.data))}
          </Typography>
        </Stack>
      </Stack>
    </Dialog>
  );
}
