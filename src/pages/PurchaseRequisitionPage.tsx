import {
  Button,
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
import Drawer from "../components/Drawer";

import { Settings } from "@mui/icons-material";

import MoreVertProductButton from "../components/buttons/MoreVertProductButton";
import CreatePurchaseRequisitionButton from "../components/buttons/CreatePurchaseRequisitionButton";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";
import MonthFilterButton from "../components/buttons/MonthFilterButton";
import PurchaseRequisitionRow from "../components/rows/PurchaseRequisitionRow";

const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function PurchaseRequisitionPage() {
  const [selectedMonth, setSelectedMonth] = useState("Januari");

  return (
    // PAGE
    <Stack direction={"row"} height={"100vh"} width={"100vw"}>
      {/* DRAWER */}
      <Drawer />

      {/* CONTENT */}
      <Stack padding={4} gap={4} width={1}>
        <Typography fontWeight={"bold"} variant="h4">
          Purchase Requisition
        </Typography>
        <Stack direction={"row"} gap={2} width={1}>
          {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker views={["year", "month"]} label="Basic date picker" />
            </DemoContainer>
          </LocalizationProvider> */}

          {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={["year", "month"]}
              label="Year and Month"
              minDate={new Date("2012-03-01")}
              maxDate={new Date("2023-06-01")}
              value={selectedDate}
              onChange={() => setSelectedDate}
              renderInput={(params: any) => (
                <TextField {...params} helperText={null} />
              )}
            />
          </LocalizationProvider> */}

          {/* <Controller
            name="datePickerField"
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  {...field}
                  views={["year", "month"]}
                  label="Year and Month"
                  minDate={new Date("2012-03-01")}
                  maxDate={new Date("2023-06-01")}
                  value={selectedDate || field.value}
                  onChange={(newValue) => {
                    setSelectedDate(newValue);
                    field.onChange(newValue);
                  }}
                />
              </LocalizationProvider>
            )}
          /> */}
          <MonthFilterButton
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
          {/* <Button
            variant="outlined"
            size="small"
            endIcon={<ArrowDropDownIcon />}
          >
            Desember
          </Button> */}

          <Button
            variant="outlined"
            size="small"
            endIcon={<ArrowDropDownIcon />}
          >
            2023
          </Button>
          <Button
            variant="outlined"
            size="small"
            endIcon={<ArrowDropDownIcon />}
          >
            Semua Vendor
          </Button>

          {/* BUTTON */}
          <CreatePurchaseRequisitionButton />
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
                <TableCell>Tanggal Surat</TableCell>
                <TableCell>Kode Vendor</TableCell>
                <TableCell>Nama Vendor</TableCell>
                <TableCell>Nomor Surat</TableCell>
                <TableCell width={10}>
                  <IconButton size="small">
                    <Settings fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>

            {/* ROWS */}
            <TableBody sx={{ overflowY: "scroll" }}>
              {rows.map((row, index) => (
                <PurchaseRequisitionRow index={index} />
                // <TableRow key={index} hover sx={{ cursor: "pointer" }}>
                //   <TableCell>15 Desember 2023</TableCell>
                //   <TableCell>SCT-02</TableCell>
                //   <TableCell>Solusi Cerdas Teknologi</TableCell>
                //   <TableCell>ABC/0223/456</TableCell>

                //   <TableCell>
                //     <MoreVertProductButton />
                //   </TableCell>
                // </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Stack>
  );
}
