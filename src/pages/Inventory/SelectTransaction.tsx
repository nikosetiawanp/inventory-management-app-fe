import {
  Chip,
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
import { useState } from "react";
import { useQuery } from "react-query";
import { Transaction } from "../../interfaces/interfaces";
import { formatDate } from "../../helpers/dateHelpers";
import DateFilterCopy from "../../components/filters/DateFilterCopy";

export default function SelectPurchase(props: {
  selectedTransaction: Transaction | null | undefined;
  setSelectedTransaction: any;
  type: "A" | "D";
}) {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const type = props.type == "A" ? "P" : "D";

  // GET TRANSACTIONS
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const getTransactions = async () => {
    const response = await axios.get(
      BACKEND_URL +
        "transactions?" +
        `type=${type}` +
        `&isApproved=1` +
        `&startDate=${startDate ? formatDate(startDate, "YYYY-MM-DD") : ""}` +
        `&endDate=${endDate ? formatDate(endDate, "YYYY-MM-DD") : ""}` +
        `&isDone=0`
    );
    console.log(response.data.data);

    return response.data.data;
  };

  const transactionsQuery = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(),
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const refetch = () => {
    getTransactions();
    transactionsQuery.refetch();
  };

  return (
    <>
      <TextField
        id="outlined-basic"
        label="Purchase Order"
        variant="outlined"
        sx={{ input: { cursor: "pointer" } }}
        onClick={() => setOpen(true)}
        value={props.selectedTransaction?.number || ""}
        placeholder="Purchase Order"
      />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth={"md"}
      >
        <Stack padding={3}>
          {/* HEADER */}
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            marginBottom={2}
          >
            <Typography variant="h4">Pilih Pembelian</Typography>
            <DateFilterCopy
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              refetch={refetch}
              label={"Tanggal"}
            />
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={["month", "year"]}
                slotProps={{ textField: { size: "small" } }}
                value={selectedDate}
                onChange={(newValue: any) => setSelectedDate(newValue)}
                format="MMMM YYYY"
              />
            </LocalizationProvider> */}
          </Stack>

          {/* TABLE */}
          <TableContainer
            sx={{
              backgroundColor: "white",
              height: 500,
            }}
          >
            <Table stickyHeader size="small">
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
                  <TableCell>Tanggal PO</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Nomor PO</TableCell>
                  <TableCell align="center">Jumlah Gudang Masuk</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactionsQuery?.data &&
                  transactionsQuery?.data.map(
                    (purchase: Transaction, index: number) => (
                      <TableRow
                        key={index}
                        hover
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          props.setSelectedTransaction(purchase);
                          setOpen(false);
                        }}
                        selected={props.selectedTransaction?.id == purchase.id}
                      >
                        <TableCell>{purchase.date}</TableCell>
                        <TableCell>{purchase.contact.name}</TableCell>
                        <TableCell>{purchase.number}</TableCell>
                        <TableCell align="center">
                          <Chip
                            size="small"
                            variant="filled"
                            color={
                              purchase?.inventories?.length > 0
                                ? "primary"
                                : "error"
                            }
                            label={`${purchase?.inventories?.length} LPB`}
                          />
                        </TableCell>
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
