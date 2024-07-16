import { Chip, TableCell, TableRow } from "@mui/material";
import { Invoice } from "../../interfaces/interfaces";
import { useState } from "react";
import InvoiceOptionButton from "./InvoiceOptionButton";
import InvoiceDetailDialog from "./InvoiceDetailDialog";
import ErrorIcon from "@mui/icons-material/Error";
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

  const today = new Date();
  const dueDate = new Date(props.invoice.dueDate);

  return (
    <>
      <TableRow
        key={props.index}
        hover
        sx={{ cursor: "pointer" }}
        onClick={() => setOpen(true)}
      >
        <TableCell>{formatDate(props.invoice?.date)}</TableCell>
        <TableCell>{props.invoice?.number}</TableCell>
        <TableCell>{props.invoice?.transaction?.contact?.name}</TableCell>
        <TableCell>
          <Chip
            size="small"
            label={formatDate(props.invoice?.dueDate)}
            color={today <= dueDate ? "primary" : "error"}
            icon={today >= dueDate ? <ErrorIcon fontSize="small" /> : undefined}
          />
        </TableCell>
        <TableCell>
          <Chip
            size="small"
            label={`${props.invoice?.debts.length} hutang`}
            color={props.invoice?.debts?.length == 0 ? "error" : "success"}
          />
        </TableCell>
        <TableCell>
          <InvoiceOptionButton invoice={props.invoice} />
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
