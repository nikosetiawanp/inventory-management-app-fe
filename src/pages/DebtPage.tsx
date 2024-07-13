import {
  IconButton,
  Paper,
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

import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";

import { Settings } from "@mui/icons-material";
import { Debt, Payment } from "../interfaces/interfaces";
import RowSkeleton from "../components/skeletons/RowSkeleton";
import DebtRow from "../components/rows/DebtRow";
import ChecklistFilter from "../components/filters/ChecklistFilter";
import DateFilter from "../components/filters/DateFilter";
import SortButton from "../components/buttons/SortButton";
import { sum } from "../helpers/calculationHelpers";
import { formatIDR } from "../helpers/currencyHelpers";

export default function DebtPage() {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";

  // DATE
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const formattedStartDate = selectedStartDate
    ? dayjs(selectedStartDate).format("YYYY-MM-DD")
    : "";
  const formattedEndDate = selectedEndDate
    ? dayjs(selectedEndDate).format("YYYY-MM-DD")
    : "";

  const [includedData, setIncludedData] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState({
    key: "invoice-date",
    direction: "ascending",
  });

  // GET DEBTS
  const getDebts = async () => {
    const response = await axios.get(
      BACKEND_URL +
        "debts?" +
        "isPaid=0" +
        `&startDate=${selectedStartDate ? formattedStartDate : ""}` +
        `&endDate=${selectedEndDate ? formattedEndDate : ""}`
    );
    return response.data.data;
  };

  const refetch = () => {
    getDebts();
    debtsQuery.refetch();
  };

  const debtsQuery = useQuery({
    queryKey: ["debts", formattedStartDate, formattedEndDate],
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

  const vendors: string[] | any = [
    ...new Set(debtsQuery?.data?.map((data: Debt) => data?.contact?.name)),
  ];
  const filteredDebtsQuery =
    includedData.length == 0
      ? debtsQuery?.data
      : debtsQuery?.data?.filter((debt: Debt) =>
          includedData?.includes(debt?.contact?.name)
        );

  // SORT DATA
  const sortedData = useMemo(() => {
    // SORT INVOICE DATE ASCENDING
    if (
      sortConfig.key == "invoice-date" &&
      sortConfig.direction == "descending"
    ) {
      return filteredDebtsQuery?.sort((a: Debt, b: Debt) =>
        b?.invoice?.date.localeCompare(a?.invoice?.date)
      );
    }

    // SORT INVOICE DATE ASCENDING
    if (
      sortConfig.key == "invoice-date" &&
      sortConfig.direction == "ascending"
    ) {
      return filteredDebtsQuery?.sort((a: Debt, b: Debt) =>
        a?.invoice?.date.localeCompare(b?.invoice?.date)
      );
    }

    // SORT CONTACT ASCENDING
    if (sortConfig.key == "vendor" && sortConfig.direction == "ascending") {
      return filteredDebtsQuery?.sort((a: Debt, b: Debt) =>
        a?.contact?.name?.localeCompare(b?.contact?.name)
      );
    }

    // SORT CONTACT ASCENDING
    if (sortConfig.key == "vendor" && sortConfig.direction == "descending") {
      return filteredDebtsQuery?.sort((a: Debt, b: Debt) =>
        b?.contact?.name?.localeCompare(a?.contact?.name)
      );
    }
  }, [debtsQuery, includedData, sortConfig]);

  const arrayOfDebts = filteredDebtsQuery
    ? filteredDebtsQuery.map((debt: Debt) => debt?.amount)
    : [];

  const arrayOfPayments = filteredDebtsQuery
    ? filteredDebtsQuery
        ?.map((debt: Debt) =>
          debt.payments.map((payment: Payment) => payment.amount)
        )
        .flat()
    : [];

  useEffect(() => {
    setIncludedData([]);
  }, [selectedStartDate, selectedEndDate]);

  return (
    <Stack
      direction={"row"}
      height={"100vh"}
      width={"100vw"}
      sx={{ backgroundColor: "background" }}
    >
      <Drawer />
      <Stack padding={4} gap={2} width={1}>
        <Typography fontWeight={"bold"} variant="h4">
          Hutang
        </Typography>

        <Stack direction={"row"} gap={2} width={1}>
          <Paper
            sx={{
              border: 1,
              borderColor: "divider",
              boxShadow: 0,
              padding: 2,
            }}
          >
            <Typography variant="subtitle2" color={"inherit"}>
              Total Tagihan
            </Typography>
            <Typography variant="h5">{formatIDR(sum(arrayOfDebts))}</Typography>
          </Paper>
          <Paper
            sx={{
              border: 1,
              borderColor: "divider",
              boxShadow: 0,
              padding: 2,
            }}
          >
            <Typography variant="subtitle2" color={"inherit"}>
              Total Dibayar
            </Typography>
            <Typography variant="h5" color={"success.main"}>
              {formatIDR(sum(arrayOfPayments))}
            </Typography>
          </Paper>
          <Paper
            sx={{
              border: 1,
              borderColor: "divider",
              boxShadow: 0,
              padding: 2,
            }}
          >
            <Typography variant="subtitle2" color={"inherit"}>
              Sisa Hutang
            </Typography>
            <Typography variant="h5" color={"error.main"}>
              {formatIDR(sum(arrayOfDebts) - sum(arrayOfPayments))}
            </Typography>
          </Paper>
        </Stack>

        {/* FILTERS */}
        <Stack direction={"row"} gap={2} width={1} alignItems={"end"}>
          <DateFilter
            sortConfigKey={"invoice-date"}
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            setSelectedStartDate={setSelectedStartDate}
            setSelectedEndDate={setSelectedEndDate}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            refetch={refetch}
            label="Tanggal Faktur"
          />{" "}
          <ChecklistFilter
            data={vendors}
            includedData={includedData}
            setIncludedData={setIncludedData}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            label={"Vendor"}
          />
        </Stack>

        {/* NAVS */}
        {/* <Stack direction={"row"} gap={2} width={1}>
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
            onClick={() => refresh()}
            disabled={debtsQuery.isRefetching || debtsQuery.isLoading}
          >
            {debtsQuery.isRefetching || debtsQuery.isLoading ? (
              <CircularProgress size={15} color="inherit" />
            ) : (
              <RefreshIcon fontSize="small" />
            )}
          </Button>
        </Stack> */}

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
                  {/* <DateFilter
                    sortConfigKey={"invoice-date"}
                    selectedStartDate={selectedStartDate}
                    selectedEndDate={selectedEndDate}
                    setSelectedStartDate={setSelectedStartDate}
                    setSelectedEndDate={setSelectedEndDate}
                    sortConfig={sortConfig}
                    setSortConfig={setSortConfig}
                    refetch={refetch}
                  /> */}
                  <SortButton
                    sortConfigKey="invoice-date"
                    sortConfig={sortConfig}
                    setSortConfig={setSortConfig}
                  />
                </TableCell>
                <TableCell>Tanggal Jatuh Tempo</TableCell>
                <TableCell>Nomor Faktur</TableCell>
                <TableCell width={100}>
                  Vendor{" "}
                  <SortButton
                    sortConfigKey="vendor"
                    sortConfig={sortConfig}
                    setSortConfig={setSortConfig}
                  />
                  {/* <StringFilter
                    sortConfigKey={"contact"}
                    data={vendors}
                    excludedData={excludedData}
                    setExcludedData={setExcludedData}
                    sortConfig={sortConfig}
                    setSortConfig={setSortConfig}
                  /> */}
                </TableCell>
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
