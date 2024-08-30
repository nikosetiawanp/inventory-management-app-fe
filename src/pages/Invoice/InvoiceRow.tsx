import { Chip } from "@mui/joy";
import { Invoice } from "../../interfaces/interfaces";
import { useState } from "react";

import InvoiceDetailDialog from "./InvoiceDetailDialog";
import { formatDate } from "../../helpers/dateHelpers";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export default function InvoiceRow(props: { index: number; invoice: Invoice }) {
  const [open, setOpen] = useState(false);

  const today = new Date();
  const dueDate = new Date(props.invoice.dueDate);

  return (
    <>
      <tr
        key={props.index}
        onClick={() => setOpen(true)}
        style={{ cursor: "pointer" }}
      >
        <td style={{ paddingLeft: 15 }}>
          {formatDate(props.invoice?.date, "DD MMMM YYYY")}
        </td>
        <td style={{ paddingLeft: 15 }}>{props.invoice?.number}</td>
        <td style={{ paddingLeft: 15 }}>
          {props.invoice?.transaction?.contact?.name}
        </td>
        <td style={{ paddingLeft: 10 }}>
          <Chip size="sm" color={today <= dueDate ? "neutral" : "danger"}>
            {formatDate(props.invoice?.dueDate, "DD MMMM YYYY")}
          </Chip>
        </td>
        <td
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 15,
          }}
        >
          {/* <Chip
            size="sm"
            color={props.invoice?.debts?.length == 0 ? "danger" : "success"}
          > */}
          {props.invoice?.debts?.length == 0 ? (
            <CancelIcon fontSize="small" color="error" />
          ) : (
            <CheckCircleIcon fontSize="small" color="success" />
          )}
        </td>
        <td style={{ paddingLeft: 15 }}></td>
      </tr>

      <InvoiceDetailDialog
        open={open}
        setOpen={setOpen}
        invoice={props.invoice}
      />
    </>
  );
}
