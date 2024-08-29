import { useState } from "react";
import { Transaction } from "../../interfaces/interfaces";

import TransactionDetailDialog from "./TransactionDetailDialog";
import { formatDate } from "../../helpers/dateHelpers";
import { Chip } from "@mui/joy";

export default function TransactionRow(props: {
  index: number;
  transaction: Transaction;
  refetch: any;
}) {
  const [open, setOpen] = useState(false);
  const isOngoing =
    props.transaction?.isApproved == true && props.transaction?.isDone == false;
  const isDone =
    props.transaction?.isApproved == true && props.transaction?.isDone == true;

  return (
    <>
      <tr
        key={props.index}
        onClick={() => setOpen(true)}
        style={{ cursor: "pointer" }}
      >
        <td style={{ paddingLeft: 15 }}>{props.transaction?.number}</td>
        <td style={{ paddingLeft: 15 }}>{props.transaction?.contact?.name}</td>
        <td style={{ paddingLeft: 15 }}>
          {formatDate(props.transaction?.date, "DD MMMM YYYY")}
        </td>
        <td style={{ textAlign: "center" }}>
          <Chip
            variant="soft"
            size="sm"
            color={isDone ? "success" : isOngoing ? "warning" : "neutral"}
          >
            {isDone ? "Selesai" : isOngoing ? "Ongoing" : "Pending"}
          </Chip>
        </td>

        <td
          style={{
            textAlign: "center",
            width: 60,
          }}
        ></td>
      </tr>

      {/* DIALOG */}
      <TransactionDetailDialog
        open={open}
        setOpen={setOpen}
        transaction={props.transaction}
        refetch={props.refetch}
      />
    </>
  );
}
