import {
  Button,
  ButtonGroup,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { useQuery } from "react-query";
import { Settings } from "@mui/icons-material";

import axios from "axios";
import { useEffect, useState } from "react";
import { Contact } from "../../interfaces/interfaces";
import Drawer from "../../components/Drawer";
import RowSkeleton from "../../components/skeletons/RowSkeleton";
import CreateContact from "./CreateContact";
import MoreVertContactButton from "./MoreVertContactButton";

export default function ContactPage() {
  // FETCHING DATA
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const getContacts = async () => {
    const response = await axios.get(
      BACKEND_URL + `contacts?type=${selectedType}`
    );
    console.log(response.data);

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

  const handleTypeChange = (type: "V" | "C") => {
    setSelectedType(type);
  };

  useEffect(() => {
    contactsQuery.refetch();
  }, [selectedType]);

  return (
    // PAGE
    <Stack direction={"row"} height={"100vh"} width={"100vw"}>
      {/* DRAWER */}
      <Drawer />
      {/* CONTENT */}
      <Stack padding={4} gap={2} width={1}>
        <Typography fontWeight={"bold"} variant="h4">
          Contacts
        </Typography>

        <TextField
          id="outlined-basic"
          placeholder="Cari"
          variant="outlined"
          size="small"
          sx={{ width: "300px" }}
          value={searchInput}
          onChange={(event) => {
            setSearchInput(event.target.value);
            contactsQuery.refetch();
          }}
        />

        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          width={1}
          gap={2}
        >
          {/* BUTTON */}
          <ButtonGroup
            // sx={{ marginRight: "auto" }}
            disabled={contactsQuery.isRefetching}
          >
            <Button
              // variant={selectedType == "V" ? "contained" : "outlined"}
              variant="contained"
              color={selectedType == "V" ? "primary" : "inherit"}
              size="small"
              onClick={() => handleTypeChange("V")}
            >
              Vendor
            </Button>
            <Button
              variant="contained"
              color={selectedType == "C" ? "primary" : "inherit"}
              size="small"
              onClick={() => handleTypeChange("C")}
            >
              Customer
            </Button>
          </ButtonGroup>

          <CreateContact />
        </Stack>
        <TableContainer
          sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}
        >
          <Table size="small" sx={{ borderCollapse: "separate" }}>
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
                <TableCell>Kode</TableCell>
                <TableCell>Nama</TableCell>
                <TableCell>Alamat</TableCell>
                <TableCell>Nomor Telepon</TableCell>
                <TableCell>Email</TableCell>

                <TableCell width={10}>
                  <IconButton size="small">
                    <Settings fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>

            {/* ROWS */}
            <TableBody sx={{ overflowY: "scroll" }}>
              {contactsQuery.isLoading ? (
                <RowSkeleton rows={15} columns={6} />
              ) : (
                filteredContactsQuery?.map(
                  (contact: Contact, index: number) => (
                    <TableRow key={index} hover>
                      <TableCell>{contact.code}</TableCell>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.address}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>
                        <MoreVertContactButton contact={contact} />
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Stack>
  );
}
