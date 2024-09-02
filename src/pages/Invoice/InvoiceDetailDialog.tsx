import {
  Stack,
  Typography,
  Table,
  Modal,
  ModalDialog,
  Sheet,
  Divider,
} from "@mui/joy";

import {
  TransactionItem,
  InventoryItem,
  Invoice,
} from "../../interfaces/interfaces";
import { useQuery } from "react-query";
import axios from "axios";
import RowSkeleton from "../../components/skeletons/RowSkeleton";

import CreateDebt from "./CreateDebt";
import { formatIDR } from "../../helpers/currencyHelpers";
import { calculateNetPrice, sum } from "../../helpers/calculationHelpers";
import MoreInvoiceButton from "./MoreInvoiceButton";
import { formatDate } from "../../helpers/dateHelpers";

export default function InvoiceDetailDialog(props: {
  open: boolean;
  setOpen: any;
  invoice: Invoice;
}) {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";

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
    console.log(response.data.data);

    return response.data.data;
  };
  const transactionItemsQuery = useQuery({
    queryKey: [`purchaseItems.${props.invoice?.transactionId}`],
    queryFn: () => getTransactionItems(),
    refetchOnWindowFocus: false,
    enabled: props.open,
  });

  const mergedArray =
    transactionItemsQuery?.data?.map((transactionItem: TransactionItem) => {
      const arrivedQuantity =
        inventoryItemsQuery?.data?.find(
          (inventoryItem: InventoryItem) =>
            inventoryItem?.productId == transactionItem?.productId
        )?.quantity || 0;

      return { ...transactionItem, arrivedQuantity };
    }) || transactionItemsQuery?.data;

  const arrayOfNetPrice = mergedArray?.map((item: TransactionItem) =>
    calculateNetPrice(
      item?.arrivedQuantity,
      item?.price,
      item?.discount,
      item?.tax
    )
  );

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
              <Typography level="h4" fontWeight="bold">
                {props.invoice?.number}
              </Typography>
              <Typography level="body-sm">
                Tanggal Faktur :{" "}
                <b>
                  {formatDate(props.invoice?.inventory.date, "DD MMMM YYYY")}
                </b>
              </Typography>
              <Typography level="body-sm">
                Tanggal Jatuh tempo :{" "}
                <b>{formatDate(props.invoice?.dueDate, "DD MMMM YYYY")}</b>
              </Typography>
              <Typography level="body-sm">
                {props.invoice.transaction.type == "P"
                  ? "Nomor PO"
                  : "Nomor SO"}{" "}
                : <b>{props.invoice.transaction.number}</b>
              </Typography>
              <Typography level="body-sm">
                Nomor Surat Jalan : <b>{props.invoice?.inventory.number}</b>
              </Typography>
            </Stack>
            {/* BUTTONS */}
            <Stack direction="row" gap={2}>
              {/* <Typography>{props.inventory.invoiceNumber}</Typography> */}
              <CreateDebt
                debtAmount={sum(arrayOfNetPrice)}
                invoice={props.invoice}
                type={props.invoice?.transaction?.type}
              />
              {/* <Button variant="contained" onClick={() => {}}>
              Buat Hutang
            </Button> */}
              <MoreInvoiceButton />
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
                <tr>
                  <th>Produk</th>
                  <th style={{ textAlign: "center" }}>Quantity</th>

                  <th>Harga</th>
                  <th style={{ textAlign: "center" }}>Diskon</th>
                  <th style={{ textAlign: "center" }}>Pajak</th>
                  <th style={{ textAlign: "right" }}>Total</th>
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
                {/* NEW ITEM */}
                {inventoryItemsQuery.isLoading ? (
                  <RowSkeleton rows={15} columns={8} />
                ) : (
                  mergedArray?.map((item: TransactionItem, index: number) => (
                    <tr key={index}>
                      {/* PRODUK */}
                      <td>{item.product.name}</td>
                      {/* QUANTITY */}
                      <td style={{ textAlign: "center" }}>
                        {item.arrivedQuantity} {item.product.unit}
                      </td>

                      {/* HARGA */}
                      <td style={{}}>{formatIDR(item.price)}</td>

                      <td style={{ textAlign: "center" }}>{item.discount}%</td>
                      <td style={{ textAlign: "center" }}>{item.tax}%</td>
                      <td style={{ textAlign: "right" }}>
                        {formatIDR(
                          calculateNetPrice(
                            item.arrivedQuantity,
                            item.price,
                            item.discount,
                            item.tax
                          )
                        )}
                      </td>
                    </tr>
                  ))
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

          {/* FOOTER */}
          {/* <Stack
            position={"sticky"}
            bottom={0}
            direction={"row"}
            justifyContent={"space-between"}
            bgcolor={"white"}
            padding={2}
            borderTop={1}
            borderColor={"divider"}
          >
            <Typography fontWeight={"bold"} level="body-sm">
              Total
            </Typography>
            <Typography fontWeight={"bold"} level="body-sm">
              {formatIDR(sum(inventoryItemsQuery.data))}
            </Typography>
          </Stack> */}
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
