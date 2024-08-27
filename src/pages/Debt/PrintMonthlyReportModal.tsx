import { Button, Modal, Typography, ModalDialog, Stack, Table } from "@mui/joy";
import { useState, useRef } from "react";
import { formatDate } from "../../helpers/dateHelpers";
import { formatIDR } from "../../helpers/currencyHelpers";
import { MonthlyDebt } from "../../interfaces/interfaces";
import { sum } from "../../helpers/calculationHelpers";
import PrintIcon from "@mui/icons-material/Print";

import { useReactToPrint } from "react-to-print";

export default function PrintMonthlyReportModal(props: {
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

  const arrayOfInitialBalance = props.contacts?.map(
    (contact: MonthlyDebt) => contact.initialBalance
  );
  const arrayOfTotalDebt = props.contacts?.map(
    (contact: MonthlyDebt) => contact.totalDebt
  );
  const arrayOfTotalPayment = props.contacts?.map(
    (contact: MonthlyDebt) => contact.totalPayment
  );
  const arrayOfCurrentBalance = props.contacts?.map(
    (contact: MonthlyDebt) => contact.currentBalance
  );

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
                  Laporan Saldo Hutang
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
                <Table size="sm">
                  <thead>
                    <tr>
                      <th style={{ fontSize: "12px" }}>Vendor</th>
                      <th style={{ fontSize: "12px" }}>Saldo Awal </th>
                      <th style={{ fontSize: "12px" }}>Pembelian</th>

                      <th style={{ fontSize: "12px" }}>Pembayaran</th>
                      <th style={{ fontSize: "12px" }}>Saldo Akhir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.contacts?.map((contact: MonthlyDebt) => {
                      return (
                        <tr>
                          <td style={{ fontSize: "12px" }}>{contact?.name}</td>
                          <td style={{ fontSize: "12px" }}>
                            {formatIDR(contact?.initialBalance)}
                          </td>
                          <td style={{ fontSize: "12px" }}>
                            <Typography color="success">
                              {formatIDR(contact?.totalDebt)}
                            </Typography>
                          </td>
                          <td style={{ fontSize: "12px" }}>
                            <Typography color="danger">
                              {formatIDR(contact?.totalPayment)}
                            </Typography>
                          </td>
                          <td style={{ fontSize: "12px" }}>
                            <b>{formatIDR(contact?.currentBalance)}</b>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td style={{ fontSize: "12px" }}>
                        <b>Total</b>
                      </td>
                      <td style={{ fontSize: "12px" }}>
                        <b>{formatIDR(sum(arrayOfInitialBalance))}</b>
                      </td>
                      <td style={{ fontSize: "12px" }}>
                        <b> {formatIDR(sum(arrayOfTotalDebt))}</b>
                      </td>
                      <td style={{ fontSize: "12px" }}>
                        <b> {formatIDR(sum(arrayOfTotalPayment))}</b>
                      </td>
                      <td style={{ fontSize: "12px" }}>
                        <b>{formatIDR(sum(arrayOfCurrentBalance))}</b>
                      </td>{" "}
                    </tr>
                  </tfoot>
                </Table>
              </Stack>
            </Stack>
          </Stack>
        </ModalDialog>
      </Modal>
    </>
  );
}
