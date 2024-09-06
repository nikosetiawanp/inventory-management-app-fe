import {
  Stack,
  Typography,
  Button,
  Table,
  Modal,
  Sheet,
  Input,
  ModalDialog,
} from "@mui/joy";

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
  refetch: () => void;
}) {
  const BACKEND_URL = "http://127.0.0.1:8000/api/v1/";
  const queryClient = useQueryClient();

  //   FORM
  const { control, handleSubmit } = useForm();
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
          transactionItemId: props.transactionItems[index].id,
        };
      });

      try {
        const response = await axios.post(
          BACKEND_URL + "inventory-items/bulk",
          dataToSubmit
        );

        setIsSubmitting(false);
        props.refetch();
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
    <Modal open={props.open} onClose={() => props.setOpen(false)}>
      <ModalDialog
        size="sm"
        sx={{ height: 1, width: 1, maxHeight: "90vh", maxWidth: "70vw" }}
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
                <Typography level="h4" fontWeight="bold">
                  {props.inventory?.number}
                </Typography>
                <Typography level="body-sm">
                  {formatDate(props.inventory?.date)}
                </Typography>
                <Typography level="body-sm">
                  {props.inventory?.transaction?.contact?.name}
                </Typography>
              </Stack>
              {/* BUTTONS */}
              <Stack direction="row" alignItems={"center"} gap={2}>
                <Button
                  variant="solid"
                  onClick={() => handleSubmit(onSubmit as any)}
                  type="submit"
                  disabled={inventoryItemsQuery?.data?.length > 0}
                  sx={{ minHeight: "100%" }}
                >
                  {isSubmitting ? "Memvalidasi" : "Validasi"}
                </Button>
              </Stack>
            </Stack>

            {/* TABLE */}
            <Sheet
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "auto",
                height: 1,
                width: 1,
              }}
            >
              <Table size="sm" stickyHeader stickyFooter>
                {/* TABLE HEAD */}
                <thead>
                  <tr>
                    <th>Produk</th>
                    <th style={{ textAlign: "center" }}>Quantity</th>
                    <th style={{ textAlign: "center", width: 100 }}>Masuk</th>
                    {/* <td width={10}>
                    <IconButton size="small">
                      <Settings fontSize="small" />
                    </IconButton>
                  </td> */}
                  </tr>
                </thead>

                <tbody
                  style={{
                    position: "sticky",
                    borderColor: "divider",
                    width: 1,
                    height: 1,
                    overflow: "scroll",
                    backgroundColor: "transparent",
                  }}
                >
                  {/* NEW ITEM */}
                  {inventoryItemsQuery?.data?.length == 0
                    ? props.transactionItems?.map(
                        (transactionItem: any, index: number) => (
                          <tr key={index}>
                            {/* {index} */}
                            <td>{transactionItem?.product?.name}</td>
                            <td align="center">
                              {transactionItem?.quantity}
                              {transactionItem.product?.unit}
                            </td>
                            {/* QUANTITY */}
                            <td style={{ width: 100, textAlign: "center" }}>
                              <Input
                                id={`items[${index}].quantity`}
                                size="md"
                                {...register(
                                  `inventoryItems[${index}].quantity`
                                )}
                                endDecorator={transactionItem?.product?.unit}
                              />
                            </td>
                          </tr>
                        )
                      )
                    : inventoryItemsQuery?.data?.map(
                        (inventoryItem: InventoryItem, index: number) => (
                          <InventoryDetailRow
                            key={index}
                            index={index}
                            inventory={props.inventory}
                            inventoryItem={inventoryItem}
                            transactionItems={props.transactionItems}
                          />
                        )
                      )}
                </tbody>
              </Table>
            </Sheet>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
}
