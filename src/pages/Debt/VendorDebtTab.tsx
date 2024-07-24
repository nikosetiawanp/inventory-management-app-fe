import { Button, IconButton, Sheet, Stack, Table, Typography } from "@mui/joy";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";

import { Settings } from "@mui/icons-material";
import { Contact, Debt, Payment } from "../../interfaces/interfaces";
import RowSkeleton from "../../components/skeletons/RowSkeleton";

import { sum } from "../../helpers/calculationHelpers";
import { formatIDR } from "../../helpers/currencyHelpers";
import SearchFilter from "../../components/filters/SearchFilter";
import SortButton from "../../components/buttons/SortButton";

export default function VendorDebtTab() {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";

  // GET DEBTS
  const getContacts = async () => {
    const response = await axios.get(BACKEND_URL + "contacts?" + "type=V");
    return response.data.data;
  };

  const contactsQuery = useQuery({
    queryKey: ["contacts"],
    queryFn: getContacts,
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const [searchInput, setSearchInput] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "vendor",
    direction: "ascending",
  });

  // const refetch = () => {
  //   getContacts();
  //   contactsQuery.refetch();
  // };

  const totalDebt = (debts: Debt[]) => {
    return sum(debts?.map((debt: Debt) => debt.amount));
  };

  const totalPayment = (debts: Debt[]) => {
    return sum(
      debts
        ?.map((debt: Debt) =>
          debt.payments.map((payment: Payment) => payment.amount)
        )
        .flat()
    );
  };

  // SORT DATA
  const sortedData = useMemo(() => {
    // SORT CONTACT ASCENDING
    if (sortConfig.key == "vendor" && sortConfig.direction == "ascending") {
      return contactsQuery?.data?.sort((a: Contact, b: Contact) =>
        a?.name?.localeCompare(b?.name)
      );
    }

    // SORT CONTACT ASCENDING
    if (sortConfig.key == "vendor" && sortConfig.direction == "descending") {
      return contactsQuery?.data?.sort((a: Contact, b: Contact) =>
        b?.name?.localeCompare(a?.name)
      );
    }
  }, [contactsQuery, sortConfig]);

  const searchResult = !searchInput
    ? sortedData
    : sortedData.filter(
        (vendor: Contact) =>
          vendor.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          vendor.code.toLowerCase().includes(searchInput.toLowerCase())
      );

  useEffect(() => {
    console.log(sortedData);
  }, [sortConfig]);

  return (
    <Stack gap={2} width={1}>
      {/* FILTERS */}
      <Stack direction={"row"} gap={2} width={1} alignItems={"end"}>
        <SearchFilter
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          label={"Cari Vendor"}
          placeholder={"Cari"}
        />
        {/* <ChecklistFilter
          data={contacts}
          includedData={includedData}
          setIncludedData={setIncludedData}
          label={"Vendor"}
        /> */}
      </Stack>

      <Sheet
        variant="outlined"
        sx={{ borderRadius: 2, overflow: "hidden", gap: 1 }}
      >
        <Table size="sm" stickyHeader stickyFooter>
          <thead>
            <tr>
              <th>
                <Button size="sm" variant="plain" color="neutral">
                  Kode
                </Button>
              </th>
              <th>
                <SortButton
                  sortConfigKey="vendor"
                  sortConfig={sortConfig}
                  setSortConfig={setSortConfig}
                  label={"Vendor"}
                />
                {/* <Button size="sm" variant="plain" color="neutral">
                  Vendor
                </Button> */}
              </th>
              <th>
                <Button size="sm" variant="plain" color="neutral">
                  Total Hutang
                </Button>
              </th>
              <th>
                <Button size="sm" variant="plain" color="neutral">
                  Total Dibayar
                </Button>
              </th>

              <th>
                <Button size="sm" variant="plain" color="neutral">
                  Sisa Hutang
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
            {contactsQuery?.isLoading ? (
              <RowSkeleton rows={15} columns={6} />
            ) : (
              searchResult?.map((contact: Contact, index: number) => (
                <tr key={index}>
                  <td style={{ paddingLeft: 15 }}>{contact.code}</td>
                  <td style={{ paddingLeft: 15 }}>{contact.name}</td>
                  <td style={{ paddingLeft: 15 }}>
                    {formatIDR(totalDebt(contact.debts))}
                  </td>
                  <td style={{ paddingLeft: 15 }}>
                    <Typography color="success">
                      {formatIDR(totalPayment(contact.debts))}
                    </Typography>
                  </td>
                  <td style={{ paddingLeft: 15 }}>
                    <Typography color="danger">
                      {formatIDR(
                        totalDebt(contact.debts) - totalPayment(contact.debts)
                      )}
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
