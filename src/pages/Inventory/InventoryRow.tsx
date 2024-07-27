import ArrivalHistoryOptionButton from "./ArrivalHistoryOptionButton";
import { Inventory } from "../../interfaces/interfaces";
import { useState } from "react";
import InventoryDetailDialog from "./InventoryDetailDialog";
import { formatDate } from "../../helpers/dateHelpers";
// import { useState } from "react";

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
        <td>{props.inventory?.number}</td>
        <td>{props.inventory?.receiptNumber}</td>
        <td>{props.inventory?.transaction?.contact?.name}</td>
        <td>{formatDate(props.inventory?.date, "DD MMMM YYYY")}</td>
        <td>{props.inventory?.transaction?.number}</td>
        <td>{props.inventory?.description}</td>
        <td align="center" width={10}>
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
