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

export default function NewItem(props: {
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
    // console.log("value changed");
    console.log(selectedProduct);
    props.setValue(`items[${props.index}].productId`, selectedProduct?.id);
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
        {/* <Autocomplete
          id={`items[${props.index}].productId`}
          autoHighlight
          options={props.products ? props.products : []}
          getOptionLabel={(option: Product) => `${option.name}`}
          value={selectedProduct}
          onChange={(event, value) => {
            setSelectedProduct(value);
            props.setValue(
              `items[${props.index}.productId]`,
              selectedProduct?.id
            );
          }}
          renderOption={(props, option) => (
            <Box
              component="li"
              sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
              {...props}
            >
              <Typography variant="body2">
                {option.code} - {option.name}
              </Typography>
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              inputProps={{
                ...params.inputProps,
              }}
              {...register(`items[${props.index}].productId`, {
                required: "Tidak boleh kosong",
              })}
              required
              size="small"
            />
          )}
        /> */}
      </TableCell>

      {/* QUANTITY */}
      <TableCell width={75}>
        <TextField
          id={`items[${props.index}].quantity`}
          variant="outlined"
          size="small"
          {...register(`items[${props.index}].quantity`, {
            required: "Tidak boleh kosong",
          })}
        />
      </TableCell>
      {/* UNIT */}
      <TableCell align="center">kg</TableCell>
      {/* PRICE */}
      <TableCell width={200}>
        <TextField
          id={`items[${props.index}].price`}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">Rp</InputAdornment>
            ),
          }}
          {...register(`items[${props.index}].price`, {
            required: "Tidak boleh kosong",
          })}
        />
      </TableCell>
      {/* DISCOUNT */}
      <TableCell width={80}>
        <TextField
          id={`items[${props.index}].discount`}
          variant="outlined"
          size="small"
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          {...register(`items[${props.index}].discount`, {
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
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          {...register(`items[${props.index}].tax`, {
            required: "Tidak boleh kosong",
          })}
        />
      </TableCell>
      {/* TOTAL */}
      {props.purchase.status == "PO" ? (
        <TableCell align="right"></TableCell>
      ) : null}
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
