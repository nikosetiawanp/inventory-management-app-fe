import ArrivalHistoryOptionButton from "./ArrivalHistoryOptionButton";
import { Inventory } from "../../interfaces/interfaces";
import { useState } from "react";
import InventoryDetailDialog from "./InventoryDetailDialog";
import { formatDate } from "../../helpers/dateHelpers";
import { Chip } from "@mui/joy";

export default function InventoryRow(props: {
  index: number;
  inventory: Inventory;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <tr
        key={props.index}
        style={{ cursor: "pointer" }}
        onClick={() => setOpen(true)}
      >
        <td style={{ paddingLeft: 15 }}>{props.inventory?.number}</td>
        <td style={{ paddingLeft: 15 }}>{props.inventory?.receiptNumber}</td>
        <td style={{ paddingLeft: 15 }}>
          {props.inventory?.transaction?.contact?.name}
        </td>
        <td style={{ paddingLeft: 15 }}>
          {formatDate(props.inventory?.date, "DD MMMM YYYY")}
        </td>
        <td style={{ paddingLeft: 15 }}>
          {props.inventory?.transaction?.number}
        </td>
        <td style={{ paddingLeft: 15 }}>{props.inventory?.description}</td>
        <td style={{ paddingLeft: 15, textAlign: "center" }}>
          <Chip
            size="sm"
            color={
              props.inventory?.inventoryItems?.length > 0 ? "success" : "danger"
            }
          >
            {props.inventory?.inventoryItems?.length > 0
              ? "Divalidasi"
              : "Menunggu validasi"}
          </Chip>
        </td>
        <td style={{ textAlign: "center" }}>
          <ArrivalHistoryOptionButton inventory={props.inventory} />
        </td>
      </tr>

      <InventoryDetailDialog
        open={open}
        setOpen={setOpen}
        inventory={props.inventory}
        transactionItems={props.inventory?.transaction?.transactionItems}
      />
    </>
  );
}
