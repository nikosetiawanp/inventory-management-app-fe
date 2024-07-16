import {
  Button,
  Chip,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import RefreshIcon from "@mui/icons-material/Refresh";
import Drawer from "../../components/Drawer";
import CreateCash from "./CreateCash";
import { Cash } from "../../interfaces/interfaces";
import RowSkeleton from "../../components/skeletons/RowSkeleton";

export default function CashPage() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
  const selectedYear = formattedDate.split("-")[0];
  const selectedMonth = formattedDate.split("-")[1];

  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const getCashes = async () => {
    const response = await axios.get(
      BACKEND_URL +
        `cashes?startDate=${selectedYear}-${selectedMonth}-01&endDate=${selectedYear}-${selectedMonth}-31`
    );
    console.log(response.data.data);

    return response.data.data;
  };
  const cashesQuery = useQuery({
    queryKey: ["cashes"],
    queryFn: () => getCashes(),
    refetchOnWindowFocus: false,
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

  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  return (
    <Stack direction={"row"} height={"100vh"} width={"100vw"}>
      <Drawer />
      <Stack padding={4} gap={4} width={1}>
        <Typography fontWeight={"bold"} variant="h4">
          Kas
        </Typography>

        <Stack
          direction={"row"}
          justifyContent={"justify-between"}
          width={1}
          gap={2}
        >
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
            onClick={() => cashesQuery.refetch()}
            disabled={cashesQuery.isRefetching || cashesQuery.isLoading}
            sx={{ marginRight: "auto" }}
          >
            {cashesQuery.isRefetching || cashesQuery.isLoading ? (
              <CircularProgress size={15} color="inherit" />
            ) : (
              <RefreshIcon fontSize="small" />
            )}
          </Button>
          <CreateCash />
        </Stack>

        {/* TABLE */}
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
                <TableCell>Tanggal</TableCell>
                <TableCell>Nomor</TableCell>
                <TableCell>Deskripsi</TableCell>
                <TableCell>Akun</TableCell>
                <TableCell>Jumlah</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ overflowY: "scroll" }}>
              {cashesQuery?.isLoading ? (
                <RowSkeleton rows={15} columns={5} />
              ) : (
                cashesQuery?.data?.map((cash: Cash, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{formatDate(cash?.date)}</TableCell>
                    <TableCell>{cash?.number}</TableCell>
                    <TableCell>{cash?.description}</TableCell>
                    <TableCell>
                      <Chip label={cash?.account?.name} size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={
                          cash?.amount == 0
                            ? "inherit"
                            : cash?.amount > 0
                            ? "success.main"
                            : "error.main"
                        }
                      >
                        {cash?.amount < 0 ? "-" : "+"}{" "}
                        {currencyFormatter.format(cash?.amount)}
                      </Typography>
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
