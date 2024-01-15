import { TableCell, TableRow } from "@mui/material";
import ArrivalHistoryOptionButton from "../buttons/ArrivalHistoryOptionButton";
// import { useState } from "react";

export default function ArrivalHistoryRow(props: {
  index: number;
  inventoryHistory: any;
}) {
  //   const [open, setOpen] = useState(false);
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
        // onClick={() => setOpen(true)}
      >
        <TableCell>{formatDate(props.inventoryHistory?.date)}</TableCell>
        <TableCell>{props.inventoryHistory?.product.name}</TableCell>
        <TableCell>{props.inventoryHistory?.purchase.vendor.name}</TableCell>
        <TableCell>{props.inventoryHistory?.purchase.poNumber}</TableCell>
        <TableCell>{props.inventoryHistory?.description}</TableCell>
        <TableCell align="center">{props.inventoryHistory.quantity}</TableCell>
        <TableCell>{props.inventoryHistory?.stockAfter}</TableCell>
        <TableCell align="center" width={10}>
          <ArrivalHistoryOptionButton
            inventoryHistory={props.inventoryHistory}
          />
        </TableCell>
      </TableRow>
    </>
  );
}
