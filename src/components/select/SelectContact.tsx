import {
  Button,
  Dialog,
  InputBase,
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
import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import { Contact } from "../../interfaces/interfaces";
import CreateVendorButton from "../buttons/CreateVendorButton";
import SearchIcon from "@mui/icons-material/Search";
import CreateContact from "../forms/CreateContact";

export default function SelectContact(props: {
  selectedContact: Contact | null | undefined;
  setSelectedContact: any;
  handleContactChange: any;
}) {
  const [open, setOpen] = useState(false);

  // GET PURCHASES
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const getContacts = async () => {
    const response = await axios.get(BACKEND_URL + "contacts");
    return response.data.data;
  };
  const contactsQuery = useQuery({
    queryKey: ["contacts"],
    queryFn: getContacts,
    refetchOnWindowFocus: false,
    enabled: open,
  });

  const [searchInput, setSearchInput] = useState("");
  const filteredContactsQuery = contactsQuery?.data?.filter(
    (contact: Contact) =>
      contact.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      contact.code.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <>
      <TextField
        id="outlined-basic"
        label="Contact"
        variant="outlined"
        sx={{ input: { cursor: "pointer" } }}
        onClick={() => setOpen(true)}
        value={props.selectedContact?.name || ""}
      />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth={"sm"}
      >
        <Stack padding={3}>
          {/* HEADER */}
          <Stack direction={"row"} alignItems={"start"}>
            <Typography
              variant="h4"
              fontWeight={"bold"}
              marginBottom={2}
              marginRight={"auto"}
            >
              Pilih Vendor
            </Typography>
            <CreateContact />
            {/* <CreateVendorButton /> */}
          </Stack>

          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            borderColor={"divider"}
          >
            <TextField
              id="outlined-basic"
              placeholder="Cari vendor"
              variant="outlined"
              size="small"
              sx={{ width: 1 }}
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value);
              }}
            />
          </Stack>

          {/* TABLE */}
          <TableContainer
            sx={{
              backgroundColor: "white",
              height: 500,
            }}
          >
            <Table stickyHeader>
              <TableHead
                sx={{
                  position: "sticky",
                  backgroundColor: "white",
                  top: 0,
                  borderBottom: 1,
                  borderColor: "divider",
                  zIndex: 50,
                }}
              >
                <TableRow>
                  <TableCell>Kode</TableCell>
                  <TableCell>Nama</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredContactsQuery?.map(
                  (contact: Contact, index: number) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        props.setSelectedContact(contact);
                        setOpen(false);
                      }}
                      selected={props.selectedContact?.id == contact.id}
                    >
                      <TableCell>{contact.code}</TableCell>
                      <TableCell>{contact.name}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Dialog>
    </>
  );
}
