import {
  Button,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import FilterListIcon from "@mui/icons-material/FilterList";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CheckIcon from "@mui/icons-material/Check";
import Divider from "@mui/material/Divider";

import * as React from "react";
import { useEffect, useState } from "react";

export default function DataFilter(props: {
  sortConfigKey: string;
  data: string[];
  excludedData?: string[];
  setExcludedData?: React.Dispatch<React.SetStateAction<any[]>>;
  sortConfig: { key: string; direction: string };
  setSortConfig: React.Dispatch<
    React.SetStateAction<{
      key: string;
      direction: string;
    }>
  >;
  useFilter: boolean;
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
    if (props.excludedData && props.setExcludedData)
      !props.excludedData?.includes(data)
        ? props.setExcludedData([...props.excludedData, data])
        : props.setExcludedData(
            [...props.excludedData].filter((item) => item !== data)
          );
    // const checked = props.excludedData?.includes(data);
    // if (props.excludedData && props.setExcludedData) {
    //   if (checked) {
    //     props.setExcludedData([...props.excludedData, data]);
    //   } else {
    //     props.setExcludedData(
    //       [...props.excludedData].filter((item) => item !== data)
    //     );
    //   }
    // }
  };

  useEffect(() => {
    console.log(props.excludedData);
  }, [props.data]);

  return (
    <>
      {/* BUTTON */}
      <IconButton size="small" onClick={handleClick}>
        {props.excludedData && props.excludedData?.length > 0 ? (
          <FilterAltIcon fontSize="small" color="primary" />
        ) : (
          <FilterListIcon fontSize="small" />
        )}
      </IconButton>

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
        <MenuItem
          onClick={() => {
            props.setSortConfig({
              key: props.sortConfigKey,
              direction: "ascending",
            });
            handleClose();
          }}
          selected={
            props.sortConfig.key == props.sortConfigKey &&
            props.sortConfig.direction == "ascending"
          }
        >
          Sort A-Z
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.setSortConfig({
              key: props.sortConfigKey,
              direction: "descending",
            });
            handleClose();
          }}
          selected={
            props.sortConfig.key == props.sortConfigKey &&
            props.sortConfig.direction == "descending"
          }
        >
          Sort Z-A
        </MenuItem>
        <Divider />

        {/* FILTER */}
        {props.useFilter && (
          <>
            <Stack padding={2}>
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
            {searchResult?.map((data: string) => (
              <MenuItem
                selected={false}
                onClick={
                  () => check(data)
                  // !props.excludedData?.includes(data)
                  //   ? props.setExcludedData([...props.excludedData, data])
                  //   : props.setExcludedData(
                  //       [...props.excludedData].filter((item) => item !== data)
                  //     )
                }
              >
                <Checkbox
                  size="small"
                  checked={!props.excludedData?.includes(data)}
                />
                {data}
              </MenuItem>
            ))}
          </>
        )}
      </Menu>
    </>
  );
}
