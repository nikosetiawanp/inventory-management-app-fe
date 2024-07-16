import {
  TableRow,
  TableCell,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { Product } from "../../interfaces/interfaces";
import SelectProduct from "../../components/select/SelectProduct";
import SelectProductCopy from "../../components/select/SelectProductCopy";

export default function NewTransactionItem(props: {
  update: any;
  index: any;
  value: any;
  control: any;
  products: Product[];
  purchase: any;
  remove: any;
  watch: any;
  fields: any;
  setValue: any;
}) {
  const { register } = props.control;
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    props.setValue(
      `transactionItems[${props.index}].productId`,
      selectedProduct?.id
    );
  }, [selectedProduct]);

  return (
    <TableRow>
      {/* PRODUCT */}
      <TableCell>
        {/* <SelectProduct
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          control={props.control}
          index={props.index}
          update={props.update}
          setValue={props.setValue}
        /> */}
        <SelectProductCopy
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          control={props.control}
          index={props.index}
          update={props.update}
          setValue={props.setValue}
        />
      </TableCell>

      {/* QUANTITY */}
      <TableCell width={100}>
        <TextField
          id={`items[${props.index}].quantity`}
          variant="outlined"
          size="small"
          autoFocus
          onFocus={(e) => {
            e.target.select();
          }}
          {...register(`transactionItems[${props.index}].quantity`, {
            required: "Tidak boleh kosong",
          })}
          sx={{ textAlign: "center" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {selectedProduct?.unit}
              </InputAdornment>
            ),
          }}
        />
      </TableCell>
      {/* UNIT */}
      <TableCell></TableCell>
      {/* HARGA */}
      <TableCell width={200}>
        <TextField
          id={`transactionItems[${props.index}].price`}
          variant="outlined"
          size="small"
          autoFocus
          onFocus={(e) => {
            e.target.select();
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">Rp</InputAdornment>
            ),
          }}
          {...register(`transactionItems[${props.index}].price`)}
        />
      </TableCell>

      {/* DISCOUNT */}
      <TableCell width={80}>
        <TextField
          id={`transactionItems[${props.index}].discount`}
          variant="outlined"
          size="small"
          autoFocus
          onFocus={(e) => {
            e.target.select();
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          {...register(`transactionItems[${props.index}].discount`, {
            required: "Tidak boleh kosong",
          })}
        />
      </TableCell>
      {/* TAX */}
      <TableCell width={80}>
        <TextField
          id={`items[${props.index}].tax`}
          variant="outlined"
          size="small"
          autoFocus
          onFocus={(e) => {
            e.target.select();
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          {...register(`transactionItems[${props.index}].tax`, {
            required: "Tidak boleh kosong",
          })}
        />
      </TableCell>

      {/* REMOVE */}
      <TableCell></TableCell>
      <TableCell width={10}>
        <IconButton size="small" onClick={() => props.remove(props.index)}>
          <ClearIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
