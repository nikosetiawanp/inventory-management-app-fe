import {
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Drawer from "../components/Drawer";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Debt, Payment } from "../interfaces/interfaces";
import RowSkeleton from "../components/skeletons/RowSkeleton";

export default function DebtPaymentPage() {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
  const selectedYear = formattedDate.split("-")[0];
  const selectedMonth = formattedDate.split("-")[1];

  // GET DEBTS
  const getDebtPayments = async () => {
    const response = await axios.get(BACKEND_URL + "payments");
    console.log(response.data.data);

    return response.data.data;
  };

  const debtPaymentsQuery = useQuery({
    queryKey: ["payments"],
    queryFn: getDebtPayments,
    refetchOnWindowFocus: false,
    enabled: true,
  });

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

  // FORMAT CURRENCY
  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  return (
    <Stack direction={"row"} height={"100vh"} width={"100vw"}>
      <Drawer />
      <Stack padding={4} gap={4} width={1}>
        <Typography fontWeight={"bold"} variant="h4">
          Daftar Pembayaran
        </Typography>

        {/* NAVS */}
        <Stack direction={"row"} gap={2} width={1}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={["month", "year"]}
              slotProps={{ textField: { size: "small" } }}
              value={selectedDate}
              onChange={(newValue: any) => setSelectedDate(newValue)}
              format="MMMM YYYY"
            />
          </LocalizationProvider>
          <Button
            size="small"
            variant="contained"
            onClick={() => debtPaymentsQuery.refetch()}
            disabled={
              debtPaymentsQuery.isRefetching || debtPaymentsQuery.isLoading
            }
          >
            {debtPaymentsQuery.isRefetching || debtPaymentsQuery.isLoading ? (
              <CircularProgress size={15} color="inherit" />
            ) : (
              <RefreshIcon fontSize="small" />
            )}
          </Button>
        </Stack>

        <TableContainer
          sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}
        >
          <Table sx={{ borderCollapse: "separate" }} size="small">
            <TableHead
              sx={{
                position: "sticky",
                backgroundColor: "white",
                top: 0,
                border: 2,
                borderColor: "divider",
                zIndex: 50,
              }}
            >
              <TableRow>
                <TableCell>Tanggal Bayar</TableCell>
                <TableCell>Tanggal Jatuh Tempo</TableCell>
                <TableCell>Jumlah Dibayar</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {debtPaymentsQuery.isLoading ? (
                <RowSkeleton rows={15} columns={6} />
              ) : (
                debtPaymentsQuery?.data?.map(
                  (payment: Payment, index: number) => (
                    <TableRow key={index} hover>
                      <TableCell>{formatDate(payment?.date)}</TableCell>

                      <TableCell>
                        {formatDate(payment?.debt?.invoice?.dueDate)}
                      </TableCell>

                      <TableCell>
                        {currencyFormatter.format(payment?.amount)}
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Stack>
  );
}
