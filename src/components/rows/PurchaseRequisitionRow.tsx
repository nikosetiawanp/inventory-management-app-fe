import MoreVertProductButton from "../buttons/MoreVertProductButton";
import { useState } from "react";
import {
  TableRow,
  TableCell,
  Stack,
  Typography,
  Dialog,
  Button,
  TableContainer,
  TableHead,
  IconButton,
  TableBody,
  Table,
  TableFooter,
  InputBase,
  Paper,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import MorePurchaseButton from "../buttons/MorePurchaseButton";
import { Settings } from "@mui/icons-material";
import EditableCell from "../tables/EditableCell";

export default function PurchaseRequisitionRow(props: { index: number }) {
  const [open, setOpen] = useState(false);
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  return (
    <>
      <TableRow
        key={props.index}
        hover
        sx={{ cursor: "pointer" }}
        onClick={() => setOpen(true)}
      >
        <TableCell>15 Desember 2023</TableCell>
        <TableCell>SCT-02</TableCell>
        <TableCell>Solusi Cerdas Teknologi</TableCell>
        <TableCell>ABC/0223/456</TableCell>
        <TableCell>
          <MoreVertProductButton />
        </TableCell>
      </TableRow>

      {/* DIALOG */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth={"lg"}
      >
        <Stack padding={3}>
          {/* HEADER */}
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            marginBottom={2}
          >
            {/* TITLE */}
            <Stack>
              <Typography variant="h4">045/ADM/2023</Typography>
              <Typography variant="body1">3 Desember 2023</Typography>
              <Typography variant="body1">PT Jaya Bersama</Typography>
            </Stack>
            {/* BUTTONS */}
            <Stack direction="row" alignItems={"center"} gap={2}>
              <Button variant="contained" startIcon={<AddIcon />}>
                Tambah
              </Button>
              <Button variant="outlined">Pindahkan ke PO</Button>
              <MorePurchaseButton />
            </Stack>
          </Stack>

          {/* TABLE */}
          <TableContainer
            sx={{
              backgroundColor: "white",
              height: 500,
            }}
          >
            <Table stickyHeader>
              {/* TABLE HEAD */}
              <TableHead
                sx={{
                  position: "sticky",
                  backgroundColor: "white",
                  top: 0,
                  borderBottom: 1,
                  borderColor: "divider",
                  zIndex: 50,
                }}
              >
                <TableRow>
                  <TableCell>Produk</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="center">Unit</TableCell>
                  <TableCell align="right" width={100}>
                    Harga
                  </TableCell>
                  <TableCell align="center">Diskon</TableCell>
                  <TableCell align="center">Pajak</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>

              <TableBody
                sx={{
                  position: "sticky",
                  backgroundColor: "white",
                  borderColor: "divider",
                  width: 1,
                  overflowY: "scroll",
                  maxHeight: 100,
                }}
              >
                {items.map((item) => (
                  <TableRow>
                    <TableCell>Kursi</TableCell>
                    {/* <TableCell>
                      <InputBase placeholder="Kursi" />
                    </TableCell> */}
                    <TableCell align="center">1</TableCell>
                    <TableCell align="center">pcs</TableCell>
                    {/* <TableCell padding="none">
                      <Paper elevation={4} sx={{ paddingY: 1 }}>
                        <InputBase placeholder="Rp 100,000.00" />
                      </Paper>
                    </TableCell> */}
                    <EditableCell />
                    {/* <TableCell align="right">Rp 100,000.00</TableCell> */}
                    <TableCell align="center">5%</TableCell>
                    <TableCell align="center">10%</TableCell>
                    <TableCell align="right">Rp 120,000.00</TableCell>
                  </TableRow>
                ))}
              </TableBody>

              {/* <TableFooter
                sx={{
                  position: "sticky",
                  backgroundColor: "white",
                  bottom: 0,
                  borderTop: 5,
                  borderColor: "divider",
                  zIndex: 50,
                  bgcolor: "primary.main",
                }}
              >
                <TableRow>
                  <TableCell>
                    {" "}
                    <Typography variant="body1" fontWeight={"bold"}>
                      Total
                    </Typography>
                  </TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" fontWeight={"bold"}>
                      Rp 120,000.00
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableFooter> */}
            </Table>
          </TableContainer>
          {/* FOOTER */}
          <Stack
            position={"sticky"}
            bottom={0}
            direction={"row"}
            justifyContent={"space-between"}
            bgcolor={"white"}
            padding={2}
            borderTop={1}
            borderColor={"divider"}
          >
            <Typography fontWeight={"bold"} variant="body1">
              Total
            </Typography>
            <Typography fontWeight={"bold"} variant="body1">
              Rp 120,000,000.00
            </Typography>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
}
