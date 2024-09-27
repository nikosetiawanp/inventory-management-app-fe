import {
  Box,
  Button,
  Modal,
  ModalDialog,
  Stack,
  Table,
  Typography,
} from "@mui/joy";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import { Inventory, InventoryItem } from "../../interfaces/interfaces";
import { formatDate } from "../../helpers/dateHelpers";

export default function PrintInventoryDetail(props: { inventory: Inventory }) {
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
              <Stack direction="row" justifyContent="space-between" spacing={8}>
                {/* LEFT */}
                <Stack width={1}>
                  <Typography color="primary" fontWeight="bold">
                    PT SAMPLE SPECIAL
                  </Typography>
                  <Box border={1} borderColor="divider" padding={1} height={1}>
                    <Typography fontSize={12}>
                      Kepada Yth : {props.inventory?.transaction?.contact?.name}{" "}
                      <br />
                      {props.inventory?.transaction?.contact?.address},{" "}
                      {props.inventory?.transaction?.contact?.province},{" "}
                      {props.inventory?.transaction?.contact?.city}
                    </Typography>
                  </Box>
                </Stack>
                {/* RIGHT */}
                <Stack width={1}>
                  <Typography fontWeight="bold">Surat Jalan</Typography>
                  <Stack direction="row" spacing={2}>
                    <Typography fontSize={12} lineHeight={2}>
                      Nomor Surat Jalan
                      <br />
                      Tanggal
                      <br />
                      Nomor SO
                      <br />
                      Dikirim dengan
                      <br />
                      No. polisi
                      <br />
                      Nama pengemudi
                    </Typography>
                    <Typography fontSize={12} lineHeight={2}>
                      : {props.inventory?.number}
                      <br />:{" "}
                      {formatDate(props.inventory?.date, "DD MMMM YYYY")}
                      <br />: {props.inventory?.transaction?.number}
                      <br />
                      :
                      <br />
                      :
                      <br />:
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>

              {/* TABLE */}
              <Stack>
                <Typography fontSize={11}>
                  Harap terima barang dengan keadaan baik barang-barang di bawah
                  ini:
                </Typography>
                <Table size="sm" borderAxis="both" sx={{ fontSize: 12 }}>
                  <thead style={{ backgroundColor: "primary" }}>
                    <tr>
                      <th style={{ width: 40 }}>No</th>
                      <th>Nama</th>
                      <th style={{ width: 60 }}>Satuan</th>
                      <th style={{ width: 60 }}>Jumlah</th>
                      <th>Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.inventory?.inventoryItems?.map(
                      (inventoryItem: InventoryItem, index: number) => (
                        <tr key={index}>
                          <td>{index}</td>
                          <td>
                            {inventoryItem?.transactionItem?.product?.name}
                          </td>
                          <td>
                            {inventoryItem?.transactionItem?.product?.unit}
                          </td>
                          <td>{inventoryItem?.quantity}</td>
                          <td></td>
                        </tr>
                      )
                    )}
                  </tbody>
                </Table>

                {/* FOOTER */}
                <Stack
                  direction="row"
                  marginTop={10}
                  justifyContent="space-between"
                  padding={4}
                >
                  {/* TANDA TERIMA */}
                  <Stack spacing={8} alignItems={"center"}>
                    <Typography fontSize={12}>Tanda Terima,</Typography>
                    <Typography fontSize={12}>....................</Typography>
                  </Stack>

                  {/* SOPIR, PACKING, MANAGER */}
                  <Stack width={350}>
                    <Table size="sm" borderAxis="both" sx={{ fontSize: 12 }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: "center" }}>Sopir,</th>
                          <th style={{ textAlign: "center" }}>
                            Bagian Packing
                          </th>
                          <th style={{ textAlign: "center" }}>Manager,</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ height: 75 }}>
                          <td
                            style={{
                              textAlign: "center",
                              verticalAlign: "bottom",
                            }}
                          >
                            ....
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              verticalAlign: "bottom",
                            }}
                          >
                            ....
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              verticalAlign: "bottom",
                            }}
                          >
                            ....
                          </td>
                        </tr>
                        <tr></tr>
                      </tbody>
                    </Table>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </ModalDialog>
      </Modal>
    </>
  );
}
