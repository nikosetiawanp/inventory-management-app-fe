import {
  Button,
  ButtonGroup,
  Checkbox,
  FormControlLabel,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import * as React from "react";
import { useEffect, useState } from "react";
import { ArrowDropDown } from "@mui/icons-material";

import CloseIcon from "@mui/icons-material/Close";
// import CheckIcon from "@mui/icons-material/Check";
// import CheckBoxIcon from "@mui/icons-material/CheckBox";
// import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
// import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";

export default function StringFilter(props: {
  data: string[];
  includedData: string[];
  setIncludedData: React.Dispatch<React.SetStateAction<any[]>>;
  sortConfig: { key: string; direction: string };
  setSortConfig: React.Dispatch<
    React.SetStateAction<{
      key: string;
      direction: string;
    }>
  >;
  label: string;
}) {
  const [searchInput, setSearchInput] = useState("");
  const searchResult = props.data?.filter(
    (item: string) =>
      item.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.toLowerCase().includes(searchInput.toLowerCase())
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const check = (data: string) => {
    console.log("✅");
    !props.includedData?.includes(data)
      ? props.setIncludedData([...props.includedData, data])
      : props.setIncludedData(
          [...props.includedData].filter((item) => item !== data)
        );
  };

  const deselectAll = () => {
    props.setIncludedData([...props.data]);
  };

  const resetFilter = () => {
    props.setIncludedData([]);
  };

  useEffect(() => {}, [props.data]);

  return (
    <div>
      {/* BUTTON */}
      <ButtonGroup size="small">
        <Button
          // startIcon={props.excludedData.length > 0 && <CheckIcon />}
          endIcon={props.includedData.length == 0 && <ArrowDropDown />}
          onClick={handleClick}
          color={props.includedData.length > 0 ? "primary" : "inherit"}
          variant="contained"
          disabled={props.data.length == 0}
        >
          {props.label}
          {/* {props.excludedData.length > 0
            ? `${props.data.length - props.excludedData.length} ${props.label}`
            : props.label} */}
        </Button>
        {props.includedData.length > 0 && (
          <Button
            // sx={{ borderRadius: 99 }}
            variant="contained"
            onClick={resetFilter}
          >
            <CloseIcon fontSize="small" />
          </Button>
        )}
      </ButtonGroup>

      {/* SORT */}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {/* FILTER */}
        {props.data.length > 0 && (
          <div>
            <Stack padding={2} gap={2}>
              <Typography>Filter {props.label}</Typography>

              <TextField
                id="outlined-basic"
                placeholder="Cari"
                variant="outlined"
                size="small"
                value={searchInput}
                onChange={(event) => {
                  setSearchInput(event.target.value);
                }}
                onKeyDown={(e) => e.stopPropagation()}
              />
            </Stack>
            {/* <MenuItem
              selected={false}
              dense
              onClick={() =>
                props.excludedData.length < props.data.length
                  ? deselectAll()
                  : resetFilter()
              }
            >
              <Checkbox
                size="medium"
                checked={props.excludedData.length < props.data.length}
                checkedIcon={
                  props.excludedData.length == 0 ? (
                    <CheckBoxIcon />
                  ) : (
                    <IndeterminateCheckBoxIcon />
                  )
                }
                // checked={props.excludedData.length !== 0}
              />
              Pilih semua
            </MenuItem> */}
            {searchResult?.map((data: string, index: number) => (
              <MenuItem
                key={index}
                selected={props.includedData.includes(data)}
                onClick={() => check(data)}
                dense
                sx={{ paddingX: 2 }}
              >
                <Checkbox
                  size="small"
                  checked={props.includedData.includes(data)}
                  // checked={
                  //   !props.excludedData?.includes(data) ||
                  //   props.excludedData.length == 0
                  // }
                  onClick={() => check(data)}
                />
                {data}
              </MenuItem>
            ))}
            <Stack direction={"row"} gap={2} padding={2} justifyContent={"end"}>
              <Button size="small" variant="text" onClick={() => resetFilter()}>
                Reset
              </Button>
            </Stack>
          </div>
        )}
      </Menu>
    </div>
  );
}
