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

import Drawer from "../../components/Drawer";
import RowSkeleton from "../../components/skeletons/RowSkeleton";
import CreateTransaction from "./CreateTransaction";

import { Settings } from "@mui/icons-material";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { Transaction } from "../../interfaces/interfaces";
import dayjs from "dayjs";
import TransactionRow from "./TransactionRow";
import DateFilter from "../../components/filters/DateFilter";
import SortButton from "../../components/buttons/SortButton";
import ChecklistFilter from "../../components/filters/ChecklistFilter";
import SelectFilter from "../../components/filters/SelectFilter";

export default function PurchaseOrderPage() {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const formattedStartDate = selectedStartDate
    ? dayjs(selectedStartDate).format("YYYY-MM-DD")
    : "";
  const formattedEndDate = selectedEndDate
    ? dayjs(selectedEndDate).format("YYYY-MM-DD")
    : "";

  // FETCHING PRODUCTS
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const getTransactions = async () => {
    const response = await axios.get(
      BACKEND_URL +
        "transactions?" +
        `type=${selectedType}` +
        `&isApproved=${selectedApprovalStatus}` +
        `&startDate=${selectedStartDate ? formattedStartDate : ""}` +
        `&endDate=${selectedEndDate ? formattedEndDate : ""}` +
        `&isDone=${selectedDoneStatus}`
    );
    console.log(response.data.data);
    return response.data.data;
  };

  const transactionsQuery = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(),
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const refetch = () => {
    getTransactions();
    transactionsQuery.refetch();
  };

  // CHECKLIST FILTER
  const [includedData, setIncludedData] = useState<string[]>([]);
  const contacts: string[] | any = [
    ...new Set(
      transactionsQuery?.data?.map(
        (transaction: Transaction) => transaction?.contact?.name
      )
    ),
  ];

  const filteredTransactionsQuery =
    includedData.length == 0
      ? transactionsQuery?.data
      : transactionsQuery?.data?.filter((transaction: Transaction) =>
          includedData?.includes(transaction?.contact?.name)
        );

  // TYPE FILTER
  const [selectedType, setSelectedType] = useState("P");
  const types = [
    { label: "Pembelian", key: "P" },
    { label: "Penjualan", key: "S" },
  ];

  // STATUS FILTER
  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState(1);
  const approvalStatuses = [
    { label: "Approved", key: 1 },
    { label: "Menunggu Approval", key: 0 },
  ];

  const [selectedDoneStatus, setSelectedDoneStatus] = useState(0);
  const doneStatuses = [
    { label: "Selesai", key: 1 },
    { label: "Belum Selesai", key: 0 },
  ];

  const [] = useState();

  // SORTING
  const [sortConfig, setSortConfig] = useState({
    key: "po-date",
    direction: "descending",
  });
  const sortedData = useMemo(() => {
    // SORT INVOICE DATE ASCENDING
    if (sortConfig.key == "po-date" && sortConfig.direction == "descending") {
      return filteredTransactionsQuery?.sort((a: Transaction, b: Transaction) =>
        b?.date.localeCompare(a?.date)
      );
    }

    // SORT INVOICE DATE ASCENDING
    if (sortConfig.key == "po-date" && sortConfig.direction == "ascending") {
      return filteredTransactionsQuery?.sort((a: Transaction, b: Transaction) =>
        a?.date.localeCompare(b?.date)
      );
    }

    // SORT CONTACT ASCENDING
    if (sortConfig.key == "contact" && sortConfig.direction == "ascending") {
      return filteredTransactionsQuery?.sort((a: Transaction, b: Transaction) =>
        a?.contact?.name?.localeCompare(b?.contact?.name)
      );
    }

    // SORT CONTACT ASCENDING
    if (sortConfig.key == "contact" && sortConfig.direction == "descending") {
      return filteredTransactionsQuery?.sort((a: Transaction, b: Transaction) =>
        b?.contact?.name?.localeCompare(a?.contact?.name)
      );
    }
  }, [transactionsQuery, includedData, sortConfig]);

  useEffect(() => {
    refetch();
  }, [
    selectedStartDate,
    selectedEndDate,
    selectedType,
    selectedApprovalStatus,
    selectedDoneStatus,
  ]);

  return (
    // PAGE
    <Stack direction={"row"} height={"100vh"} width={"100vw"}>
      {/* DRAWER */}
      <Drawer />

      {/* CONTENT */}
      <Stack padding={4} gap={4} width={1}>
        <Typography fontWeight={"bold"} variant="h4">
          Purchase Order
        </Typography>

        <Stack direction={"row"} gap={2} width={1}>
          <SelectFilter
            selected={selectedType}
            setSelected={setSelectedType}
            options={types}
          />
          <SelectFilter
            selected={selectedApprovalStatus}
            setSelected={setSelectedApprovalStatus}
            options={approvalStatuses}
          />
          <DateFilter
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            setSelectedStartDate={setSelectedStartDate}
            setSelectedEndDate={setSelectedEndDate}
            refetch={refetch}
            label="Tanggal PO"
          />
          <ChecklistFilter
            data={contacts}
            includedData={includedData}
            setIncludedData={setIncludedData}
            label={"Vendor"}
          />
          <SelectFilter
            selected={selectedDoneStatus}
            setSelected={setSelectedDoneStatus}
            options={doneStatuses}
          />

          {/* BUTTON */}
          <CreateTransaction type={"P"} />
        </Stack>

        <TableContainer
          sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}
        >
          <Table sx={{ borderCollapse: "separate" }} size="small">
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
                <TableCell>Nomor PO </TableCell>
                <TableCell>
                  Vendor{" "}
                  <SortButton
                    sortConfigKey="contact"
                    sortConfig={sortConfig}
                    setSortConfig={setSortConfig}
                  />
                </TableCell>
                <TableCell>
                  Tanggal PO{" "}
                  <SortButton
                    sortConfigKey="po-date"
                    sortConfig={sortConfig}
                    setSortConfig={setSortConfig}
                  />
                </TableCell>
                <TableCell>Status Approval</TableCell>
                <TableCell>Status Selesai</TableCell>
                <TableCell width={10}>
                  <IconButton size="small">
                    <Settings fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>

            {/* ROWS */}
            <TableBody sx={{ overflowY: "scroll" }}>
              {transactionsQuery.isLoading ? (
                <RowSkeleton rows={15} columns={5} />
              ) : (
                sortedData?.map((transaction: Transaction, index: number) => (
                  <TransactionRow
                    index={index}
                    key={index}
                    transaction={transaction}
                    refetch={transactionsQuery.refetch}
                    arrayLength={transactionsQuery.data.length}
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
