import {
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
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import CreateInventoryArrival from "../components/forms/CreateInventoryArrival";
import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import ArrivalHistoryRow from "../components/rows/ArrivalHistoryRow";
import { InventoryHistory } from "../interfaces/interfaces";

export default function ArrivalHistoryPage() {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
  const selectedYear = formattedDate.split("-")[0];
  const selectedMonth = formattedDate.split("-")[1];

  // GET INVENTORY HISTORY
  const getInventoryHistories = async () => {
    const response = await axios.get(
      BACKEND_URL +
        `inventory-histories?startDate=${selectedYear}-${selectedMonth}-01&endDate=${selectedYear}-${selectedMonth}-31&type=A`
    );
    return response.data.data;
  };

  const inventoryHistoryQuery = useQuery({
    queryKey: ["inventoryhistories"],
    queryFn: getInventoryHistories,
    refetchOnWindowFocus: false,
    enabled: true,
  });

  useEffect(() => {
    inventoryHistoryQuery.refetch();
  }, [selectedDate]);

  return (
    <Stack direction={"row"} height={"100vh"} width={"100vw"}>
      <Drawer />
      <Stack padding={4} gap={4} width={1}>
        <Typography fontWeight={"bold"} variant="h4">
          Gudang Masuk
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

          {/* BUTTON */}
          <CreateInventoryArrival />
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
                <TableCell>Tanggal Masuk</TableCell>
                <TableCell>Produk</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Nomor PO</TableCell>
                <TableCell>Keterangan</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell>Sisa Stok</TableCell>
                <TableCell width={10} align="center">
                  <IconButton size="small">
                    <Settings fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {inventoryHistoryQuery?.data?.map(
                (inventoryHistory: InventoryHistory, index: number) => (
                  <ArrivalHistoryRow
                    key={index}
                    index={index}
                    inventoryHistory={inventoryHistory}
                  />
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Stack>
  );
}
