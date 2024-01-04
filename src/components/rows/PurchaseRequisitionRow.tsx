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
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import MorePurchaseButton from "../buttons/MorePurchaseButton";
import { Item, Purchase } from "../../interfaces/interfaces";
import MoreVertPurchaseButton from "../buttons/MoreVertPurchaseButton";
import NewItemRow from "./NewItemRow";
import { Settings } from "@mui/icons-material";

export default function PurchaseRequisitionRow(props: {
  index: number;
  purchase: Purchase;
}) {
  const [open, setOpen] = useState(false);

  const calculateTotal = (
    quantity: number,
    price: number,
    discount: number,
    tax: number
  ) => {
    const priceTotal = quantity * price;
    const discountTotal = priceTotal * (discount / 100);
    const taxTotal = priceTotal * (tax / 100);

    const result = priceTotal - discountTotal + taxTotal;
    return result;
  };

  const calculateSum = (items: Item[]) => {
    const totals = items.map((item) =>
      calculateTotal(item.quantity, item.price, item.discount, item.tax)
    );
    let sum = 0;

    totals.forEach((price) => {
      sum += price;
    });

    return sum;
  };

  return (
    <>
      <TableRow
        key={props.index}
        hover
        sx={{ cursor: "pointer" }}
        onClick={() => setOpen(true)}
      >
        <TableCell>{props.purchase.prDate}</TableCell>
        <TableCell>{props.purchase.vendor.code}</TableCell>
        <TableCell>{props.purchase.vendor.name}</TableCell>
        <TableCell>{props.purchase.prNumber}</TableCell>
        <TableCell>
          <MoreVertPurchaseButton purchase={props.purchase} />
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
              <Typography variant="h4">{props.purchase.prNumber}</Typography>
              <Typography variant="body1">{props.purchase.prDate}</Typography>
              <Typography variant="body1">
                {props.purchase.vendor.name}
              </Typography>
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
                  <TableCell width={10}>
                    <IconButton size="small">
                      <Settings fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableHead>

              {props.purchase.items.length == 0 ? (
                <Stack bgcolor={"primary.main"}>
                  {/* <Typography>Belum ada produk</Typography> */}
                </Stack>
              ) : (
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
                  <NewItemRow index={0} />
                  {props.purchase.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.product.name}</TableCell>

                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="center">pcs</TableCell>
                      <TableCell align="center">{item.price}</TableCell>

                      {/* <EditableCell /> */}
                      <TableCell align="center">{item.discount}%</TableCell>
                      <TableCell align="center">{item.tax}%</TableCell>
                      <TableCell align="right">
                        {calculateTotal(
                          item.quantity,
                          item.price,
                          item.discount,
                          item.tax
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* <Typography>ASDFGHJKL</Typography> */}
                  {/* <NewItemRow index={0} /> */}
                </TableBody>
              )}
              {/* <Typography>SDFF</Typography> */}
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
              {calculateSum(props.purchase.items)}
            </Typography>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
}
