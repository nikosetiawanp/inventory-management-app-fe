import { Skeleton, TableCell, TableRow } from "@mui/material";

export default function RowSkeleton(props: { rows: number; columns: number }) {
  const keys = [...Array(props.rows).keys()];
  const columns = [...Array(props.columns).keys()];

  return keys.map((_, index) => (
    <TableRow hover key={index}>
      {columns.map((_, index) => (
        <TableCell key={index}>
          <Skeleton variant="rounded" />
        </TableCell>
      ))}
    </TableRow>
  ));
}
