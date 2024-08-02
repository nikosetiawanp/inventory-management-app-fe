import { Button, IconButton, Sheet, Stack, Table, Typography } from "@mui/joy";

import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";

import { Settings } from "@mui/icons-material";
import { Debt, Payment } from "../../interfaces/interfaces";
import RowSkeleton from "../../components/skeletons/RowSkeleton";
import DebtRow from "./DebtRow";
import ChecklistFilter from "../../components/filters/ChecklistFilter";
import SortButton from "../../components/buttons/SortButton";
import { sum } from "../../helpers/calculationHelpers";
import { formatIDR } from "../../helpers/currencyHelpers";
import DateFilterCopy from "../../components/filters/DateFilterCopy";

export default function UnpaidDebtTab() {
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

  const [includedData, setIncludedData] = useState<
    { id: string; label: string }[]
  >([]);
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
        "&type=D" +
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
    queryKey: ["debts", selectedStartDate, selectedEndDate],
    queryFn: getDebts,
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const contacts = debtsQuery?.data?.map((debt: Debt) => {
    const data = {
      id: debt.contactId,
      label: debt?.contact?.name,
    };
    return data;
  });
  const filteredDebtsQuery =
    includedData.length == 0
      ? debtsQuery?.data
      : debtsQuery?.data?.filter((debt: Debt) =>
          includedData?.some(
            (includedData) => includedData.id == debt.contactId
          )
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
    console.log(debtsQuery.data);
  }, [selectedStartDate, selectedEndDate]);

  return (
    <Stack gap={2} width={1}>
      {/* STATUS */}
      <Stack direction={"row"} gap={2} width={1}>
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
            Total Tagihan
          </Typography>
          <h2>{formatIDR(sum(arrayOfDebts))}</h2>
        </Sheet>

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
            Total Dibayar
          </Typography>
          <h2>
            <Typography color="success">
              {formatIDR(sum(arrayOfPayments))}
            </Typography>
          </h2>
        </Sheet>

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
            Sisa Hutang
          </Typography>
          <h2>
            <Typography color="danger">
              {formatIDR(sum(arrayOfDebts) - sum(arrayOfPayments))}
            </Typography>
          </h2>
        </Sheet>
      </Stack>

      {/* FILTERS */}
      <Stack direction={"row"} gap={2} width={1} alignItems={"end"}>
        <DateFilterCopy
          selectedStartDate={selectedStartDate}
          setSelectedStartDate={setSelectedStartDate}
          selectedEndDate={selectedEndDate}
          setSelectedEndDate={setSelectedEndDate}
          refetch={refetch}
          label="Tanggal Faktur"
        />{" "}
        <ChecklistFilter
          data={contacts}
          includedData={includedData}
          setIncludedData={setIncludedData}
          label={"Vendor"}
        />
      </Stack>

      <Sheet variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table size="sm" stickyHeader stickyFooter>
          <thead>
            <tr>
              <th>
                <SortButton
                  sortConfigKey="invoice-date"
                  sortConfig={sortConfig}
                  setSortConfig={setSortConfig}
                  label={"Tanggal Faktur"}
                />
              </th>
              <th>
                <Button size="sm" variant="plain" color="neutral">
                  Jatuh Tempo
                </Button>
              </th>
              <th>
                <Button size="sm" variant="plain" color="neutral">
                  Nomor Faktur
                </Button>
              </th>
              <th style={{ width: 120 }}>
                <SortButton
                  sortConfigKey="vendor"
                  sortConfig={sortConfig}
                  setSortConfig={setSortConfig}
                  label={"Vendor"}
                />
              </th>
              <th>
                <Button size="sm" variant="plain" color="neutral">
                  Jumlah Tagihan
                </Button>
              </th>
              <th>
                <Button size="sm" variant="plain" color="neutral">
                  Jumlah Dibayar
                </Button>
              </th>
              <th style={{ textAlign: "center" }}>
                <Button size="sm" variant="plain" color="neutral">
                  Pembayaran
                </Button>
              </th>
              <th style={{ textAlign: "center" }}>
                <IconButton size="sm">
                  <Settings fontSize="small" />
                </IconButton>
              </th>
            </tr>
          </thead>

          <tbody>
            {debtsQuery.isLoading ? (
              <RowSkeleton rows={15} columns={6} />
            ) : (
              sortedData?.map((debt: Debt, index: number) => (
                <DebtRow key={index} index={index} debt={debt} />
              ))
            )}
          </tbody>
        </Table>
      </Sheet>
    </Stack>
  );
}
