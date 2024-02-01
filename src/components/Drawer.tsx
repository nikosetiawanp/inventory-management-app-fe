import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";

import StorefrontIcon from "@mui/icons-material/Storefront";
import InventoryIcon from "@mui/icons-material/Inventory";

import CreateGlobalButton from "./buttons/CreateGlobalButton";

export default function Drawer() {
  // const urlParams = new URLSearchParams(window.location.search);
  // const param = urlParams.get('');
  const endpoint = window.location.pathname;

  const navigate = useNavigate();

  const links = [
    {
      name: "Daftar Vendor",
      param: "/vendor",
      category: "Daftar",
      icon: <StorefrontIcon />,
    },
    {
      name: "Daftar Produk",
      param: "/product",
      category: "Daftar",
      icon: <InventoryIcon />,
    },
    {
      name: "Purchase Requisition",
      param: "/purchase-requisition",
      category: "Pembelian",
    },
    {
      name: "Purchase Order",
      param: "/purchase-order",
      category: "Pembelian",
    },
    {
      name: "Faktur",
      param: "/invoices",
      category: "Pembelian",
    },
    {
      name: "Stok Gudang",
      param: "/inventory",
      category: "Gudang",
    },
    {
      name: "Gudang Masuk",
      param: "/inventory-arrival",
      category: "Gudang",
    },
    {
      name: "Gudang Keluar",
      param: "/inventory-departure",
      category: "Gudang",
    },
  ];
  return (
    <Box
      sx={{
        height: 1,
        minWidth: "256px",
        borderRight: 1,
        borderColor: "divider",
      }}
    >
      <Stack height={1}>
        <List>
          {/* LOGO */}
          <ListItem>
            <Skeleton variant="rounded" width={"100%"} height={50} />
          </ListItem>
          <Divider sx={{ marginY: 1 }} />
          {/* BUTTON */}
          <ListItem>
            <CreateGlobalButton />
            {/* <Button startIcon={<AddIcon />} variant="contained" size="large">
              Tambah
            </Button> */}
          </ListItem>

          {links.map((item, index) => (
            <div key={index}>
              {links[index]?.category !== links[index - 1]?.category && (
                <ListSubheader key={item.category}>
                  {item.category}
                </ListSubheader>
              )}
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => navigate(item.param)}
                  selected={endpoint == item.param}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name}></ListItemText>
                </ListItemButton>
              </ListItem>
            </div>
          ))}

          {/* PRODUK
          <ListItem dense>
            <ListItemButton>
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary={"Produk"}></ListItemText>
            </ListItemButton>
          </ListItem> */}
        </List>
      </Stack>
    </Box>
  );
}
