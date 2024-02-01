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

import { useQuery } from "react-query";
import { Settings } from "@mui/icons-material";
import { Vendor } from "../interfaces/interfaces";

import Drawer from "../components/Drawer";
import CreateVendorButton from "../components/buttons/CreateVendorButton";
import MoreVertVendorButton from "../components/buttons/MoreVertVendorButton";
import RowSkeleton from "../components/skeletons/RowSkeleton";
import axios from "axios";
import { useState } from "react";

export default function VendorPage() {
  // FETCHING DATA
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const getVendors = async () => {
    const response = await axios.get(BACKEND_URL + "vendors/");
    return response.data.data;
  };

  const vendorsQuery = useQuery({
    queryKey: ["vendors"],
    queryFn: () => getVendors(),
    refetchOnWindowFocus: false,
  });

  const [searchInput, setSearchInput] = useState("");
  const filteredVendorsQuery = vendorsQuery?.data?.filter(
    (vendor: Vendor) =>
      vendor.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      vendor.code.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    // PAGE
    <Stack direction={"row"} height={"100vh"} width={"100vw"}>
      {/* DRAWER */}
      <Drawer />
      {/* CONTENT */}
      <Stack padding={4} gap={4} width={1}>
        <Typography fontWeight={"bold"} variant="h4">
          Daftar Vendor
        </Typography>
        <Stack direction={"row"} justifyContent={"space-between"} width={1}>
          <TextField
            id="outlined-basic"
            placeholder="Cari vendor"
            variant="outlined"
            size="small"
            sx={{ width: "400px" }}
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value);
            }}
          />
          {/* BUTTON */}
          <CreateVendorButton />
        </Stack>

        <TableContainer
          sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}
        >
          <Table size="medium" sx={{ borderCollapse: "separate" }}>
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
                <TableCell>Kode</TableCell>
                <TableCell>Nama</TableCell>
                <TableCell>Alamat</TableCell>
                <TableCell>Nomor Telepon</TableCell>
                <TableCell>Email</TableCell>
                <TableCell width={10}>
                  <IconButton size="small">
                    <Settings fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>

            {/* ROWS */}
            <TableBody sx={{ overflowY: "scroll" }}>
              {vendorsQuery.isLoading ? (
                <RowSkeleton rows={15} columns={6} />
              ) : (
                filteredVendorsQuery?.map((vendor: Vendor) => (
                  <TableRow key={vendor.id} hover>
                    <TableCell>{vendor.code}</TableCell>
                    <TableCell>{vendor.name}</TableCell>
                    <TableCell>{vendor.address}</TableCell>
                    <TableCell>{vendor.phone}</TableCell>
                    <TableCell>{vendor.email}</TableCell>
                    <TableCell>
                      <MoreVertVendorButton vendor={vendor} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* BOTTOM */}
        {/* <Stack direction={"row"} gap={2}>
          <Typography variant="body1">Halaman 1 dari 5</Typography>
          <Button variant="outlined" sx={{ marginLeft: "auto" }}>
            Previous
          </Button>
          <Button variant="outlined">Next</Button>
        </Stack> */}
      </Stack>
    </Stack>
  );
}
