import { Button } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function YearFilterButton(props: {
  selectedYear: string | number;
  setSelectedYear: any;
}) {
  return (
    <>
      <Button variant="outlined" size="small" endIcon={<ArrowDropDownIcon />}>
        {props.selectedYear}
      </Button>
    </>
  );
}
