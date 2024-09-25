import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Menu,
  TextField,
  Typography,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function DebtFilter(props: {
  contacts: string[];
  includedContacts: string[];
  setIncludedContacts: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  // HANDLE OPEN AND CLOSE
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // HANDLE CHECKLIST
  const [searchInput, setSearchInput] = useState("");
  const searchResult = props.contacts?.filter(
    (item: string) =>
      item.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.toLowerCase().includes(searchInput.toLowerCase())
  );
  const check = (data: string) => {
    !props.includedContacts?.includes(data)
      ? props.setIncludedContacts([...props.includedContacts, data])
      : props.setIncludedContacts(
          [...props.includedContacts].filter((item) => item !== data)
        );
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<FilterListIcon />}
        onClick={handleClick}
      >
        Filter
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Typography variant="h6" marginX={2}>
          Filter
        </Typography>
        <Accordion elevation={0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Kontak</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              id="outlined-basic"
              placeholder="Cari kontak"
              variant="outlined"
              size="small"
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value);
              }}
              onKeyDown={(e) => e.stopPropagation()}
              sx={{ marginBottom: 2 }}
            />
            <FormGroup sx={{ paddingX: 2 }}>
              {searchResult?.map((data: string, index: number) => (
                <FormControlLabel
                  key={index}
                  checked={props.includedContacts.includes(data)}
                  control={<Checkbox size="small" />}
                  label={data}
                  onClick={() => check(data)}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
      </Menu>
    </>
  );
}
