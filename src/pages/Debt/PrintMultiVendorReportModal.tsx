import { Button, Modal, Typography, ModalDialog, Stack, Table } from "@mui/joy";
import { useState, useRef } from "react";
import { formatDate } from "../../helpers/dateHelpers";
import { formatIDR } from "../../helpers/currencyHelpers";
import { DebtHistory, MonthlyDebt } from "../../interfaces/interfaces";
import { sum } from "../../helpers/calculationHelpers";
import PrintIcon from "@mui/icons-material/Print";

import { useReactToPrint } from "react-to-print";

export default function PrintMultiVendorReportModal(props: {
  startDate: string | null;
  endDate: string | null;
  contacts: MonthlyDebt[];
  type: "D" | "R";
}) {
  const [open, setOpen] = useState(false);
  const formattedStartDate = formatDate(props.startDate, "DD MMMM YYYY");
  const formattedEndDate = formatDate(props.endDate, "DD MMMM YYYY");

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
        disabled={!props.startDate || !props.endDate}
        startDecorator={<PrintIcon fontSize="small" />}
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
                    {props.type == "D" || "R" ? "Data Hutang" : "Data Piutang"}
                  </b>
                </Typography>
                <Typography
                  component="h3"
                  id="close-modal-title"
                  level="h4"
                  color="primary"
                  fontWeight="lg"
                >
                  {props.type == "D" || "R" ? "Kartu Hutang" : "Kartu Piutang"}{" "}
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
              <Stack spacing={4} height={1}>
                {props.contacts?.map((contact: MonthlyDebt, index: number) => {
                  const arrayOfHistoryAmount = contact?.histories?.map(
                    (history: DebtHistory) =>
                      history?.type == "D" || history?.type == "R"
                        ? history?.amount
                        : 0 - history?.amount
                  );

                  const arrayOfDebts = contact?.histories
                    ?.filter((history: DebtHistory) => history?.type == "D")
                    .map((history: DebtHistory) => history?.amount);

                  const arrayOfReceivables = contact?.histories
                    ?.filter((history: DebtHistory) => history?.type == "R")
                    .map((history: DebtHistory) => history?.amount);

                  const arrayOfPayments = contact?.histories
                    ?.filter((history: DebtHistory) => history?.type == "P")
                    .map((history: DebtHistory) => history?.amount);

                  return (
                    <Stack key={index} justifyContent={"center"}>
                      <Typography color="primary" textAlign={"center"}>
                        <b>
                          {contact?.name} | {contact?.code}
                        </b>
                      </Typography>

                      <Table size="sm">
                        <thead>
                          <tr>
                            <th style={{ fontSize: "12px" }}>Tanggal</th>
                            <th style={{ fontSize: "12px" }}>Nomor Bukti</th>
                            <th style={{ fontSize: "12px" }}>Keterangan</th>
                            {/* <th>
                            <Button size="sm" variant="plain" color="neutral">
                              Mata Uang
                            </Button>
                          </th> */}
                            <th style={{ fontSize: "12px" }}>Debit</th>
                            <th style={{ fontSize: "12px" }}>Kredit</th>
                            <th style={{ fontSize: "12px" }}>Saldo</th>
                          </tr>
                        </thead>

                        <tbody>
                          {/* SALDO AWAL */}
                          <tr>
                            <td style={{ fontSize: "12px" }}>
                              <b>Saldo Awal</b>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td style={{ fontSize: "12px" }}>
                              {props.type == "D"
                                ? formatIDR(
                                    props.contacts[index].initialBalance
                                  )
                                : formatIDR(
                                    0 - props.contacts[index].initialBalance
                                  )}
                            </td>
                          </tr>

                          {contact?.histories?.map(
                            (history: DebtHistory, index: number) => (
                              <tr key={index}>
                                <td style={{ fontSize: "12px" }}>
                                  {formatDate(history?.date, "DD MMMM YYYY")}
                                </td>
                                <td style={{}}>
                                  <Typography color="neutral">
                                    {/* {formatIDR(vendor?.initialBalance)} */}
                                  </Typography>
                                </td>
                                <td style={{}}>
                                  <Typography></Typography>
                                </td>
                                {/* <td
                                style={{ paddingLeft: 15, textAlign: "center" }}
                              >
                                Rp
                              </td> */}
                                <td style={{ fontSize: "12px" }}>
                                  <Typography color="success">
                                    {history?.type == "D" && props.type == "D"
                                      ? formatIDR(history?.amount)
                                      : history?.type == "P" &&
                                        props.type == "R"
                                      ? formatIDR(history?.amount)
                                      : formatIDR(0)}
                                  </Typography>
                                </td>
                                <td style={{ fontSize: "12px" }}>
                                  <Typography color="danger">
                                    {history?.type == "R" && props.type == "R"
                                      ? formatIDR(history?.amount)
                                      : history?.type == "P" &&
                                        props.type == "D"
                                      ? formatIDR(history?.amount)
                                      : formatIDR(0)}
                                  </Typography>
                                </td>
                                <td style={{ fontSize: "12px" }}>
                                  {props.type == "D"
                                    ? formatIDR(
                                        contact?.initialBalance +
                                          sum(
                                            arrayOfHistoryAmount.slice(
                                              0,
                                              index + 1
                                            )
                                          )
                                      )
                                    : formatIDR(
                                        contact?.initialBalance +
                                          sum(
                                            arrayOfHistoryAmount.slice(
                                              0,
                                              index + 1
                                            )
                                          ) *
                                            -1
                                      )}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td style={{ fontSize: "12px" }}>
                              <b>Saldo Akhir</b>
                            </td>
                            <td></td>
                            <td></td>
                            <td style={{ fontSize: "12px" }}>
                              <Typography color="success">
                                <b>
                                  {props.type == "D"
                                    ? formatIDR(sum(arrayOfDebts))
                                    : formatIDR(sum(arrayOfPayments))}
                                </b>
                              </Typography>
                            </td>
                            <td style={{ fontSize: "12px" }}>
                              <Typography color="danger">
                                <b>
                                  {props.type == "D"
                                    ? formatIDR(sum(arrayOfPayments))
                                    : formatIDR(sum(arrayOfReceivables))}
                                </b>
                              </Typography>
                            </td>
                            <td style={{ fontSize: "12px" }}>
                              <b>
                                {props.type == "D"
                                  ? formatIDR(contact?.currentBalance)
                                  : formatIDR(0 - contact?.currentBalance)}
                              </b>
                            </td>
                          </tr>
                        </tfoot>
                      </Table>
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
          </Stack>
        </ModalDialog>
      </Modal>
    </>
  );
}
