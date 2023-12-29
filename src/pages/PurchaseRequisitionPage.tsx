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
import axios from "axios";
import { useQuery } from "react-query";
import { Purchase } from "../interfaces/interfaces";
import RowSkeleton from "../components/skeletons/RowSkeleton";

export default function PurchaseRequisitionPage() {
  const [selectedMonth, setSelectedMonth] = useState("Januari");

  // FETCHING PRODUCTS
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const getPurchases = async () => {
    const response = await axios.get(BACKEND_URL + "purchases/");
    return response.data.data;
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["purchase"],
    queryFn: () => getPurchases(),
  });

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
          <MonthFilterButton
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />

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
          <Table sx={{ borderCollapse: "separate" }}>
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
              {isLoading ? (
                <RowSkeleton rows={15} columns={5} />
              ) : (
                data?.map((purchase: Purchase, index: number) => (
                  <PurchaseRequisitionRow
                    index={index}
                    key={index}
                    purchase={purchase}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Stack>
  );
}
