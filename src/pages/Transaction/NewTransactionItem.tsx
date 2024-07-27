import {
  Autocomplete,
  AutocompleteOption,
  FormControl,
  IconButton,
  Input,
  ListItemContent,
  Stack,
} from "@mui/joy";
import { ClearIcon } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { Product } from "../../interfaces/interfaces";

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
    <>
      <tr>
        {/* PRODUCT */}
        <td>
          {/* <SelectProduct
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          control={props.control}
          index={props.index}
          update={props.update}
          setValue={props.setValue}
        /> */}
          {/* <SelectProductCopy
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          control={props.control}
          index={props.index}
          update={props.update}
          setValue={props.setValue}
        /> */}
          {/* AUTOCOMPLETE */}
          <FormControl>
            <Stack>
              {/* <FormLabel></FormLabel>{" "} */}
              <Autocomplete
                id="product"
                size="md"
                placeholder={"Pilih produk"}
                value={selectedProduct}
                onChange={(event, newValue) => {
                  event;
                  setSelectedProduct(newValue);
                }}
                inputValue={selectedProduct?.name}
                getOptionLabel={(option: Product) => option.name}
                options={props.products ? props.products : []}
                renderOption={(props, option: Product) => (
                  <AutocompleteOption {...props} key={option.id}>
                    <ListItemContent sx={{ fontSize: "sm" }}>
                      {option.name}
                    </ListItemContent>
                  </AutocompleteOption>
                )}
              />
            </Stack>
          </FormControl>
        </td>

        {/* QUANTITY */}
        <td>
          <Input
            id={`items[${props.index}].quantity`}
            variant="outlined"
            size="md"
            autoFocus
            onFocus={(e) => {
              e.target.select();
            }}
            {...register(`transactionItems[${props.index}].quantity`, {
              required: "Tidak boleh kosong",
            })}
            sx={{ textAlign: "center" }}
            endDecorator={selectedProduct?.unit}
          />
        </td>
        {/* UNIT */}
        <td></td>
        {/* HARGA */}
        <td>
          <Input
            id={`transactionItems[${props.index}].price`}
            variant="outlined"
            size="md"
            autoFocus
            onFocus={(e) => {
              e.target.select();
            }}
            startDecorator="Rp"
            {...register(`transactionItems[${props.index}].price`)}
          />
        </td>

        {/* DISCOUNT */}
        <td>
          <Input
            id={`transactionItems[${props.index}].discount`}
            variant="outlined"
            size="md"
            autoFocus
            onFocus={(e) => {
              e.target.select();
            }}
            endDecorator="%"
            {...register(`transactionItems[${props.index}].discount`, {
              required: "Tidak boleh kosong",
            })}
          />
        </td>
        {/* TAX */}
        <td>
          <Input
            id={`items[${props.index}].tax`}
            variant="outlined"
            size="md"
            autoFocus
            onFocus={(e: any) => {
              e.target.select();
            }}
            endDecorator="%"
            {...register(`transactionItems[${props.index}].tax`, {
              required: "Tidak boleh kosong",
            })}
          />
        </td>

        {/* REMOVE */}
        <td></td>
        <td width={10}>
          <IconButton size="sm" onClick={() => props.remove(props.index)}>
            <ClearIcon fontSize="small" />
          </IconButton>
        </td>
      </tr>
    </>
  );
}
