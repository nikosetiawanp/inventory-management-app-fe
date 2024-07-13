import {
  Button,
  ButtonGroup,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Menu,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import * as React from "react";
import { useEffect, useState } from "react";
import { ArrowDropDown } from "@mui/icons-material";

import CloseIcon from "@mui/icons-material/Close";

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
    !props.includedData?.includes(data)
      ? props.setIncludedData([...props.includedData, data])
      : props.setIncludedData(
          [...props.includedData].filter((item) => item !== data)
        );
  };

  const resetFilter = () => {
    props.setIncludedData([]);
  };

  return (
    <div>
      {/* BUTTON */}
      <ButtonGroup size="small">
        <Button
          endIcon={props.includedData.length == 0 && <ArrowDropDown />}
          onClick={handleClick}
          color={props.includedData.length > 0 ? "primary" : "inherit"}
          variant="contained"
          disabled={props.data.length == 0}
        >
          {props.label}
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

            {/* CHECKLIST */}
            <FormGroup sx={{ paddingX: 2 }}>
              {searchResult?.map((data: string, index: number) => (
                <FormControlLabel
                  key={index}
                  checked={props.includedData.includes(data)}
                  control={<Checkbox size="small" />}
                  label={data}
                  onClick={() => check(data)}
                />
              ))}
            </FormGroup>

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
