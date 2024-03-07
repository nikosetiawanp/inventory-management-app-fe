import { useState } from "react";
import { Account } from "../../interfaces/interfaces";
import {
  Button,
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

export default function SelectAccount(props: {
  selectedAccount: Account | null | undefined;
  setSelectedAccount: any;
  handleAccountChange: any;
}) {
  const [open, setOpen] = useState(false);

  // GET PURCHASES
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const getAccounts = async () => {
    const response = await axios.get(BACKEND_URL + "accounts");
    return response.data.data;
  };
  const accounts = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
    refetchOnWindowFocus: false,
    enabled: open,
  });

  //   SEARCH
  const [searchInput, setSearchInput] = useState("");

  return (
    <>
      <TextField
        id="outlined-basic"
        label="Contact"
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

            <Button variant="contained">Buat Akun</Button>
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
              <TableBody>{/* map */}</TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Dialog>
    </>
  );
}
