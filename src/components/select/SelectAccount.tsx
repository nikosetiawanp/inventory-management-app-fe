import { useState } from "react";
import { Account } from "../../interfaces/interfaces";
import {
  Dialog,
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
import { useQuery } from "react-query";
import CreateAccount from "../../pages/Account/CreateAccount";

export default function SelectAccount(props: {
  selectedAccount: Account | null | undefined;
  setSelectedAccount: any;
  handleAccountChange: any;
}) {
  const [open, setOpen] = useState(false);

  // GET PURCHASES
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const getAccounts = async () => {
    const response = await axios.get(BACKEND_URL + "accounts/");

    return response.data.data;
  };
  const accountsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
    refetchOnWindowFocus: false,
    enabled: open,
  });

  //   SEARCH
  const [searchInput, setSearchInput] = useState("");
  const filteredAccountsQuery = accountsQuery?.data?.filter(
    (account: Account) =>
      account.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      account.number.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <>
      <TextField
        id="outlined-basic"
        label="Akun"
        variant="outlined"
        sx={{ input: { cursor: "pointer" } }}
        onClick={() => setOpen(true)}
        value={props.selectedAccount?.name || ""}
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
              Pilih Akun
            </Typography>
            <CreateAccount />
          </Stack>

          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            borderColor={"divider"}
          >
            <TextField
              id="outlined-basic"
              placeholder="Cari akun"
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
                {filteredAccountsQuery?.map(
                  (account: Account, index: number) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        props.setSelectedAccount(account);
                        setOpen(false);
                      }}
                      selected={props.selectedAccount?.id == account.id}
                    >
                      <TableCell>{account.number}</TableCell>
                      <TableCell>{account.name}</TableCell>
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
