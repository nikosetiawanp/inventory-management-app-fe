import {
  Dialog,
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
import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import { Product } from "../../interfaces/interfaces";
import CreateProductButton from "../../pages/Product/CreateProductButton";

export default function SelectProduct(props: {
  selectedProduct: Product | null;
  setSelectedProduct: any;
  control: any;
  index: number;
  update: any;
  setValue: any;
}) {
  const [open, setOpen] = useState(false);

  // GET PURCHASES
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const getProducts = async () => {
    const response = await axios.get(BACKEND_URL + "products");
    return response.data.data;
  };
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    refetchOnWindowFocus: false,
    enabled: open,
  });
  const [searchInput, setSearchInput] = useState("");
  const filteredProductsQuery = productsQuery?.data?.filter(
    (product: Product) =>
      product.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      product.code.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleProductSelection = (selectedProduct: Product) => {
    props.setSelectedProduct(selectedProduct);

    setOpen(false);
  };

  return (
    <>
      <Typography
        color={"primary.main"}
        sx={{ cursor: "pointer" }}
        onClick={() => setOpen(true)}
      >
        {props.selectedProduct
          ? props.selectedProduct?.name
          : "Pilih Produk..."}
      </Typography>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth={"sm"}
      >
        <Stack padding={3}>
          <Stack direction={"row"} alignItems={"start"}>
            <Typography
              variant="h4"
              fontWeight={"bold"}
              marginBottom={2}
              marginRight={"auto"}
            >
              Pilih Produk
            </Typography>
            <CreateProductButton />
          </Stack>
          {/* HEADER */}
          <Stack
            direction={"row"}
            alignItems={"center"}
            marginBottom={2}
            gap={2}
          >
            <TextField
              id="outlined-basic"
              placeholder="Cari produk"
              variant="outlined"
              size="small"
              fullWidth
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value);
              }}
            />

            {/* <Typography variant="h4">Pilih Produk</Typography> */}
          </Stack>

          {/* TABLE */}
          <TableContainer
            sx={{
              backgroundColor: "white",
              height: 500,
            }}
          >
            <Table stickyHeader>
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
                  <TableCell>Kode</TableCell>
                  <TableCell>Nama</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProductsQuery?.map(
                  (product: Product, index: number) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        handleProductSelection(product);
                        setOpen(false);
                      }}
                      selected={props.selectedProduct?.id == product.id}
                    >
                      <TableCell>{product.code}</TableCell>
                      <TableCell>{product.name}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Dialog>
    </>
  );
}
