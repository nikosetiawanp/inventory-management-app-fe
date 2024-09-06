import { MoreVert } from "@mui/icons-material";
import { Chip, IconButton, Input } from "@mui/joy";
import { useState } from "react";
import {
  Inventory,
  InventoryItem,
  TransactionItem,
} from "../../interfaces/interfaces";
import { SubmitHandler, useForm } from "react-hook-form";

import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

export default function InventoryDetailRow(props: {
  index: number;
  inventoryItem: InventoryItem;
  transactionItems: TransactionItem[];
  inventory: Inventory;
}) {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();

  const {
    register,
    formState: { errors },
  } = useForm<InventoryItem>();
  const [editing, setEditing] = useState(false);

  const updateInventoryItem = useMutation(
    async (data: InventoryItem) => {
      const dataToSubmit = {
        quantity: data.quantity,
        productId: props.inventoryItem.productId,
        inventoryId: props.inventoryItem.inventoryId,
      };

      try {
        const response = await axios.patch(
          BACKEND_URL + "inventory-items/" + props.inventoryItem.id,
          dataToSubmit
        );
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`inventoryItems.${props.inventory.id}`);
      },
    }
  );

  const onSubmit: SubmitHandler<InventoryItem> = async (data, event) => {
    try {
      await updateInventoryItem.mutateAsync(data);
      setEditing(false);
    } catch (error) {
      console.log(error);
    }
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
          size="sm"
          onClick={handleClick}
          aria-controls={open ? "demo-positioned-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </>
    );
  };

  return (
    <tr key={props.index}>
      {/* {index} */}
      <td>{props.inventoryItem?.product?.name}</td>
      <td align="center">
        {props.transactionItems[props.index].quantity}
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
