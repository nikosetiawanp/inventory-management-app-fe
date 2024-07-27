import { Button, IconButton, Sheet, Stack, Table, Typography } from "@mui/joy";
import Drawer from "../../components/Drawer";
import { Settings } from "@mui/icons-material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import CreateInventory from "./CreateInventory";
import axios from "axios";
import { useQuery } from "react-query";
import { Inventory } from "../../interfaces/interfaces";
import InventoryRow from "./InventoryRow";
import DateFilterCopy from "../../components/filters/DateFilterCopy";

export default function InventoryArrivalPage() {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";

  // DATE
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const formattedStartDate = selectedStartDate
    ? dayjs(selectedStartDate).format("YYYY-MM-DD")
    : "";
  const formattedEndDate = selectedEndDate
    ? dayjs(selectedEndDate).format("YYYY-MM-DD")
    : "";

  // GET INVENTORY HISTORY
  const getInventories = async () => {
    const response = await axios.get(
      BACKEND_URL +
        `inventories?startDate=${formattedStartDate}&endDate=${formattedEndDate}&type=A`
    );
    console.log(response.data.data);

    return response.data.data;
  };

  const inventoriesQuery = useQuery({
    queryKey: ["inventories", selectedStartDate, selectedEndDate],
    queryFn: getInventories,
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const refetch = () => {
    getInventories();
    inventoriesQuery.refetch();
  };

  useEffect(() => {
    getInventories();
  }, [selectedStartDate, selectedEndDate]);

  return (
    // PAGE
    <Stack direction={"row"} height={"100vh"} width={"100vw"}>
      <Drawer />
      <Stack padding={4} width={1} spacing={2}>
        <Typography fontWeight={"bold"} level="h4">
          Gudang Masuk
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
          <CreateInventory type="A" />
        </Stack>

        <Sheet variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Table size="sm" stickyHeader stickyFooter>
            <thead>
              <tr>
                <th>
                  {" "}
                  <Button size="sm" variant="plain" color="neutral">
                    Nomor LPB
                  </Button>
                </th>
                <th>
                  {" "}
                  <Button size="sm" variant="plain" color="neutral">
                    Nomor Faktur
                  </Button>
                </th>
                <th>
                  {" "}
                  <Button size="sm" variant="plain" color="neutral">
                    Vendor
                  </Button>
                </th>
                <th>
                  {" "}
                  <Button size="sm" variant="plain" color="neutral">
                    Tanggal Faktur
                  </Button>
                </th>
                <th>
                  {" "}
                  <Button size="sm" variant="plain" color="neutral">
                    Purchase Order
                  </Button>
                </th>
                <th>
                  {" "}
                  <Button size="sm" variant="plain" color="neutral">
                    Deskripsi
                  </Button>
                </th>
                <th style={{ width: 60, textAlign: "center" }}>
                  <IconButton size="sm">
                    <Settings fontSize="small" />
                  </IconButton>
                </th>
              </tr>
            </thead>

            <tbody>
              {inventoriesQuery?.data?.map(
                (inventory: Inventory, index: number) => (
                  <InventoryRow
                    key={index}
                    index={index}
                    inventory={inventory}
                  />
                )
              )}
            </tbody>
          </Table>
        </Sheet>
      </Stack>
    </Stack>
  );
}
