import { Button, IconButton, Sheet, Stack, Table } from "@mui/joy";
import DateFilterCopy from "../../components/filters/DateFilterCopy";
import CreateInventory from "./CreateInventory";
import PrintInventory from "./PrintInventory";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { useQuery } from "react-query";
import RowSkeleton from "../../components/skeletons/RowSkeleton";
import { Settings } from "@mui/icons-material";
import { Inventory } from "../../interfaces/interfaces";
import InventoryRow from "./InventoryRow";

export default function InventoryTab(props: { type: "A" | "D" }) {
  // DATE
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const formattedStartDate = startDate
    ? dayjs(startDate).format("YYYY-MM-DD")
    : "";
  const formattedEndDate = endDate ? dayjs(endDate).format("YYYY-MM-DD") : "";

  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  // GET INVENTORY HISTORY
  const getInventories = async () => {
    const response = await axios.get(
      BACKEND_URL +
        "inventories?" +
        `startDate=${formattedStartDate}` +
        `&endDate=${formattedEndDate}` +
        `&type=${props.type}`
    );

    return response.data.data;
  };

  const inventoriesQuery = useQuery({
    queryKey: ["inventories", startDate, endDate, props.type],
    queryFn: getInventories,
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const refetch = () => {
    getInventories();
    inventoriesQuery.refetch();
  };

  useEffect(() => {
    setStartDate(null);
    setEndDate(null);
  }, [props.type]);

  useEffect(() => {
    getInventories();
  }, [startDate, endDate]);
  return (
    <Stack>
      {/* FILTERS */}
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"flex-end"}
        spacing={2}
        marginBottom={2}
      >
        <DateFilterCopy
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          refetch={refetch}
          label="Tanggal Faktur"
        />
        <Stack marginLeft="auto" direction={"row"} spacing={2}>
          <CreateInventory type={props.type} />
          <PrintInventory
            startDate={startDate}
            endDate={endDate}
            inventories={inventoriesQuery?.data}
            type={props.type}
          />
        </Stack>
      </Stack>

      {/* TABLE */}
      <Sheet variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table size="sm" stickyHeader stickyFooter>
          <thead>
            <tr>
              <th>
                <Button size="sm" variant="plain" color="neutral">
                  Nomor LPB
                </Button>
              </th>
              <th>
                <Button size="sm" variant="plain" color="neutral">
                  Nomor Faktur
                </Button>
              </th>
              <th>
                <Button size="sm" variant="plain" color="neutral">
                  {props.type == "A" ? "Vendor" : "Customer"}
                </Button>
              </th>
              <th>
                <Button size="sm" variant="plain" color="neutral">
                  Tanggal Faktur
                </Button>
              </th>
              <th>
                <Button size="sm" variant="plain" color="neutral">
                  {props.type == "A" ? "Purchase Order" : "Sales Order"}
                </Button>
              </th>
              <th>
                <Button size="sm" variant="plain" color="neutral">
                  Deskripsi
                </Button>
              </th>
              <th style={{ textAlign: "center" }}>
                <Button size="sm" variant="plain" color="neutral">
                  Status Validasi
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
            {inventoriesQuery?.isLoading ? (
              <RowSkeleton rows={15} columns={8} />
            ) : (
              inventoriesQuery?.data?.map(
                (inventory: Inventory, index: number) => (
                  <InventoryRow
                    key={index}
                    index={index}
                    inventory={inventory}
                  />
                )
              )
            )}
          </tbody>
        </Table>
      </Sheet>
    </Stack>
  );
}
