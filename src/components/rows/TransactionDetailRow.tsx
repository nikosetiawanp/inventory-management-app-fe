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
} from "@mui/material";
import {
  Inventory,
  Transaction,
  TransactionItem,
} from "../../interfaces/interfaces";
import EditIcon from "@mui/icons-material/Edit";

import { useState } from "react";
import EditTransactionItemRow from "./EditTransactionItemRow";

export default function TransactionDetailRow(props: {
  transactionItem: TransactionItem;
  index: number;
  transaction: Transaction;
  inventories: Inventory[];
}) {
  const [editing, setEditing] = useState(false);
  // TOTAL ARRIVED
  const getTotalArrived = (productId: any) => {
    // if (props.inventories.length == 0) return 0;
    // const inventoryItems = props.inventories?.map(
    //   (inventory: Inventory) => inventory?.inventoryItems
    // );
    // const filteredByProductId = [...inventoryItems.flat()]
    //   .filter((inventoryItem: any) => inventoryItem?.productId == productId)
    //   .map((item: any) => item.quantity);

    // const total = filteredByProductId.reduce(
    //   (accumulator, currentValue) => accumulator + currentValue,
    //   0
    // );
    // return total;
    return 0;
  };
  // const getTotalArrived = (productId: any) => {
  //   const inventoryItems = props.inventories?.map(
  //     (inventory: Inventory) => inventory.inventoryItems
  //   );

  //   // Flatten the array manually using concat and the spread operator
  //   const flattenedInventoryItems = [].concat(...inventoryItems);

  //   const filteredByProductId = flattenedInventoryItems
  //     .filter((inventoryItem: any) => inventoryItem.productId == productId)
  //     .map((item: any) => item.quantity);

  //   const total = filteredByProductId.reduce(
  //     (accumulator, currentValue) => accumulator + currentValue,
  //     0
  //   );
  //   return total;
  // };
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
  // const calculateSum = (items: TransactionItem[]) => {
  //   if (!items) return 0;
  //   const totals = items?.map((item: TransactionItem) =>
  //     calculateTotal(item.quantity, item.price, item.discount, item.tax)
  //   );
  //   let sum = 0;

  //   totals.forEach((price: number) => {
  //     sum += price;
  //   });
  //   return sum;
  // };

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
        <TableCell>{props.transactionItem.product.name}</TableCell>

        <TableCell align="center">
          {props.transactionItem.quantity} {props.transactionItem.product.unit}
        </TableCell>

        <TableCell align="center">
          <Chip
            size="small"
            variant="filled"
            color={
              getTotalArrived(props.transactionItem.productId) == 0
                ? "error"
                : getTotalArrived(props.transactionItem.productId) >=
                  props.transactionItem.quantity
                ? "success"
                : "warning"
            }
            label={
              getTotalArrived(props.transactionItem.productId) +
              " " +
              props.transactionItem.product.unit
            }
          />
          {/* <Typography
            color={
              getTotalArrived(props.purchaseItem.productId) == 0
                ? "error"
                : getTotalArrived(props.purchaseItem.productId) >=
                  props.purchaseItem.quantity
                ? "success.main"
                : "warning.main"
            }
          >
            {getTotalArrived(props.purchaseItem.productId)}{" "}
            {props.purchaseItem.product.unit}
          </Typography> */}

          {/* <Chip
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
            label={getTotalArrived(props.purchaseItem.productId)}
          /> */}
        </TableCell>
        <TableCell align="right">
          {currencyFormatter.format(props.transactionItem.price)}
        </TableCell>

        <TableCell align="center">{props.transactionItem.discount}%</TableCell>
        <TableCell align="center">{props.transactionItem.tax}%</TableCell>
        <TableCell align="right">
          {currencyFormatter.format(
            calculateTotal(
              props.transactionItem.quantity,
              props.transactionItem.price,
              props.transactionItem.discount,
              props.transactionItem.tax
            )
          )}
        </TableCell>

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
    <EditTransactionItemRow
      transactionItem={props.transactionItem}
      editing={editing}
      setEditing={setEditing}
      inventories={props.inventories}
      transaction={props.transaction}
    />
  ) : (
    <Row />
  );
}
