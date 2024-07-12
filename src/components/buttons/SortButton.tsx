import {
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import * as React from "react";
import { ArrowDownward, ArrowUpward, SwapVert } from "@mui/icons-material";

export default function SortButton(props: {
  sortConfigKey: string;
  sortConfig: { key: string; direction: string };
  setSortConfig: React.Dispatch<
    React.SetStateAction<{
      key: string;
      direction: string;
    }>
  >;
}) {
  if (props.sortConfigKey !== props.sortConfig.key) {
    return (
      <IconButton
        size="small"
        onClick={() => {
          props.setSortConfig({
            key: props.sortConfigKey,
            direction: "ascending",
          });
        }}
      >
        <SwapVert fontSize="small" />
      </IconButton>
    );
  }

  if (
    props.sortConfigKey == props.sortConfig.key &&
    props.sortConfig.direction == "ascending"
  ) {
    return (
      <IconButton
        size="small"
        // color="primary"
        onClick={() => {
          props.setSortConfig({
            key: props.sortConfigKey,
            direction: "descending",
          });
        }}
      >
        <ArrowUpward fontSize="small" />
      </IconButton>
    );
  }

  if (
    props.sortConfigKey == props.sortConfig.key &&
    props.sortConfig.direction == "descending"
  ) {
    return (
      <IconButton
        size="small"
        // color="primary"
        onClick={() => {
          props.setSortConfig({
            key: props.sortConfigKey,
            direction: "ascending",
          });
        }}
      >
        <ArrowDownward fontSize="small" />
      </IconButton>
    );
  }

  //   return (
  //     <div>
  //       {/* BUTTON */}
  //       {props.sortConfigKey !== props.sortConfig.key}
  //       <IconButton size="small">
  //         <ArrowUpward fontSize="small" />
  //       </IconButton>
  //     </div>
  //   );
}
