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

import AddIcon from "@mui/icons-material/Add";
import StorefrontIcon from "@mui/icons-material/Storefront";
import InventoryIcon from "@mui/icons-material/Inventory";

export default function Drawer() {
  //   const params = new URLSearchParams(window.location.pathname);
  //   const { params } = useParams();

  const navigate = useNavigate();

  const links = [
    {
      name: "Vendor",
      param: "/vendor",
      category: "Daftar",
      icon: <StorefrontIcon />,
    },
    {
      name: "Produk",
      param: "/product",
      category: "Daftar",
      icon: <InventoryIcon />,
    },
    {
      name: "Purchase Requisition",
      param: "/purchaserequisition",
      category: "Pembelian",
    },
    {
      name: "Purchase Order",
      param: "/purchaseorder",
      category: "Pembelian",
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
            {/* <Typography variant="h5">Logo</Typography> */}
          </ListItem>
          <Divider sx={{ marginY: 1 }} />
          {/* BUTTON */}
          <ListItem>
            <Button startIcon={<AddIcon />} variant="contained" size="large">
              Tambah
            </Button>
          </ListItem>

          {links.map((item, index) => (
            <>
              {links[index]?.category !== links[index - 1]?.category && (
                <ListSubheader key={item.category}>
                  {item.category}
                </ListSubheader>
              )}
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => navigate(item.param)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name}></ListItemText>
                </ListItemButton>
              </ListItem>
            </>
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
