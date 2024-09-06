import {
  Box,
  Divider,
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
            sx={
              props.startDate || props.endDate
                ? { gap: 0.5, paddingY: 0, paddingRight: 1 }
                : { gap: 0.5 }
            }
            endDecorator={
              props.startDate || props.endDate ? (
                <Box
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.05)", // Add your desired hover background color
                      cursor: "pointer",
                    },
                    borderRadius: 99,
                    width: "fit",
                    display: "flex",
                    alignItems: "center",
                    padding: 0.5,
                  }}
                >
                  <CloseRounded
                    fontSize="small"
                    onClick={(e) => {
                      props.setStartDate();
                      props.setEndDate();
                      e.stopPropagation();
                    }}
                  />
                </Box>
              ) : (
                // </IconButton>
                <DateRangeIcon fontSize="small" />
              )
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
