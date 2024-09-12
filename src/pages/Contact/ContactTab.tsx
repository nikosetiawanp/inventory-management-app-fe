import { Button, Sheet, Stack, Table } from "@mui/joy";
import SearchFilter from "../../components/filters/SearchFilter";
import CreateContact from "./CreateContact";
import RowSkeleton from "../../components/skeletons/RowSkeleton";
import { Alert, Contact } from "../../interfaces/interfaces";
import { Settings } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import PrintContacts from "./PrintContacts";
import ActionMenu from "./ActionMenu";

export default function ContactTab(props: {
  type: "V" | "C";
  setAlert: React.Dispatch<React.SetStateAction<Alert>>;
}) {
  const [searchInput, setSearchInput] = useState("");

  //   GET DATA
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const getContacts = async () => {
    const response = await axios.get(
      BACKEND_URL + `contacts?type=${props.type}`
    );
    return response.data.data;
  };
  const contactsQuery = useQuery({
    queryKey: ["contacts"],
    queryFn: () => getContacts(),
    refetchOnWindowFocus: false,
  });
  const searchResult = contactsQuery?.data?.filter(
    (vendor: Contact) =>
      vendor.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      vendor.code.toLowerCase().includes(searchInput.toLowerCase())
  );

  useEffect(() => {
    contactsQuery.refetch();
  }, [props.type]);

  return (
    <Stack>
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
        <Stack direction={"row"} gap={2} width="auto" alignItems={"end"}>
          <CreateContact type={props.type} setAlert={props.setAlert} />
          <PrintContacts contacts={contactsQuery?.data} type={props.type} />
        </Stack>
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
                  Provinsi
                </Button>
              </th>
              <th>
                <Button size="sm" variant="plain" color="neutral">
                  Kota
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
              searchResult?.map((contact: Contact, index: number) => (
                <tr key={index}>
                  <td style={{ paddingLeft: 15 }}>{contact.code}</td>
                  <td style={{ paddingLeft: 15 }}>{contact.name}</td>
                  <td style={{ paddingLeft: 15 }}>{contact.address}</td>
                  <td style={{ paddingLeft: 15 }}>{contact.province}</td>
                  <td style={{ paddingLeft: 15 }}>{contact.city}</td>
                  <td style={{ paddingLeft: 15 }}>{contact.phone}</td>
                  <td style={{ paddingLeft: 15 }}>{contact.email}</td>
                  <td style={{ textAlign: "center" }}>
                    <ActionMenu contact={contact} setAlert={props.setAlert} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Sheet>
    </Stack>
  );
}
