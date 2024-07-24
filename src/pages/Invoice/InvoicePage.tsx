import { Button, IconButton, Sheet, Stack, Table, Typography } from "@mui/joy";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

import { Settings } from "@mui/icons-material";
import Drawer from "../../components/Drawer";
import RowSkeleton from "../../components/skeletons/RowSkeleton";
import { Invoice } from "../../interfaces/interfaces";
import InvoiceRow from "./InvoiceRow";
import DateFilterCopy from "../../components/filters/DateFilterCopy";

export default function InvoicePage() {
  // DATE
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const formattedStartDate = selectedStartDate
    ? dayjs(selectedStartDate).format("YYYY-MM-DD")
    : "";
  const formattedEndDate = selectedEndDate
    ? dayjs(selectedEndDate).format("YYYY-MM-DD")
    : "";

  // FETCHING PRODUCTS
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const getInvoices = async () => {
    const response = await axios.get(
      BACKEND_URL +
        `invoices?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
    );
    console.log(response.data.data);

    return response.data.data;
  };

  const invoicesQuery = useQuery({
    queryKey: ["invoices", selectedStartDate, selectedEndDate],
    queryFn: () => getInvoices(),
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const refetch = () => {
    getInvoices();
    invoicesQuery.refetch();
  };

  useEffect(() => {
    getInvoices();
  }, [selectedStartDate, selectedEndDate]);
  return (
    <>
      {/* PAGE */}
      <Stack direction={"row"} height={"100vh"} width={"100vw"}>
        {/* DRAWER */}
        <Drawer />
        {/* TITLE */}
        <Stack padding={4} width={1} spacing={2}>
          <Typography fontWeight={"bold"} level="h4">
            Faktur
          </Typography>

          {/* DATE FILTER */}
          <Stack direction={"row"} gap={2} width={1}>
            <DateFilterCopy
              selectedStartDate={selectedStartDate}
              setSelectedStartDate={setSelectedStartDate}
              selectedEndDate={selectedEndDate}
              setSelectedEndDate={setSelectedEndDate}
              refetch={refetch}
              label="Tanggal Faktur"
            />{" "}
          </Stack>

          <Sheet
            variant="outlined"
            sx={{ borderRadius: 2, overflow: "hidden" }}
          >
            <Table size="sm" stickyHeader stickyFooter>
              {/* HEAD */}
              <thead>
                <tr>
                  <th>
                    <Button size="sm" variant="plain" color="neutral">
                      Tanggal Faktur
                    </Button>
                  </th>
                  <th>
                    <Button size="sm" variant="plain" color="neutral">
                      Nomor Faktur
                    </Button>
                  </th>
                  <th>
                    <Button size="sm" variant="plain" color="neutral">
                      Nama Vendor
                    </Button>
                  </th>
                  <th>
                    <Button size="sm" variant="plain" color="neutral">
                      Jatuh Tempo
                    </Button>
                  </th>
                  <th>
                    <Button size="sm" variant="plain" color="neutral">
                      Status Hutang
                    </Button>
                  </th>

                  <th style={{ width: 10 }}>
                    <IconButton size="sm">
                      <Settings fontSize="small" />
                    </IconButton>
                  </th>
                </tr>
              </thead>

              {/* ROWS */}
              <tbody>
                {invoicesQuery.isLoading ? (
                  <RowSkeleton rows={15} columns={5} />
                ) : (
                  invoicesQuery?.data?.map(
                    (invoice: Invoice, index: number) => (
                      <InvoiceRow index={index} key={index} invoice={invoice} />
                    )
                  )
                )}
              </tbody>
            </Table>
          </Sheet>
        </Stack>
      </Stack>
    </>
  );
}
