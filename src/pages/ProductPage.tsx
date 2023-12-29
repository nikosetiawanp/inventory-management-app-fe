import {
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

import CreateProductButton from "../components/buttons/CreateProductButton";
import { Settings } from "@mui/icons-material";
import MoreVertProductButton from "../components/buttons/MoreVertProductButton";
import { useQuery } from "react-query";
import { Product } from "../interfaces/interfaces";
import RowSkeleton from "../components/skeletons/RowSkeleton";
import axios from "axios";

const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

export default function ProductPage() {
  // FETCHING PRODUCTS
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const getProducts = async () => {
    const response = await axios.get(BACKEND_URL + "products/");
    return response.data.data;
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["product"],
    queryFn: () => getProducts(),
  });
  return (
    // PAGE
    <Stack direction={"row"} height={"100vh"} width={"100vw"}>
      {/* DRAWER */}
      <Drawer />

      {/* CONTENT */}
      <Stack padding={4} gap={4} width={1}>
        <Typography fontWeight={"bold"} variant="h4">
          Daftar Produk
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
          <CreateProductButton />
        </Stack>

        <TableContainer
          sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}
        >
          <Table size="medium" sx={{ borderCollapse: "separate" }}>
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
                <TableCell>Nama</TableCell>
                <TableCell width={160}>Unit</TableCell>
                <TableCell width={10}>
                  <IconButton size="small">
                    <Settings fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>

            {/* ROWS */}
            <TableBody sx={{ overflowY: "scroll" }}>
              {isLoading ? (
                <RowSkeleton rows={15} columns={4} />
              ) : (
                data.map((product: Product, index: number) => (
                  <TableRow key={index} hover>
                    <TableCell>{product.code}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell>
                      <MoreVertProductButton product={product} />
                    </TableCell>
                  </TableRow>
                ))
              )}
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
