import {
  Dropdown,
  FormLabel,
  Menu,
  MenuButton,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { formatDate } from "../../helpers/dateHelpers";
import DateRangeIcon from "@mui/icons-material/DateRange";

export default function MonthFilter(props: {
  selectedDate: Dayjs;
  setSelectedDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  refetch: () => void;
  label: string;
}) {
  return (
    <Stack>
      <FormLabel>{props.label}</FormLabel>
      <Dropdown>
        <Sheet>
          <MenuButton endDecorator={<DateRangeIcon fontSize="small" />}>
            <Typography color="primary">
              {formatDate(props.selectedDate, "MMMM YYYY")}
            </Typography>
          </MenuButton>
          <Menu sx={{ padding: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack direction={"row"}>
                <DateCalendar
                  autoFocus
                  defaultValue={props.selectedDate}
                  onChange={(newValue: any) => props.setSelectedDate(newValue)}
                  views={["month", "year"]}
                  openTo="month"
                />
                {/* <MonthCalendar autoFocus />
                <Divider orientation="vertical" />
                <YearCalendar /> */}
              </Stack>
            </LocalizationProvider>
          </Menu>
        </Sheet>
      </Dropdown>
    </Stack>
  );
}
