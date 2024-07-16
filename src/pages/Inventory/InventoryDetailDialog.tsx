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
  TableBody,
  TextField,
  InputAdornment,
} from "@mui/material";

import {
  Inventory,
  InventoryItem,
  TransactionItem,
} from "../../interfaces/interfaces";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { useState } from "react";
import InventoryDetailRow from "./InventoryDetailRow";

export default function InventoryDetailDialog(props: {
  open: boolean;
  setOpen: any;
  inventory: Inventory;
  transactionItems: TransactionItem[];
}) {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();

  //   FORM
  const { control, handleSubmit } = useForm();
  // const { fields } = useFieldArray({
  //   control,
  //   name: "inventoryItems",
  // });
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

  const onSubmit: SubmitHandler<any> = async (data: {
    inventoryItems: InventoryItem[];
  }) => {
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
                  {/* <TableCell width={10}>
                    <IconButton size="small">
                      <Settings fontSize="small" />
                    </IconButton>
                  </TableCell> */}
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
                      )
                    )}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </form>
    </Dialog>
  );
}
