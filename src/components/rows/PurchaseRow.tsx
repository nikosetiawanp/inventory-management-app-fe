import { useState } from "react";
import { TableRow, TableCell } from "@mui/material";

import { Purchase } from "../../interfaces/interfaces";
import MoreVertPurchaseButton from "../buttons/MoreVertPurchaseButton";

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
        <TableCell>
          {props.purchase.status == "PR"
            ? formatDate(props.purchase.prDate)
            : formatDate(props.purchase.poDate)}
        </TableCell>
        <TableCell>{props.purchase.vendor.code}</TableCell>
        <TableCell>{props.purchase.vendor.name}</TableCell>
        <TableCell>
          {props.purchase.status == "PR"
            ? props.purchase.prNumber
            : props.purchase.poNumber}
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
