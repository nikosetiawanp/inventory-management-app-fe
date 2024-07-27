import { IconButton, Snackbar } from "@mui/joy";

import PlaylistAddCheckCircleRoundedIcon from "@mui/icons-material/PlaylistAddCheckCircleRounded";
import CloseIcon from "@mui/icons-material/Close";

import { Alert } from "../interfaces/interfaces";

export default function AlertSnackbar(props: {
  alert: Alert;
  setAlert: React.Dispatch<React.SetStateAction<Alert>>;
}) {
  return (
    <Snackbar
      variant="soft"
      color={props.alert.color}
      open={props.alert.open}
      onClose={() =>
        props.setAlert((prevAlert) => ({ ...prevAlert, open: false }))
      }
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      startDecorator={<PlaylistAddCheckCircleRoundedIcon />}
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
