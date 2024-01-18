import {
  TableRow,
  TableCell,
  Autocomplete,
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { Product } from "../../interfaces/interfaces";
import SelectProduct from "../select/SelectProduct";

export default function NewPurchaseItem(props: {
  update: any;
  index: any;
  value: any;
  control: any;
  products: Product[];
  inventory: any;
  remove: any;
  watch: any;
  fields: any;
  setValue: any;
}) {
  const { register } = props.control;
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    console.log(selectedProduct);
    props.setValue(
      `inventoryItems[${props.index}].productId`,
      selectedProduct?.id
    );
  }, [selectedProduct]);

  return (
    <TableRow>
      {/* PRODUCT */}
      <TableCell>
        <SelectProduct
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          control={props.control}
          index={props.index}
          update={props.update}
          setValue={props.setValue}
        />
      </TableCell>

      {/* QUANTITY */}
      <TableCell width={75}>
        <TextField
          id={`items[${props.index}].quantity`}
          variant="outlined"
          size="small"
          {...register(`inventoryItems[${props.index}].quantity`, {
            required: "Tidak boleh kosong",
          })}
          sx={{ textAlign: "center" }}
        />
      </TableCell>
      {/* UNIT */}
      {/* <TableCell align="center">{selectedProduct?.unit}</TableCell> */}
      <TableCell></TableCell>
      {/* REMOVE */}
      <TableCell width={10}>
        <IconButton size="small" onClick={() => props.remove(props.index)}>
          <ClearIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
