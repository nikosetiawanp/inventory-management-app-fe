import { Stack, Tab, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import Drawer from "../../components/Drawer";

import UnpaidDebtTab from "./UnpaidDebtTab";
import VendorDebtTab from "./VendorDebtTab";

export default function DebtPage() {
  return (
    <Stack
      direction={"row"}
      height={"100vh"}
      width={"100vw"}
      sx={{ backgroundColor: "background" }}
    >
      <Drawer />
      <Stack padding={4} gap={2} width={1}>
        <Typography fontWeight={"bold"} level="h4">
          Hutang
        </Typography>
        <Tabs defaultValue={0} sx={{ backgroundColor: "transparent" }}>
          <TabList>
            <Tab color="primary" value={0}>
              Belum Lunas
            </Tab>
            <Tab color="primary" value={1}>
              Vendor
            </Tab>
          </TabList>
          <TabPanel value={0} sx={{ paddingX: 0 }}>
            <UnpaidDebtTab />
          </TabPanel>
          <TabPanel value={1} sx={{ paddingX: 0 }}>
            <VendorDebtTab />
          </TabPanel>
        </Tabs>

        {/* STATUS
        <Stack direction={"row"} gap={2} width={1}>
          <Sheet
            sx={{
              border: 1,
              borderColor: "divider",
              boxShadow: 0,
              padding: 2,
              borderRadius: 2,
            }}
          >
            <Typography level="body-md" color={"neutral"}>
              Total Tagihan
            </Typography>
            <h2>{formatIDR(sum(arrayOfDebts))}</h2>
          </Sheet>

          <Sheet
            sx={{
              border: 1,
              borderColor: "divider",
              boxShadow: 0,
              padding: 2,
              borderRadius: 2,
            }}
          >
            <Typography level="body-md" color={"neutral"}>
              Total Dibayar
            </Typography>
            <h2>
              <Typography color="success">
                {formatIDR(sum(arrayOfPayments))}
              </Typography>
            </h2>
          </Sheet>

          <Sheet
            sx={{
              border: 1,
              borderColor: "divider",
              boxShadow: 0,
              padding: 2,
              borderRadius: 2,
            }}
          >
            <Typography level="body-md" color={"neutral"}>
              Sisa Hutang
            </Typography>
            <h2>
              <Typography color="danger">
                {formatIDR(sum(arrayOfDebts) - sum(arrayOfPayments))}
              </Typography>
            </h2>
          </Sheet>
        </Stack> */}

        {/* FILTERS
        <Stack direction={"row"} gap={2} width={1} alignItems={"end"}>
          <DateFilterCopy
            selectedStartDate={selectedStartDate}
            setSelectedStartDate={setSelectedStartDate}
            selectedEndDate={selectedEndDate}
            setSelectedEndDate={setSelectedEndDate}
            refetch={refetch}
            label="Tanggal Faktur"
          />{" "}
          <ChecklistFilter
            data={contacts}
            includedData={includedData}
            setIncludedData={setIncludedData}
            label={"Vendor"}
          />
        </Stack> */}

        {/* <Sheet variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Table size="sm" stickyHeader stickyFooter>
            <thead>
              <tr>
                <th>
                  <SortButton
                    sortConfigKey="invoice-date"
                    sortConfig={sortConfig}
                    setSortConfig={setSortConfig}
                    label={"Tanggal Faktur"}
                  />
                </th>
                <th>
                  <Button size="sm" variant="plain" color="neutral">
                    Tanggal Jatuh Tempo
                  </Button>
                </th>
                <th>
                  <Button size="sm" variant="plain" color="neutral">
                    Nomor Faktur
                  </Button>
                </th>
                <th style={{ width: 100 }}>
                  <SortButton
                    sortConfigKey="vendor"
                    sortConfig={sortConfig}
                    setSortConfig={setSortConfig}
                    label={"Vendor"}
                  />
                </th>
                <th>
                  <Button size="sm" variant="plain" color="neutral">
                    Jumlah Tagihan
                  </Button>
                </th>
                <th>
                  <Button size="sm" variant="plain" color="neutral">
                    Jumlah Dibayar
                  </Button>
                </th>
                <th align="center">
                  <Button size="sm" variant="plain" color="neutral">
                    Pembayaran
                  </Button>
                </th>
                <th style={{ textAlign: "center" }}>
                  <IconButton size="sm">
                    <Settings fontSize="small" />
                  </IconButton>
                </th>
              </tr>
            </thead>

            <tbody>
              {debtsQuery.isLoading ? (
                <RowSkeleton rows={15} columns={6} />
              ) : (
                sortedData?.map((debt: Debt, index: number) => (
                  <DebtRow key={index} index={index} debt={debt} />
                ))
              )}
            </tbody>
          </Table>
        </Sheet> */}
      </Stack>
    </Stack>
  );
}
