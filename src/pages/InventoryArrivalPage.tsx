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
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import CreateInventory from "../components/forms/CreateInventory";
import axios from "axios";
import { useQuery } from "react-query";
import InventoryRow from "../components/rows/InventoryRow";
import { Inventory } from "../interfaces/interfaces";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function InventoryArrivalPage() {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
  const selectedYear = formattedDate.split("-")[0];
  const selectedMonth = formattedDate.split("-")[1];

  // GET INVENTORY HISTORY
  const getInventories = async () => {
    const response = await axios.get(
      BACKEND_URL +
        `inventories?startDate=${selectedYear}-${selectedMonth}-01&endDate=${selectedYear}-${selectedMonth}-31&type=A`
    );

    return response.data.data;
  };

  const inventoriesQuery = useQuery({
    queryKey: ["inventories"],
    queryFn: getInventories,
    refetchOnWindowFocus: false,
    enabled: true,
  });

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
          <Button
            size="small"
            variant="contained"
            onClick={() => inventoriesQuery.refetch()}
            disabled={
              inventoriesQuery.isRefetching || inventoriesQuery.isLoading
            }
          >
            {inventoriesQuery.isRefetching || inventoriesQuery.isLoading ? (
              <CircularProgress size={15} color="inherit" />
            ) : (
              <RefreshIcon fontSize="small" />
            )}
          </Button>

          {/* BUTTON */}
          <CreateInventory type="A" />
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
                <TableCell>Nomor PO</TableCell>
                <TableCell>Nomor Surat Jalan</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Keterangan</TableCell>
                <TableCell width={10} align="center">
                  <IconButton size="small">
                    <Settings fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventoriesQuery?.data?.map(
                (inventory: Inventory, index: number) => (
                  <InventoryRow
                    key={index}
                    index={index}
                    inventory={inventory}
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
