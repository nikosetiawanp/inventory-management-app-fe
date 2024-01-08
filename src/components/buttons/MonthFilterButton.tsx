import { Button, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";
import React from "react";

export default function MonthFilterButton(props: {
  selectedMonth: string;
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const months = [
    {
      id: 1,
      name: "Januari",
    },
    {
      id: 2,
      name: "Februari",
    },
    {
      id: 3,
      name: "Maret",
    },
    {
      id: 4,
      name: "April",
    },
    {
      id: 5,
      name: "Mei",
    },
    {
      id: 6,
      name: "Juni",
    },
    {
      id: 7,
      name: "Juli",
    },
    {
      id: 8,
      name: "Agustus",
    },
    {
      id: 9,
      name: "September",
    },
    {
      id: 10,
      name: "Oktober",
    },
    {
      id: 11,
      name: "November",
    },
    {
      id: 12,
      name: "Desember",
    },
  ];
  return (
    <>
      <Button
        variant="outlined"
        size="small"
        endIcon={<ArrowDropDownIcon />}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {props.selectedMonth}
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
        {months.map((month) => (
          <MenuItem
            onClick={() => {
              props.setSelectedMonth(month.name);
              handleClose();
            }}
            key={month.id}
          >
            {month.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
