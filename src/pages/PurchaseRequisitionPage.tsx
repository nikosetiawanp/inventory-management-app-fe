import {
  Button,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Drawer from "../components/Drawer";

import { Settings } from "@mui/icons-material";

import CreatePurchaseRequisitionButton from "../components/buttons/CreatePurchaseRequisitionButton";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useEffect, useState } from "react";
import MonthFilterButton from "../components/buttons/MonthFilterButton";
import PurchaseRow from "../components/rows/PurchaseRow";
import axios from "axios";
import { useQuery } from "react-query";
import { Purchase } from "../interfaces/interfaces";
import RowSkeleton from "../components/skeletons/RowSkeleton";
import YearFilterButton from "../components/buttons/VendorFilterButton";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function PurchaseRequisitionPage() {
  const [status, setStatus] = useState("PR");

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
  const selectedYear = formattedDate.split("-")[0];
  const selectedMonth = formattedDate.split("-")[1];

  // FETCHING PRODUCTS
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const getPurchases = async () => {
    const response = await axios.get(
      BACKEND_URL +
        `purchases?startDate=${selectedYear}-${selectedMonth}-01&endDate=${selectedYear}-${selectedMonth}-31&status=PR`
    );
    return response.data.data;
  };

  const { isLoading, error, data, refetch, isRefetching } = useQuery({
    queryKey: ["purchases"],
    queryFn: () => getPurchases(),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [selectedDate]);

  return (
    // PAGE
    <Stack direction={"row"} height={"100vh"} width={"100vw"}>
      {/* DRAWER */}
      <Drawer />

      {/* CONTENT */}
      <Stack padding={4} gap={4} width={1}>
        <Typography fontWeight={"bold"} variant="h4">
          Purchase Requisition
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

          {/* BUTTON */}
          <CreatePurchaseRequisitionButton />
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
                <TableCell>Tanggal Surat</TableCell>
                <TableCell>Kode Vendor</TableCell>
                <TableCell>Nama Vendor</TableCell>
                <TableCell>Nomor Surat</TableCell>
                <TableCell width={10}>
                  <IconButton size="small">
                    <Settings fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>

            {/* ROWS */}
            <TableBody sx={{ overflowY: "scroll" }}>
              {isLoading ? (
                <RowSkeleton rows={15} columns={5} />
              ) : (
                data?.map((purchase: Purchase, index: number) => (
                  <PurchaseRow
                    index={index}
                    key={index}
                    purchase={purchase}
                    refetch={refetch}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Stack>
  );
}
