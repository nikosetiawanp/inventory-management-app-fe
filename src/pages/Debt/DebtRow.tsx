import { Chip, Typography } from "@mui/joy";
import { Debt, Payment } from "../../interfaces/interfaces";
import PaymentListDialog from "./PaymentListDialog";
import CreatePayment from "./CreatePayment";
import { sum } from "../../helpers/calculationHelpers";
import { formatDate } from "../../helpers/dateHelpers";
import "dayjs/locale/id";
import { formatIDR } from "../../helpers/currencyHelpers";
import CompleteDebt from "./CompleteDebt";

export default function DebtRow(props: { index: number; debt: Debt }) {
  const arrayOfPayments = props.debt.payments.map(
    (payment: Payment) => payment.amount
  );

  const today = new Date();
  const dueDate = new Date(props.debt?.invoice?.dueDate);

  return (
    <tr key={props.index}>
      <td>{formatDate(props.debt?.invoice?.date, "D MMMM YYYY")}</td>
      <td>
        <Chip
          variant="soft"
          size="sm"
          color={today <= dueDate ? "neutral" : "danger"}
        >
          {formatDate(props.debt?.invoice?.dueDate, "D MMMM YYYY")}
        </Chip>
      </td>
      <td>{props.debt?.invoice?.number}</td>
      <td>{props.debt?.contact?.name}</td>

      <td>{formatIDR(props.debt?.amount)}</td>
      <td>
        <Typography
          level="body-md"
          color={
            sum(arrayOfPayments) >= props.debt?.amount ? "success" : "danger"
          }
        >
          {formatIDR(sum(arrayOfPayments))}
        </Typography>
      </td>

      <td>
        <PaymentListDialog debt={props.debt} />
      </td>

      <td>
        {sum(arrayOfPayments) >= props.debt?.amount ? (
          <CompleteDebt debt={props.debt} />
        ) : (
          <CreatePayment debt={props.debt} />
        )}
      </td>
      {/* <td>{props.debt?.isPaid ? null : <CreatePayment debt={props.debt} />}</td> */}
    </tr>
  );
}
