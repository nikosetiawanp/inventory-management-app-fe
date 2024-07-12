import { Button, ButtonGroup, Menu, Stack, Typography } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

import * as React from "react";
import { useState } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { ArrowDropDown } from "@mui/icons-material";

export default function StringFilter(props: {
  sortConfigKey: string;
  sortConfig: { key: string; direction: string };
  setSortConfig: React.Dispatch<
    React.SetStateAction<{
      key: string;
      direction: string;
    }>
  >;
  selectedStartDate: string | number | dayjs.Dayjs | Date | null | undefined;
  setSelectedStartDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs>> | any;
  selectedEndDate: string | number | dayjs.Dayjs | Date | null | undefined;
  setSelectedEndDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs>> | any;
  refetch: () => void;
  label: string;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleKeyDown = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const resetFilter = () => {
    props.setSelectedStartDate();
    props.setSelectedEndDate();
    props.refetch();
    handleClose();
  };

  return (
    <>
      {/* BUTTON */}
      <ButtonGroup size="small" style={{ borderRadius: 50 }}>
        <Button
          color={
            props.selectedStartDate || props.selectedEndDate
              ? "primary"
              : "inherit"
          }
          variant="contained"
          onClick={handleClick}
          endIcon={
            props.selectedStartDate || props.selectedEndDate ? null : (
              <ArrowDropDown />
            )
          }
        >
          {props.label}
        </Button>
        {props.selectedStartDate || props.selectedEndDate ? (
          <Button variant="contained" onClick={resetFilter}>
            <CloseIcon fontSize="small" />
          </Button>
        ) : null}
      </ButtonGroup>

      {/* SORT */}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        autoFocus={false}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        onKeyDown={handleKeyDown}
      >
        {/* DATE PICKER */}
        <Stack direction={"column"} gap={2} width={"auto"} padding={2}>
          <Typography>Filter Tanggal</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={["year", "month", "day"]}
              slotProps={{ textField: { size: "small" } }}
              value={props.selectedStartDate}
              onChange={(newValue: any) => props.setSelectedStartDate(newValue)}
              format="D MMM YYYY"
              label="Setelah"
              maxDate={props.selectedEndDate}
            />
            <DatePicker
              views={["year", "month", "day"]}
              slotProps={{ textField: { size: "small" } }}
              value={props.selectedEndDate}
              onChange={(newValue: any) => props.setSelectedEndDate(newValue)}
              format="D MMM YYYY"
              label="Sebelum"
              maxDate={dayjs()}
              minDate={props.selectedStartDate && props.selectedStartDate}
            />
          </LocalizationProvider>

          <Stack direction={"row"} gap={2} justifyContent={"end"}>
            <Button size="small" variant="text" onClick={resetFilter}>
              Reset
            </Button>
          </Stack>
        </Stack>
      </Menu>
    </>
  );
}
