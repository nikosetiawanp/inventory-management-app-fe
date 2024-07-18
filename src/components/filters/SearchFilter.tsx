import { FormLabel, Input, Stack } from "@mui/joy";

export default function SearchFilter(props: {
  searchInput: string;
  setSearchInput: (value: React.SetStateAction<string>) => void;
  label: string;
  placeholder: string;
}) {
  return (
    <Stack width={1}>
      <FormLabel>{props.label}</FormLabel>
      <Input
        id="outlined-basic"
        placeholder={props.placeholder}
        variant="outlined"
        size="md"
        value={props.searchInput}
        onChange={(event) => {
          props.setSearchInput(event.target.value);
        }}
        fullWidth
      />
    </Stack>
  );
}
