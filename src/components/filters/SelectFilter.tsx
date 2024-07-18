import { Button, Menu, MenuItem } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import * as React from "react";
import { useState } from "react";

export default function SelectFilter(props: {
  selected: any;
  setSelected: (selected: any) => void;
  options: {
    label: any;
    key: any;
  }[];
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleKeyDown = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const label = props.options.filter(
    (option) => option.key == props.selected
  )[0]?.label;

  return (
    <>
      {/* BUTTON */}
      <Button
        color={"primary"}
        variant="contained"
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
      >
        {label}
      </Button>

      {/* SORT */}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        autoFocus={false}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        onKeyDown={handleKeyDown}
      >
        {props.options.map((option) => (
          <MenuItem
            key={option.key}
            onClick={() => {
              props.setSelected(option.key);
              handleClose();
            }}
            selected={props.selected == option.key}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
