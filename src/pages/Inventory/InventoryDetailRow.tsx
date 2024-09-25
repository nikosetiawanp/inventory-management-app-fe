import { Chip, Input } from "@mui/joy";
import { useState } from "react";
import {
  Inventory,
  InventoryItem,
  TransactionItem,
} from "../../interfaces/interfaces";
import { useForm } from "react-hook-form";

export default function InventoryDetailRow(props: {
  index: number;
  inventoryItem: InventoryItem;
  transactionItems: TransactionItem[];
  inventory: Inventory;
}) {
  const {
    register,
    formState: {},
  } = useForm<InventoryItem>();
  const [editing] = useState(false);

  return (
    <tr key={props.index}>
      {/* {index} */}
      <td>{props.inventoryItem?.product?.name}</td>
      <td align="center">
        {props.transactionItems[props.index].quantity}{" "}
        {props.transactionItems[props.index].product.unit}
      </td>
      {/* QUANTITY */}
      <td align="center" style={{ width: 100 }}>
        {editing ? (
          <Input
            id={`quantity`}
            variant="outlined"
            size="sm"
            autoFocus
            onFocus={(e) => {
              e.target.select();
            }}
            {...register(`quantity`, {
              required: "Tidak boleh kosong",
            })}
            sx={{ textAlign: "center" }}
            endDecorator={props.inventoryItem?.product?.unit}
          />
        ) : (
          <Chip
            size="sm"
            color={
              props.inventoryItem.quantity == 0
                ? "danger"
                : props.inventoryItem.quantity >=
                  props.transactionItems[props.index].quantity
                ? "success"
                : "warning"
            }
          >
            {props.inventoryItem.quantity} {props.inventoryItem.product.unit}
          </Chip>
        )}
      </td>
    </tr>
  );
}
