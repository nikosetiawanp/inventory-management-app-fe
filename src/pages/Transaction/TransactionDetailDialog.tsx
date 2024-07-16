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
} from "@mui/material";

import { TransactionItem, Transaction } from "../../interfaces/interfaces";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import RowSkeleton from "../../components/skeletons/RowSkeleton";
import { useState } from "react";
import NewTransactionItem from "./NewTransactionItem";
import CreateInvoice from "./CreateInvoice";
import TransactionDetailRow from "./TransactionDetailRow";
import ApprovePurchase from "./ApprovePurchase";
import { calculateNetPrice, sum } from "../../helpers/calculationHelpers";
import { formatIDR } from "../../helpers/currencyHelpers";
import { formatDate } from "../../helpers/dateHelpers";
import MoreTransactionButton from "./MoreTransactionButton";

export default function TransactionDetailDialog(props: {
  open: boolean;
  setOpen: any;
  transaction: Transaction;
  refetch: any;
}) {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();

  //   FORM
  const { control, handleSubmit, watch, setValue } = useForm();
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: "transactionItems",
  });

  // GET ITEMS
  const getTransactionItems = async () => {
    const response = await axios.get(
      BACKEND_URL + `transaction-items?transactionId=${props.transaction.id}`
    );

    return response.data.data;
  };
  const transactionItemsQuery = useQuery({
    queryKey: [`transactionItems.${props.transaction.id}`],
    queryFn: () => getTransactionItems(),
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
      BACKEND_URL + `inventories?transactionId=${props.transaction.id}`
    );

    return response.data.data;
  };
  const inventoriesQuery = useQuery({
    queryKey: ["inventories"],
    queryFn: getInventories,
    refetchOnWindowFocus: false,
    enabled: props.open,
  });

  const arrayOfNetPrice = transactionItemsQuery?.data?.map(
    (transactionItem: TransactionItem) =>
      calculateNetPrice(
        transactionItem?.quantity,
        transactionItem?.price,
        transactionItem?.discount,
        transactionItem?.tax
      )
  );

  const clearFieldsArray = () => {
    for (let i = 0; i < fields.length; i++) {
      if (fields.length > 0) {
        remove(0);
      } else return;
    }
  };

  // POST
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createItems = useMutation(
    async (data: TransactionItem[]) => {
      setIsSubmitting(true);
      try {
        const response = await axios.post(
          BACKEND_URL + "transaction-items/bulk",
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
        queryClient.invalidateQueries(
          `transactionItems.${props.transaction.id}`
        );
      },
    }
  );

  const onSubmit: SubmitHandler<any> = async (data: {
    transactionItems: TransactionItem[];
  }) => {
    try {
      await createItems.mutateAsync(data.transactionItems);
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
              {props.transaction?.number}
            </Typography>
            <Stack direction={"row"} gap={0.5}>
              <Typography variant="body1">Vendor :</Typography>
              <Typography>{props.transaction?.contact?.name}</Typography>
            </Stack>
            <Typography variant="body1">
              {/* Tanggal :  */}
              {formatDate(props.transaction?.date, "DD MMMM YYYY")}
            </Typography>
            {/* <Typography variant="body1">
              Estimasi Kedatangan :{" "}
              {formatDate(props.transaction?.expectedArrival)}
            </Typography> */}
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
                {isSubmitting ? "Menyimpan" : "Simpan"}
              </Button>
            ) : (
              <>
                {props.transaction?.isApproved ? (
                  <>
                    {/* <Button variant="outlined">2 Faktur</Button> */}
                    <CreateInvoice
                      inventories={inventoriesQuery.data}
                      transaction={props.transaction}
                    />
                  </>
                ) : (
                  <ApprovePurchase
                    refetch={props.refetch}
                    transaction={props.transaction}
                  />
                )}
                <MoreTransactionButton />
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
              {transactionItemsQuery.isLoading ? (
                <RowSkeleton rows={15} columns={8} />
              ) : (
                transactionItemsQuery.data?.map(
                  (transactionItem: TransactionItem, index: number) => (
                    <TransactionDetailRow
                      key={index}
                      transactionItem={transactionItem}
                      index={index}
                      transaction={props.transaction}
                      inventories={inventoriesQuery.data}
                    />
                  )
                )
              )}
              {fields.map((field, index) => (
                <NewTransactionItem
                  key={field.id}
                  control={control}
                  update={update}
                  index={index}
                  value={field}
                  remove={remove}
                  products={productsQuery.data}
                  purchase={props.transaction}
                  watch={watch}
                  fields={fields}
                  setValue={setValue}
                />
              ))}
              {!props.transaction?.isApproved && (
                <div>
                  <Button
                    variant="text"
                    onClick={() => {
                      append({
                        quantity: 0,
                        price: "",
                        discount: "",
                        tax: "",
                        transactionId: props.transaction?.id,
                        productId: "",
                      });
                    }}
                  >
                    Tambah Produk
                  </Button>
                </div>
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
            {formatIDR(sum(arrayOfNetPrice))}
          </Typography>
        </Stack>
      </Stack>
    </Dialog>
  );
}
