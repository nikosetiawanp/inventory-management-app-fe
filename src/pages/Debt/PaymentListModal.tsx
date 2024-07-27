import {
  Chip,
  DialogTitle,
  Divider,
  List,
  ListItem,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import { Debt, Payment } from "../../interfaces/interfaces";
import { useState } from "react";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { formatIDR } from "../../helpers/currencyHelpers";
import { formatDate } from "../../helpers/dateHelpers";
import { sum } from "../../helpers/calculationHelpers";

export default function PaymentListModal(props: { debt: Debt }) {
  const [open, setOpen] = useState(false);
  const arrayOfPaymentAmount = props.debt?.payments?.map(
    (payment: Payment) => payment.amount
  );

  return (
    <>
      <Chip
        color="primary"
        size="sm"
        variant="plain"
        onClick={() => setOpen(true)}
        endDecorator={<ReceiptIcon fontSize="small" />}
      >
        {props.debt?.payments?.length}
      </Chip>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <ModalDialog>
          <ModalClose />

          <DialogTitle>Daftar Pembayaran</DialogTitle>
          <List
            sx={{
              overflow: "scroll",
            }}
          >
            {props.debt?.payments.map((payment: Payment, index: number) => (
              <ListItem key={index}>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  width={1}
                  spacing={4}
                >
                  <Chip color="neutral">
                    {formatDate(payment?.date, "DD MMMM YYYY")}{" "}
                  </Chip>
                  <Typography> {formatIDR(payment.amount)}</Typography>
                </Stack>
                <Divider />
              </ListItem>
            ))}
          </List>
          <Stack direction={"row"} width={1} justifyContent={"space-between"}>
            <Typography>
              <b>Total</b>{" "}
            </Typography>
            <Typography>
              <b>{formatIDR(sum(arrayOfPaymentAmount))}</b>
            </Typography>
          </Stack>
        </ModalDialog>
      </Modal>
    </>
  );
}
