import { Button, Modal, ModalDialog, Stack, Table, Typography } from "@mui/joy";
import { useRef, useState } from "react";
import { formatDate } from "../../helpers/dateHelpers";
import PrintIcon from "@mui/icons-material/Print";
import { useReactToPrint } from "react-to-print";
import { Transaction, TransactionItem } from "../../interfaces/interfaces";
import { calculateNetPrice, sum } from "../../helpers/calculationHelpers";
import { formatIDR } from "../../helpers/currencyHelpers";
import React from "react";

export default function PrintTransactions(props: {
  startDate: string | null;
  endDate: string | null;
  type: "P" | "S";
  transactions: Transaction[];
}) {
  const [open, setOpen] = useState(false);
  const formattedStartDate = formatDate(props.startDate, "DD MMMM YYYY");
  const formattedEndDate = formatDate(props.endDate, "DD MMMM YYYY");

  // PRINT
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const arrayOfTransactionItems = props.transactions
    ?.map((transaction: Transaction) => transaction?.transactionItems)
    .flat();

  const arrayOfAllNetPrice = arrayOfTransactionItems?.map(
    (transactionItem: TransactionItem) =>
      calculateNetPrice(
        transactionItem?.quantity,
        transactionItem?.price,
        transactionItem?.discount,
        transactionItem?.tax
      )
  );

  return (
    <>
      <Button
        variant="solid"
        color="primary"
        size="md"
        onClick={() => setOpen(true)}
        startDecorator={<PrintIcon fontSize="small" />}
        disabled={
          !props.startDate || !props.endDate || props.transactions?.length == 0
        }
      >
        Cetak
      </Button>

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
          {/* PRINT */}
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
              disabled={!props.startDate || !props.endDate}
              startDecorator={<PrintIcon fontSize="small" />}
            >
              Cetak
            </Button>
          </Stack>

          {/* OUTLINE */}
          <Stack
            border={1}
            borderColor={"divider"}
            borderRadius={2}
            overflow={"scroll"}
          >
            {/* PRINT AREA */}
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
                {/* <Typography>
                  <b>{props.type == "P" ? "Laporan PO" : "Laporan SO"}</b>
                </Typography> */}
                <Typography
                  component="h3"
                  id="close-modal-title"
                  level="h4"
                  color="primary"
                  fontWeight="lg"
                >
                  {props.type == "P" ? "Laporan PO" : "Laporan SO"}
                </Typography>
                <Typography color="danger">
                  <b>
                    {formattedStartDate !== formattedEndDate
                      ? `${formattedStartDate} - ${formattedEndDate}`
                      : formattedStartDate}
                  </b>
                </Typography>
              </Stack>

              {/* DATA */}
              <Table size="sm">
                <thead>
                  <tr>
                    <th style={{ fontSize: "12px" }}>Tanggal</th>
                    <th style={{ fontSize: "12px" }}>
                      {props.type == "P" ? "No. PO" : "No. SO"}
                    </th>
                    <th style={{ fontSize: "12px" }}>
                      {props.type == "P" ? "Vendor" : "Customer"}
                    </th>
                    <th style={{ fontSize: "12px", width: "100px" }}>Produk</th>
                    <th
                      style={{
                        fontSize: "12px",
                        textAlign: "center",
                        width: "75px",
                      }}
                    >
                      Quantity
                    </th>
                    <th style={{ fontSize: "12px", textAlign: "right" }}>
                      Harga
                    </th>
                    <th
                      style={{
                        fontSize: "12px",
                        textAlign: "center",
                        width: "40px",
                      }}
                    >
                      Disc
                    </th>
                    <th
                      style={{
                        fontSize: "12px",
                        textAlign: "center",
                        width: "40px",
                      }}
                    >
                      PJK
                    </th>
                    <th style={{ fontSize: "12px", textAlign: "right" }}>
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {props.transactions?.map(
                    (transaction: Transaction, index: number) => {
                      const arrayOfNetPrice =
                        transaction?.transactionItems?.map(
                          (transactionItem: TransactionItem) =>
                            calculateNetPrice(
                              transactionItem?.quantity,
                              transactionItem?.price,
                              transactionItem?.discount,
                              transactionItem?.tax
                            )
                        );

                      return (
                        <React.Fragment key={index}>
                          {/* INVENTORY ITEMS */}
                          {transaction?.transactionItems?.map(
                            (
                              transactionItem: TransactionItem,
                              index: number
                            ) => (
                              <tr key={index} style={{ borderTop: 2 }}>
                                <td style={{ fontSize: "12px" }}>
                                  {index == 0
                                    ? formatDate(
                                        transaction?.date,
                                        "DD-MM-YYYY"
                                      )
                                    : ""}
                                </td>
                                <td style={{ fontSize: "12px" }}>
                                  <b>{index == 0 ? transaction?.number : ""}</b>
                                </td>
                                <td style={{ fontSize: "12px" }}>
                                  <b>
                                    {index == 0
                                      ? transaction?.contact?.name
                                      : ""}
                                  </b>
                                </td>
                                <td style={{ fontSize: "12px" }}>
                                  {transactionItem?.product?.name}
                                </td>
                                <td
                                  style={{
                                    fontSize: "12px",
                                    textAlign: "center",
                                  }}
                                >
                                  {transactionItem?.quantity}{" "}
                                  {transactionItem?.product?.unit}
                                </td>
                                <td style={{ fontSize: "12px" }}>
                                  {formatIDR(transactionItem?.price)}
                                </td>
                                <td
                                  style={{
                                    fontSize: "12px",
                                    textAlign: "center",
                                  }}
                                >
                                  {transactionItem?.discount}%
                                </td>
                                <td
                                  style={{
                                    fontSize: "12px",
                                    textAlign: "center",
                                  }}
                                >
                                  {transactionItem?.tax}%
                                </td>
                                <td
                                  style={{
                                    fontSize: "12px",
                                    textAlign: "right",
                                  }}
                                >
                                  {formatIDR(
                                    calculateNetPrice(
                                      transactionItem?.quantity,
                                      transactionItem?.price,
                                      transactionItem?.discount,
                                      transactionItem?.tax
                                    )
                                  )}
                                </td>
                              </tr>
                            )
                          )}

                          {/* TOTAL */}
                          <tr>
                            <td
                              style={{
                                fontSize: "12px",
                              }}
                            ></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td
                              style={{
                                fontSize: "12px",
                                textAlign: "right",
                              }}
                            >
                              <b>{formatIDR(sum(arrayOfNetPrice))}</b>
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    }
                  )}
                </tbody>
                <tfoot>
                  <td style={{ fontSize: "12px" }}>
                    <b>Total Semua</b>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td style={{ fontSize: "12px" }}>
                    <b>{formatIDR(sum(arrayOfAllNetPrice))}</b>
                  </td>
                </tfoot>
              </Table>
            </Stack>
          </Stack>
        </ModalDialog>
      </Modal>
    </>
  );
}
