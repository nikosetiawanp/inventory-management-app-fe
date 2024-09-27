import { Button, Chip, Sheet, Stack, Table, Typography } from "@mui/joy";

import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import Drawer from "../../components/Drawer";
import { Cash } from "../../interfaces/interfaces";
import RowSkeleton from "../../components/skeletons/RowSkeleton";
import DateFilterCopy from "../../components/filters/DateFilterCopy";
import { formatDate } from "../../helpers/dateHelpers";
import { formatIDR } from "../../helpers/currencyHelpers";
import CreateCash from "./CreateCash";

export default function CashPage() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const getCashes = async () => {
    const response = await axios.get(
      BACKEND_URL +
        `cashes?` +
        `startDate=${formatDate(startDate, "YYYY-MM-DD")}` +
        `&endDate=${formatDate(endDate, "YYYY-MM-DD")}`
    );

    return response.data.data;
  };
  const cashesQuery = useQuery({
    queryKey: ["cashes"],
    queryFn: () => getCashes(),
    refetchOnWindowFocus: false,
  });

  const refetch = () => {
    getCashes();
    cashesQuery.refetch();
  };

  useEffect(() => {
    cashesQuery.refetch();
  }, [startDate, endDate]);

  return (
    <Stack direction={"row"} height={"100vh"} width={"100vw"}>
      <Drawer />
      <Stack padding={4} width={1} spacing={2}>
        <Typography fontWeight={"bold"} level="h4">
          Kas
        </Typography>

        {/* DATE FILTER */}
        <Stack direction={"row"} alignItems="end" gap={2} width={1}>
          <DateFilterCopy
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            refetch={refetch}
            label="Tanggal Kas"
          />
          <Stack marginLeft="auto">
            <CreateCash />
          </Stack>
        </Stack>

        {/* TABLE */}
        <Sheet variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
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
                    Nomor
                  </Button>
                </th>
                <th>
                  <Button size="sm" variant="plain" color="neutral">
                    Deskripsi
                  </Button>
                </th>
                <th>
                  <Button size="sm" variant="plain" color="neutral">
                    Akun
                  </Button>
                </th>
                <th>
                  <Button size="sm" variant="plain" color="neutral">
                    Jumlah
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody style={{ overflow: "scroll" }}>
              {cashesQuery?.isLoading ? (
                <RowSkeleton rows={15} columns={5} />
              ) : (
                cashesQuery?.data?.map((cash: Cash, index: number) => (
                  <tr key={index}>
                    <td style={{ paddingLeft: 15 }}>
                      {formatDate(cash?.date, "DD MMMM YYYY")}
                    </td>
                    <td style={{ paddingLeft: 15 }}>{cash?.number}</td>
                    <td style={{ paddingLeft: 15 }}>{cash?.description}</td>
                    <td style={{ paddingLeft: 15 }}>
                      <Chip size="sm">{cash?.account?.name}</Chip>
                    </td>
                    <td style={{ paddingLeft: 15 }}>
                      <Typography>
                        {cash?.amount < 0 ? "-" : "+"} {formatIDR(cash?.amount)}
                      </Typography>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Sheet>
      </Stack>
    </Stack>
  );
}
