import { Button } from "@mui/joy";
import * as React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

export default function SortButton(props: {
  label: string;
  sortConfigKey: string;
  sortConfig: { key: string; direction: string };
  setSortConfig: React.Dispatch<
    React.SetStateAction<{
      key: string;
      direction: string;
    }>
  >;
}) {
  const isAscending =
    props.sortConfigKey == props.sortConfig.key &&
    props.sortConfig.direction == "ascending";

  const isDescending =
    props.sortConfigKey == props.sortConfig.key &&
    props.sortConfig.direction == "descending";

  const sortAscending = () => {
    props.setSortConfig({
      key: props.sortConfigKey,
      direction: "ascending",
    });
  };

  const sortDescending = () => {
    props.setSortConfig({
      key: props.sortConfigKey,
      direction: "descending",
    });
  };

  return (
    <Button
      size="sm"
      variant="plain"
      color={isAscending || isDescending ? "primary" : "neutral"}
      endDecorator={
        isAscending ? (
          <ArrowDropUpIcon fontSize="small" />
        ) : isDescending ? (
          <ArrowDropDownIcon fontSize="small" />
        ) : null
      }
      onClick={() => (isAscending ? sortDescending() : sortAscending())}
    >
      {props.label}
    </Button>
  ); // if (props.sortConfigKey !== props.sortConfig.key) {
  //   return (
  //     <IconButton
  //       size="small"
  //       onClick={() => {
  //         props.setSortConfig({
  //           key: props.sortConfigKey,
  //           direction: "ascending",
  //         });
  //       }}
  //     >
  //       <SwapVert fontSize="small" />
  //     </IconButton>
  //   );
  // }
  // if (
  //   props.sortConfigKey == props.sortConfig.key &&
  //   props.sortConfig.direction == "ascending"
  // ) {
  //   return (
  //     <IconButton
  //       size="small"
  //       onClick={() => {
  //         props.setSortConfig({
  //           key: props.sortConfigKey,
  //           direction: "descending",
  //         });
  //       }}
  //     >
  //       <ArrowUpward fontSize="small" />
  //     </IconButton>
  //   );
  // }
  // if (
  //   props.sortConfigKey == props.sortConfig.key &&
  //   props.sortConfig.direction == "descending"
  // ) {
  //   return (
  //     <IconButton
  //       size="small"
  //       onClick={() => {
  //         props.setSortConfig({
  //           key: props.sortConfigKey,
  //           direction: "ascending",
  //         });
  //       }}
  //     >
  //       <ArrowDownward fontSize="small" />
  //     </IconButton>
  //   );
  // }
}
