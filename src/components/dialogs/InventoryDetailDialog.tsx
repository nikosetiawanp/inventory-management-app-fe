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
  TextField,
  InputAdornment,
  Menu,
  ListItemIcon,
  ListItemText,
  MenuItem,
} from "@mui/material";

import {
  PurchaseItem,
  Inventory,
  InventoryItem,
  TransactionItem,
} from "../../interfaces/interfaces";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import RowSkeleton from "../skeletons/RowSkeleton";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import InventoryDetailRow from "../rows/InventoryDetailRow";

export default function InventoryDetailDialog(props: {
  open: boolean;
  setOpen: any;
  inventory: Inventory;
  transactionItems: TransactionItem[];
}) {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();

  //   FORM
  const { control, handleSubmit, watch, setValue } = useForm();
  const { fields, prepend, update, remove } = useFieldArray({
    control,
    name: "inventoryItems",
  });
  const { register } = control;

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

      const dataToSubmit = await data.map((data, index) => {
        return {
          quantity: data.quantity ? data.quantity : 0,
          productId: props.transactionItems[index].productId,
          inventoryId: props.inventory.id,
        };
      });

      try {
        const response = await axios.post(
          BACKEND_URL + "inventory-items/bulk",
          dataToSubmit
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
        queryClient.invalidateQueries(`inventoryItems.${props.inventory?.id}`);
      },
    }
  );

  const onSubmit: SubmitHandler<any> = async (
    data: { inventoryItems: InventoryItem[] },
    event
  ) => {
    try {
      await createInventoryItems.mutateAsync(data.inventoryItems);
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
      <form onSubmit={handleSubmit(onSubmit)}>
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
              <Typography variant="h4">{props.inventory?.number}</Typography>
              <Typography variant="body1">
                {formatDate(props.inventory?.date)}
              </Typography>
              <Typography variant="body1">
                {props.inventory?.transaction?.contact?.name}
              </Typography>
            </Stack>
            {/* BUTTONS */}
            <Stack direction="row" alignItems={"center"} gap={2}>
              {inventoryItemsQuery?.data?.length == 0 && (
                <Button
                  variant="contained"
                  onClick={() => handleSubmit(onSubmit as any)}
                  type="submit"
                  disabled={isSubmitting}
                  sx={{ minHeight: "100%" }}
                >
                  {isSubmitting ? "Memvalidasi" : "Validasi"}
                </Button>
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
            <Table stickyHeader size="small">
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
                  <TableCell align="center">Masuk</TableCell>
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
                {inventoryItemsQuery?.data?.length == 0
                  ? props.transactionItems?.map(
                      (purchaseItem: any, index: number) => (
                        <TableRow key={index}>
                          {/* {index} */}
                          <TableCell>{purchaseItem?.product?.name}</TableCell>
                          <TableCell align="center">
                            {purchaseItem?.quantity}{" "}
                            {purchaseItem.product?.unit}
                          </TableCell>
                          {/* QUANTITY */}
                          <TableCell align="center" width={100}>
                            <TextField
                              id={`items[${index}].quantity`}
                              size="small"
                              {...register(`inventoryItems[${index}].quantity`)}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    {purchaseItem?.product?.unit}
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </TableCell>
                          <TableCell width={10}></TableCell>
                        </TableRow>
                      )
                    )
                  : inventoryItemsQuery?.data?.map(
                      (inventoryItem: InventoryItem, index: number) => (
                        <InventoryDetailRow
                          key={index}
                          index={index}
                          inventory={props.inventory}
                          inventoryItem={inventoryItem}
                          purchaseItems={props.transactionItems}
                        />
                        // <TableRow key={index}>
                        //   {/* {index} */}
                        //   <TableCell>{inventoryItem?.product?.name}</TableCell>
                        //   <TableCell align="center">
                        //     {props.purchaseItems[index].quantity}{" "}
                        //     {props.purchaseItems[index].product.unit}
                        //   </TableCell>
                        //   {/* QUANTITY */}
                        //   <TableCell align="center" width={100}>
                        //     <Chip
                        //       size="small"
                        //       variant="filled"
                        //       color={
                        //         inventoryItem.quantity == 0
                        //           ? "error"
                        //           : inventoryItem.quantity >=
                        //             props.purchaseItems[index].quantity
                        //           ? "success"
                        //           : "warning"
                        //       }
                        //       label={
                        //         inventoryItem.quantity +
                        //         " " +
                        //         inventoryItem.product.unit
                        //       }
                        //     />
                        //   </TableCell>
                        //   <TableCell width={10}></TableCell>
                        // </TableRow>
                      )
                    )}
                {/* {inventoryItemsQuery.isLoading ? (
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
              )} */}
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
      </form>
    </Dialog>
  );
}
