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
                  <b>Data Hutang</b>
                </Typography>
                <Typography
                  component="h3"
                  id="close-modal-title"
                  level="h4"
                  color="primary"
                  fontWeight="lg"
                >
                  Laporan Hutang Per Vendor
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
                {props.contacts?.map((vendor: MonthlyDebt, index: number) => {
                  const arrayOfHistoryAmount = vendor?.histories?.map(
                    (history: DebtHistory) =>
                      history?.type == "D"
                        ? history?.amount
                        : history?.amount * -1
                  );

                  const arrayOfDebts = vendor?.histories
                    ?.filter((history: DebtHistory) => history?.type == "D")
                    .map((history: DebtHistory) => history?.amount);

                  const arrayOfPayments = vendor?.histories
                    ?.filter((history: DebtHistory) => history?.type == "P")
                    .map((history: DebtHistory) => history?.amount);

                  return (
                    <Stack key={index} justifyContent={"center"}>
                      <Typography color="primary" textAlign={"center"}>
                        <b>
                          {vendor?.name} | {vendor?.code}
                        </b>
                      </Typography>

                      <Table size="sm">
                        <thead>
                          <tr>
                            <th>
                              <Button size="sm" variant="plain" color="neutral">
                                Tanggal
                              </Button>
                            </th>
                            <th>
                              <Button size="sm" variant="plain" color="neutral">
                                Nomor Bukti
                              </Button>
                            </th>
                            <th>
                              <Button size="sm" variant="plain" color="neutral">
                                Keterangan
                              </Button>
                            </th>
                            {/* <th>
                            <Button size="sm" variant="plain" color="neutral">
                              Mata Uang
                            </Button>
                          </th> */}
                            <th>
                              <Button size="sm" variant="plain" color="neutral">
                                Debit
                              </Button>
                            </th>
                            <th>
                              <Button size="sm" variant="plain" color="neutral">
                                Kredit
                              </Button>
                            </th>
                            <th>
                              <Button size="sm" variant="plain" color="neutral">
                                Saldo
                              </Button>
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {/* SALDO AWAL */}
                          <tr>
                            <td style={{ paddingLeft: 15, fontSize: "14px" }}>
                              <b>Saldo Awal</b>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td style={{ paddingLeft: 15, fontSize: "14px" }}>
                              {formatIDR(props.contacts[index].initialBalance)}
                            </td>
                          </tr>

                          {vendor?.histories?.map(
                            (history: DebtHistory, index: number) => (
                              <tr key={index}>
                                <td
                                  style={{ paddingLeft: 15, fontSize: "14px" }}
                                >
                                  {formatDate(history?.date, "DD MMMM YYYY")}
                                </td>
                                <td style={{ paddingLeft: 15 }}>
                                  <Typography color="neutral">
                                    {/* {formatIDR(vendor?.initialBalance)} */}
                                  </Typography>
                                </td>
                                <td style={{ paddingLeft: 15 }}>
                                  <Typography></Typography>
                                </td>
                                {/* <td
                                style={{ paddingLeft: 15, textAlign: "center" }}
                              >
                                Rp
                              </td> */}
                                <td
                                  style={{ paddingLeft: 15, fontSize: "14px" }}
                                >
                                  <Typography color="success">
                                    {history?.type == "D"
                                      ? formatIDR(history?.amount)
                                      : formatIDR(0)}
                                  </Typography>
                                </td>
                                <td
                                  style={{ paddingLeft: 15, fontSize: "14px" }}
                                >
                                  <Typography color="danger">
                                    {history?.type == "P"
                                      ? formatIDR(history?.amount)
                                      : formatIDR(0)}
                                  </Typography>
                                </td>
                                <td
                                  style={{ paddingLeft: 15, fontSize: "14px" }}
                                >
                                  {formatIDR(
                                    arrayOfHistoryAmount &&
                                      vendor?.initialBalance +
                                        sum(
                                          arrayOfHistoryAmount.slice(
                                            0,
                                            index + 1
                                          )
                                        )
                                  )}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td style={{ paddingLeft: 15, fontSize: "14px" }}>
                              <b>Saldo Akhir</b>
                            </td>
                            <td></td>
                            <td></td>
                            {/* <td></td> */}
                            <td style={{ paddingLeft: 15, fontSize: "14px" }}>
                              <Typography color="success">
                                {formatIDR(sum(arrayOfDebts))}
                              </Typography>
                            </td>
                            <td style={{ paddingLeft: 15, fontSize: "14px" }}>
                              <Typography color="danger">
                                {formatIDR(sum(arrayOfPayments))}
                              </Typography>
                            </td>
                            <td style={{ paddingLeft: 15, fontSize: "14px" }}>
                              <b>{formatIDR(vendor?.currentBalance)}</b>
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
