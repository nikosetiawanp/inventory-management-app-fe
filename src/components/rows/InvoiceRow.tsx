import { TableCell, TableRow } from "@mui/material";
import ArrivalHistoryOptionButton from "../buttons/ArrivalHistoryOptionButton";
import { Inventory, Invoice, PurchaseItem } from "../../interfaces/interfaces";
import { useState } from "react";
import InventoryDetailDialog from "../dialogs/InventoryDetailDialog";
import InvoiceOptionButton from "../buttons/InvoiceOptionButton";
import InvoiceDetailDialog from "../dialogs/InvoiceDetailDialog";
// import { useState } from "react";

export default function InvoiceRow(props: { index: number; invoice: Invoice }) {
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
        <TableCell>{formatDate(props.invoice?.date)}</TableCell>
        <TableCell>{props.invoice?.invoiceNumber}</TableCell>
        <TableCell>{props.invoice?.purchase?.vendor?.name}</TableCell>
        <TableCell>{formatDate(props.invoice?.dueDate)}</TableCell>
        <TableCell>
          <InvoiceOptionButton invoice={props.invoice} />
        </TableCell>
        <TableCell align="center" width={10}>
          {/* <ArrivalHistoryOptionButton inventory={props.inventory} /> */}
        </TableCell>
      </TableRow>

      <InvoiceDetailDialog
        open={open}
        setOpen={setOpen}
        invoice={props.invoice}
      />
    </>
  );
}
