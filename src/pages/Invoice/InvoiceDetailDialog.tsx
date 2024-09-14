import {
  Stack,
  Typography,
  Table,
  Modal,
  ModalDialog,
  Sheet,
  Divider,
} from "@mui/joy";

import { InventoryItem, Invoice } from "../../interfaces/interfaces";
import CreateDebt from "./CreateDebt";
import { formatIDR } from "../../helpers/currencyHelpers";
import { calculateNetPrice, sum } from "../../helpers/calculationHelpers";
import { formatDate } from "../../helpers/dateHelpers";
import ActionMenu from "./ActionMenu";

export default function InvoiceDetailDialog(props: {
  open: boolean;
  setOpen: any;
  invoice: Invoice;
}) {
  const arrayOfNetPrice = props.invoice?.inventory?.inventoryItems?.map(
    (inventoryItem: InventoryItem) => {
      return calculateNetPrice(
        inventoryItem?.quantity,
        inventoryItem?.transactionItem?.price,
        inventoryItem?.transactionItem?.discount,
        inventoryItem?.transactionItem?.tax
      );
    }
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
              {/* <MoreInvoiceButton /> */}
              <ActionMenu invoice={props.invoice} />
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

                  <th style={{ textAlign: "right" }}>Harga</th>
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

                {props.invoice?.inventory?.inventoryItems?.map(
                  (inventoryItem: InventoryItem, index: number) => (
                    <tr key={index}>
                      {/* PRODUK */}
                      <td>{inventoryItem?.product?.name}</td>
                      {/* QUANTITY */}
                      <td style={{ textAlign: "center" }}>
                        {inventoryItem?.quantity} {inventoryItem?.product?.unit}
                      </td>

                      {/* HARGA */}
                      <td style={{ textAlign: "right" }}>
                        {formatIDR(inventoryItem?.transactionItem?.price)}
                      </td>

                      <td style={{ textAlign: "center" }}>
                        {inventoryItem?.transactionItem?.discount}%
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {inventoryItem?.transactionItem?.tax}%
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {formatIDR(
                          calculateNetPrice(
                            inventoryItem?.quantity,
                            inventoryItem?.transactionItem?.price,
                            inventoryItem?.transactionItem?.discount,
                            inventoryItem?.transactionItem?.tax
                          )
                        )}
                      </td>
                    </tr>
                  )
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
