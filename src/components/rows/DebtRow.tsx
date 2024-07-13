import { TableRow, TableCell, Chip, Typography } from "@mui/material";
import { Debt, Payment } from "../../interfaces/interfaces";
import PaymentListDialog from "../dialogs/PaymentListDialog";
import CreatePayment from "../buttons/CreatePayment";
import { sum } from "../../helpers/calculationHelpers";
import { formatDate } from "../../helpers/dateHelpers";
import "dayjs/locale/id";
import { formatIDR } from "../../helpers/currencyHelpers";

export default function DebtRow(props: { index: number; debt: Debt }) {
  const arrayOfPayments = props.debt.payments.map(
    (payment: Payment) => payment.amount
  );

  const today = new Date();
  const dueDate = new Date(props.debt?.invoice?.dueDate);

  return (
    <TableRow key={props.index} hover>
      <TableCell>
        {formatDate(props.debt?.invoice?.date, "D MMMM YYYY")}
      </TableCell>
      <TableCell>
        <Chip
          variant="outlined"
          size="small"
          label={formatDate(props.debt?.invoice?.dueDate, "D MMMM YYYY")}
          color={today <= dueDate ? "primary" : "error"}
        />
      </TableCell>
      <TableCell>{props.debt?.invoice?.number}</TableCell>
      <TableCell>{props.debt?.contact?.name}</TableCell>

      <TableCell>{formatIDR(props.debt?.amount)}</TableCell>
      <TableCell>
        <Typography
          variant="body2"
          color={
            sum(arrayOfPayments) == 0
              ? "error.main"
              : sum(arrayOfPayments) >= props.debt?.amount
              ? "success.main"
              : "warning.main"
          }
        >
          {formatIDR(sum(arrayOfPayments))}
        </Typography>
      </TableCell>

      <TableCell>
        <PaymentListDialog debt={props.debt} />
        {/* <Chip
          label={`${props.debt?.payments?.length} pembayaran`}
          variant="filled"
          color="primary"
          size="small"
        /> */}
      </TableCell>
      {/* <TableCell align="center">
        {totalPaid >= debtAmount}
        <Chip
          label={props.debt?.isPaid ? "Selesai" : "Belum selesai"}
          variant="filled"
          color={props.debt?.isPaid ? "success" : "warning"}
          size="small"
        />
      </TableCell> */}

      <TableCell>
        {props.debt?.isPaid ? null : <CreatePayment debt={props.debt} />}
      </TableCell>
    </TableRow>
  );
}
