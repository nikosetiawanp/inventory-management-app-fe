import { Button, IconButton, Sheet, Stack, Table, Typography } from "@mui/joy";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Settings } from "@mui/icons-material";
import Drawer from "../../components/Drawer";
import RowSkeleton from "../../components/skeletons/RowSkeleton";
import { Invoice } from "../../interfaces/interfaces";
import InvoiceRow from "../Invoice/InvoiceRow";
import DateFilterCopy from "../../components/filters/DateFilterCopy";

export default function CompletedTransactionPage(props: { type: "P" | "S" }) {
  // DATE
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const formattedStartDate = startDate
    ? dayjs(startDate).format("YYYY-MM-DD")
    : "";
  const formattedEndDate = endDate ? dayjs(endDate).format("YYYY-MM-DD") : "";

  // FETCHING PRODUCTS
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const getInvoices = async () => {
    const response = await axios.get(
      BACKEND_URL +
        "invoices?" +
        `startDate=${formattedStartDate}` +
        `&endDate=${formattedEndDate}` +
        `&type=${props.type}`
    );
    return response.data.data;
  };

  const invoicesQuery = useQuery({
    queryKey: ["invoices", startDate, endDate, props.type],
    queryFn: () => getInvoices(),
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const refetch = () => {
    getInvoices();
    invoicesQuery.refetch();
  };

  useEffect(() => {
    setStartDate(null);
    setEndDate(null);
  }, [props.type]);

  useEffect(() => {
    refetch();
    console.log(invoicesQuery?.data);
  }, [startDate, endDate, props.type]);
  return (
    <>
      {/* PAGE */}
      <Stack direction={"row"} height={"100vh"} width={"100vw"}>
        {/* DRAWER */}
        <Drawer />
        {/* TITLE */}
        <Stack padding={4} width={1} spacing={2}>
          <Typography fontWeight={"bold"} level="h4">
            {props.type == "P" ? "Pembelian" : "Penjualan"}
          </Typography>

          {/* DATE FILTER */}
          <Stack direction={"row"} gap={2} width={1}>
            <DateFilterCopy
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              refetch={refetch}
              label="Tanggal Faktur"
            />
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
                      {props.type == "P" ? "Vendor" : "Customer"}
                    </Button>
                  </th>
                  <th>
                    <Button size="sm" variant="plain" color="neutral">
                      Jatuh Tempo
                    </Button>
                  </th>
                  <th style={{ textAlign: "center" }}>
                    <Button size="sm" variant="plain" color="neutral">
                      {props.type == "P" ? "Status Hutang" : "Status Piutang"}
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
