import { Chip, Typography } from "@mui/joy";
import { Alert, Debt, Payment } from "../../interfaces/interfaces";
import CreatePayment from "./CreatePayment";
import { sum } from "../../helpers/calculationHelpers";
import { formatDate } from "../../helpers/dateHelpers";
import "dayjs/locale/id";
import { formatIDR } from "../../helpers/currencyHelpers";
import CompleteDebt from "./CompleteDebt";
import PaymentListModal from "./PaymentListModal";
import ActionMenu from "./ActionMenu";

export default function DebtRow(props: {
  index: number;
  debt: Debt;
  setAlert: React.Dispatch<React.SetStateAction<Alert>>;
}) {
  const arrayOfPayments = props.debt.payments.map(
    (payment: Payment) => payment.amount
  );

  const today = new Date();
  const dueDate = new Date(props.debt?.invoice?.dueDate);

  return (
    <tr key={props.index}>
      <td style={{ paddingLeft: 15 }}>
        {formatDate(props.debt?.invoice?.date, "D MMMM YYYY")}
      </td>
      <td style={{ paddingLeft: 15 }}>
        <Chip
          variant="soft"
          size="sm"
          color={today <= dueDate ? "neutral" : "danger"}
        >
          {formatDate(props.debt?.invoice?.dueDate, "D MMMM YYYY")}
        </Chip>
      </td>
      <td style={{ paddingLeft: 15 }}>{props.debt?.invoice?.number}</td>
      <td style={{ paddingLeft: 15 }}>{props.debt?.contact?.name}</td>

      <td style={{ paddingLeft: 15 }}>{formatIDR(props.debt?.amount)}</td>
      <td style={{ paddingLeft: 15 }}>
        <Typography
          level="body-md"
          color={
            sum(arrayOfPayments) >= props.debt?.amount ? "success" : "danger"
          }
        >
          {formatIDR(sum(arrayOfPayments))}
        </Typography>
      </td>

      <td style={{ textAlign: "center" }}>
        <PaymentListModal debt={props.debt} />
      </td>

      <td style={{ textAlign: "center" }}>
        {sum(arrayOfPayments) >= props.debt?.amount ? (
          <CompleteDebt debt={props.debt} />
        ) : (
          <CreatePayment debt={props.debt} />
        )}

        <ActionMenu debt={props.debt} setAlert={props.setAlert} />
      </td>
      {/* <td>{props.debt?.isPaid ? null : <CreatePayment debt={props.debt} />}</td> */}
    </tr>
  );
}
