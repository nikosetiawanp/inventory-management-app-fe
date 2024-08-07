import { Button, IconButton, Sheet, Stack, Table, Typography } from "@mui/joy";

import Drawer from "../../components/Drawer";
import RowSkeleton from "../../components/skeletons/RowSkeleton";
import CreateTransaction from "./CreateTransaction";

import { Settings } from "@mui/icons-material";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { Transaction } from "../../interfaces/interfaces";
import TransactionRow from "./TransactionRow";
import SortButton from "../../components/buttons/SortButton";
import ChecklistFilter from "../../components/filters/ChecklistFilter";
import SelectFilter from "../../components/filters/SelectFilter";
import DateFilterCopy from "../../components/filters/DateFilterCopy";
import { formatDate } from "../../helpers/dateHelpers";

export default function PurchaseOrderPage() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // FETCHING PRODUCTS
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const getTransactions = async () => {
    const response = await axios.get(
      BACKEND_URL +
        "transactions?" +
        `type=${selectedType}` +
        `&isApproved=${selectedApprovalStatus}` +
        `&startDate=${startDate ? formatDate(startDate, "YYYY-MM-DD") : ""}` +
        `&endDate=${endDate ? formatDate(startDate, "YYYY-MM-DD") : ""}` +
        `&isDone=${selectedDoneStatus}`
    );
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
  const [includedData, setIncludedData] = useState<
    { id: string; label: string }[]
  >([]);
  const contacts = transactionsQuery?.data?.map((transaction: Transaction) => {
    const data = {
      id: transaction.contactId,
      label: transaction?.contact?.name,
    };
    return data;
  });
  // const contacts: string[] | any = [
  //   ...new Set(
  //     transactionsQuery?.data?.map(
  //       (transaction: Transaction) =>{id: transaction?.id,label: transaction?.contact?.name}
  //     )
  //   ),
  // ];

  const filteredTransactionsQuery =
    includedData.length == 0
      ? transactionsQuery?.data
      : transactionsQuery?.data?.filter((transaction: Transaction) =>
          includedData.some(
            (includedData) => includedData.id == transaction.contactId
          )
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
    // // SORT INVOICE DATE ASCENDING
    // if (sortConfig.key == "po-date" && sortConfig.direction == "descending") {
    //   return filteredTransactionsQuery?.sort((a: Transaction, b: Transaction) =>
    //     b?.date.localeCompare(a?.date)
    //   );
    // }

    // // SORT INVOICE DATE ASCENDING
    // if (sortConfig.key == "po-date" && sortConfig.direction == "ascending") {
    //   return filteredTransactionsQuery?.sort((a: Transaction, b: Transaction) =>
    //     a?.date.localeCompare(b?.date)
    //   );
    // }

    // SORT INVOICE DATE DESCENDING
    if (sortConfig.key == "po-date" && sortConfig.direction == "descending") {
      return filteredTransactionsQuery?.sort(
        (a: Transaction, b: Transaction) => {
          const dateComparison = b?.date.localeCompare(a?.date);
          if (dateComparison !== 0) {
            return dateComparison;
          }
          return b?.id - a?.id; // Sort by id if dates are equal
        }
      );
    }

    // SORT INVOICE DATE ASCENDING
    if (sortConfig.key == "po-date" && sortConfig.direction == "ascending") {
      return filteredTransactionsQuery?.sort(
        (a: Transaction, b: Transaction) => {
          const dateComparison = a?.date.localeCompare(b?.date);
          if (dateComparison !== 0) {
            return dateComparison;
          }
          return a?.id - b?.id; // Sort by id if dates are equal
        }
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
    startDate,
    endDate,
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
      <Stack padding={4} width={1}>
        {/*TITLE & CREATE PRODUCT */}
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"flex-end"}
          marginBottom={4}
        >
          <Typography fontWeight={"bold"} level="h4">
            Purchase Order
          </Typography>
          <CreateTransaction type={"purchase"} />
        </Stack>

        <Stack direction={"row"} marginBottom={2} gap={2} width={1}>
          <SelectFilter
            selected={selectedType}
            setSelected={setSelectedType}
            options={types}
            label={"Kategori"}
          />
          <SelectFilter
            selected={selectedApprovalStatus}
            setSelected={setSelectedApprovalStatus}
            options={approvalStatuses}
            label={"Approval"}
          />
          <DateFilterCopy
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            refetch={refetch}
            label={"Tanggal"}
          />
          {/* <DateFilter
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            setSelectedStartDate={setSelectedStartDate}
            setSelectedEndDate={setSelectedEndDate}
            refetch={refetch}
            label="Tanggal PO"
          /> */}
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
            label={"Status"}
          />

          {/* BUTTON */}
        </Stack>

        <Sheet variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Table size="sm" stickyHeader stickyFooter>
            {/* HEAD */}
            <thead>
              <tr>
                <th>
                  <Button size="sm" variant="plain" color="neutral">
                    Nomor PO
                  </Button>
                </th>
                <th>
                  <SortButton
                    label="Vendor"
                    sortConfigKey="contact"
                    sortConfig={sortConfig}
                    setSortConfig={setSortConfig}
                  />
                </th>
                <th>
                  <SortButton
                    label="Tanggal PO"
                    sortConfigKey="po-date"
                    sortConfig={sortConfig}
                    setSortConfig={setSortConfig}
                  />
                </th>
                <th style={{ textAlign: "center" }}>
                  <Button size="sm" variant="plain" color="neutral">
                    Status Approval
                  </Button>
                </th>
                <th style={{ textAlign: "center" }}>
                  <Button size="sm" variant="plain" color="neutral">
                    Status Selesai
                  </Button>
                </th>
                <th
                  style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    width: 60,
                  }}
                >
                  <IconButton size="sm">
                    <Settings fontSize="small" />
                  </IconButton>
                </th>
              </tr>
            </thead>

            {/* ROWS */}
            <tbody>
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
            </tbody>
          </Table>
        </Sheet>
      </Stack>
    </Stack>
  );
}
