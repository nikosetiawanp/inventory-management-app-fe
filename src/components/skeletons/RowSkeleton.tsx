import { Skeleton, TableCell, TableRow } from "@mui/material";
import MoreVertVendorButton from "../buttons/MoreVertVendorButton";

export default function RowSkeleton(props: { times: number; columns: number }) {
  const keys = [...Array(props.times).keys()];
  const columns = [...Array(props.columns).keys()];

  return keys.map((item, index) => (
    <TableRow hover key={index}>
      {columns.map((column, index) => (
        <TableCell key={index}>
          <Skeleton variant="rounded" />
        </TableCell>
      ))}
    </TableRow>
  ));
}
