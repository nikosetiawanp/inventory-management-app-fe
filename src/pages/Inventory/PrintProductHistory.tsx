import { Button, Modal, Typography, ModalDialog, Stack, Table } from "@mui/joy";
import { useState, useRef } from "react";
import { formatDate } from "../../helpers/dateHelpers";
import { Product, ProductHistory } from "../../interfaces/interfaces";
import { sum } from "../../helpers/calculationHelpers";
import PrintIcon from "@mui/icons-material/Print";

import { useReactToPrint } from "react-to-print";

export default function PrintProductHistory(props: {
  startDate: string | null;
  endDate: string | null;
  products: Product[];
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
                  <b>Data Produk</b>
                </Typography>
                <Typography
                  component="h3"
                  id="close-modal-title"
                  level="h4"
                  color="primary"
                  fontWeight="lg"
                >
                  Kartu Stok
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
                {props.products?.map((product: Product, index: number) => {
                  const arrayOfHistoryQuantity = product?.history?.map(
                    (history: ProductHistory) =>
                      history?.type == "A"
                        ? history?.quantity
                        : history?.quantity * -1
                  );
                  const arrayOfArrivalQuantity = product?.history?.map(
                    (history: ProductHistory) =>
                      history?.type == "A" ? history?.quantity : 0
                  );
                  const arrayOfDepartureQuantity = product?.history?.map(
                    (history: ProductHistory) =>
                      history?.type == "D" ? history?.quantity : 0
                  );

                  return (
                    <Stack key={index} justifyContent={"center"}>
                      <Typography color="primary" textAlign={"center"}>
                        <b>
                          {product?.name} | {product?.code}
                        </b>
                      </Typography>

                      <Table size="sm">
                        <thead>
                          <tr>
                            <th style={{ fontSize: "12px" }}>Tanggal</th>
                            <th style={{ fontSize: "12px" }}>Nomor Faktur</th>
                            <th style={{ fontSize: "12px" }}>Keterangan</th>
                            {/* <th>
                            <Button size="sm" variant="plain" color="neutral">
                              Mata Uang
                            </Button>
                          </th> */}
                            <th
                              style={{ fontSize: "12px", textAlign: "center" }}
                            >
                              Masuk
                            </th>
                            <th
                              style={{ fontSize: "12px", textAlign: "center" }}
                            >
                              Keluar
                            </th>
                            <th
                              style={{ fontSize: "12px", textAlign: "center" }}
                            >
                              Saldo
                            </th>
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
                            <td
                              style={{ fontSize: "12px", textAlign: "center" }}
                            >
                              <b>{props.products[index].initialQuantity}</b>
                            </td>
                          </tr>

                          {product?.history?.map(
                            (history: ProductHistory, index: number) => (
                              <tr key={index}>
                                <td style={{ fontSize: "12px" }}>
                                  {formatDate(history?.date, "DD MMMM YYYY")}
                                </td>
                                <td style={{ fontSize: "12px" }}>
                                  {history?.receiptNumber}
                                </td>
                                <td style={{ fontSize: "12px" }}>
                                  {history?.description}
                                </td>

                                <td
                                  style={{
                                    fontSize: "12px",
                                    textAlign: "center",
                                  }}
                                >
                                  <Typography color="success">
                                    {history?.type == "A"
                                      ? history?.quantity
                                      : 0}
                                  </Typography>
                                </td>
                                <td
                                  style={{
                                    fontSize: "12px",
                                    textAlign: "center",
                                  }}
                                >
                                  <Typography color="danger">
                                    {history?.type == "D"
                                      ? history?.quantity
                                      : 0}
                                  </Typography>
                                </td>
                                <td
                                  style={{
                                    fontSize: "12px",
                                    textAlign: "center",
                                  }}
                                >
                                  <b>
                                    {arrayOfHistoryQuantity &&
                                      product?.initialQuantity +
                                        sum(
                                          arrayOfHistoryQuantity.slice(
                                            0,
                                            index + 1
                                          )
                                        )}
                                  </b>
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
                            {/* <td></td> */}
                            <td
                              style={{ fontSize: "12px", textAlign: "center" }}
                            >
                              <Typography color="success">
                                {sum(arrayOfArrivalQuantity)}
                              </Typography>
                            </td>
                            <td
                              style={{ fontSize: "12px", textAlign: "center" }}
                            >
                              <Typography color="danger">
                                {sum(arrayOfDepartureQuantity)}
                              </Typography>
                            </td>
                            <td style={{ fontSize: "12px" }}></td>
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
