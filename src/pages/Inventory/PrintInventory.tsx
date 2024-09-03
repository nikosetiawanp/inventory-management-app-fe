import {
  Button,
  Chip,
  Modal,
  ModalDialog,
  Stack,
  Table,
  Typography,
} from "@mui/joy";
import { Inventory } from "../../interfaces/interfaces";
import { useRef, useState } from "react";

import PrintIcon from "@mui/icons-material/Print";
import { useReactToPrint } from "react-to-print";
import { formatDate } from "../../helpers/dateHelpers";

export default function PrintInventory(props: {
  inventories: Inventory[];
  startDate: string | null;
  endDate: string | null;
  type: "A" | "D";
}) {
  const [open, setOpen] = useState(false);

  // PRINT
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <>
      {" "}
      <Button
        variant="solid"
        color="primary"
        size="md"
        onClick={() => setOpen(true)}
        startDecorator={<PrintIcon fontSize="small" />}
        disabled={!props.startDate || !props.endDate}
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
          {/* MENU */}
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
              {/* HEADER & TITLE */}
              <Stack alignItems="center">
                <Typography>
                  <b>{props.type == "A" ? "Gudang Masuk" : "Gudang Keluar"}</b>
                </Typography>
                <Typography
                  component="h3"
                  id="close-modal-title"
                  level="h4"
                  color="primary"
                  fontWeight="lg"
                >
                  {props.type == "A"
                    ? "Laporan Gudang Masuk"
                    : "Laporan Gudang Keluar"}{" "}
                </Typography>

                <Typography color="danger">
                  <b>
                    {formatDate(props.startDate, "DD MMMM YYYY")} -{" "}
                    {formatDate(props.endDate, "DD MMMM YYYY")}
                  </b>
                </Typography>
              </Stack>

              {/* DATA */}
              <Stack spacing={4} height={1}>
                <Table size="sm">
                  <thead>
                    <tr>
                      <th style={{ fontSize: "12px" }}>Nomor LPB </th>
                      <th style={{ fontSize: "12px" }}>Nomor Faktur</th>
                      <th style={{ fontSize: "12px" }}>
                        {props.type == "A" ? "Customer" : "Vendor"}
                      </th>
                      <th style={{ fontSize: "12px" }}>Tanggal Faktur</th>
                      <th style={{ fontSize: "12px" }}>
                        {props.type == "A" ? "Purchase Order" : "Sales Order"}
                      </th>
                      <th style={{ fontSize: "12px" }}>Deskripsi</th>
                      <th style={{ fontSize: "12px", textAlign: "center" }}>
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {props.inventories?.map((inventory: Inventory) => {
                      return (
                        <tr>
                          <td style={{ fontSize: "12px" }}>
                            {inventory?.number}
                          </td>
                          <td style={{ fontSize: "12px" }}>
                            {inventory?.receiptNumber}
                          </td>
                          <td style={{ fontSize: "12px" }}>
                            {inventory?.transaction?.contact?.name}
                          </td>
                          <td style={{ fontSize: "12px" }}>
                            {formatDate(inventory?.date, "DD MMMM YYYY")}
                          </td>
                          <td style={{ fontSize: "12px" }}>
                            {inventory?.transaction?.number}
                          </td>
                          <td style={{ fontSize: "12px" }}>
                            {inventory?.description}
                          </td>
                          <td style={{ fontSize: "12px", textAlign: "center" }}>
                            <Chip
                              size="sm"
                              color={
                                inventory?.inventoryItems?.length > 0
                                  ? "success"
                                  : "danger"
                              }
                            >
                              {inventory?.inventoryItems?.length > 0
                                ? "Divalidasi"
                                : "Menunggu validasi"}
                            </Chip>
                          </td>
                        </tr>
                      );
                    })}
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
