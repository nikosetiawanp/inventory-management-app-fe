import { Autocomplete, Box, Button, TextField } from "@mui/material";
import axios from "axios";
import { useQuery } from "react-query";
import { Product } from "../../interfaces/interfaces";
import { createFilterOptions } from "@mui/material/Autocomplete";

export default function SelectProductCopy(props: {
  selectedProduct: Product | null;
  setSelectedProduct: any;
  control: any;
  index: number;
  update: any;
  setValue: any;
}) {
  // GET PURCHASES
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const getProducts = async () => {
    const response = await axios.get(BACKEND_URL + "products");
    return response.data.data;
  };
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    refetchOnWindowFocus: false,
  });

  const filterOptions = createFilterOptions<Product>({
    stringify: (option: Product) => `${option.code}${option.name}`,
  });

  return (
    <>
      <Autocomplete
        id="country-select-demo"
        sx={{ width: 300 }}
        options={[...productsQuery.data]}
        autoHighlight
        getOptionLabel={(option: Product) => `${option.code} - ${option.name}`}
        filterOptions={filterOptions}
        onChange={(event, value) => {
          event;
          props.setSelectedProduct(value);
        }}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
            {...props}
            key={option.id}
          >
            {option.code} - {option.name}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            label="Pilih produk"
            inputProps={{
              ...params.inputProps,
              autoComplete: "new-password",
            }}
          />
        )}
      />
    </>
  );
}
