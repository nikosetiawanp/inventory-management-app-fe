import { Chip } from "@mui/joy";
import {
  Inventory,
  Transaction,
  TransactionItem,
} from "../../interfaces/interfaces";

import { useState } from "react";
import EditTransactionItemRow from "./EditTransactionItemRow";
import { formatIDR } from "../../helpers/currencyHelpers";
import { calculateNetPrice } from "../../helpers/calculationHelpers";

export default function TransactionDetailRow(props: {
  transactionItem: TransactionItem;
  index: number;
  transaction: Transaction;
  inventories: Inventory[];
}) {
  const [isEditing, setIsEditing] = useState(false);

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
              totalArrived(props.transactionItem.productId) > 0
                ? "success"
                : "danger"
            }
          >
            {totalArrived(props.transactionItem.productId) +
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
