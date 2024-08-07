import {
  Button,
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
import { Settings } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { Transaction } from "../interfaces/interfaces";
import RowSkeleton from "../components/skeletons/RowSkeleton";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CreateTransaction from "./Transaction/CreateTransaction";
import TransactionRow from "./Transaction/TransactionRow";

export default function PurchaseRequisitionPage() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
  const selectedYear = formattedDate.split("-")[0];
  const selectedMonth = formattedDate.split("-")[1];

  // FETCHING PRODUCTS
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const getTransactions = async () => {
    const response = await axios.get(
      BACKEND_URL +
        `transactions?startDate=${selectedYear}-${selectedMonth}-01&endDate=${selectedYear}-${selectedMonth}-31&type=S`
    );
    return response.data.data;
  };

  const transactionsQuery = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(),
    refetchOnWindowFocus: false,
  });

  return (
    // PAGE
    <Stack direction={"row"} height={"100vh"} width={"100vw"}>
      {/* DRAWER */}
      <Drawer />

      {/* CONTENT */}
      <Stack padding={4} gap={4} width={1}>
        <Typography fontWeight={"bold"} variant="h4">
          Sales Order
        </Typography>

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
            onClick={() => transactionsQuery.refetch()}
            disabled={
              transactionsQuery.isRefetching || transactionsQuery.isLoading
            }
          >
            {transactionsQuery.isRefetching || transactionsQuery.isLoading ? (
              <CircularProgress size={15} color="inherit" />
            ) : (
              <RefreshIcon fontSize="small" />
            )}
          </Button>

          {/* BUTTON */}
          <CreateTransaction type={"S"} />
        </Stack>

        <TableContainer
          sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}
        >
          <Table sx={{ borderCollapse: "separate" }} size="small">
            {/* HEAD */}
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
                <TableCell>Nomor SO</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Tanggal SO</TableCell>
                <TableCell>Status Approval</TableCell>
                <TableCell>Status Selesai</TableCell>
                <TableCell width={10}>
                  <IconButton size="small">
                    <Settings fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>

            {/* ROWS */}
            <TableBody sx={{ overflowY: "scroll" }}>
              {transactionsQuery.isLoading ? (
                <RowSkeleton rows={15} columns={5} />
              ) : (
                transactionsQuery.data?.map(
                  (transaction: Transaction, index: number) => (
                    <TransactionRow
                      index={index}
                      key={index}
                      transaction={transaction}
                      refetch={transactionsQuery.refetch}
                      arrayLength={transactionsQuery.data.length}
                    />
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
