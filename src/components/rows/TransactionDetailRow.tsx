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
  InventoryItem,
  Transaction,
  TransactionItem,
} from "../../interfaces/interfaces";
import EditIcon from "@mui/icons-material/Edit";

import { useEffect, useState } from "react";
import EditTransactionItemRow from "./EditTransactionItemRow";
import DeleteTransactionItem from "../buttons/DeleteTransactionItem";
import { formatIDR } from "../../helpers/currencyHelpers";
import { calculateNetPrice } from "../../helpers/calculationHelpers";

export default function TransactionDetailRow(props: {
  transactionItem: TransactionItem;
  index: number;
  transaction: Transaction;
  inventories: Inventory[];
}) {
  const [editing, setEditing] = useState(false);

  const totalArrived = (productId: any) => {
    const inventoryItems = props.inventories?.map(
      (inventory: Inventory) => inventory.inventoryItems
    );

    const flattenedInventoryItems = [].concat(...(inventoryItems as any));
    const filteredByProductId = flattenedInventoryItems
      .filter((inventoryItem: any) => inventoryItem.productId == productId)
      .map((item: any) => item.quantity);

    const total = filteredByProductId.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    return total;
  };

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
          disabled={props.transaction.isApproved}
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
          <DeleteTransactionItem
            transaction={props.transaction}
            transactionItem={props.transactionItem}
          />
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
              totalArrived(props.transactionItem.productId) == 0
                ? "error"
                : totalArrived(props.transactionItem.productId) >=
                  props.transactionItem.quantity
                ? "success"
                : "warning"
            }
            label={
              totalArrived(props.transactionItem.productId) +
              " " +
              props.transactionItem.product.unit
            }
          />
        </TableCell>
        <TableCell align="right">
          {formatIDR(props.transactionItem.price)}
        </TableCell>

        <TableCell align="center">{props.transactionItem.discount}%</TableCell>
        <TableCell align="center">{props.transactionItem.tax}%</TableCell>
        <TableCell align="right">
          {formatIDR(
            calculateNetPrice(
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
