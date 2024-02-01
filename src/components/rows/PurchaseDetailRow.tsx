import { MoreVert } from "@mui/icons-material";
import {
  TableRow,
  TableCell,
  Chip,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Button,
  Stack,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Inventory, Purchase, PurchaseItem } from "../../interfaces/interfaces";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { register } from "module";
import { useForm } from "react-hook-form";
import EditPurchaseItemRow from "./EditPurchaseItemRow";

export default function PurchaseDetailRow(props: {
  purchaseItem: PurchaseItem;
  index: number;
  purchase: Purchase;
  inventories: Inventory[];
}) {
  const [editing, setEditing] = useState(false);
  // TOTAL ARRIVED
  const getTotalArrived = (productId: any) => {
    const inventoryItems = props.inventories.map(
      (inventory: Inventory) => inventory.inventoryItems
    );
    const filteredByProductId = [...inventoryItems.flat()]
      .filter((inventoryItem: any) => inventoryItem.productId == productId)
      .map((item: any) => item.quantity);

    const total = filteredByProductId.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    return total;
  };
  // TOTAL PRICE
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
  const calculateSum = (items: PurchaseItem[]) => {
    if (!items) return 0;
    const totals = items?.map((item: PurchaseItem) =>
      calculateTotal(item.quantity, item.prPrice, item.discount, item.tax)
    );
    let sum = 0;

    totals.forEach((price: number) => {
      sum += price;
    });
    return sum;
  };

  // FORMAT CURRENCY
  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  const OptionButton = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: any) => {
      event.stopPropagation();
      setAnchorEl(event.currentTarget);
    };
    const handleClose = (event: any) => {
      event.stopPropagation();
      setAnchorEl(null);
    };
    return (
      <>
        <IconButton
          size="small"
          onClick={handleClick}
          aria-controls={open ? "demo-positioned-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <MoreVert fontSize="small" />
        </IconButton>

        <Menu
          id="demo-positioned-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <MenuItem onClick={() => setEditing(true)}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Ubah</ListItemText>
          </MenuItem>
          {/* <DeleteInvoice invoice={props.invoice} /> */}
          {/* <DeleteProductButton product={props.product} /> */}
        </Menu>
      </>
    );
  };

  const Row = () => {
    return (
      <TableRow key={props.index}>
        <TableCell>{props.purchaseItem.product.name}</TableCell>

        <TableCell align="center">
          {props.purchaseItem.quantity} {props.purchaseItem.product.unit}
        </TableCell>
        {/* <TableCell align="center">pcs</TableCell> */}
        <TableCell align="right">
          {currencyFormatter.format(props.purchaseItem.prPrice)}
        </TableCell>
        <TableCell align="center">
          {props.purchaseItem.poPrice
            ? currencyFormatter.format(props.purchaseItem.poPrice)
            : currencyFormatter.format(props.purchaseItem.prPrice)}
        </TableCell>

        <TableCell align="center">{props.purchaseItem.discount}%</TableCell>
        <TableCell align="center">{props.purchaseItem.tax}%</TableCell>
        <TableCell align="right">
          {currencyFormatter.format(
            calculateTotal(
              props.purchaseItem.quantity,
              props.purchaseItem.prPrice,
              props.purchaseItem.discount,
              props.purchaseItem.tax
            )
          )}
        </TableCell>

        {props.purchase.status == "PO" ? (
          <TableCell align="center">
            <Chip
              size="small"
              variant="filled"
              color={
                getTotalArrived(props.purchaseItem.productId) == 0
                  ? "error"
                  : getTotalArrived(props.purchaseItem.productId) >=
                    props.purchaseItem.quantity
                  ? "success"
                  : "warning"
              }
              label={
                getTotalArrived(props.purchaseItem.productId) == 0
                  ? "Belum datang"
                  : getTotalArrived(props.purchaseItem.productId) ==
                    props.purchaseItem.quantity
                  ? "Lengkap"
                  : getTotalArrived(props.purchaseItem.productId) >
                    props.purchaseItem.quantity
                  ? `Kelebihan ${
                      getTotalArrived(props.purchaseItem.productId) -
                      props.purchaseItem.quantity
                    }`
                  : `Kurang ${
                      props.purchaseItem.quantity -
                      getTotalArrived(props.purchaseItem.productId)
                    }`
              }
            />
          </TableCell>
        ) : null}

        <TableCell align="center">
          <OptionButton />
        </TableCell>
      </TableRow>
    );
  };

  // const EditableRow = () => {
  //   const {
  //     register,
  //     handleSubmit,
  //     watch,
  //     formState: { errors },
  //   } = useForm();

  //   return (
  //     <TableRow>
  //       <TableCell>{props.purchaseItem?.product?.name}</TableCell>
  //       <TableCell>
  //         <TextField
  //           id={`quantity`}
  //           variant="outlined"
  //           size="small"
  //           defaultValue={props.purchaseItem.quantity}
  //           {...register(`quantity`, {
  //             required: "Tidak boleh kosong",
  //           })}
  //           sx={{ textAlign: "center" }}
  //           InputProps={{
  //             endAdornment: (
  //               <InputAdornment position="end">
  //                 {props.purchaseItem?.product?.unit}
  //               </InputAdornment>
  //             ),
  //           }}
  //         />
  //       </TableCell>
  //       <TableCell align="center">
  //         {currencyFormatter.format(props.purchaseItem.prPrice)}
  //         {/* <TextField
  //           id={`prPrice`}
  //           variant="outlined"
  //           size="small"
  //           defaultValue={props.purchaseItem.prPrice}
  //           {...register(`prPrice`, {
  //             required: "Tidak boleh kosong",
  //           })}
  //           sx={{ textAlign: "center" }}
  //           InputProps={{
  //             startAdornment: (
  //               <InputAdornment position="start">Rp</InputAdornment>
  //             ),
  //           }}
  //         /> */}
  //       </TableCell>
  //       <TableCell>
  //         <TextField
  //           id={`poPrice`}
  //           variant="outlined"
  //           size="small"
  //           defaultValue={
  //             props.purchaseItem.poPrice ? props.purchaseItem.poPrice : props.purchaseItem.prPrice
  //           }
  //           {...register(`poPrice`, {
  //             required: "Tidak boleh kosong",
  //           })}
  //           sx={{ textAlign: "center" }}
  //           InputProps={{
  //             startAdornment: (
  //               <InputAdornment position="start">Rp</InputAdornment>
  //             ),
  //           }}
  //         />
  //       </TableCell>
  //       <TableCell>
  //         <TextField
  //           id={`discount`}
  //           variant="outlined"
  //           size="small"
  //           defaultValue={props.purchaseItem.discount}
  //           InputProps={{
  //             endAdornment: <InputAdornment position="end">%</InputAdornment>,
  //           }}
  //           {...register(`discount`, {
  //             required: "Tidak boleh kosong",
  //           })}
  //         />
  //       </TableCell>
  //       <TableCell>
  //         <TextField
  //           id={`tax`}
  //           variant="outlined"
  //           size="small"
  //           defaultValue={props.purchaseItem.tax}
  //           InputProps={{
  //             endAdornment: <InputAdornment position="end">%</InputAdornment>,
  //           }}
  //           {...register(`tax`, {
  //             required: "Tidak boleh kosong",
  //           })}
  //         />
  //       </TableCell>
  //       <TableCell></TableCell>
  //       <TableCell>
  //         <Chip
  //           size="small"
  //           variant="filled"
  //           color={
  //             getTotalArrived(props.purchaseItem.productId) == 0
  //               ? "error"
  //               : getTotalArrived(props.purchaseItem.productId) >= props.purchaseItem.quantity
  //               ? "success"
  //               : "warning"
  //           }
  //           label={
  //             getTotalArrived(props.purchaseItem.productId) == 0
  //               ? "Belum datang"
  //               : getTotalArrived(props.purchaseItem.productId) == props.purchaseItem.quantity
  //               ? "Lengkap"
  //               : getTotalArrived(props.purchaseItem.productId) > props.purchaseItem.quantity
  //               ? `Kelebihan ${
  //                   getTotalArrived(props.purchaseItem.productId) - props.purchaseItem.quantity
  //                 }`
  //               : `Kurang ${
  //                   props.purchaseItem.quantity - getTotalArrived(props.purchaseItem.productId)
  //                 }`
  //           }
  //         />
  //       </TableCell>
  //       <TableCell align="center">
  //         <Stack direction="row">
  //           <IconButton size="small" color="primary">
  //             <CheckIcon fontSize="small" />
  //           </IconButton>
  //           <IconButton
  //             size="small"
  //             color="error"
  //             onClick={() => setEditing(false)}
  //           >
  //             <CloseIcon fontSize="small" />
  //           </IconButton>
  //         </Stack>
  //       </TableCell>
  //     </TableRow>
  //   );
  // };

  return editing ? (
    <EditPurchaseItemRow
      purchaseItem={props.purchaseItem}
      editing={editing}
      setEditing={setEditing}
      inventories={props.inventories}
      purchase={props.purchase}
    />
  ) : (
    <Row />
  );
}
