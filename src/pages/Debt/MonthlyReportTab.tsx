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
import DateFilterCopy from "../../components/filters/DateFilterCopy";
import PrintMonthlyReportModal from "./PrintMonthlyReportModal";

export default function MonthlyReportTab(props: { type: "D" | "R" }) {
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

  // const [searchInput, setSearchInput] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "contact",
    direction: "ascending",
  });

  // SORT DATA
  const sortedData = useMemo(() => {
    // SORT CONTACT ASCENDING
    if (sortConfig.key == "contact" && sortConfig.direction == "ascending") {
      return vendorDebtsQuery?.data?.sort((a: Contact, b: Contact) =>
        a?.name?.localeCompare(b?.name)
      );
    }

    // SORT CONTACT ASCENDING
    if (sortConfig.key == "contact" && sortConfig.direction == "descending") {
      return vendorDebtsQuery?.data?.sort((a: Contact, b: Contact) =>
        b?.name?.localeCompare(a?.name)
      );
    }
  }, [vendorDebtsQuery, sortConfig]);

  const refetch = () => {
    getMonthlyDebts();
    vendorDebtsQuery.refetch();
  };
  useEffect(() => {
    refetch();
  }, [startDate, endDate]);

  useEffect(() => {
    setStartDate(null);
    setEndDate(null);
  }, [props.type]);

  return (
    <Stack gap={2} width={1}>
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
          type={props.type}
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
                  sortConfigKey="contact"
                  sortConfig={sortConfig}
                  setSortConfig={setSortConfig}
                  label={props.type == "D" ? "Vendor" : "Customer"}
                />
              </th>
              <th>
                <Button size="sm" variant="plain" color="neutral">
                  Saldo Awal
                </Button>
              </th>
              <th>
                <Button size="sm" variant="plain" color="neutral">
                  Debit
                </Button>
              </th>

              <th>
                <Button size="sm" variant="plain" color="neutral">
                  Kredit
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
                      {props.type == "D"
                        ? formatIDR(contact?.totalDebt)
                        : formatIDR(contact?.totalPayment)}
                    </Typography>
                  </td>
                  <td style={{ paddingLeft: 15 }}>
                    <Typography color="danger">
                      {props.type == "D"
                        ? formatIDR(contact?.totalPayment)
                        : formatIDR(contact?.totalDebt)}
                    </Typography>
                  </td>
                  <td style={{ paddingLeft: 15 }}>
                    <Typography>
                      <b>
                        {props.type == "D"
                          ? formatIDR(contact?.currentBalance)
                          : formatIDR(0 - contact?.currentBalance)}
                      </b>
                    </Typography>
                  </td>
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
