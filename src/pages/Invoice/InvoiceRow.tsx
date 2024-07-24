import { Chip } from "@mui/joy";
import { Invoice } from "../../interfaces/interfaces";
import { useState } from "react";

import InvoiceDetailDialog from "./InvoiceDetailDialog";
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
      <tr key={props.index}>
        <td style={{ paddingLeft: 15 }}>{formatDate(props.invoice?.date)}</td>
        <td style={{ paddingLeft: 15 }}>{props.invoice?.number}</td>
        <td style={{ paddingLeft: 15 }}>
          {props.invoice?.transaction?.contact?.name}
        </td>
        <td style={{ paddingLeft: 15 }}>
          <Chip size="sm" color={today <= dueDate ? "primary" : "danger"}>
            {formatDate(props.invoice?.dueDate)}
          </Chip>
        </td>
        <td style={{ paddingLeft: 15 }}>
          <Chip
            size="sm"
            color={props.invoice?.debts?.length == 0 ? "neutral" : "success"}
          >
            {`${props.invoice?.debts.length} hutang`}
          </Chip>
        </td>
        <td style={{ paddingLeft: 15 }}>
          {/* <InvoiceOptionButton invoice={props.invoice} /> */}
        </td>
      </tr>

      <InvoiceDetailDialog
        open={open}
        setOpen={setOpen}
        invoice={props.invoice}
      />
    </>
  );
}
