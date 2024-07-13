import dayjs from "dayjs";
import "dayjs/locale/id";
dayjs.locale("id");

export function formatDate(
  date: string | number | Date | dayjs.Dayjs | null | undefined,
  format: string
) {
  if (!date) return ""; // Return an empty string if the date is null or undefined

  const parsedDate = dayjs(date);
  if (!parsedDate.isValid()) {
    throw new Error("Invalid date format");
  }

  return parsedDate.format(format); // e.g., 12 Juli 2024
}
