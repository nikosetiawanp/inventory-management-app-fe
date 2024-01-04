import {
  IconButton,
  InputAdornment,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers";

export default function NewItemRow(props: { index: number }) {
  return (
    <TableRow key={props.index} selected>
      {/* PRODUCT */}
      <TableCell>
        <TextField id="product" variant="outlined" size="small" />
      </TableCell>
      {/* QUANTITY */}
      <TableCell width={75}>
        <TextField id="quantity" variant="outlined" size="small" />
      </TableCell>
      {/* UNIT */}
      <TableCell align="center">
        <Typography>kg</Typography>
      </TableCell>
      {/* PRICE */}
      <TableCell width={200}>
        <TextField
          id="price"
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">Rp</InputAdornment>
            ),
          }}
        />
      </TableCell>
      {/* DISCOUNT */}
      <TableCell width={80}>
        <TextField
          id="discount"
          variant="outlined"
          size="small"
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />
      </TableCell>
      {/* TAX */}
      <TableCell width={80}>
        <TextField
          id="tax"
          variant="outlined"
          size="small"
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />
      </TableCell>
      {/* TOTAL */}
      <TableCell align="right">
        <Typography>Rp 50,000.00</Typography>
      </TableCell>
      {/* OPTION */}
      <TableCell width={10}>
        <IconButton size="small">
          <ClearIcon fontSize="small" />
          {/* <Settings fontSize="small" /> */}
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
