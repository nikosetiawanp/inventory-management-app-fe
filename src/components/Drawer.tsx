import {
  Avatar,
  Box,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemDecorator,
  ListSubheader,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { useNavigate } from "react-router-dom";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CategoryIcon from "@mui/icons-material/Category";
import InputIcon from "@mui/icons-material/Input";
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
      category: "List",
      icon: <AccountCircleIcon fontSize="small" />,
    },
    {
      name: "Produk",
      param: "/product",
      category: "List",
      icon: <CategoryIcon fontSize="small" />,
    },
    {
      name: "Akun",
      param: "/account",
      category: "List",
      icon: <AccountBalanceIcon fontSize="small" />,
    },
    // PURCHASE
    {
      name: "Purchase Order",
      param: "/purchase-order",
      category: "Pembelian",
      icon: <ShoppingCartIcon fontSize="small" />,
    },
    {
      name: "Faktur",
      param: "/purchase-invoice",
      category: "Pembelian",
      icon: <ReceiptIcon fontSize="small" />,
    },
    // SALES
    {
      name: "Penjualan",
      param: "/sales-order",
      category: "Penjualan",
      icon: <ShoppingCartIcon fontSize="small" />,
    },
    {
      name: "Faktur",
      param: "/sales-invoice",
      category: "Penjualan",
      icon: <ReceiptIcon fontSize="small" />,
    },
    // DEBT
    {
      name: "Hutang",
      param: "/debt",
      category: "Hutang Piutang",
      icon: <PaidIcon fontSize="small" />,
    },
    {
      name: "Piutang",
      param: "/receivable",
      category: "Hutang Piutang",
    },
    // INVENTORY
    {
      name: "Gudang",
      param: "/inventory",
      category: "Gudang",
      icon: <InputIcon fontSize="small" />,
    },
    {
      name: "Kas",
      param: "/cash",
      category: "Kas",
      icon: <AccountBalanceWalletIcon fontSize="small" />,
    },
    {
      name: "General",
      param: "/general",
      category: "Kas",
      icon: <BalanceIcon fontSize="small" />,
    },
  ];

  return (
    <Sheet
      sx={{
        height: 1,
        minWidth: "256px",
        borderRight: 1,
        borderColor: "divider",
        direction: "column",
      }}
    >
      {/* OVERFLOW */}
      <Stack height={1} overflow={"scroll"}>
        {/* LOGO */}
        <Stack paddingX={2} paddingY={1}>
          <DialogTitle level="title-lg">Logo</DialogTitle>
        </Stack>
        <Divider sx={{ marginY: 1 }} />
        <DialogContent>
          <List size="md">
            {links.map((item, index) => (
              <ListItem nested key={index}>
                {links[index]?.category !== links[index - 1]?.category && (
                  <ListSubheader
                    key={item.category}
                    sx={{ marginTop: index > 0 ? 1.5 : 0 }}
                    // sx={index > 0 && { marginTop: 1 }}
                  >
                    {/* <b> */}
                    {item.category}
                    {/* </b> */}
                  </ListSubheader>
                )}
                <ListItemButton
                  color={item.param == endpoint ? "primary" : "neutral"}
                  variant={item.param == endpoint ? "soft" : "plain"}
                  sx={{ marginX: "1px", borderRadius: 1 }}
                  onClick={() => navigate(item.param)}
                  // selected={item.param == endpoint}
                >
                  <ListItemDecorator>{item.icon}</ListItemDecorator>
                  {item.name}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>

        {/* USER */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            p: 1.5,
            pb: 2,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Avatar size="lg" />
          <div>
            <Typography level="title-md">Username</Typography>
            <Typography level="body-sm">joined 20 Jun 2023</Typography>
          </div>
        </Box>
      </Stack>
    </Sheet>
  );
}
