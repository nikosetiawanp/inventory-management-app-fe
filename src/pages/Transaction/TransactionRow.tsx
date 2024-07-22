import { useState } from "react";
import { Transaction } from "../../interfaces/interfaces";

import TransactionDetailDialog from "./TransactionDetailDialog";
import { formatDate } from "../../helpers/dateHelpers";
import { Chip } from "@mui/joy";

export default function TransactionRow(props: {
  index: number;
  transaction: Transaction;
  refetch: any;
  arrayLength: number;
}) {
  const [open, setOpen] = useState(false);

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
            color={props.transaction?.isApproved ? "success" : "warning"}
          >
            {props.transaction?.isApproved ? "Approved" : "Pending"}{" "}
          </Chip>
        </td>
        <td style={{ textAlign: "center" }}>
          <Chip
            size="sm"
            variant="soft"
            color={props.transaction?.isDone ? "success" : "danger"}
          >
            {props.transaction?.isDone ? "Selesai" : "Belum Selesai"}
          </Chip>
        </td>

        <td
          style={{
            textAlign: "center",
            width: 60,
          }}
        >
          {/* <MoreVertTransactionButton transaction={props.transaction} /> */}
        </td>
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
