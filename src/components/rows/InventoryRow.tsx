import { TableCell, TableRow } from "@mui/material";
import ArrivalHistoryOptionButton from "../buttons/ArrivalHistoryOptionButton";
import { Inventory } from "../../interfaces/interfaces";
import { useState } from "react";
import InventoryDetailDialog from "../dialogs/InventoryDetailDialog";
// import { useState } from "react";

export default function InventoryRow(props: {
  index: number;
  inventory: Inventory;
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
        <TableCell>{formatDate(props.inventory?.date)}</TableCell>
        <TableCell>
          {props.inventory?.purchase.poNumber &&
            props.inventory?.purchase.poNumber}
        </TableCell>
        <TableCell>{props.inventory?.letterNumber}</TableCell>
        <TableCell>{props.inventory?.purchase.vendor.name}</TableCell>
        <TableCell>{props.inventory?.description}</TableCell>
        <TableCell align="center" width={10}>
          <ArrivalHistoryOptionButton inventory={props.inventory} />
        </TableCell>
      </TableRow>

      <InventoryDetailDialog
        open={open}
        setOpen={setOpen}
        inventory={props.inventory}
      />
    </>
  );
}
