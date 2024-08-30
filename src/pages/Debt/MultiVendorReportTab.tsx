import { Button, IconButton, Sheet, Stack, Table, Typography } from "@mui/joy";

import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";

import { Settings } from "@mui/icons-material";
import { Contact, DebtHistory, MonthlyDebt } from "../../interfaces/interfaces";
import RowSkeleton from "../../components/skeletons/RowSkeleton";

import { formatIDR } from "../../helpers/currencyHelpers";
import { formatDate } from "../../helpers/dateHelpers";
import { sum } from "../../helpers/calculationHelpers";
import ChecklistFilter from "../../components/filters/ChecklistFilter";
import DateFilterCopy from "../../components/filters/DateFilterCopy";
import PrintMultiVendorReportModal from "./PrintMultiVendorReportModal";

export default function MultiVendorReportTab(props: { type: "D" | "R" }) {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";

  // DATE
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // CONTACT
  const [selectedContacts, setSelectedContacts] = useState<
    { id: string; label: string }[]
  >([]);
  const selectedConctactsParam = selectedContacts
    ?.map((contact) => `&contactId[]=${contact.id}`)
    .join("&");

  // GET DEBTS
  const getMonthlyDebts = async () => {
    const response = await axios.get(
      BACKEND_URL +
        "debt-history?" +
        `type=${props.type == "D" ? "V" : "C"}` +
        `&startDate=${formatDate(startDate, "YYYY-MM-DD")}` +
        `&endDate=${formatDate(endDate, "YYYY-MM-DD")}` +
        selectedConctactsParam
    );
    console.log(response.data);

    return response.data;
  };

  const contactDebtsQuery = useQuery({
    queryKey: [
      "debt-history",
      startDate,
      endDate,
      selectedContacts,
      props.type,
    ],
    queryFn: getMonthlyDebts,
    refetchOnWindowFocus: false,
    enabled: startDate !== null && endDate !== null,
  });

  // CONTACTS
  const getContacts = async () => {
    const response = await axios.get(
      BACKEND_URL + `contacts?` + `type=${props.type == "D" ? "V" : "C"}`
    );
    return response.data.data;
  };

  const contactsQuery = useQuery({
    queryKey: ["contacts"],
    queryFn: getContacts,
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const contacts = contactsQuery?.data?.map((contact: Contact) => {
    const data = {
      id: contact.id,
      label: contact?.name,
    };
    return data;
  });

  const refetch = () => {
    getMonthlyDebts();
    contactDebtsQuery.refetch();
  };

  useEffect(() => {
    refetch();
  }, [selectedContacts, startDate, endDate]);

  useEffect(() => {
    setStartDate(null);
    setEndDate(null);
  }, [props.type]);

  return (
    <Stack gap={2} width={1}>
      {/* FILTERS */}
      <Stack direction={"row"} gap={2} width={1} alignItems={"end"}>
        <ChecklistFilter
          data={contacts}
          includedData={selectedContacts}
          setIncludedData={setSelectedContacts}
          label={props.type == "D" ? "Vendor" : "Customer"}
        />

        <DateFilterCopy
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          refetch={refetch}
          label={"Tanggal"}
        />
        <PrintMultiVendorReportModal
          startDate={startDate}
          endDate={endDate}
          contacts={contactDebtsQuery?.data}
          type={props.type}
        />
      </Stack>

      {/* TABLES */}
      <Stack
        direction={"column"}
        spacing={4}
        // border={2}
        height={"100vh"} // Set height to viewport height
        maxHeight={"100vh"} // Ensure it doesn't exceed the viewport height
        overflow={"scroll"}
      >
        {contactDebtsQuery?.data?.map((contact: MonthlyDebt, index: number) => {
          const arrayOfHistoryAmount = contact?.histories?.map(
            (history: DebtHistory) =>
              history?.type == "D" || history?.type == "R"
                ? history?.amount
                : 0 - history?.amount
          );

          const arrayOfDebts = contact?.histories
            ?.filter((history: DebtHistory) => history?.type == "D")
            .map((history: DebtHistory) => history?.amount);

          const arrayOfReceivables = contact?.histories
            ?.filter((history: DebtHistory) => history?.type == "R")
            .map((history: DebtHistory) => history?.amount);

          const arrayOfPayments = contact?.histories
            ?.filter((history: DebtHistory) => history?.type == "P")
            .map((history: DebtHistory) => history?.amount);

          return (
            <Stack key={index}>
              <Typography color="primary">
                <b>
                  {contact?.name} | {contact?.code}
                </b>
              </Typography>
              <Sheet
                variant="outlined"
                sx={{ borderRadius: 2, overflow: "hidden", gap: 1 }}
              >
                <Table size="sm" stickyHeader stickyFooter>
                  <thead>
                    <tr>
                      <th>
                        <Button size="sm" variant="plain" color="neutral">
                          Tanggal
                        </Button>
                      </th>
                      <th>
                        <Button size="sm" variant="plain" color="neutral">
                          Nomor Bukti
                        </Button>
                      </th>
                      <th>
                        <Button size="sm" variant="plain" color="neutral">
                          Keterangan
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
                          Saldo
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
                    <tr>
                      <td style={{ paddingLeft: 15 }}>
                        <b>Saldo Awal</b>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td style={{ paddingLeft: 15 }}>
                        <b>
                          {props.type == "D"
                            ? formatIDR(
                                contactDebtsQuery?.data[index].initialBalance
                              )
                            : formatIDR(
                                0 -
                                  contactDebtsQuery?.data[index].initialBalance
                              )}
                        </b>
                      </td>
                      <td></td>
                    </tr>

                    {contactDebtsQuery?.isLoading ? (
                      <RowSkeleton rows={15} columns={6} />
                    ) : (
                      contact?.histories?.map(
                        (history: DebtHistory, index: number) => (
                          <tr key={index}>
                            <td style={{ paddingLeft: 15 }}>
                              {formatDate(history?.date, "DD MMMM YYYY")}
                            </td>
                            <td style={{ paddingLeft: 15 }}></td>
                            <td style={{ paddingLeft: 15 }}>
                              <Typography></Typography>
                            </td>
                            <td style={{ paddingLeft: 15 }}>
                              <Typography color="success">
                                {history?.type == "D" && props.type == "D"
                                  ? formatIDR(history?.amount)
                                  : history?.type == "P" && props.type == "R"
                                  ? formatIDR(history?.amount)
                                  : "-"}
                              </Typography>
                            </td>
                            {/* KREDIT */}
                            <td style={{ paddingLeft: 15 }}>
                              <Typography color="danger">
                                {history?.type == "R" && props.type == "R"
                                  ? formatIDR(history?.amount)
                                  : history?.type == "P" && props.type == "D"
                                  ? formatIDR(history?.amount)
                                  : "-"}
                              </Typography>
                            </td>

                            <td style={{ paddingLeft: 15 }}>
                              {props.type == "D"
                                ? formatIDR(
                                    contact?.initialBalance +
                                      sum(
                                        arrayOfHistoryAmount.slice(0, index + 1)
                                      )
                                  )
                                : formatIDR(
                                    contact?.initialBalance +
                                      sum(
                                        arrayOfHistoryAmount.slice(0, index + 1)
                                      ) *
                                        -1
                                  )}
                            </td>
                            <td style={{ width: 50 }}></td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td style={{ paddingLeft: 15 }}>
                        <b>Saldo Akhir</b>
                      </td>
                      <td></td>
                      <td></td>
                      <td style={{ paddingLeft: 15 }}>
                        <Typography color="success">
                          {props.type == "D"
                            ? formatIDR(sum(arrayOfDebts))
                            : formatIDR(sum(arrayOfPayments))}
                        </Typography>
                      </td>
                      <td style={{ paddingLeft: 15 }}>
                        <Typography color="danger">
                          {props.type == "D"
                            ? formatIDR(sum(arrayOfPayments))
                            : formatIDR(sum(arrayOfReceivables))}
                        </Typography>
                      </td>
                      <td style={{ paddingLeft: 15 }}>
                        {props.type == "D"
                          ? formatIDR(contact?.currentBalance)
                          : formatIDR(0 - contact?.currentBalance)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </Table>
              </Sheet>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}
