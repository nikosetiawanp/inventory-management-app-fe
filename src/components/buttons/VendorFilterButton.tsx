import { Button } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function YearFilterButton() {
  return (
    <>
      <Button variant="outlined" size="small" endIcon={<ArrowDropDownIcon />}>
        Semua Vendor
      </Button>
    </>
  );
}
