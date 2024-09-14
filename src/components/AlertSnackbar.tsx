import { IconButton, Snackbar } from "@mui/joy";

import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import { Alert } from "../interfaces/interfaces";

export default function AlertSnackbar(props: { alert: Alert }) {
  return (
    <Snackbar
      variant="soft"
      color={props.alert.color}
      open={props.alert.open}
      onClose={() =>
        props.setAlert((prevAlert) => ({ ...prevAlert, open: false }))
      }
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      startDecorator={
        props.alert?.color == "success" ? <CheckCircleIcon /> : <ErrorIcon />
      }
      endDecorator={
        <IconButton
          onClick={() =>
            props.setAlert((prevAlert) => ({ ...prevAlert, open: false }))
          }
          size="sm"
          variant="soft"
          color={props.alert.color}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    >
      {props.alert.message}
    </Snackbar>
  );
}
