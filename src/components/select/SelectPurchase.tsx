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
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Purchase } from "../../interfaces/interfaces";

export default function SelectPurchase(props: {
  selectedPurchase: Purchase | null | undefined;
  setSelectedPurchase: any;
  handlePurchaseChange: any;
}) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
  const selectedYear = formattedDate.split("-")[0];
  const selectedMonth = formattedDate.split("-")[1];

  // GET PURCHASES
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const getPurchases = async () => {
    const response = await axios.get(
      BACKEND_URL +
        `purchases?startDate=${selectedYear}-${selectedMonth}-01&endDate=${selectedYear}-${selectedMonth}-31&status=PO`
    );
    return response.data.data;
  };
  const purchasesQuery = useQuery({
    queryKey: ["purchases"],
    queryFn: getPurchases,
    refetchOnWindowFocus: false,
    enabled: open,
  });

  useEffect(() => {
    purchasesQuery.refetch();
  }, [selectedDate]);

  return (
    <>
      <TextField
        id="outlined-basic"
        label="Nomor PO"
        variant="outlined"
        sx={{ input: { cursor: "pointer" } }}
        onClick={() => setOpen(true)}
        value={props.selectedPurchase?.poNumber || ""}
        placeholder="Nomor PO"
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={["month", "year"]}
                slotProps={{ textField: { size: "small" } }}
                value={selectedDate}
                onChange={(newValue: any) => setSelectedDate(newValue)}
                format="MMMM YYYY"
              />
            </LocalizationProvider>
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
                  <TableCell>Tanggal PO</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Nomor PO</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchasesQuery.data &&
                  purchasesQuery.data.map(
                    (purchase: Purchase, index: number) => (
                      <TableRow
                        key={index}
                        hover
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          props.setSelectedPurchase(purchase);
                          setOpen(false);
                        }}
                        selected={props.selectedPurchase?.id == purchase.id}
                      >
                        <TableCell>{purchase.poDate}</TableCell>
                        <TableCell>{purchase.vendor.name}</TableCell>
                        <TableCell>{purchase.poNumber}</TableCell>
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
