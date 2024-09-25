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
import dayjs from "dayjs";
import { useState } from "react";

import { Inventory } from "../../interfaces/interfaces";

export default function SelectInventory(props: {
  selectedInventory: Inventory | null | undefined;
  setSelectedInventory: any;
  inventories: Inventory[];
}) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  return (
    <>
      <TextField
        id="outlined-basic"
        label="Nomor Surat Jalan"
        variant="outlined"
        sx={{ input: { cursor: "pointer" } }}
        onClick={() => setOpen(true)}
        value={props.selectedInventory?.number || ""}
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
            <Typography variant="h4">Pilih Stok Masuk</Typography>
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
                  <TableCell>Tanggal</TableCell>
                  <TableCell>Nomor Surat Jalan</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.inventories &&
                  props.inventories.map(
                    (inventory: Inventory, index: number) => (
                      <TableRow
                        key={index}
                        hover
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          props.setSelectedInventory(inventory);
                          setOpen(false);
                        }}
                        selected={props.selectedInventory?.id == inventory.id}
                      >
                        <TableCell>{inventory.date}</TableCell>
                        <TableCell>{inventory.number}</TableCell>
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
