import {
  Stack,
  Typography,
  Button,
  Table,
  Modal,
  ModalDialog,
  Sheet,
  Divider,
  Chip,
} from "@mui/joy";

import { TransactionItem, Transaction } from "../../interfaces/interfaces";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import RowSkeleton from "../../components/skeletons/RowSkeleton";
import NewTransactionItem from "./NewTransactionItem";
import CreateInvoice from "./CreateInvoice";
import TransactionDetailRow from "./TransactionDetailRow";
import { calculateNetPrice, sum } from "../../helpers/calculationHelpers";
import { formatIDR } from "../../helpers/currencyHelpers";
import { formatDate } from "../../helpers/dateHelpers";
import PrintTransactionDetail from "./PrintTransactionDetail";
import UpdateTransactionStatus from "./UpdateTransactionStatus";
import ActionMenu from "./ActionMenu";
import { useNotification } from "../../App";

export default function TransactionDetailDialog(props: {
  open: boolean;
  setOpen: any;
  transaction: Transaction;
  refetch: any;
}) {
  const { triggerAlert } = useNotification();
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
  const createTransactionItems = useMutation(
    async (data: TransactionItem[]) => {
      try {
        const response = await axios.post(
          BACKEND_URL + "transaction-items/bulk",
          data
        );
        triggerAlert({ message: "Data berhasil disimpan", color: "success" });
        return response.data;
      } catch (error: any) {
        console.log(error);
        triggerAlert({ message: `Error: ${error.message}`, color: "danger" });
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
      await createTransactionItems.mutateAsync(data.transactionItems);
      clearFieldsArray();
    } catch (error) {
      console.log("Mutation Error:", error);
    }
  };

  const purchaseTitle = props.transaction?.isDone
    ? "Pembelian"
    : "Purchase Order";

  const salesTitle = props.transaction?.isDone ? "Penjualan" : "Sales Order";

  return (
    <Modal open={props.open} onClose={() => props.setOpen(false)}>
      <ModalDialog
        size="sm"
        sx={{ height: 1, width: 1, maxHeight: "90vh", maxWidth: "70vw" }}
      >
        <Stack height={1} padding={2}>
          {/* HEADER */}
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            marginBottom={2}
          >
            {/* TITLE */}
            <Stack>
              <Typography level="body-md">
                {props.transaction?.type == "P" ? purchaseTitle : salesTitle}
              </Typography>
              <Typography level="h4" fontWeight="bold">
                {props.transaction?.number}
              </Typography>
              <Stack direction={"row"} gap={0.5}>
                <Typography level="body-sm">
                  {props.transaction?.type == "P" ? "Vendor" : "Customer"} :{" "}
                  <b> {props.transaction?.contact?.name}</b>
                </Typography>
              </Stack>
              <Typography level="body-sm">
                Tanggal :{" "}
                <b>{formatDate(props.transaction?.date, "DD MMMM YYYY")}</b>
              </Typography>
              <Stack direction={"row"} spacing={1}>
                {props.transaction?.isApproved ? (
                  <Chip color="warning">Ongoing</Chip>
                ) : (
                  <Chip color="neutral">Pending</Chip>
                )}
              </Stack>
            </Stack>

            {/* BUTTONS */}
            <Stack direction="row" alignItems={"center"} gap={2}>
              {/* SAVE BUTTON */}
              {fields.length > 0 ? (
                <Button
                  variant="solid"
                  onClick={handleSubmit(onSubmit as any)}
                  type="submit"
                  loading={createTransactionItems?.isLoading}
                  sx={{ minHeight: "100%" }}
                >
                  Simpan
                </Button>
              ) : (
                <>
                  {props.transaction?.isApproved ? (
                    <CreateInvoice
                      inventories={inventoriesQuery.data}
                      transaction={props.transaction}
                    />
                  ) : (
                    ""
                  )}
                  <UpdateTransactionStatus
                    refetch={props.refetch}
                    transaction={props.transaction}
                    purpose={
                      !props.transaction?.isApproved &&
                      !props.transaction?.isDone
                        ? "approve"
                        : "complete"
                    }
                    dialogOpen={props.open}
                    setDialogOpen={props.setOpen}
                  />
                  <PrintTransactionDetail
                    transaction={props.transaction}
                    transactionItems={transactionItemsQuery?.data}
                  />
                  <ActionMenu transaction={props.transaction} />
                  {/* <MoreTransactionButton /> */}
                </>
              )}
            </Stack>
          </Stack>

          {/* TABLE */}
          <Sheet
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "auto",
              height: 1,
              width: 1,
            }}
          >
            <Table size="sm" stickyHeader stickyFooter>
              {/* TABLE HEAD */}
              <thead>
                <tr style={{ overflowX: "scroll" }}>
                  <th>Produk</th>
                  <th style={{ textAlign: "center", width: 100 }}>Quantity</th>
                  <th style={{ textAlign: "center", width: 100 }}>Datang</th>

                  <th style={{ textAlign: "right" }}>Harga</th>

                  <th style={{ textAlign: "center", width: 100 }}>Diskon</th>
                  <th style={{ textAlign: "center", width: 100 }}>Pajak</th>
                  <th style={{ textAlign: "right" }}>Total</th>

                  <th style={{ textAlign: "center", width: 50 }}></th>
                </tr>
              </thead>

              <tbody
                style={{
                  position: "sticky",
                  borderColor: "divider",
                  width: 1,
                  height: 1,
                  overflow: "scroll",
                  backgroundColor: "transparent",
                }}
              >
                {/* TRANSACTION ITEMS */}
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
                  <Button
                    variant="plain"
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
                )}
              </tbody>
            </Table>
            <Divider sx={{ marginTop: "auto" }} />
            <Sheet
              sx={{
                display: "flex",
                justifyContent: "space-between",
                borderColor: "neutral",
                paddingTop: 2,
                // borderTop: 1,
              }}
            >
              <h3>Total</h3>
              <h3>{formatIDR(sum(arrayOfNetPrice))}</h3>
            </Sheet>
          </Sheet>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
