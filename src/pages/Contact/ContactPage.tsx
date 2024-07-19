import { Box, Button, Sheet, Stack, Table } from "@mui/joy";

import Typography from "@mui/joy/Typography";

import { useQuery } from "react-query";

import axios from "axios";
import { useEffect, useState } from "react";
import { Contact } from "../../interfaces/interfaces";
import Drawer from "../../components/Drawer";
import RowSkeleton from "../../components/skeletons/RowSkeleton";
import CreateContact from "./CreateContact";
import SelectFilter from "../../components/filters/SelectFilter";

import { Settings } from "@mui/icons-material";
import AlertDialogModal from "../../components/AlertModal";
import SearchFilter from "../../components/filters/SearchFilter";

export default function ContactPage() {
  // FETCHING DATA
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const getContacts = async () => {
    const response = await axios.get(
      BACKEND_URL + `contacts?type=${selectedType}`
    );
    return response.data.data;
  };

  const contactsQuery = useQuery({
    queryKey: ["contacts"],
    queryFn: () => getContacts(),
    refetchOnWindowFocus: false,
  });

  const [selectedType, setSelectedType] = useState("V");
  const [searchInput, setSearchInput] = useState("");
  const filteredContactsQuery = contactsQuery?.data?.filter(
    (vendor: Contact) =>
      vendor.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      vendor.code.toLowerCase().includes(searchInput.toLowerCase())
  );

  const contactTypes = [
    { label: "Vendor", key: "V" },
    { label: "Customer", key: "C" },
  ];

  useEffect(() => {
    contactsQuery.refetch();
  }, [selectedType]);

  return (
    // PAGE
    <Stack direction={"row"} height={"100vh"} width={"100vw"}>
      {/* DRAWER */}
      <Drawer />

      {/* CONTENT */}
      <Stack padding={4} width={1}>
        {/* TITLE & CREATE CONTACT */}
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"flex-end"}
          marginBottom={4}
        >
          <Typography fontWeight={"bold"} level="h4">
            Kontak
          </Typography>
          <Box>
            <CreateContact />
          </Box>
        </Stack>

        {/* SEARCH & FILTER */}
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"flex-end"}
          spacing={2}
          marginBottom={2}
        >
          <SearchFilter
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            label={"Cari Kontak"}
            placeholder={"Cari"}
          />
          <SelectFilter
            selected={selectedType}
            setSelected={setSelectedType}
            options={contactTypes}
            label="Kategori"
          />
        </Stack>

        {/* TABLE */}
        <Sheet variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Table size="sm" stickyHeader stickyFooter>
            {/* HEAD */}
            <thead>
              <tr>
                <th>
                  <Button size="sm" variant="plain" color="neutral">
                    Kode
                  </Button>
                </th>
                <th>
                  <Button size="sm" variant="plain" color="neutral">
                    Nama
                  </Button>
                </th>
                <th>
                  <Button size="sm" variant="plain" color="neutral">
                    Alamat
                  </Button>
                </th>
                <th>
                  <Button size="sm" variant="plain" color="neutral">
                    Telepon
                  </Button>
                </th>
                <th>
                  <Button size="sm" variant="plain" color="neutral">
                    Email
                  </Button>
                </th>

                <th
                  style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    width: 60,
                  }}
                >
                  <Button size="sm" variant="plain" color="neutral">
                    <Settings fontSize="small" />
                  </Button>
                </th>
              </tr>
            </thead>

            {/* ROWS */}
            <tbody>
              {contactsQuery.isLoading ? (
                <RowSkeleton rows={15} columns={6} />
              ) : (
                filteredContactsQuery?.map(
                  (contact: Contact, index: number) => (
                    <tr key={index}>
                      <td style={{ paddingLeft: 15 }}>{contact.code}</td>
                      <td style={{ paddingLeft: 15 }}>{contact.name}</td>
                      <td style={{ paddingLeft: 15 }}>{contact.address}</td>
                      <td style={{ paddingLeft: 15 }}>{contact.phone}</td>
                      <td style={{ paddingLeft: 15 }}>{contact.email}</td>
                      <td style={{ textAlign: "center" }}>
                        <AlertDialogModal />
                        {/* <MoreVertContactButton contact={contact} /> */}
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </Table>
        </Sheet>
        {/* </TableContainer> */}
      </Stack>
    </Stack>
  );
}
