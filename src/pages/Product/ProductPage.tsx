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
import Drawer from "../../components/Drawer";

import axios from "axios";
import { useState } from "react";
import { Product } from "../../interfaces/interfaces";
import { useQuery } from "react-query";
import CreateProductButton from "./CreateProductButton";
import { Settings } from "@mui/icons-material";
import RowSkeleton from "../../components/skeletons/RowSkeleton";
import MoreVertProductButton from "./MoreVertProductButton";

export default function ProductPage() {
  // FETCHING PRODUCTS
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const getProducts = async () => {
    const response = await axios.get(BACKEND_URL + "products/");
    return response.data.data;
  };

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
    refetchOnWindowFocus: false,
  });

  const [searchInput, setSearchInput] = useState("");
  const filteredProductsQuery = productsQuery?.data?.filter(
    (product: Product) =>
      product.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      product.code.toLowerCase().includes(searchInput.toLowerCase())
  );
  return (
    // PAGE
    <Stack direction={"row"} height={"100vh"} width={"100vw"}>
      {/* DRAWER */}
      <Drawer />

      {/* CONTENT */}
      <Stack padding={4} gap={4} width={1}>
        <Typography fontWeight={"bold"} variant="h4">
          Produk
        </Typography>
        <Stack direction={"row"} justifyContent={"space-between"} width={1}>
          <TextField
            id="outlined-basic"
            placeholder="Cari produk"
            variant="outlined"
            size="small"
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value);
            }}
          />
          {/* BUTTON */}
          <CreateProductButton />
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
              {productsQuery.isLoading ? (
                <RowSkeleton rows={15} columns={4} />
              ) : (
                filteredProductsQuery.map((product: Product, index: number) => (
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
      </Stack>
    </Stack>
  );
}
