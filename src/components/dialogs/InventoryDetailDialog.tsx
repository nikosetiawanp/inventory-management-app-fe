import { MoreVert, Settings } from "@mui/icons-material";
import {
  Dialog,
  Stack,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  IconButton,
  TableBody,
  Chip,
} from "@mui/material";
import MorePurchaseButton from "../buttons/MorePurchaseButton";

import {
  PurchaseItem,
  Inventory,
  InventoryItem,
} from "../../interfaces/interfaces";
import AddIcon from "@mui/icons-material/Add";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import RowSkeleton from "../skeletons/RowSkeleton";
import { useEffect, useState } from "react";
import NewInventoryItem from "../rows/NewInventoryItem";

export default function InventoryDetailDialog(props: {
  open: boolean;
  setOpen: any;
  inventory: Inventory;
}) {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();

  //   FORM
  const { control, handleSubmit, watch, setValue } = useForm();
  const { fields, append, prepend, update, remove } = useFieldArray({
    control,
    name: "inventoryItems",
  });

  // GET ITEMS
  const getInventoryItems = async () => {
    const response = await axios.get(
      BACKEND_URL + `inventory-items?inventoryId=${props.inventory.id}`
    );
    return response.data.data;
  };
  const inventoryItemsQuery = useQuery({
    queryKey: [`inventoryItems.${props.inventory.id}`],
    queryFn: () => getInventoryItems(),
    refetchOnWindowFocus: false,
    enabled: props.open,
  });

  // GET PRODUCTS
  const getProducts = async () => {
    const response = await axios.get(BACKEND_URL + `products`);
    return response.data.data;
  };

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    refetchOnWindowFocus: false,
    enabled: fields?.length > 0,
  });

  const clearFieldsArray = () => {
    for (let i = 0; i < fields.length; i++) {
      if (fields.length > 0) {
        remove(0);
      } else return;
    }
  };
  // FORMAT DATE
  const formatDate = (inputDate: string) => {
    const date = new Date(inputDate);
    const options: any = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    const formattedDate = date.toLocaleDateString("id-ID", options);
    const [day, month, year] = formattedDate.split(" ");
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const monthIndex = monthNames.indexOf(month);
    if (monthIndex !== -1) {
      const indonesianMonth = monthNames[monthIndex];
      return `${day} ${indonesianMonth} ${year}`;
    }

    return formattedDate;
  };

  // POST
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createInventoryItems = useMutation(
    async (data: InventoryItem[]) => {
      setIsSubmitting(true);
      try {
        const response = await axios.post(
          BACKEND_URL + "inventory-items/bulk",
          data
        );
        setIsSubmitting(false);
        return response.data;
      } catch (error) {
        setIsSubmitting(false);
        throw new Error("Network response was not ok");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`inventoryItems.${props.inventory.id}`);
      },
    }
  );

  const onSubmit: SubmitHandler<any> = async (
    data: { inventoryItems: InventoryItem[] },
    event
  ) => {
    try {
      await createInventoryItems.mutateAsync(data.inventoryItems);
      clearFieldsArray();
    } catch (error) {
      console.log("Mutation Error:", error);
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={() => props.setOpen(false)}
      fullWidth
      maxWidth={"lg"}
    >
      <Stack padding={3}>
        {/* HEADER */}
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          marginBottom={2}
        >
          {/* TITLE */}
          <Stack>
            <Typography variant="h4">{props.inventory.letterNumber}</Typography>
            <Typography variant="body1">
              {formatDate(props.inventory.date)}
            </Typography>
            <Typography variant="body1">
              {props.inventory.purchase.vendor.name}
            </Typography>
          </Stack>
          {/* BUTTONS */}
          <Stack direction="row" alignItems={"center"} gap={2}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => {
                append({
                  quantity: 0,
                  stockAfter: 0,
                  inventoryId: props.inventory.id,
                  productId: "",
                });
              }}
            >
              Tambah Item
            </Button>
            {fields.length > 0 ? (
              <Button
                variant="contained"
                onClick={handleSubmit(onSubmit as any)}
                type="submit"
                disabled={isSubmitting}
                sx={{ minHeight: "100%" }}
              >
                {isSubmitting
                  ? "Menyimpan"
                  : // <CircularProgress color="inherit" size={15} />
                    "Simpan"}
              </Button>
            ) : (
              <>
                <MorePurchaseButton />
              </>
            )}
          </Stack>
        </Stack>

        {/* TABLE */}
        <TableContainer
          sx={{
            backgroundColor: "white",
            height: 500,
          }}
        >
          <Table stickyHeader>
            {/* TABLE HEAD */}
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
                <TableCell>Produk</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="center">Stok Sekarang</TableCell>
                <TableCell width={10}>
                  <IconButton size="small">
                    <Settings fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody
              sx={{
                position: "sticky",
                backgroundColor: "white",
                borderColor: "divider",
                width: 1,
                overflowY: "scroll",
                maxHeight: 100,
              }}
            >
              {/* NEW ITEM */}
              {inventoryItemsQuery.isLoading ? (
                <RowSkeleton rows={15} columns={8} />
              ) : (
                inventoryItemsQuery.data?.map(
                  (item: InventoryItem, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell align="center">
                        {item.quantity} {item.product.unit}
                      </TableCell>
                      <TableCell align="center">
                        {item.stockAfter} {item.product.unit}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  )
                )
              )}

              {fields.map((field, index) => (
                <NewInventoryItem
                  key={field.id}
                  control={control}
                  update={update}
                  index={index}
                  value={field}
                  remove={remove}
                  products={productsQuery.data}
                  inventory={props.inventory}
                  watch={watch}
                  fields={fields}
                  setValue={setValue}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* FOOTER */}
        {/* <Stack
          position={"sticky"}
          bottom={0}
          direction={"row"}
          justifyContent={"space-between"}
          bgcolor={"white"}
          padding={2}
          borderTop={1}
          borderColor={"divider"}
        >
          <Typography fontWeight={"bold"} variant="body1">
            Total
          </Typography>
          <Typography fontWeight={"bold"} variant="body1">
            {currencyFormatter.format(
              calculateSum(purchaseItemsQuery.data as any)
            )}
          </Typography>
        </Stack> */}
      </Stack>
    </Dialog>
  );
}
