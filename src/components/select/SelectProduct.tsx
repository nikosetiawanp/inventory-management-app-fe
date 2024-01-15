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

  const handleProductSelection = (selectedProduct: Product) => {
    props.setSelectedProduct(selectedProduct);
    // props.setValue(
    //   `items[${props.index}].productId`,
    //   props.selectedProduct?.id
    // );

    setOpen(false);
  };

  return (
    <>
      <TextField
        id="outlined-basic"
        variant="outlined"
        size="small"
        sx={{ cursor: "pointer" }}
        onClick={() => setOpen(true)}
        value={props.selectedProduct?.name || ""}
      />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth={"md"}
      >
        <Stack padding={3}>
          {/* HEADER */}
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            marginBottom={2}
          >
            <Typography variant="h4">Pilih Produk</Typography>
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
                {productsQuery.data &&
                  productsQuery.data.map((product: Product, index: number) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        // props.setSelectedProduct(product);
                        handleProductSelection(product);
                        setOpen(false);
                      }}
                      selected={props.selectedProduct?.id == product.id}
                    >
                      <TableCell>{product.code}</TableCell>
                      <TableCell>{product.name}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Dialog>
    </>
  );
}
