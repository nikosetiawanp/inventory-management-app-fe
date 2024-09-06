import { Button, IconButton, Sheet, Stack, Table, Typography } from "@mui/joy";

import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";

import { Settings } from "@mui/icons-material";
import { Product, ProductHistory } from "../../interfaces/interfaces";
import RowSkeleton from "../../components/skeletons/RowSkeleton";

import { formatDate } from "../../helpers/dateHelpers";
import { sum } from "../../helpers/calculationHelpers";
import DateFilterCopy from "../../components/filters/DateFilterCopy";
import PrintProductHistory from "./PrintProductHistory";

export default function ProductHistoryTab() {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";

  // DATE
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // GET DEBTS
  const getProductHistory = async () => {
    const response = await axios.get(
      BACKEND_URL +
        "product-history?" +
        `startDate=${formatDate(startDate, "YYYY-MM-DD")}` +
        `&endDate=${formatDate(endDate, "YYYY-MM-DD")}`
    );
    return response.data.data;
  };

  const productHistoryQuery = useQuery({
    queryKey: ["product-history"],
    queryFn: getProductHistory,
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const refetch = () => {
    getProductHistory();
    productHistoryQuery.refetch();
  };

  useEffect(() => {
    refetch();
    console.log(productHistoryQuery?.data);
  }, [startDate, endDate]);

  return (
    <Stack gap={2} width={1}>
      {/* FILTERS */}
      <Stack direction={"row"} gap={2} width={1} alignItems={"end"}>
        {/* <ChecklistFilter
          data={contacts}
          includedData={selectedContacts}
          setIncludedData={setSelectedContacts}
          label={"Vendor"}
        /> */}

        <DateFilterCopy
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          refetch={refetch}
          label={"Tanggal"}
        />
        <PrintProductHistory
          startDate={startDate}
          endDate={endDate}
          products={productHistoryQuery?.data}
        />
        {/* <PrintMultiVendorReportModal
          startDate={startDate}
          endDate={endDate}
          contacts={vendorDebtsQuery?.data}
        /> */}
      </Stack>

      {/* TABLES */}
      <Stack
        direction={"column"}
        spacing={4}
        // border={2}
        height={"100vh"} // Set height to viewport height
        maxHeight={"100vh"} // Ensure it doesn't exceed the viewport height
        overflow={"scroll"}
      >
        {productHistoryQuery?.data?.map((product: Product, index: number) => {
          const arrayOfHistoryQuantity = product?.history?.map(
            (history: ProductHistory) =>
              history?.type == "A" ? history?.quantity : history?.quantity * -1
          );
          const arrayOfArrivalQuantity = product?.history?.map(
            (history: ProductHistory) =>
              history?.type == "A" ? history?.quantity : 0
          );
          const arrayOfDepartureQuantity = product?.history?.map(
            (history: ProductHistory) =>
              history?.type == "D" ? history?.quantity : 0
          );

          return (
            <Stack key={index}>
              <Typography color="primary">
                <b>
                  {product?.name} | {product?.code}
                </b>
              </Typography>
              <Sheet
                variant="outlined"
                sx={{ borderRadius: 2, overflow: "hidden", gap: 1 }}
              >
                <Table size="sm" stickyHeader stickyFooter>
                  <thead>
                    <tr>
                      <th>
                        <Button size="sm" variant="plain" color="neutral">
                          Tanggal
                        </Button>
                      </th>
                      <th>
                        <Button size="sm" variant="plain" color="neutral">
                          Nomor Faktur
                        </Button>
                      </th>
                      <th>
                        <Button size="sm" variant="plain" color="neutral">
                          Keterangan
                        </Button>
                      </th>
                      <th>
                        <Button size="sm" variant="plain" color="neutral">
                          Masuk
                        </Button>
                      </th>
                      <th>
                        <Button size="sm" variant="plain" color="neutral">
                          Keluar
                        </Button>
                      </th>
                      <th>
                        <Button size="sm" variant="plain" color="neutral">
                          Saldo
                        </Button>
                      </th>
                      <th style={{ textAlign: "center", width: 50 }}>
                        <IconButton size="sm">
                          <Settings fontSize="small" />
                        </IconButton>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td style={{ paddingLeft: 15 }}>
                        <b>Saldo Awal</b>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td style={{ paddingLeft: 15 }}>
                        <b>
                          {productHistoryQuery?.data[index].initialQuantity}
                        </b>
                      </td>
                      <td></td>
                    </tr>

                    {productHistoryQuery?.isLoading ? (
                      <RowSkeleton rows={15} columns={6} />
                    ) : (
                      product.history?.map(
                        (history: ProductHistory, index: number) => (
                          <tr key={index}>
                            <td style={{ paddingLeft: 15 }}>
                              {formatDate(history?.date, "DD MMMM YYYY")}
                            </td>
                            <td style={{ paddingLeft: 15 }}>
                              {history?.receiptNumber}
                            </td>
                            <td style={{ paddingLeft: 15 }}>
                              <Typography>{history?.description}</Typography>
                            </td>{" "}
                            <td style={{ paddingLeft: 15 }}>
                              <Typography color="success">
                                {history?.type == "A" ? history?.quantity : 0}
                              </Typography>
                            </td>
                            <td style={{ paddingLeft: 15 }}>
                              <Typography color="danger">
                                {history?.type == "D" ? history?.quantity : 0}
                              </Typography>
                            </td>
                            <td style={{ paddingLeft: 15 }}>
                              {arrayOfHistoryQuantity &&
                                product?.initialQuantity +
                                  sum(
                                    arrayOfHistoryQuantity.slice(0, index + 1)
                                  )}
                            </td>
                            <td style={{ width: 50 }}></td>
                          </tr>
                        )
                      )
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td style={{ paddingLeft: 15 }}>
                        <b>Total</b>
                      </td>
                      <td></td>
                      <td></td>
                      <td style={{ paddingLeft: 15 }}>
                        <Typography color="success">
                          {sum(arrayOfArrivalQuantity)}
                        </Typography>
                      </td>
                      <td style={{ paddingLeft: 15 }}>
                        <Typography color="danger">
                          {sum(arrayOfDepartureQuantity)}
                        </Typography>
                      </td>
                      <td style={{ paddingLeft: 15 }}></td>
                      <td></td>
                    </tr>
                  </tfoot>
                </Table>
              </Sheet>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}
