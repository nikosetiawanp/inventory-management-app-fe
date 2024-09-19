import {
  Box,
  Button,
  Divider,
  Modal,
  ModalDialog,
  Stack,
  Table,
  Typography,
} from "@mui/joy";
import { InventoryItem, Invoice } from "../../interfaces/interfaces";
import { useRef, useState } from "react";
import PrintIcon from "@mui/icons-material/Print";
import { useReactToPrint } from "react-to-print";
import { formatDate } from "../../helpers/dateHelpers";
import { formatIDR } from "../../helpers/currencyHelpers";
import { sum } from "../../helpers/calculationHelpers";

export default function PrintInvoiceDetail(props: { invoice: Invoice }) {
  const [open, setOpen] = useState(false);

  // PRINT
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const arrayOfTotal = props.invoice?.inventory?.inventoryItems?.map(
    (inventoryItem: InventoryItem) => {
      return inventoryItem?.quantity * inventoryItem?.transactionItem?.price;
    }
  );

  const arrayOfDiscount = props.invoice?.inventory?.inventoryItems?.map(
    (inventoryItem: InventoryItem) => {
      return (
        (inventoryItem?.quantity *
          inventoryItem?.transactionItem?.price *
          inventoryItem?.transactionItem?.discount) /
        100
      );
    }
  );

  const arrayOfTax = props.invoice?.inventory?.inventoryItems?.map(
    (inventoryItem: InventoryItem) => {
      return (
        (inventoryItem?.quantity *
          inventoryItem?.transactionItem?.price *
          inventoryItem?.transactionItem?.tax) /
        100
      );
    }
  );

  const total = sum(arrayOfTotal) - sum(arrayOfDiscount) + sum(arrayOfTax);

  return (
    <>
      <Button
        variant="solid"
        color="primary"
        size="md"
        onClick={() => setOpen(true)}
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
          {/* HEADING */}
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

          {/* BORDER */}
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
              {/* ----- INVOICE HEADER ----- */}
              <Stack direction="row" justifyContent="space-between" spacing={8}>
                {/* LEFT */}
                <Stack width={1}>
                  <Typography color="primary" fontWeight="bold">
                    PT SAMPLE SPECIAL
                  </Typography>
                  <Typography fontSize={12}>
                    Jl. HR Rasuna Said No. 343
                  </Typography>
                  <Typography fontSize={12}>
                    Kuningan, Setia Budi 12350, Indonesia
                  </Typography>
                  {/* ADDRESSES */}
                  <Stack direction="row" spacing={4}>
                    {/* PHONE & FAX */}
                    <Stack>
                      <Typography fontSize={12}>
                        Telp : 021 5678 7768
                      </Typography>
                      <Typography fontSize={12}>Fax : 021 4564 7569</Typography>
                    </Stack>
                    {/* EMAIL & WEBSITE */}
                    <Stack>
                      <Typography fontSize={12}>
                        Email : sample@special.com
                      </Typography>
                      <Typography fontSize={12}>
                        www.samplespecial.com
                      </Typography>
                    </Stack>
                  </Stack>
                  {/* RECIPIENT */}
                  <Box
                    border={1}
                    borderColor="divider"
                    padding={0.8}
                    marginTop={2}
                    minHeight={50}
                  >
                    <Typography
                      fontSize={12}
                      sx={{ textTransform: "capitalize" }}
                    >
                      SOLD TO :
                      <br />
                      {props.invoice?.transaction?.contact?.name}
                    </Typography>
                  </Box>
                  <Box
                    border={1}
                    borderColor="divider"
                    padding={0.8}
                    marginTop={0.8}
                    minHeight={100}
                  >
                    <Typography fontSize={12}>
                      DELIVERED TO :
                      <br />
                      {props.invoice?.transaction?.contact?.address},{" "}
                      {props.invoice?.transaction?.contact?.province},{" "}
                      {props.invoice?.transaction?.contact?.city}
                    </Typography>
                  </Box>
                </Stack>

                {/* RIGHT */}
                <Stack
                  width={1}
                  spacing={4}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  {/* INVOICE & CUSTOMER - ACCOUNT */}
                  <Stack spacing={-0.5} alignItems="center" marginLeft="auto">
                    <Typography fontSize={12}>
                      <u>
                        <b>INVOICE</b>
                      </u>
                    </Typography>
                    <Typography fontSize={12}>
                      <b>CUSTOMER - ACCOUNT</b>
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} marginLeft={0}>
                    <Typography fontSize={12}>
                      INVOICE NO
                      <br />
                      DATE
                      <br />
                      NO. S/O
                      <br />
                      TGL JATUH TEMPO
                    </Typography>
                    <Typography fontSize={12}>
                      : {props.invoice?.number}
                      <br />: {formatDate(props.invoice?.date, "DD MMMM YYYY")}
                      <br />: {props.invoice?.transaction?.number}
                      <br />:{" "}
                      {formatDate(props.invoice?.dueDate, "DD MMMM YYYY")}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
              {/* ----- END OF INVOICE HEADER ----- */}

              {/* TABLE */}
              <Table size="sm" borderAxis="both" sx={{ fontSize: 12 }}>
                <thead style={{ backgroundColor: "primary" }}>
                  <tr>
                    <th>Produk</th>
                    <th style={{ width: 70 }}>Quantity</th>
                    <th>Harga</th>
                    <th style={{ width: 70 }}>Diskon</th>
                    <th style={{ width: 70 }}>Pajak</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {props.invoice?.inventory?.inventoryItems?.map(
                    (inventoryItem: InventoryItem, index: number) => {
                      const total =
                        inventoryItem?.quantity *
                        inventoryItem?.transactionItem?.price;
                      return (
                        <tr key={index}>
                          <td>{inventoryItem?.product?.name}</td>
                          <td>{inventoryItem?.quantity}</td>
                          <td>
                            {formatIDR(inventoryItem?.transactionItem?.price)}
                          </td>
                          <td>{inventoryItem?.transactionItem?.discount}%</td>
                          <td>{inventoryItem?.transactionItem?.tax}%</td>
                          <td style={{ textAlign: "right" }}>
                            {formatIDR(total)}
                          </td>
                        </tr>
                      );
                    }
                  )}
                  {/* SUB TOTAL */}
                  <tr>
                    <td
                      colSpan={4}
                      rowSpan={5}
                      style={{ borderLeft: 0, borderBottom: 0, fontSize: 11 }}
                    ></td>
                    <td style={{ fontWeight: "bold" }}>Sub Total</td>
                    <td
                      style={{
                        fontWeight: "bold",
                        textAlign: "right",
                      }}
                    >
                      {formatIDR(sum(arrayOfTotal))}
                    </td>
                  </tr>
                  {/* DISCOUNT TOTAL */}
                  <tr>
                    <td style={{ fontWeight: "bold" }}>Diskon</td>
                    <td
                      style={{
                        textAlign: "right",
                        fontWeight: "bold",
                      }}
                    >
                      {formatIDR(sum(arrayOfDiscount))}
                    </td>
                  </tr>
                  {/* TAX TOTAL */}
                  <tr>
                    <td>
                      <Typography fontWeight="bold">PPN 11%</Typography>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Typography fontWeight="bold">
                        {formatIDR(sum(arrayOfTax))}
                      </Typography>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Typography fontWeight="bold">TOTAL </Typography>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Typography fontWeight="bold">
                        {formatIDR(total)}
                      </Typography>
                    </td>
                  </tr>
                </tbody>
              </Table>

              <Stack width="fit" alignItems={"end"}>
                <Stack alignItems={"center"}>
                  <Typography fontSize={12} fontWeight="bold" marginBottom={8}>
                    for PT. SAMPLE SPECIAL
                  </Typography>

                  <Typography fontSize={12} fontWeight="bold">
                    RIHANA
                  </Typography>
                  <Divider
                    sx={{
                      "--Divider-lineColor": "black",
                      // "--Divider-thickness": "2px",
                    }}
                  />
                  <Typography fontSize={12} fontWeight="bold">
                    Authorised Signature
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </ModalDialog>
      </Modal>
    </>
  );
}
