import { Stack, Typography, Table, Sheet, Button } from "@mui/joy";
import { useState } from "react";
import { Settings } from "@mui/icons-material";

import axios from "axios";
import { useQuery } from "react-query";
import Drawer from "../../components/Drawer";
import CreateAccount from "./CreateAccount";
import RowSkeleton from "../../components/skeletons/RowSkeleton";
import { Account, Alert } from "../../interfaces/interfaces";
import SearchFilter from "../../components/filters/SearchFilter";
import AlertSnackbar from "../../components/AlertSnackbar";
import ActionMenu from "./ActionMenu";

export default function AccountPage() {
  const [searchInput, setSearchInput] = useState("");
  // FETCHING DATA
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const getAccounts = async () => {
    const response = await axios.get(BACKEND_URL + "accounts/");
    return response.data.data;
  };
  const accountsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: () => getAccounts(),
    refetchOnWindowFocus: false,
  });

  // ALERT
  const [alert, setAlert] = useState<Alert>({
    open: false,
    color: "success",
    message: "Data berhasil dibuat",
  });
  return (
    // PAGE
    <Stack direction={"row"} height={"100vh"} width={"100vw"}>
      <Drawer />
      <Stack padding={4} gap={2} width={1}>
        <Typography fontWeight={"bold"} level="h4">
          Akun
        </Typography>
        {/* SEARCH & FILTER */}
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"flex-end"}
          spacing={2}
        >
          <SearchFilter
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            label={"Cari produk"}
            placeholder={"Cari"}
          />
          <CreateAccount />
        </Stack>

        {/* BUTTON */}
        <Sheet variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Table size="sm" stickyHeader stickyFooter>
            <thead>
              <tr>
                {/* <th>
                  <Button size="sm" variant="plain" color="neutral">
                    Id
                  </Button>
                </th> */}
                <th>
                  <Button size="sm" variant="plain" color="neutral">
                    Nomor Akun
                  </Button>
                </th>
                <th>
                  <Button size="sm" variant="plain" color="neutral">
                    Nama
                  </Button>
                </th>
                <th
                  style={{
                    textAlign: "center",
                    width: 60,
                  }}
                >
                  <Button size="sm" variant="plain" color="neutral">
                    <Settings fontSize="small" />
                  </Button>
                </th>
              </tr>
            </thead>

            <tbody>
              {accountsQuery.isLoading ? (
                <RowSkeleton rows={15} columns={6} />
              ) : (
                accountsQuery.data.map((account: Account, index: number) => (
                  <tr key={index}>
                    {/* <td style={{ paddingLeft: 15 }}>{account.id}</td> */}
                    <td style={{ paddingLeft: 15 }}>{account.number}</td>
                    <td style={{ paddingLeft: 15 }}>{account.name}</td>
                    <td>
                      <ActionMenu account={account} setAlert={setAlert} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Sheet>
      </Stack>
      <AlertSnackbar alert={alert} setAlert={setAlert} />
    </Stack>
  );
}
