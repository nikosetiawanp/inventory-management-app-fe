import { Button, IconButton, Sheet, Stack, Table, Typography } from "@mui/joy";

import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";

import { Settings } from "@mui/icons-material";
import { Contact, DebtHistory, MonthlyDebt } from "../../interfaces/interfaces";
import RowSkeleton from "../../components/skeletons/RowSkeleton";

import { formatIDR } from "../../helpers/currencyHelpers";
import MonthFilter from "../../components/filters/MonthFilter";
import dayjs from "dayjs";
import { formatDate } from "../../helpers/dateHelpers";
import { sum } from "../../helpers/calculationHelpers";
import ChecklistFilter from "../../components/filters/ChecklistFilter";

export default function MultiVendorReportTab() {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedContacts, setSelectedContacts] = useState<
    { id: string; label: string }[]
  >([]);
  const selectedConctactsParam = selectedContacts
    ?.map((contact) => `&contactId[]=${contact.id}`)
    .join("&");

  // const [selectedYear, setSelectedYear] = useState(dayjs().format("YYYY"));

  // GET DEBTS
  const getMonthlyDebts = async () => {
    const response = await axios.get(
      BACKEND_URL +
        "monthly-debts?" +
        `yearMonth=${formatDate(selectedDate, "YYYY-MM")}` +
        "&type=V" +
        selectedConctactsParam
    );
    return response.data;
  };

  const vendorDebtsQuery = useQuery({
    queryKey: ["monthly-debts", selectedDate, selectedContacts],
    queryFn: getMonthlyDebts,
    refetchOnWindowFocus: false,
    enabled: selectedContacts.length > 0,
  });

  // CONTACTS
  const getContacts = async () => {
    const response = await axios.get(BACKEND_URL + `contacts?type=V`);
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

  useEffect(() => {
    console.log(vendorDebtsQuery.data);
    console.log(selectedContacts);
  }, [selectedContacts, selectedDate]);
  // ---------------------------

  // const arrayOfHistoryAmount = vendorDebtsQuery?.histories?.map(
  //   (history: DebtHistory) =>
  //     history?.type == "D" ? history?.amount : history?.amount * -1
  // );

  // const arrayOfDebts = vendorDebtsQuery?.data?.histories
  //   ?.filter((history: DebtHistory) => history?.type == "D")
  //   .map((history: DebtHistory) => history?.amount);

  // const arrayOfPayments = vendorDebtsQuery?.data?.histories
  //   ?.filter((history: DebtHistory) => history?.type == "P")
  //   .map((history: DebtHistory) => history?.amount);
  useEffect(() => {
    console.log(vendorDebtsQuery?.data);
  }, [selectedDate]);

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
            {/* <h2>{formatIDR(sum(arrayOfInitialBalance))}</h2> */}
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
            {/* <h2>{formatIDR(sum(arrayOfTotalDebt))}</h2> */}
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
            {/* <h2>{formatIDR(sum(arrayOfTotalPayment))}</h2> */}
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
          {/* <h2>{formatIDR(sum(arrayOfCurrentBalance))}</h2> */}
        </Sheet>
      </Stack>
      {/* FILTERS */}
      <Stack direction={"row"} gap={2} width={1} alignItems={"end"}>
        <ChecklistFilter
          data={contacts}
          includedData={selectedContacts}
          setIncludedData={setSelectedContacts}
          label={"Vendor"}
        />
        {/* <Stack>
          <FormLabel>Vendor</FormLabel>{" "}
          <Autocomplete
            id="contact"
            size="md"
            placeholder={"Pilih Vendor"}
            disableClearable={true}
            onChange={(event, newValue) => {
              event;
              setSelectedContact(newValue);
            }}
            // inputValue={selectedContact?.name}
            getOptionLabel={(option: Contact) => option.name}
            options={contactsQuery.data ? contactsQuery.data : []}
            renderOption={(props, option: Contact) => (
              <AutocompleteOption {...props} key={option.id}>
                <ListItemContent sx={{ fontSize: "sm" }}>
                  {option.name}
                </ListItemContent>
              </AutocompleteOption>
            )}
          />
        </Stack> */}
        <MonthFilter
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          refetch={function (): void {
            throw new Error("Function not implemented.");
          }}
          label={"Periode"}
        />
      </Stack>

      {/* TABLES */}
      <Stack
        direction={"column"}
        spacing={2}
        border={2}
        height={"100vh"} // Set height to viewport height
        maxHeight={"100vh"} // Ensure it doesn't exceed the viewport height
        overflow={"scroll"}
      >
        {vendorDebtsQuery?.data?.map((vendor: MonthlyDebt, index: number) => {
          const arrayOfHistoryAmount = vendor?.histories?.map(
            (history: DebtHistory) =>
              history?.type == "D" ? history?.amount : history?.amount * -1
          );

          const arrayOfDebts = vendor?.histories
            ?.filter((history: DebtHistory) => history?.type == "D")
            .map((history: DebtHistory) => history?.amount);

          const arrayOfPayments = vendor?.histories
            ?.filter((history: DebtHistory) => history?.type == "P")
            .map((history: DebtHistory) => history?.amount);

          return (
            <Stack key={index}>
              <Typography color="neutral">
                <b>{vendor.name}</b>
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
                        {formatIDR(
                          vendorDebtsQuery?.data[index].initialBalance
                        )}
                      </td>
                      <td></td>
                    </tr>

                    {vendorDebtsQuery?.isLoading ? (
                      <RowSkeleton rows={15} columns={6} />
                    ) : (
                      vendor?.histories?.map(
                        (history: DebtHistory, index: number) => (
                          <tr key={index}>
                            <td style={{ paddingLeft: 15 }}>
                              {formatDate(history?.date, "DD MMMM YYYY")}
                            </td>
                            <td style={{ paddingLeft: 15 }}>
                              <Typography color="neutral">
                                {/* {formatIDR(vendor?.initialBalance)} */}
                              </Typography>
                            </td>
                            <td style={{ paddingLeft: 15 }}>
                              <Typography></Typography>
                            </td>{" "}
                            <td style={{ paddingLeft: 15 }}>
                              <Typography color="success">
                                {history?.type == "D"
                                  ? formatIDR(history?.amount)
                                  : formatIDR(0)}
                              </Typography>
                            </td>
                            <td style={{ paddingLeft: 15 }}>
                              <Typography color="danger">
                                {history?.type == "P"
                                  ? formatIDR(history?.amount)
                                  : formatIDR(0)}
                              </Typography>
                            </td>
                            <td style={{ paddingLeft: 15 }}>
                              {formatIDR(
                                arrayOfHistoryAmount &&
                                  vendor?.initialBalance +
                                    sum(
                                      arrayOfHistoryAmount.slice(0, index + 1)
                                    )
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
                          {formatIDR(sum(arrayOfDebts))}
                        </Typography>
                      </td>
                      <td style={{ paddingLeft: 15 }}>
                        <Typography color="danger">
                          {formatIDR(sum(arrayOfPayments))}
                        </Typography>
                      </td>
                      <td style={{ paddingLeft: 15 }}>
                        {formatIDR(vendor?.currentBalance)}
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
