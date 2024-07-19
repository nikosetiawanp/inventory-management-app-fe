import Option from "@mui/joy/Option";

import * as React from "react";
import { FormLabel, Select, Stack } from "@mui/joy";

export default function SelectFilter(props: {
  selected: any;
  setSelected: (selected: any) => void;
  options: {
    label: any;
    key: any;
  }[];
  label: string;
}) {
  const handleChange = (
    event: React.SyntheticEvent | null,
    newValue: string | null
  ) => {
    event;
    props.setSelected(newValue);
  };

  return (
    <Stack>
      <FormLabel>{props.label}</FormLabel>
      <Select
        value={props.selected}
        defaultValue="Vendor"
        onChange={handleChange}
      >
        {props.options.map((option) => (
          <Option value={option.key}>{option.label}</Option>
        ))}
      </Select>
    </Stack>
  );
}
