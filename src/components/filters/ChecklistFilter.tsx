import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import {
  Box,
  Checkbox,
  Chip,
  Divider,
  FormLabel,
  IconButton,
  Input,
  Stack,
} from "@mui/joy";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Close, CloseRounded } from "@mui/icons-material";

export default function ChecklistFilter(props: {
  data: string[];
  includedData: string[];
  setIncludedData: React.Dispatch<React.SetStateAction<any[]>>;
  label: string;
}) {
  const [searchInput, setSearchInput] = useState("");
  const searchResult = props.data?.filter(
    (item: string) =>
      item.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <Stack>
      <FormLabel>{props.label}</FormLabel>
      <Select
        multiple
        autoFocus={false}
        disabled={props.data.length == 0}
        placeholder={`Pilih ${props.label}`}
        defaultValue={props.includedData}
        value={props.includedData}
        {...(props.includedData.length > 0 && {
          endDecorator: (
            <IconButton
              size="sm"
              variant="soft"
              color="neutral"
              onMouseDown={(event) => {
                event.stopPropagation();
              }}
              onClick={() => {
                props.setIncludedData([]);
              }}
            >
              <CloseRounded fontSize="small" />
            </IconButton>
          ),
          indicator: null,
        })}
        renderValue={() =>
          props.includedData.length == 0 ? (
            `Pilih ${props.label}`
          ) : (
            <Box sx={{ display: "flex", gap: "0.25rem" }}>
              {props.includedData.map((data) => (
                <Chip variant="soft" color="primary">
                  {data}
                </Chip>
              ))}
            </Box>
          )
        }
        sx={{
          minWidth: "15rem",
        }}
        slotProps={{
          listbox: {
            sx: {
              width: "100%",
            },
          },
        }}
      >
        <Input
          sx={{ marginX: 1, marginBottom: 1, marginTop: 0.5 }}
          onChange={(event) => {
            setSearchInput(event.target.value);
          }}
          value={searchInput}
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
          variant="outlined"
          placeholder="Cari"
          startDecorator={<SearchIcon fontSize="small" />}
          endDecorator={
            <IconButton size="sm" onClick={() => setSearchInput("")}>
              <Close fontSize="small" />
            </IconButton>
          }
        />
        <Divider />
        {searchResult.map((data, index) => (
          <Option
            value={data}
            key={index}
            hidden={true}
            autoFocus={false}
            onChange={() => {
              const newSelection = props.includedData.includes(data)
                ? props.includedData.filter((item) => item !== data)
                : [...props.includedData, data];
              props.setIncludedData(newSelection);
            }}
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
          >
            <Checkbox
              label={data}
              color="primary"
              variant="outlined"
              checked={props.includedData.includes(data)}
            />
          </Option>
        ))}
      </Select>
    </Stack>
  );
}
