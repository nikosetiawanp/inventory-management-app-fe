import { Chip } from "@mui/joy";
import {
  Inventory,
  Transaction,
  TransactionItem,
} from "../../interfaces/interfaces";

import { useState } from "react";
import EditTransactionItemRow from "./EditTransactionItemRow";
import { formatIDR } from "../../helpers/currencyHelpers";
import { calculateNetPrice, sum } from "../../helpers/calculationHelpers";

export default function TransactionDetailRow(props: {
  transactionItem: TransactionItem;
  index: number;
  transaction: Transaction;
  inventories: Inventory[];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const calculateTotalArrived = (productId: any) => {
    const inventoryItems = props.inventories?.map(
      (inventory: Inventory) => inventory.inventoryItems
    );

    const mergedInventoryItems = [].concat(...(inventoryItems as any));
    const arrayOfArrivedQuantity = mergedInventoryItems
      .filter((inventoryItem: any) => inventoryItem.productId == productId)
      .map((item: any) => item.quantity);

    return sum(arrayOfArrivedQuantity);
  };

  const Row = () => {
    return (
      <tr key={props.index}>
        <td>{props.transactionItem.product.name}</td>

        <td align="center">
          {props.transactionItem.quantity} {props.transactionItem.product.unit}
        </td>

        <td align="center">
          <Chip
            size="sm"
            variant="soft"
            color={
              calculateTotalArrived(props.transactionItem.productId) <
              props.transactionItem.quantity
                ? "neutral"
                : "success"
            }
          >
            {calculateTotalArrived(props.transactionItem.productId) +
              " " +
              props.transactionItem.product.unit}
          </Chip>
        </td>
        <td align="right">{formatIDR(props.transactionItem.price)}</td>
        <td align="center">{props.transactionItem.discount}%</td>
        <td align="center">{props.transactionItem.tax}%</td>
        <td style={{ textAlign: "right" }}>
          {formatIDR(
            calculateNetPrice(
              props.transactionItem.quantity,
              props.transactionItem.price,
              props.transactionItem.discount,
              props.transactionItem.tax
            )
          )}
        </td>
        <td align="center">{/* <OptionButton /> */}</td>
      </tr>
    );
  };

  return isEditing ? (
    <EditTransactionItemRow
      transactionItem={props.transactionItem}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      inventories={props.inventories}
      transaction={props.transaction}
    />
  ) : (
    <Row />
  );
}
