import { useState } from "react";
import { TableRow, TableCell, Chip } from "@mui/material";

import { Transaction } from "../../interfaces/interfaces";
import MoreVertPurchaseButton from "../buttons/MoreVertPurchaseButton";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import TransactionDetailDialog from "../dialogs/TransactionDetailDialog";
import { formatDate } from "../../helpers/dateHelpers";

export default function PurchaseRow(props: {
  index: number;
  transaction: Transaction;
  refetch: any;
  arrayLength: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        key={props.index}
        hover
        sx={{ cursor: "pointer" }}
        onClick={() => setOpen(true)}
      >
        <TableCell>{props.transaction?.number}</TableCell>
        <TableCell>{props.transaction?.contact?.name}</TableCell>
        <TableCell>
          {formatDate(props.transaction?.date, "DD MMMM YYYY")}
        </TableCell>
        <TableCell>
          <Chip
            size="small"
            variant="filled"
            icon={
              props.transaction?.isApproved ? (
                <CheckCircleIcon fontSize="small" />
              ) : (
                <WatchLaterIcon fontSize="small" />
              )
            }
            label={props.transaction?.isApproved ? "Approved" : "Pending"}
            color={props.transaction?.isApproved ? "success" : "warning"}
          />
        </TableCell>
        <TableCell>
          <Chip
            size="small"
            variant="filled"
            icon={
              props.transaction.isDone ? (
                <CheckCircleIcon fontSize="small" />
              ) : (
                <WatchLaterIcon fontSize="small" />
              )
            }
            label={props.transaction?.isDone ? "Selesai" : "Belum Selesai"}
            color={props.transaction?.isDone ? "success" : "warning"}
          />
        </TableCell>

        <TableCell>
          <MoreVertPurchaseButton purchase={props.transaction} />
        </TableCell>
      </TableRow>

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
