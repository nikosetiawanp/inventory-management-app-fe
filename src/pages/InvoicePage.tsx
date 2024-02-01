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
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { useQuery } from "react-query";
import Drawer from "../components/Drawer";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CreatePurchaseRequisitionButton from "../components/buttons/CreatePurchaseRequisitionButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Settings } from "@mui/icons-material";
import PurchaseRow from "../components/rows/PurchaseRow";
import RowSkeleton from "../components/skeletons/RowSkeleton";
import { Invoice, Purchase } from "../interfaces/interfaces";
import InvoiceRow from "../components/rows/InvoiceRow";

export default function InvoicePage() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
  const selectedYear = formattedDate.split("-")[0];
  const selectedMonth = formattedDate.split("-")[1];

  // FETCHING PRODUCTS
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const getInvoices = async () => {
    const response = await axios.get(
      BACKEND_URL +
        `invoices?startDate=${selectedYear}-${selectedMonth}-01&endDate=${selectedYear}-${selectedMonth}-31`
    );

    return response.data.data;
  };

  const invoicesQuery = useQuery({
    queryKey: ["invoices"],
    queryFn: () => getInvoices(),
    refetchOnWindowFocus: false,
  });
  return (
    <>
      <Stack direction={"row"} height={"100vh"} width={"100vw"}>
        <Drawer />
        <Stack padding={4} gap={4} width={1}>
          <Typography fontWeight={"bold"} variant="h4">
            Faktur
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
              onClick={() => invoicesQuery.refetch()}
              disabled={invoicesQuery.isRefetching || invoicesQuery.isLoading}
            >
              {invoicesQuery.isRefetching || invoicesQuery.isLoading ? (
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
                  <TableCell>Tanggal Faktur</TableCell>
                  <TableCell>Nomor Faktur</TableCell>
                  <TableCell>Nama Vendor</TableCell>
                  <TableCell>Tanggal Jatuh Tempo</TableCell>
                  <TableCell width={10}>
                    <IconButton size="small">
                      <Settings fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableHead>

              {/* ROWS */}
              <TableBody sx={{ overflowY: "scroll" }}>
                {invoicesQuery.isLoading ? (
                  <RowSkeleton rows={15} columns={5} />
                ) : (
                  invoicesQuery.data?.map((invoice: Invoice, index: number) => (
                    <InvoiceRow index={index} key={index} invoice={invoice} />
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Stack>
    </>
  );
}
