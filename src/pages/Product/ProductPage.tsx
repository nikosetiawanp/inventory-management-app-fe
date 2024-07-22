import { Box, Button, Chip, Sheet, Stack, Table, Typography } from "@mui/joy";
import Drawer from "../../components/Drawer";

import axios from "axios";
import { useState } from "react";
import { Product } from "../../interfaces/interfaces";
import { useQuery } from "react-query";
import CreateProduct from "./CreateProduct";
import { Settings } from "@mui/icons-material";
import RowSkeleton from "../../components/skeletons/RowSkeleton";
import SearchFilter from "../../components/filters/SearchFilter";
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
      <Stack padding={4} width={1}>
        {/*TITLE & CREATE PRODUCT */}
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"flex-end"}
          marginBottom={4}
        >
          <Typography fontWeight={"bold"} level="h4">
            Produk
          </Typography>
          <Box>
            <CreateProduct />
          </Box>
        </Stack>

        {/* SEARCH & FILTER */}
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"flex-end"}
          spacing={2}
          marginBottom={2}
        >
          <SearchFilter
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            label={"Cari produk"}
            placeholder={"Cari"}
          />
        </Stack>

        <Sheet variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Table size="sm" stickyHeader stickyFooter>
            {/* HEAD */}
            <thead>
              <tr>
                <th>
                  <Button size="sm" variant="plain" color="neutral">
                    Kode
                  </Button>
                </th>
                <th>
                  <Button size="sm" variant="plain" color="neutral">
                    Nama
                  </Button>
                </th>
                <th style={{ textAlign: "center" }}>
                  <Button size="sm" variant="plain" color="neutral">
                    Unit
                  </Button>
                </th>
                <th
                  style={{
                    textAlign: "center",
                    width: 60,
                  }}
                >
                  <Button size="sm" variant="plain" color="neutral">
                    <Settings fontSize="small" />
                  </Button>
                </th>
              </tr>
            </thead>

            {/* ROWS */}
            <tbody>
              {productsQuery.isLoading ? (
                <RowSkeleton rows={15} columns={4} />
              ) : (
                filteredProductsQuery.map((product: Product, index: number) => (
                  <tr key={index}>
                    <td style={{ paddingLeft: 15 }}>{product.code}</td>
                    <td style={{ paddingLeft: 15 }}>{product.name}</td>
                    <td style={{ textAlign: "center" }}>
                      <Chip variant="outlined" size="sm">
                        {product.unit}
                      </Chip>
                    </td>
                    <td style={{ paddingLeft: 15 }}>
                      {/* <MoreVertProductButton product={product} /> */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Sheet>
      </Stack>
    </Stack>
  );
}
