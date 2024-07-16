import {
  Stack,
  Typography,
  TextField,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TableBody,
} from "@mui/material";
import { useState } from "react";
import { Settings } from "@mui/icons-material";

import axios from "axios";
import { useQuery } from "react-query";
import Drawer from "../../components/Drawer";
import CreateAccount from "./CreateAccount";
import RowSkeleton from "../../components/skeletons/RowSkeleton";
import { Account } from "../../interfaces/interfaces";

export default function AccountPage() {
  const [searchInput, setSearchInput] = useState("");
  // FETCHING DATA
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const getAccounts = async () => {
    const response = await axios.get(BACKEND_URL + "accounts/");
    console.log(response.data.data);

    return response.data.data;
  };

  const accountsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: () => getAccounts(),
    refetchOnWindowFocus: false,
  });
  return (
    // PAGE
    <Stack direction={"row"} height={"100vh"} width={"100vw"}>
      <Drawer />

      <Stack padding={4} gap={4} width={1}>
        <Typography fontWeight={"bold"} variant="h4">
          Akun
        </Typography>

        <Stack direction={"row"} justifyContent={"space-between"} width={1}>
          <TextField
            id="outlined-basic"
            placeholder="Cari"
            variant="outlined"
            size="small"
            sx={{ width: "400px" }}
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value);
            }}
          />
          {/* BUTTON */}
          <CreateAccount />
        </Stack>

        <TableContainer
          sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}
        >
          <Table size="small" sx={{ borderCollapse: "separate" }}>
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
                <TableCell width={10}>
                  <IconButton size="small">
                    <Settings fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody sx={{ overflowY: "scroll" }}>
              {accountsQuery.isLoading ? (
                <RowSkeleton rows={15} columns={6} />
              ) : (
                accountsQuery.data.map((account: Account, index: number) => (
                  <TableRow key={index} hover>
                    <TableCell>{account.number}</TableCell>
                    <TableCell>{account.name}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Stack>
  );
}
