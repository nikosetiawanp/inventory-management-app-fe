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
import Drawer from "../../components/Drawer";
import { Settings } from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import dayjs from "dayjs";
import CreateInventory from "./CreateInventory";
import axios from "axios";
import { useQuery } from "react-query";

import { Inventory } from "../../interfaces/interfaces";
import RefreshIcon from "@mui/icons-material/Refresh";
import InventoryRow from "./InventoryRow";

export default function InventoryDeparturePage() {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
  const selectedYear = formattedDate.split("-")[0];
  const selectedMonth = formattedDate.split("-")[1];

  // GET INVENTORY HISTORY
  const getInventories = async () => {
    const response = await axios.get(
      BACKEND_URL +
        `inventories?startDate=${selectedYear}-${selectedMonth}-01&endDate=${selectedYear}-${selectedMonth}-31&type=D`
    );
    console.log(response.data.data);

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
          Gudang Keluar
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
          <CreateInventory type="D" />
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
                <TableCell>Nomor Surat Jalan</TableCell>
                <TableCell>Nomor Faktur</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Tanggal Keluar</TableCell>
                <TableCell>Sales Order</TableCell>
                <TableCell>Deskripsi</TableCell>
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
