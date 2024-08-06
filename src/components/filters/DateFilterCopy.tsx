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
  startDate: string | number | dayjs.Dayjs | Date | null | undefined;
  setStartDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs>> | any;
  endDate: string | number | dayjs.Dayjs | Date | null | undefined;
  setEndDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs>> | any;
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
              props.startDate || props.endDate ? (
                <IconButton
                  size="sm"
                  color="neutral"
                  variant="soft"
                  onClick={(e) => {
                    props.setStartDate();
                    props.setEndDate();
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
              props.startDate || props.endDate
                ? { gap: 0.5, paddingY: 0, paddingRight: 0 }
                : { gap: 0.5 }
            }
          >
            <Typography color={props.startDate ? "primary" : "neutral"}>
              {props.startDate
                ? formatDate(props.startDate, "DD MMM YYYY")
                : "Start date"}{" "}
            </Typography>{" "}
            <Typography> -</Typography>
            <Typography color={props.endDate ? "primary" : "neutral"}>
              {props.endDate
                ? formatDate(props.endDate, "DD MMM YYYY")
                : "End date"}
            </Typography>
          </MenuButton>
          <Menu sx={{ padding: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack direction={"row"}>
                <DateCalendar
                  autoFocus
                  value={props.startDate}
                  onChange={(newValue: any) => props.setStartDate(newValue)}
                  maxDate={props.endDate && props.endDate}
                />
                <Divider orientation="vertical" />
                <DateCalendar
                  disableFuture
                  value={props.endDate}
                  minDate={props.startDate}
                  onChange={(newValue: any) => props.setEndDate(newValue)}
                />
              </Stack>
            </LocalizationProvider>
          </Menu>
        </Sheet>
      </Dropdown>
    </Stack>
  );
}
