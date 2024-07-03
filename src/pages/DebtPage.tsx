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
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";

import RefreshIcon from "@mui/icons-material/Refresh";
import { CheckCircle, Filter, Settings, WatchLater } from "@mui/icons-material";
import { Debt, Payment } from "../interfaces/interfaces";
import PayDebt from "../components/buttons/CreatePayment";
import RowSkeleton from "../components/skeletons/RowSkeleton";
import DebtRow from "../components/rows/DebtRow";
import DataFilter from "../components/filters/DataFilter";

export default function DebtPage() {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";

  const [selectedStartDate, setSelectedStartDate] = useState(dayjs());
  const [selectedEndDate, setSelectedEndDate] = useState(dayjs());

  const formattedStartDate = dayjs(selectedStartDate).format("YYYY-MM-DD");
  const formattedEndDate = dayjs(selectedEndDate).format("YYYY-MM-DD");

  const [sortConfig, setSortConfig] = useState({
    key: "contact",
    direction: "ascending",
  });

  // const selectedYear = formattedDate.split("-")[0];
  // const selectedMonth = formattedDate.split("-")[1];

  // GET DEBTS
  const getDebts = async () => {
    const response = await axios.get(
      BACKEND_URL +
        `debts?startDate=${formattedStartDate}&endDate=${formattedEndDate}&isPaid=0`
    );
    // console.log(response.data.data);

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

  const vendors: string[] | any = [
    ...new Set(debtsQuery?.data?.map((data: Debt) => data?.contact?.name)),
  ];
  const [excludedData, setExcludedData] = useState<string[]>([]);

  const filteredDebtsQuery = debtsQuery?.data?.filter(
    (debt: Debt) => !excludedData?.includes(debt?.contact?.name)
  );

  const sortedData = useMemo(() => {
    // SORT INVOICE DATE ASCENDING
    if (
      sortConfig.key == "invoice-date" &&
      sortConfig.direction == "ascending"
    ) {
      return filteredDebtsQuery?.sort((a: Debt, b: Debt) =>
        a?.invoice?.date.localeCompare(b?.invoice?.date)
      );
    }

    // SORT INVOICE DATE ASCENDING
    if (
      sortConfig.key == "invoice-date" &&
      sortConfig.direction == "descending"
    ) {
      return filteredDebtsQuery?.sort((a: Debt, b: Debt) =>
        b?.invoice?.date.localeCompare(a?.invoice?.date)
      );
    }

    // SORT CONTACT ASCENDING
    if (sortConfig.key == "contact" && sortConfig.direction == "ascending") {
      return filteredDebtsQuery?.sort((a: Debt, b: Debt) =>
        a?.contact?.name?.localeCompare(b?.contact?.name)
      );
    }

    // SORT CONTACT ASCENDING
    if (sortConfig.key == "contact" && sortConfig.direction == "descending") {
      return filteredDebtsQuery?.sort((a: Debt, b: Debt) =>
        b?.contact?.name?.localeCompare(a?.contact?.name)
      );
    }
  }, [debtsQuery, excludedData, sortConfig]);

  useEffect(() => {
    console.log(sortedData);

    console.log(sortConfig);
  }, [sortConfig]);

  return (
    <Stack direction={"row"} height={"100vh"} width={"100vw"}>
      <Drawer />
      <Stack padding={4} gap={4} width={1}>
        <Typography fontWeight={"bold"} variant="h4">
          Hutang
        </Typography>

        {/* NAVS */}
        <Stack direction={"row"} gap={2} width={1}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={["day", "month", "year"]}
              slotProps={{ textField: { size: "small" } }}
              value={selectedStartDate}
              onChange={(newValue: any) => setSelectedStartDate(newValue)}
              format="DD MMMM YYYY"
              label="Setelah"
            />
            <DatePicker
              views={["day", "month", "year"]}
              slotProps={{ textField: { size: "small" } }}
              value={selectedEndDate}
              onChange={(newValue: any) => setSelectedEndDate(newValue)}
              format="DD MMMM YYYY"
              label="Sebelum"
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
                <TableCell>
                  Tanggal Faktur{" "}
                  <DataFilter
                    sortConfigKey={"invoice-date"}
                    data={[]}
                    // excludedData={[]}
                    // setExcludedData={null}
                    sortConfig={sortConfig}
                    setSortConfig={setSortConfig}
                    useFilter={true}
                  />{" "}
                </TableCell>
                <TableCell>Nomor Faktur</TableCell>
                <TableCell width={100}>
                  Vendor{" "}
                  <DataFilter
                    sortConfigKey={"contact"}
                    data={vendors}
                    excludedData={excludedData}
                    setExcludedData={setExcludedData}
                    sortConfig={sortConfig}
                    setSortConfig={setSortConfig}
                    useFilter={true}
                  />
                </TableCell>
                <TableCell>Tanggal Jatuh Tempo</TableCell>
                <TableCell>Jumlah Tagihan</TableCell>
                <TableCell>Jumlah Dibayar</TableCell>
                <TableCell align="center">Pembayaran</TableCell>
                {/* <TableCell align="center">Status</TableCell> */}
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
                sortedData?.map((debt: Debt, index: number) => (
                  <DebtRow key={index} index={index} debt={debt} />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Stack>
  );
}
