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
  Stack,
  Typography,
} from "@mui/material";

import { Link, useNavigate, useParams } from "react-router-dom";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AddIcon from "@mui/icons-material/Add";

export default function Drawer() {
  //   const params = new URLSearchParams(window.location.pathname);
  //   const { params } = useParams();

  const navigate = useNavigate();

  const links = [
    { name: "Vendor", param: "/vendor", category: "Daftar" },
    { name: "Produk", param: "/product", category: "Daftar" },
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
            <Typography variant="h5">{}</Typography>
          </ListItem>
          <Divider />
          {/* BUTTON */}
          <ListItem>
            <Button startIcon={<AddIcon />} variant="contained" size="large">
              Tambah
            </Button>
          </ListItem>

          {links.map((item, index) => (
            <>
              {links[index]?.category !== links[index - 1]?.category && (
                <ListSubheader key={index}>{item.category}</ListSubheader>
              )}
              <ListItem dense key={index}>
                <ListItemButton onClick={() => navigate(item.param)}>
                  <ListItemIcon>
                    <StorefrontIcon />
                  </ListItemIcon>
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
