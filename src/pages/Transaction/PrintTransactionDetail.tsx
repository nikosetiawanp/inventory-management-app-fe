import { Button, Modal, ModalDialog, Stack, Table, Typography } from "@mui/joy";

import PrintIcon from "@mui/icons-material/Print";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Transaction, TransactionItem } from "../../interfaces/interfaces";
import { formatDate } from "../../helpers/dateHelpers";
import { formatIDR } from "../../helpers/currencyHelpers";
import { calculateNetPrice, sum } from "../../helpers/calculationHelpers";

export default function PrintTransactionDetail(props: {
  transaction: Transaction;
  transactionItems: TransactionItem[];
}) {
  const [open, setOpen] = useState(false);
  //   TOTALS
  const arrayOfNetPrice = props.transactionItems?.map(
    (transactionItem: TransactionItem) =>
      calculateNetPrice(
        transactionItem?.quantity,
        transactionItem?.price,
        transactionItem?.discount,
        transactionItem?.tax
      )
  );

  // PRINT
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <>
      <Button
        variant="solid"
        color="primary"
        size="md"
        onClick={() => setOpen(true)}
        disabled={props.transactionItems?.length == 0}
        startDecorator={<PrintIcon fontSize="small" />}
      >
        Cetak
      </Button>

      {/* MODAL */}
      <Modal
        aria-labelledby="close-modal-title"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ModalDialog
          size="sm"
          sx={{
            height: 1,
            maxHeight: "90vh",
            maxWidth: "70vw",
            padding: 4,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography level="title-lg">
              <b>Preview</b>
            </Typography>
            <Button
              variant="solid"
              color="primary"
              size="md"
              onClick={handlePrint}
              startDecorator={<PrintIcon fontSize="small" />}
            >
              Cetak
            </Button>
          </Stack>

          <Stack
            border={1}
            borderColor={"divider"}
            borderRadius={2}
            overflow={"scroll"}
          >
            <Stack
              height={1}
              spacing={4}
              ref={printRef}
              sx={{
                width: "210mm", // A4 paper width
                maxWidth: "100%", // Ensure it fits on smaller screens
                padding: 2,
              }}
            >
              {/* HEADER & TITLE */}
              <Stack alignItems="center">
                <Typography>
                  <b>
                    {props.transaction?.type == "P"
                      ? "Purchase Order"
                      : "Sales Order"}
                  </b>
                </Typography>
                <Typography
                  component="h3"
                  id="close-modal-title"
                  level="h4"
                  color="primary"
                  fontWeight="lg"
                >
                  {props.transaction?.type == "P"
                    ? "Laporan Pembelian"
                    : "Laporan Penjualan"}
                </Typography>
                <Typography color="danger">
                  <b>{formatDate(props.transaction?.date, "DD MMMM YYYY")}</b>
                </Typography>
              </Stack>

              {/* DATA */}
              <Stack spacing={4} height={1}>
                <Table size="sm">
                  <thead>
                    <tr>
                      <th style={{ fontSize: "12px" }}>Produk </th>
                      <th style={{ fontSize: "12px", textAlign: "center" }}>
                        Quantity{" "}
                      </th>
                      <th style={{ fontSize: "12px" }}>Harga </th>
                      <th style={{ fontSize: "12px", textAlign: "center" }}>
                        Diskon{" "}
                      </th>
                      <th style={{ fontSize: "12px", textAlign: "center" }}>
                        Pajak{" "}
                      </th>
                      <th style={{ fontSize: "12px", textAlign: "right" }}>
                        Total{" "}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.transactionItems?.map(
                      (transactionItem: TransactionItem) => {
                        return (
                          <tr>
                            <td style={{ fontSize: "12px" }}>
                              {transactionItem?.product?.name}
                            </td>
                            <td
                              style={{ fontSize: "12px", textAlign: "center" }}
                            >
                              {transactionItem?.quantity}{" "}
                              {transactionItem?.product?.unit}
                            </td>
                            <td style={{ fontSize: "12px" }}>
                              {formatIDR(transactionItem?.price)}
                            </td>
                            <td
                              style={{ fontSize: "12px", textAlign: "center" }}
                            >
                              {transactionItem?.discount}%
                            </td>
                            <td
                              style={{ fontSize: "12px", textAlign: "center" }}
                            >
                              {transactionItem?.tax}%
                            </td>
                            <td
                              style={{ fontSize: "12px", textAlign: "right" }}
                            >
                              <b>
                                {formatIDR(
                                  calculateNetPrice(
                                    transactionItem.quantity,
                                    transactionItem.price,
                                    transactionItem.discount,
                                    transactionItem.tax
                                  )
                                )}
                              </b>
                            </td>
                          </tr>
                        );
                      }
                    )}
                    <tr>
                      <td style={{ fontSize: "12px" }}>
                        <b>Total</b>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td style={{ fontSize: "12px", textAlign: "right" }}>
                        <b>{formatIDR(sum(arrayOfNetPrice))}</b>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Stack>
            </Stack>
          </Stack>
        </ModalDialog>
      </Modal>
    </>
  );
}
