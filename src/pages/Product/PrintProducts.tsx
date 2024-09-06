import { Button, Modal, ModalDialog, Stack, Table, Typography } from "@mui/joy";
import PrintIcon from "@mui/icons-material/Print";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Product } from "../../interfaces/interfaces";

export default function PrintProducts(props: { products: Product[] }) {
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
        disabled={props.products?.length == 0}
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
                  <b>Produk</b>
                </Typography>
                <Typography
                  component="h3"
                  id="close-modal-title"
                  level="h4"
                  color="primary"
                  fontWeight="lg"
                >
                  Daftar Produk
                </Typography>
              </Stack>

              {/* DATA */}
              <Stack spacing={4} height={1}>
                <Table size="sm">
                  <thead>
                    <tr>
                      <th style={{ fontSize: "12px" }}>Kode</th>
                      <th style={{ fontSize: "12px" }}>Nama</th>
                      <th style={{ fontSize: "12px" }}>Unit</th>
                    </tr>
                  </thead>

                  <tbody>
                    {props.products?.map((product: Product) => {
                      return (
                        <tr>
                          <td style={{ fontSize: "12px" }}>{product?.code}</td>
                          <td style={{ fontSize: "12px" }}>{product?.name}</td>
                          <td style={{ fontSize: "12px" }}>{product?.unit}</td>
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
