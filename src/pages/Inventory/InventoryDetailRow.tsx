import { MoreVert } from "@mui/icons-material";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TableRow,
  TableCell,
  Chip,
  InputAdornment,
  TextField,
  Stack,
} from "@mui/material";
import { useState } from "react";
import {
  Inventory,
  InventoryItem,
  TransactionItem,
} from "../../interfaces/interfaces";
import EditIcon from "@mui/icons-material/Edit";
import { SubmitHandler, useForm } from "react-hook-form";
import CheckIcon from "@mui/icons-material/Check";

import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

export default function InventoryDetailRow(props: {
  index: number;
  inventoryItem: InventoryItem;
  purchaseItems: TransactionItem[];
  inventory: Inventory;
}) {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
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
        </Menu>
      </>
    );
  };

  return (
    <TableRow key={props.index}>
      {/* {index} */}
      <TableCell>{props.inventoryItem?.product?.name}</TableCell>
      <TableCell align="center">
        {props.purchaseItems[props.index].quantity}{" "}
        {props.purchaseItems[props.index].product.unit}
      </TableCell>
      {/* QUANTITY */}
      <TableCell align="center" width={100}>
        {editing ? (
          <TextField
            id={`quantity`}
            size="small"
            defaultValue={props.inventoryItem?.quantity}
            {...register(`quantity`, {
              required: "Tidak boleh kosong",
            })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {props.inventoryItem.product?.unit}
                </InputAdornment>
              ),
            }}
          />
        ) : (
          <Chip
            size="small"
            variant="filled"
            color={
              props.inventoryItem.quantity == 0
                ? "error"
                : props.inventoryItem.quantity >=
                  props.purchaseItems[props.index].quantity
                ? "success"
                : "warning"
            }
            label={
              props.inventoryItem.quantity +
              " " +
              props.inventoryItem.product.unit
            }
          />
        )}
      </TableCell>
      {/* OPTIONS */}
      {/* <TableCell width={10}>
        {editing ? (
          <Stack direction="row" justifyContent="center">
            <IconButton
              size="small"
              color="primary"
              onClick={handleSubmit(onSubmit as any)}
            >
              <CheckIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => setEditing(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        ) : (
          <OptionButton />
        )}
      </TableCell> */}
    </TableRow>
  );
}
