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
import { CheckCircle, Settings, WatchLater } from "@mui/icons-material";
import { Debt, DebtPayment } from "../interfaces/interfaces";
import PayDebt from "../components/buttons/PayDebt";
import RowSkeleton from "../components/skeletons/RowSkeleton";

export default function DebtPage() {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
  const selectedYear = formattedDate.split("-")[0];
  const selectedMonth = formattedDate.split("-")[1];

  // GET DEBTS
  const getDebts = async () => {
    const response = await axios.get(
      BACKEND_URL +
        `debts?startDate=${selectedYear}-${selectedMonth}-01&endDate=${selectedYear}-${selectedMonth}-31&status=UNPAID`
    );
    return response.data.data;
  };

  const debtsQuery = useQuery({
    queryKey: ["debts"],
    queryFn: getDebts,
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

  const sumDebtPayments = (debtPayments: DebtPayment[]) => {
    if (debtPayments.length < 1) return 0;

    let totalPaidDebt = 0;

    for (let i = 0; i < debtPayments.length; i++) {
      totalPaidDebt += debtPayments[i].paidAmount;
    }
    return totalPaidDebt;
  };

  return (
    <Stack direction={"row"} height={"100vh"} width={"100vw"}>
      <Drawer />
      <Stack padding={4} gap={4} width={1}>
        <Typography fontWeight={"bold"} variant="h4">
          Daftar Hutang
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
            onClick={() => debtsQuery.refetch()}
            disabled={debtsQuery.isRefetching || debtsQuery.isLoading}
          >
            {debtsQuery.isRefetching || debtsQuery.isLoading ? (
              <CircularProgress size={15} color="inherit" />
            ) : (
              <RefreshIcon fontSize="small" />
            )}
          </Button>
        </Stack>

        <TableContainer
          sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}
        >
          <Table sx={{ borderCollapse: "separate" }}>
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
                <TableCell>Tanggal Faktur</TableCell>
                <TableCell>Nomor Faktur</TableCell>
                <TableCell>Nama Vendor</TableCell>
                <TableCell>Tanggal Jatuh Tempo</TableCell>
                <TableCell>Jumlah Tagihan</TableCell>
                <TableCell>Status</TableCell>
                <TableCell width={10} align="center">
                  <IconButton size="small">
                    <Settings fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {debtsQuery.isLoading ? (
                <RowSkeleton rows={15} columns={6} />
              ) : (
                debtsQuery?.data?.map((debt: Debt, index: number) => (
                  <TableRow key={index} hover>
                    <TableCell>{formatDate(debt?.invoice.date)}</TableCell>
                    <TableCell>{debt?.invoice.invoiceNumber}</TableCell>
                    <TableCell>{debt?.invoice.purchase.vendor.name}</TableCell>
                    <TableCell>{formatDate(debt?.invoice.dueDate)}</TableCell>
                    <TableCell>
                      {currencyFormatter.format(debt?.debtAmount)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          // sumDebtPayments(debt.debtPayments)
                          sumDebtPayments(debt.debtPayments) == 0
                            ? "Belum dibayar"
                            : sumDebtPayments(debt.debtPayments) >
                              debt?.debtAmount
                            ? `Kelebihan ${currencyFormatter.format(
                                sumDebtPayments(debt.debtPayments) -
                                  debt?.debtAmount
                              )}`
                            : sumDebtPayments(debt.debtPayments) <
                              debt?.debtAmount
                            ? `Kurang ${currencyFormatter.format(
                                debt.debtAmount -
                                  sumDebtPayments(debt.debtPayments)
                              )}`
                            : "Lunas"
                        }
                        variant="outlined"
                        color={
                          sumDebtPayments(debt.debtPayments) == 0
                            ? "error"
                            : sumDebtPayments(debt.debtPayments) <
                              debt?.debtAmount
                            ? "warning"
                            : "success"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {sumDebtPayments(debt.debtPayments) < debt?.debtAmount ? (
                        <PayDebt debt={debt} />
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Stack>
  );
}
