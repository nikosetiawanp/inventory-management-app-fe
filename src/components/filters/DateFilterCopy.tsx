import {
  Divider,
  Dropdown,
  FormLabel,
  IconButton,
  Menu,
  MenuButton,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { formatDate } from "../../helpers/dateHelpers";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { CloseRounded } from "@mui/icons-material";

export default function DateFilterCopy(props: {
  selectedStartDate: string | number | dayjs.Dayjs | Date | null | undefined;
  setSelectedStartDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs>> | any;
  selectedEndDate: string | number | dayjs.Dayjs | Date | null | undefined;
  setSelectedEndDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs>> | any;
  refetch: () => void;
  label: string;
}) {
  return (
    <Stack>
      <FormLabel>{props.label}</FormLabel>
      <Dropdown>
        <Sheet>
          <MenuButton
            endDecorator={
              props.selectedStartDate || props.selectedEndDate ? (
                <IconButton
                  size="sm"
                  color="neutral"
                  variant="soft"
                  onClick={(e) => {
                    props.setSelectedStartDate();
                    props.setSelectedEndDate();
                    e.stopPropagation();
                  }}
                >
                  <CloseRounded fontSize="small" />
                </IconButton>
              ) : (
                <DateRangeIcon fontSize="small" />
              )
            }
            sx={
              props.selectedStartDate || props.selectedEndDate
                ? { gap: 0.5, paddingY: 0, paddingRight: 0 }
                : { gap: 0.5 }
            }
          >
            <Typography color={props.selectedStartDate ? "primary" : "neutral"}>
              {props.selectedStartDate
                ? formatDate(props.selectedStartDate, "D/MM/YYYY")
                : "Start date"}{" "}
            </Typography>{" "}
            <Typography> -</Typography>
            <Typography color={props.selectedEndDate ? "primary" : "neutral"}>
              {props.selectedEndDate
                ? formatDate(props.selectedEndDate, "D/MM/YYYY")
                : "End date"}
            </Typography>
          </MenuButton>
          <Menu sx={{ padding: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack direction={"row"}>
                <DateCalendar
                  autoFocus
                  value={props.selectedStartDate}
                  onChange={(newValue: any) =>
                    props.setSelectedStartDate(newValue)
                  }
                  maxDate={props.selectedEndDate && props.selectedEndDate}
                />
                <Divider orientation="vertical" />
                <DateCalendar
                  disableFuture
                  value={props.selectedEndDate}
                  minDate={props.selectedStartDate}
                  onChange={(newValue: any) =>
                    props.setSelectedEndDate(newValue)
                  }
                />
              </Stack>
            </LocalizationProvider>
          </Menu>
        </Sheet>
      </Dropdown>
    </Stack>
  );
}
