import { useState } from "react";
import {
  TableRow,
  TableCell,
  Stack,
  Typography,
  Dialog,
  Button,
  TableContainer,
  TableHead,
  IconButton,
  TableBody,
  Table,
} from "@mui/material";

import MorePurchaseButton from "../buttons/MorePurchaseButton";
import { Item, Purchase } from "../../interfaces/interfaces";
import MoreVertPurchaseButton from "../buttons/MoreVertPurchaseButton";
import NewItemRow from "./NewItemRow";
import { Settings } from "@mui/icons-material";
import PurchaseDetailDialog from "../dialogs/PurchaseDetailDialog";

export default function PurchaseRequisitionRow(props: {
  index: number;
  purchase: Purchase;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        key={props.index}
        hover
        sx={{ cursor: "pointer" }}
        onClick={() => setOpen(true)}
      >
        <TableCell>{props.purchase.prDate}</TableCell>
        <TableCell>{props.purchase.vendor.code}</TableCell>
        <TableCell>{props.purchase.vendor.name}</TableCell>
        <TableCell>{props.purchase.prNumber}</TableCell>
        <TableCell>
          <MoreVertPurchaseButton purchase={props.purchase} />
        </TableCell>
      </TableRow>

      {/* DIALOG */}

      <PurchaseDetailDialog
        open={open}
        setOpen={setOpen}
        purchase={props.purchase}
      />
    </>
  );
}
