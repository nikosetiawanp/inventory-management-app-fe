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
import PrintProductSummary from "./PrintProductSummary";

export default function ProductSummaryTab() {
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
        <DateFilterCopy
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          refetch={refetch}
          label={"Tanggal"}
        />
        <Stack marginLeft="auto">
          <PrintProductSummary
            startDate={startDate}
            endDate={endDate}
            products={productHistoryQuery?.data}
          />
        </Stack>
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
        <Sheet
          variant="outlined"
          sx={{ borderRadius: 2, overflow: "hidden", gap: 1 }}
        >
          <Table size="sm" stickyHeader stickyFooter>
            <thead>
              <tr>
                <th>
                  <Button size="sm" variant="plain" color="neutral">
                    Produk
                  </Button>
                </th>
                <th>
                  <Button size="sm" variant="plain" color="neutral">
                    Awal
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
                    Total
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
              {productHistoryQuery?.isLoading ? (
                <RowSkeleton rows={15} columns={6} />
              ) : (
                productHistoryQuery?.data?.map((product: Product) => {
                  const arrayOfArrivalQuantity = product?.history?.map(
                    (history: ProductHistory) =>
                      history?.type == "A" ? history?.quantity : 0
                  );
                  const arrayOfDepartureQuantity = product?.history?.map(
                    (history: ProductHistory) =>
                      history?.type == "D" ? history?.quantity : 0
                  );

                  return (
                    <tr>
                      <td style={{ paddingLeft: 15 }}>{product.name}</td>
                      <td style={{ paddingLeft: 15 }}>
                        {product.initialQuantity}
                      </td>
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
                      <td style={{ paddingLeft: 15 }}>
                        <b>{product.currentQuantity}</b>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </Sheet>
      </Stack>
    </Stack>
  );
}
