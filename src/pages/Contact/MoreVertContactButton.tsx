import { MoreVert } from "@mui/icons-material";
import {
  Dropdown,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
} from "@mui/joy";
import EditIcon from "@mui/icons-material/Edit";
import { Contact } from "../../interfaces/interfaces";
import DeleteRecord from "../../components/DeleteRecord";

export default function MoreVertContactButton(props: { contact: Contact }) {
  return (
    <Dropdown>
      <MenuButton variant="plain">
        <MoreVert fontSize="small" />
      </MenuButton>

      <Menu>
        <MenuItem>
          <ListItemDecorator>
            <EditIcon fontSize="small" color="inherit" />
          </ListItemDecorator>
          Ubah
        </MenuItem>
        <DeleteRecord
          id={props.contact.id}
          param="contacts"
          queryKey="contacts"
          label={props.contact.name}
          variant={"menu-item"}
        />
        {/* <MenuItem>
          <AlertDialogModal />
        </MenuItem> */}
      </Menu>
    </Dropdown>
  );
}
