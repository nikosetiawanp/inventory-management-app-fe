import { Button, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";
import React from "react";

export default function YearFilterButton(props: {
  selectedYear: string;
  setSelectedYear: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const years = ["2024", "2023"];

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        endIcon={<ArrowDropDownIcon />}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={() => alert("clicked")}
      >
        {props.selectedYear}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {years.map((year) => (
          <MenuItem
            onClick={() => {
              props.setSelectedYear(year as any);
              handleClose();
            }}
            key={year}
          >
            {year}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
