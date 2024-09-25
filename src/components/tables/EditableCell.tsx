import { TableCell, InputBase, Menu } from "@mui/material";
import { useState } from "react";

export default function EditableCell() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <TableCell sx={{ cursor: "pointer" }} onClick={handleClick} align="right">
        Rp 100,000.00
      </TableCell>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <InputBase sx={{ paddingX: 2 }} />
      </Menu>

      {/* {isEditing && (
        <TableCell padding="none" sx={{ position: "relative" }}>
          <Paper
            elevation={4}
            sx={{ padding: 2, position: "absolute", top: 0 }}
          >
            <InputBase />
          </Paper>
        </TableCell>
      )} */}
    </>
  );
}
