import { Button, IconButton, Sheet, Stack, Table } from "@mui/joy";

import RowSkeleton from "../../components/skeletons/RowSkeleton";

import { Settings } from "@mui/icons-material";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { Transaction } from "../../interfaces/interfaces";
import SortButton from "../../components/buttons/SortButton";
import ChecklistFilter from "../../components/filters/ChecklistFilter";
import DateFilterCopy from "../../components/filters/DateFilterCopy";
import { formatDate } from "../../helpers/dateHelpers";
import TransactionRow from "./TransactionRow";
import PrintTransactions from "./PrintTransactions";

export default function ApprovedTransactionTab(props: { type: "P" | "S" }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // FETCHING PRODUCTS
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const getTransactions = async () => {
    const response = await axios.get(
      BACKEND_URL +
        "transactions?" +
        `type=${props.type}` +
        `&isApproved=1` +
        `&startDate=${startDate ? formatDate(startDate, "YYYY-MM-DD") : ""}` +
        `&endDate=${endDate ? formatDate(endDate, "YYYY-MM-DD") : ""}` +
        `&isDone=0`
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

  useEffect(() => {
    console.log(transactionsQuery?.data);
  }, []);

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

  const filteredTransactionsQuery =
    includedData.length == 0
      ? transactionsQuery?.data
      : transactionsQuery?.data?.filter((transaction: Transaction) =>
          includedData.some(
            (includedData) => includedData.id == transaction.contactId
          )
        );

  // SORTING
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "descending",
  });
  const sortedData = useMemo(() => {
    // SORT INVOICE DATE DESCENDING
    if (sortConfig.key == "date" && sortConfig.direction == "descending") {
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
    if (sortConfig.key == "date" && sortConfig.direction == "ascending") {
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
  }, [startDate, endDate]);

  return (
    // CONTAINER
    <Stack direction={"row"}>
      {/* CONTENT */}
      <Stack>
        {/*TITLE & CREATE PRODUCT */}
        <Stack
          direction={"row"}
          marginBottom={2}
          gap={2}
          width={1}
          alignItems={"end"}
        >
          <DateFilterCopy
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            refetch={refetch}
            label={"Tanggal"}
          />

          <ChecklistFilter
            data={contacts}
            includedData={includedData}
            setIncludedData={setIncludedData}
            label={props.type == "P" ? "Vendor" : "Customer"}
          />

          <PrintTransactions
            startDate={startDate}
            endDate={endDate}
            type={props.type}
            transactions={transactionsQuery?.data}
          />
        </Stack>

        <Sheet variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Table size="sm" stickyHeader stickyFooter>
            {/* HEAD */}
            <thead>
              <tr>
                <th>
                  <Button size="sm" variant="plain" color="neutral">
                    {props.type == "P" ? "Nomor PO" : "Nomor SO"}
                  </Button>
                </th>
                <th>
                  <SortButton
                    label={props.type == "P" ? "Vendor" : "Customer"}
                    sortConfigKey="contact"
                    sortConfig={sortConfig}
                    setSortConfig={setSortConfig}
                  />
                </th>
                <th>
                  <SortButton
                    label="Tanggal"
                    sortConfigKey="date"
                    sortConfig={sortConfig}
                    setSortConfig={setSortConfig}
                  />
                </th>
                <th style={{ textAlign: "center" }}>
                  <Button size="sm" variant="plain" color="neutral">
                    Status
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
                sortedData?.map((transaction: Transaction, index: number) => {
                  return (
                    <TransactionRow
                      key={index}
                      index={index}
                      transaction={transaction}
                      refetch={refetch}
                    />
                  );
                })
              )}
            </tbody>
          </Table>
        </Sheet>
      </Stack>
    </Stack>
  );
}
