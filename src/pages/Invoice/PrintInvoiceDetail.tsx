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

export default function PrintInvoiceDetail(props: { invoice: Invoice }) {
  const [open, setOpen] = useState(false);

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
                  <Typography color="primary">
                    <b>PT SAMPLE SPECIAL</b>
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
                  >
                    <Typography fontSize={12}>
                      SOLD TO :
                      <br />
                      SAMPLE INDONESIA, PT.
                    </Typography>
                  </Box>
                  <Box
                    border={1}
                    borderColor="divider"
                    padding={0.8}
                    marginTop={0.8}
                  >
                    <Typography fontSize={12}>
                      DELIVERED TO : SAMPLE INDONESIA, PT.
                      <br />
                      JL. IMAM BONJOL NO. 60 JAKARTA PUSAT 10221
                      <br />
                      INDONESIA
                      <br />
                      <br />
                      Up. Mr. Dimas Prasetyo
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
                      P/O NO
                      <br />
                      TERMS
                      <br />
                      PAGE NUMBER
                    </Typography>
                    <Typography fontSize={12}>
                      : {props.invoice?.number}
                      <br />: {formatDate(props.invoice?.date, "DD MMMM YYYY")}
                      <br />: {props.invoice?.transaction?.number}
                      <br />
                      : Cash/Tunai
                      <br /> : 1
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
              {/* ----- END OF INVOICE HEADER ----- */}

              {/* TABLE */}
              <Table size="sm" borderAxis="both">
                <thead style={{ backgroundColor: "primary" }}>
                  <tr>
                    <th style={{ fontSize: 12 }}>Produk</th>
                    <th style={{ fontSize: 12 }}>Quantity</th>
                    <th style={{ fontSize: 12 }}>Harga</th>
                    <th style={{ fontSize: 12 }}>Diskon</th>
                    <th style={{ fontSize: 12 }}>Pajak</th>
                    <th style={{ fontSize: 12, textAlign: "right" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {props.invoice?.inventory?.inventoryItems?.map(
                    (inventoryItem: InventoryItem, index: number) => (
                      <tr key={index}>
                        <td style={{ fontSize: 12 }}>
                          {inventoryItem?.product?.name}
                        </td>
                        <td style={{ fontSize: 12 }}>
                          {inventoryItem?.quantity}
                        </td>
                        <td style={{ fontSize: 12 }}>
                          {formatIDR(inventoryItem?.transactionItem?.price)}
                        </td>
                        <td style={{ fontSize: 12 }}>
                          {inventoryItem?.transactionItem?.discount}%
                        </td>
                        <td style={{ fontSize: 12 }}>
                          {inventoryItem?.transactionItem?.tax}%
                        </td>
                        <td style={{ fontSize: 12, textAlign: "right" }}>
                          Total
                        </td>
                      </tr>
                    )
                  )}
                  {/* SUB TOTAL */}
                  <tr>
                    <td
                      colSpan={4}
                      rowSpan={5}
                      style={{ borderLeft: 0, borderBottom: 0, fontSize: 11 }}
                    >
                      IMPORTANT NOTE:
                      <ul>
                        <li>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit.
                        </li>
                        <li>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit.
                        </li>
                        <li>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit.
                        </li>
                        <li>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit.
                        </li>
                      </ul>
                    </td>
                    <td style={{ fontSize: 12, fontWeight: "bold" }}>
                      Sub Total
                    </td>
                    <td
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        textAlign: "right",
                      }}
                    >
                      Rp 000.000,00
                    </td>
                  </tr>
                  {/* DISCOUNT TOTAL */}
                  <tr>
                    <td style={{ fontSize: 12, fontWeight: "bold" }}>Diskon</td>
                    <td
                      style={{
                        fontSize: 12,
                        textAlign: "right",
                        fontWeight: "bold",
                      }}
                    >
                      Rp 000.000,00
                    </td>
                  </tr>
                  {/* TAX TOTAL */}
                  <tr>
                    <td style={{ fontSize: 12 }}>
                      <Typography fontWeight="bold">PPN 11%</Typography>
                    </td>
                    <td style={{ fontSize: 12, textAlign: "right" }}>
                      <Typography fontWeight="bold">Rp 000.000,00</Typography>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontSize: 12 }}>
                      <Typography fontWeight="bold">TOTAL </Typography>
                    </td>
                    <td style={{ fontSize: 12, textAlign: "right" }}>
                      <Typography fontWeight="bold">Rp 000.000,00</Typography>
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
