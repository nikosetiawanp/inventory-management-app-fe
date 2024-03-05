import { TableRow, TableCell, Chip, Typography } from "@mui/material";
import { Debt, Payment } from "../../interfaces/interfaces";
import PayDebt from "../buttons/PayDebt";

export default function DebtRow(props: { index: number; debt: Debt }) {
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

  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  const sumDebtPayments = (payments: Payment[]) => {
    if (payments.length < 1) return 0;

    let totalPaidDebt = 0;

    for (let i = 0; i < payments.length; i++) {
      totalPaidDebt += payments[i].amount;
    }
    return totalPaidDebt;
  };

  const today = new Date();
  const dueDate = new Date(props.debt.invoice.dueDate);

  const debtAmount = props.debt?.amount;
  const totalPaid = sumDebtPayments(props.debt?.payments);

  return (
    <TableRow key={props.index} hover>
      <TableCell>{formatDate(props.debt?.invoice.date)}</TableCell>
      <TableCell>{props.debt?.invoice.number}</TableCell>
      <TableCell>{props.debt?.invoice?.purchase?.contact?.name}</TableCell>
      <TableCell>
        <Chip
          variant="filled"
          size="small"
          label={formatDate(props.debt?.invoice?.dueDate)}
          color={today <= dueDate ? "primary" : "error"}
        />
      </TableCell>
      <TableCell>{currencyFormatter.format(props.debt?.amount)}</TableCell>
      <TableCell>
        <Typography
          variant="body2"
          color={
            totalPaid == 0
              ? "error.main"
              : totalPaid >= debtAmount
              ? "success.main"
              : "warning.main"
          }
        >
          {currencyFormatter.format(totalPaid)}
        </Typography>
        {/* <Chip
          variant="filled"
          size="small"
          label={currencyFormatter.format(totalPaid)}
          color={
            totalPaid == 0
              ? "error"
              : totalPaid >= debtAmount
              ? "success"
              : "warning"
          }
        /> */}
      </TableCell>

      <TableCell align="center">
        {totalPaid >= debtAmount}
        <Chip
          label={props.debt?.isPaid ? "Selesai" : "Belum selesai"}
          variant="filled"
          color={props.debt?.isPaid ? "success" : "warning"}
          size="small"
        />
      </TableCell>
      <TableCell>
        {props.debt?.isPaid ? null : <PayDebt debt={props.debt} />}
      </TableCell>
    </TableRow>
  );
}
