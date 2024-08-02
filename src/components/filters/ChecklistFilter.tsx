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

interface data {
  id: string;
  label: string;
}

export default function ChecklistFilter(props: {
  data: data[];
  includedData: data[];
  setIncludedData: React.Dispatch<React.SetStateAction<any[]>>;
  label: string;
}) {
  const [searchInput, setSearchInput] = useState("");
  const uniqueArrayOfData = props.data?.filter(
    (value, index, self) => index === self.findIndex((t) => t.id === value.id)
  );

  const searchResult = uniqueArrayOfData?.filter((item: data) =>
    item.label.toLowerCase().includes(searchInput.toLowerCase())
  );

  const arrayOfIncludedId = props.includedData?.map((data: data) => data.id);

  const check = (newValue: data) =>
    props.setIncludedData([...props.includedData, newValue]);

  const uncheck = (value: data) =>
    props.setIncludedData(
      props.includedData.filter((includedData) => includedData.id !== value.id)
    );

  return (
    <Stack>
      <FormLabel>{props.label}</FormLabel>
      <Select
        multiple
        autoFocus={false}
        disabled={props.data?.length == 0}
        placeholder={`Pilih ${props.label}`}
        defaultValue={[]}
        value={arrayOfIncludedId}
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
        renderValue={(selected) =>
          selected.length === 0 ? (
            `Pilih ${props.label}`
          ) : (
            <Box sx={{ display: "flex", gap: "0.25rem" }}>
              {selected.map((selectedOption: any) => (
                <Chip key={selectedOption.id} variant="soft" color="primary">
                  {selectedOption.label}
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
        {searchResult?.map((data: data) => {
          return (
            <Option
              value={data.id}
              key={data.id}
              autoFocus={false}
              onChange={() => {
                arrayOfIncludedId.includes(data.id)
                  ? uncheck(data)
                  : check(data);
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
            >
              <Checkbox
                label={data.label}
                color="primary"
                variant="outlined"
                checked={arrayOfIncludedId.includes(data.id)}
              />
            </Option>
          );
        })}
      </Select>
    </Stack>
  );
}
