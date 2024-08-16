import { Button, IconButton, Sheet, Stack, Table, Typography } from "@mui/joy";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";

import { Settings } from "@mui/icons-material";
import { Contact, MonthlyDebt } from "../../interfaces/interfaces";
import RowSkeleton from "../../components/skeletons/RowSkeleton";

import { formatIDR } from "../../helpers/currencyHelpers";
import SortButton from "../../components/buttons/SortButton";

import { formatDate } from "../../helpers/dateHelpers";
import { sum } from "../../helpers/calculationHelpers";
import DateFilterCopy from "../../components/filters/DateFilterCopy";
import PrintMonthlyReportModal from "./PrintMonthlyReportModal";

export default function MonthlyReportTab() {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null); // const [selectedYear, setSelectedYear] = useState(dayjs().format("YYYY"));

  // GET DEBTS
  const getMonthlyDebts = async () => {
    const response = await axios.get(
      BACKEND_URL +
        "debt-history?" +
        "type=V" +
        `&startDate=${formatDate(startDate, "YYYY-MM-DD")}` +
        `&endDate=${formatDate(endDate, "YYYY-MM-DD")}`
    );
    console.log(response.data);
    return response.data;
  };

  const vendorDebtsQuery = useQuery({
    queryKey: ["debt-history", startDate, endDate],
    queryFn: getMonthlyDebts,
    refetchOnWindowFocus: false,
    enabled: true,
  });

  // const getDebts = async () => {
  //   const response = await axios.get(
  //     BACKEND_URL +
  //       "debts?" +
  //       `&startDate=${selectedStartDate ? formattedStartDate : ""}` +
  //       `&endDate=${selectedEndDate ? formattedEndDate : ""}`
  //   );
  //   return response.data.data;
  // };

  // const refetch = () => {
  //   getDebts();
  //   debtsQuery.refetch();
  // };

  // const debtsQuery = useQuery({
  //   queryKey: ["debts", selectedStartDate, selectedEndDate],
  //   queryFn: getDebts,
  //   refetchOnWindowFocus: false,
  //   enabled: true,
  // });

  // const [searchInput, setSearchInput] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "vendor",
    direction: "ascending",
  });

  // SORT DATA
  const sortedData = useMemo(() => {
    // SORT CONTACT ASCENDING
    if (sortConfig.key == "vendor" && sortConfig.direction == "ascending") {
      return vendorDebtsQuery?.data?.sort((a: Contact, b: Contact) =>
        a?.name?.localeCompare(b?.name)
      );
    }

    // SORT CONTACT ASCENDING
    if (sortConfig.key == "vendor" && sortConfig.direction == "descending") {
      return vendorDebtsQuery?.data?.sort((a: Contact, b: Contact) =>
        b?.name?.localeCompare(a?.name)
      );
    }
  }, [vendorDebtsQuery, sortConfig]);

  const arrayOfInitialBalance = vendorDebtsQuery?.data?.map(
    (contact: MonthlyDebt) => contact.initialBalance
  );
  const arrayOfTotalDebt = vendorDebtsQuery?.data?.map(
    (contact: MonthlyDebt) => contact.totalDebt
  );
  const arrayOfTotalPayment = vendorDebtsQuery?.data?.map(
    (contact: MonthlyDebt) => contact.totalPayment
  );
  const arrayOfCurrentBalance = vendorDebtsQuery?.data?.map(
    (contact: MonthlyDebt) => contact.currentBalance
  );

  const refetch = () => {
    getMonthlyDebts();
    vendorDebtsQuery.refetch();
  };
  useEffect(() => {
    refetch();
  }, [startDate, endDate]);

  return (
    <Stack gap={2} width={1}>
      <Stack direction={"row"} gap={2} width={1}>
        {/* SALDO AWAL */}
        <Sheet
          sx={{
            border: 1,
            borderColor: "divider",
            boxShadow: 0,
            padding: 2,
            borderRadius: 2,
          }}
        >
          <Typography level="body-md" color={"neutral"}>
            Total Saldo Awal
          </Typography>
          <Typography color="neutral">
            <h2>{formatIDR(sum(arrayOfInitialBalance))}</h2>
          </Typography>
        </Sheet>
        {/* PEMBELIAN */}
        <Sheet
          sx={{
            border: 1,
            borderColor: "divider",
            boxShadow: 0,
            padding: 2,
            borderRadius: 2,
          }}
        >
          <Typography level="body-md" color={"neutral"}>
            Total Pembelian
          </Typography>
          <Typography color="success">
            <h2>{formatIDR(sum(arrayOfTotalDebt))}</h2>
          </Typography>
        </Sheet>

        {/* PEMBAYARAN */}
        <Sheet
          sx={{
            border: 1,
            borderColor: "divider",
            boxShadow: 0,
            padding: 2,
            borderRadius: 2,
          }}
        >
          <Typography level="body-md" color={"neutral"}>
            Total Pembayaran
          </Typography>
          <Typography color="danger">
            <h2>{formatIDR(sum(arrayOfTotalPayment))}</h2>
          </Typography>
        </Sheet>

        {/* SALDO AKHIR */}
        <Sheet
          sx={{
            border: 1,
            borderColor: "divider",
            boxShadow: 0,
            padding: 2,
            borderRadius: 2,
          }}
        >
          <Typography level="body-md" color={"neutral"}>
            Total Saldo Akhir
          </Typography>
          <h2>{formatIDR(sum(arrayOfCurrentBalance))}</h2>
        </Sheet>
      </Stack>
      {/* FILTERS */}
      <Stack direction={"row"} gap={2} width={1} alignItems={"end"}>
        <DateFilterCopy
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          refetch={refetch}
          label={"Tanggal"}
        />
        <PrintMonthlyReportModal
          startDate={startDate}
          endDate={endDate}
          contacts={vendorDebtsQuery?.data}
        />
      </Stack>

      <Sheet
        variant="outlined"
        sx={{ borderRadius: 2, overflow: "hidden", gap: 1 }}
      >
        <Table size="sm" stickyHeader stickyFooter>
          <thead>
            <tr>
              <th>
                <SortButton
                  sortConfigKey="vendor"
                  sortConfig={sortConfig}
                  setSortConfig={setSortConfig}
                  label={"Vendor"}
                />
              </th>
              <th>
                <Button size="sm" variant="plain" color="neutral">
                  Saldo Awal
                </Button>
              </th>
              <th>
                <Button size="sm" variant="plain" color="neutral">
                  Pembelian
                </Button>
              </th>

              <th>
                <Button size="sm" variant="plain" color="neutral">
                  Pembayaran
                </Button>
              </th>
              <th>
                <Button size="sm" variant="plain" color="neutral">
                  Saldo Akhir
                </Button>
              </th>

              <th style={{ textAlign: "center", width: 50 }}>
                <IconButton size="sm">
                  <Settings fontSize="small" />
                </IconButton>
              </th>
            </tr>
          </thead>

          <tbody>
            {vendorDebtsQuery?.isLoading ? (
              <RowSkeleton rows={15} columns={6} />
            ) : (
              sortedData?.map((contact: MonthlyDebt, index: number) => (
                <tr key={index}>
                  <td style={{ paddingLeft: 15 }}>{contact?.name}</td>
                  <td style={{ paddingLeft: 15 }}>
                    <Typography color="neutral">
                      {formatIDR(contact?.initialBalance)}
                    </Typography>
                  </td>
                  <td style={{ paddingLeft: 15 }}>
                    <Typography color="success">
                      {formatIDR(contact?.totalDebt)}
                    </Typography>
                  </td>
                  <td style={{ paddingLeft: 15 }}>
                    <Typography color="danger">
                      {formatIDR(contact?.totalPayment)}
                    </Typography>
                  </td>
                  <td style={{ paddingLeft: 15 }}>
                    <Typography>
                      <b> {formatIDR(contact?.currentBalance)}</b>
                    </Typography>
                  </td>{" "}
                  {/* <td style={{ paddingLeft: 15 }}>
                    <Typography color="neutral">
                      {formatIDR(
                        totalDebt(contact.debts) - totalPayment(contact.debts)
                      )}
                    </Typography>
                  </td> */}
                  <td style={{ width: 50 }}></td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Sheet>
    </Stack>
  );
}
