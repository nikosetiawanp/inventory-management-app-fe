import { useState } from "react";
import { TableRow, TableCell, Chip } from "@mui/material";

import { Purchase } from "../../interfaces/interfaces";
import MoreVertPurchaseButton from "../buttons/MoreVertPurchaseButton";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import PurchaseDetailDialog from "../dialogs/PurchaseDetailDialog";

export default function PurchaseRow(props: {
  index: number;
  purchase: Purchase;
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
        <TableCell>{props.purchase.number}</TableCell>
        <TableCell>{props.purchase.contact.name}</TableCell>
        <TableCell>{formatDate(props.purchase.date)}</TableCell>
        <TableCell>
          <Chip
            size="small"
            variant="filled"
            icon={
              props.purchase.isApproved ? (
                <CheckCircleIcon fontSize="small" />
              ) : (
                <WatchLaterIcon fontSize="small" />
              )
            }
            label={props.purchase.isApproved ? "Approved" : "Pending"}
            color={props.purchase.isApproved ? "success" : "warning"}
          />
        </TableCell>
        <TableCell>
          <Chip
            size="small"
            variant="filled"
            icon={
              props.purchase.isDone ? (
                <CheckCircleIcon fontSize="small" />
              ) : (
                <WatchLaterIcon fontSize="small" />
              )
            }
            label={props.purchase.isDone ? "Selesai" : "Belum Selesai"}
            color={props.purchase.isDone ? "success" : "warning"}
          />
        </TableCell>

        <TableCell>
          <MoreVertPurchaseButton purchase={props.purchase} />
        </TableCell>
      </TableRow>

      {/* DIALOG */}

      <PurchaseDetailDialog
        open={open}
        setOpen={setOpen}
        purchase={props.purchase}
        refetch={props.refetch}
      />
    </>
  );
}
