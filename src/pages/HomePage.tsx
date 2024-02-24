import { Card, Stack, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function HomePage() {
  return (
    // PAGE
    <Stack
      direction={"row"}
      height={"100vh"}
      width={"100vw"}
      justifyContent={"center"}
      alignItems={"center"}
      bgcolor={"border"}
    >
      {/* ITEMS */}
      {/* <Stack padding={4} gap={4} width={1} height={1} bgcolor={"border"}> */}
      <Stack direction={"column"} alignItems={"center"} gap={1}>
        <Card
          sx={{
            width: "70px",
            height: "70px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ShoppingCartIcon color="primary" fontSize="large" />
        </Card>
        <Typography variant="body1">Pembelian</Typography>
        {/* </Stack> */}
      </Stack>
    </Stack>
  );
}
