import {
  Dialog,
  Stack,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";
import { Debt, Payment } from "../../interfaces/interfaces";
import { useState } from "react";
import CreatePayment from "../buttons/CreatePayment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { formatIDR } from "../../helpers/currencyHelpers";
import { formatDate } from "../../helpers/dateHelpers";

export default function PaymentListDialog(props: { debt: Debt }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Chip
        label={props.debt?.payments?.length}
        icon={<ReceiptIcon fontSize="small" />}
        color="primary"
        size="small"
        onClick={() => setOpen(true)}
      />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth={"sm"}
      >
        <Stack padding={3}>
          {/* HEADER */}
          <Stack direction={"row"} alignItems={"start"}>
            <Typography
              variant="h4"
              fontWeight={"bold"}
              marginBottom={2}
              marginRight={"auto"}
            >
              Daftar Pembayaran
            </Typography>
            <CreatePayment debt={props.debt} />
            {/* <CreateVendorButton /> */}
          </Stack>

          {/* TABLE */}
          <TableContainer
            sx={{
              backgroundColor: "white",
              height: 500,
            }}
          >
            <Table stickyHeader>
              <TableHead
                sx={{
                  position: "sticky",
                  backgroundColor: "white",
                  top: 0,
                  borderBottom: 1,
                  borderColor: "divider",
                  zIndex: 50,
                }}
              >
                <TableRow>
                  <TableCell>Tanggal Pembayaran</TableCell>
                  <TableCell>Jumlah</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.debt?.payments.map((payment: Payment, index: number) => (
                  <TableRow key={index} hover sx={{ cursor: "pointer" }}>
                    <TableCell>
                      {formatDate(payment?.date, "DD MMMM YYYY")}
                    </TableCell>
                    <TableCell>{formatIDR(payment?.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Dialog>
    </>
  );
}
