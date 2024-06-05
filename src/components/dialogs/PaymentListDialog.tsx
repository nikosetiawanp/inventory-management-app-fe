import {
  Dialog,
  Stack,
  Typography,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
} from "@mui/material";
import { Contact, Debt, Payment } from "../../interfaces/interfaces";
import { useState } from "react";
import CreatePayment from "../buttons/CreatePayment";

export default function PaymentListDialog(props: { debt: Debt }) {
  // FORMAT CURRENCY
  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  // FORMAT DATE
  const formatDate = (inputDate: string) => {
    const date = new Date(inputDate);
    const options: any = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    const formattedDate = date.toLocaleDateString("id-ID", options);
    const [day, month, year] = formattedDate.split(" ");
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const monthIndex = monthNames.indexOf(month);
    if (monthIndex !== -1) {
      const indonesianMonth = monthNames[monthIndex];
      return `${day} ${indonesianMonth} ${year}`;
    }

    return formattedDate;
  };

  const [open, setOpen] = useState(false);
  //   const [searchInput, setSearchInput] = useState("");
  //   const filteredPaymentssQuery = props.debt?.payments.filter(
  //     (payment: Payment) =>
  //       payment.name.toLowerCase().includes(searchInput.toLowerCase()) ||
  //       payment.code.toLowerCase().includes(searchInput.toLowerCase())
  //   );

  return (
    <>
      {/* <Chip
        label={`${props.debt?.payments?.length} pembayaran`}
        variant="filled"
        color="primary"
        size="small"
        onClick={() => setOpen(true)}
      /> */}
      <Button
        variant="text"
        size="small"
        onClick={() => setOpen(true)}
      >{`${props.debt?.payments?.length} pembayaran`}</Button>
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

          {/* <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            borderColor={"divider"}
          >
            <TextField
              id="outlined-basic"
              placeholder="Cari vendor"
              variant="outlined"
              size="small"
              sx={{ width: 1 }}
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value);
              }}
            />
          </Stack> */}

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
                  <TableCell>Tanggal</TableCell>
                  <TableCell>Jumlah</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.debt?.payments.map((payment: Payment, index: number) => (
                  <TableRow key={index} hover sx={{ cursor: "pointer" }}>
                    <TableCell>{formatDate(payment?.date)}</TableCell>
                    <TableCell>
                      {currencyFormatter.format(payment?.amount)}
                    </TableCell>
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
