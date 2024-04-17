import { useState } from "react";
import { TableRow, TableCell, Chip } from "@mui/material";

import { Transaction } from "../../interfaces/interfaces";
import MoreVertPurchaseButton from "../buttons/MoreVertPurchaseButton";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import TransactionDetailDialog from "../dialogs/TransactionDetailDialog";

export default function PurchaseRow(props: {
  index: number;
  transaction: Transaction;
  refetch: any;
  arrayLength: number;
}) {
  const [open, setOpen] = useState(false);

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
        <TableCell>{formatDate(props.transaction?.date)}</TableCell>
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
