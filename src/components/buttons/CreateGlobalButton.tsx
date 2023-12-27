import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

import StorefrontIcon from "@mui/icons-material/Storefront";
import InventoryIcon from "@mui/icons-material/Inventory";
import CreateProductForm from "../forms/CreateProductForm";
import CreateVendorForm from "../forms/CreateVendorForm";

export default function CreateGlobalButton() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [productFormOpen, setProductFormOpen] = useState(false);
  const [vendorFormOpen, setVendorFormOpen] = useState(false);

  return (
    <div>
      <Button
        id="demo-positioned-button"
        onClick={handleClick}
        startIcon={<AddIcon />}
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        size="large"
      >
        Tambah
      </Button>

      <Menu
        id="demo-positioned-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <MenuItem
          onClick={() => {
            setVendorFormOpen(true);
            handleClose();
          }}
        >
          <ListItemIcon>
            <StorefrontIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Vendor Baru</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setProductFormOpen(true);
            handleClose();
          }}
        >
          <ListItemIcon>
            <InventoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Produk Baru</ListItemText>
        </MenuItem>
      </Menu>

      <CreateProductForm open={productFormOpen} setOpen={setProductFormOpen} />
      <CreateVendorForm open={vendorFormOpen} setOpen={setVendorFormOpen} />
    </div>
  );
}
