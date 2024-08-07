import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Skeleton,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CategoryIcon from "@mui/icons-material/Category";
import InputIcon from "@mui/icons-material/Input";
import OutputIcon from "@mui/icons-material/Output";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PaidIcon from "@mui/icons-material/Paid";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BalanceIcon from "@mui/icons-material/Balance";

export default function Drawer() {
  const endpoint = window.location.pathname;
  const navigate = useNavigate();
  const links = [
    {
      name: "Kontak",
      param: "/contact",
      category: "Daftar",
      icon: <AccountCircleIcon />,
    },
    {
      name: "Produk",
      param: "/product",
      category: "Daftar",
      icon: <CategoryIcon />,
    },
    {
      name: "Akun",
      param: "/account",
      category: "Daftar",
      icon: <AccountBalanceIcon />,
    },
    // PURCHASE
    {
      name: "Purchase Order",
      param: "/purchase-order",
      category: "Pembelian",
      icon: <ShoppingCartIcon />,
    },
    {
      name: "Faktur",
      param: "/purchase-invoice",
      category: "Pembelian",
      icon: <ReceiptIcon />,
    },
    // SALES
    {
      name: "Penjualan",
      param: "/sales-order",
      category: "Penjualan",
      icon: <ShoppingCartIcon />,
    },
    {
      name: "Faktur",
      param: "/sales-invoice",
      category: "Penjualan",
      icon: <ReceiptIcon />,
    },
    // DEBT
    {
      name: "Hutang",
      param: "/debt",
      category: "Hutang",
      icon: <PaidIcon />,
    },
    {
      name: "Pembayaran Hutang",
      param: "/debt-payment",
      category: "Hutang",
    },
    // INVENTORY
    {
      name: "Gudang Masuk",
      param: "/inventory-arrival",
      category: "Gudang",
      icon: <InputIcon />,
    },
    {
      name: "Gudang Keluar",
      param: "/inventory-departure",
      category: "Gudang",
      icon: <OutputIcon />,
    },
    {
      name: "Kas",
      param: "/cash",
      category: "Kas",
      icon: <AccountBalanceWalletIcon />,
    },
    {
      name: "General",
      param: "/general",
      category: "Kas",
      icon: <BalanceIcon />,
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
      <Stack height={1} overflow={"scroll"}>
        <List>
          {/* LOGO */}
          <ListItem>
            <Skeleton variant="rounded" width={"100%"} height={50} />
          </ListItem>
          <Divider sx={{ marginY: 1 }} />
          {/* BUTTON */}
          <ListItem></ListItem>

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
