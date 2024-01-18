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
import { useState } from "react";
import { useQuery } from "react-query";
import { Vendor } from "../../interfaces/interfaces";

export default function SelectVendor(props: {
  selectedVendor: Vendor | null | undefined;
  setSelectedVendor: any;
  handleVendorChange: any;
}) {
  const [open, setOpen] = useState(false);

  // GET PURCHASES
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const getVendors = async () => {
    const response = await axios.get(BACKEND_URL + "vendors");
    return response.data.data;
  };
  const vendorsQuery = useQuery({
    queryKey: ["vendors"],
    queryFn: getVendors,
    refetchOnWindowFocus: false,
    enabled: open,
  });

  return (
    <>
      <TextField
        id="outlined-basic"
        label="Vendor"
        variant="outlined"
        sx={{ input: { cursor: "pointer" } }}
        onClick={() => setOpen(true)}
        value={props.selectedVendor?.name || ""}
      />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth={"sm"}
      >
        <Stack padding={3}>
          {/* HEADER */}
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            marginBottom={2}
          >
            <Typography variant="h4">Pilih Vendor</Typography>
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
                {vendorsQuery.data &&
                  vendorsQuery.data.map((vendor: Vendor, index: number) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        props.setSelectedVendor(vendor);
                        setOpen(false);
                      }}
                      selected={props.selectedVendor?.id == vendor.id}
                    >
                      <TableCell>{vendor.code}</TableCell>
                      <TableCell>{vendor.name}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Dialog>
    </>
  );
}
