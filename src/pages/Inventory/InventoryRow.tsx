import ArrivalHistoryOptionButton from "./ArrivalHistoryOptionButton";
import { Inventory } from "../../interfaces/interfaces";
import { useState } from "react";
import InventoryDetailDialog from "./InventoryDetailDialog";
import { formatDate } from "../../helpers/dateHelpers";
import { Stack } from "@mui/joy";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

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
        <td
          style={{
            // display: "flex",
            textAlign: "center",
            paddingLeft: 15,
          }}
        >
          <Stack justifyContent="center" alignItems="center">
            {props.inventory?.inventoryItems?.length > 0 ? (
              <CheckCircleIcon fontSize="small" color="success" />
            ) : (
              <CancelIcon fontSize="small" color="error" />
            )}
          </Stack>
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
