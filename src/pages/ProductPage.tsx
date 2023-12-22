import {
  Button,
  Divider,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Drawer from "../components/Drawer";

import CreateProduct from "../components/dialogs/CreateProduct";
import { MoreHoriz, MoreVert, Settings } from "@mui/icons-material";

const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

export default function ProductPage() {
  return (
    // PAGE
    <Stack direction={"row"} height={"100vh"} width={"100vw"}>
      {/* DRAWER */}
      <Drawer />

      {/* CONTENT */}
      <Stack padding={4} gap={2} width={1}>
        <Typography fontWeight={"bold"} variant="h4">
          Produk
        </Typography>
        <Stack direction={"row"} justifyContent={"space-between"} width={1}>
          <TextField
            id="outlined-basic"
            label="Cari"
            variant="outlined"
            size="small"
            sx={{ width: "400px" }}
          />
          {/* BUTTON */}
          <CreateProduct />
        </Stack>

        <TableContainer
          sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}
        >
          <Table size="small" sx={{ borderCollapse: "separate" }}>
            {/* HEAD */}
            <TableHead
              sx={{
                position: "sticky",
                backgroundColor: "white",
                top: 0,
                border: 2,
                borderColor: "divider",
                zIndex: 50,
              }}
            >
              <TableRow>
                <TableCell width={80}>Kode</TableCell>
                <TableCell width={200}>Nama</TableCell>
                <TableCell width={80}>Unit</TableCell>
                <TableCell width={10}>
                  <IconButton>
                    <Settings />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>

            {/* ROWS */}
            <TableBody sx={{ overflowY: "scroll" }}>
              {rows.map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell>SCT-02</TableCell>
                  <TableCell>Sendok Korea</TableCell>
                  <TableCell>pcs</TableCell>
                  <TableCell>
                    <IconButton>
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* BOTTOM */}
        {/* <Stack direction={"row"} gap={2}>
          <Typography variant="body1">Halaman 1 dari 5</Typography>
          <Button variant="outlined" sx={{ marginLeft: "auto" }}>
            Previous
          </Button>
          <Button variant="outlined">Next</Button>
        </Stack> */}
      </Stack>
    </Stack>
  );
}
