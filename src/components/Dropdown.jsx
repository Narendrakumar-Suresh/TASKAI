import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import PropTypes from "prop-types";

export default function Dropdowns({
  onAddSubTask,
  onDeleteTask,
  onGenerateSubtasks,
}) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="light" size="sm">
          ...
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Actions">
        <DropdownItem key="addsub" onPress={onAddSubTask}>
          Add Subtask
        </DropdownItem>
        <DropdownItem key="generate" onPress={onGenerateSubtasks}>
          Generate Sub-Tasks
        </DropdownItem>
        <DropdownItem key="delete" color="danger" onPress={onDeleteTask}>
          Delete Task
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

Dropdowns.propTypes = {
  onAddSubTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onGenerateSubtasks: PropTypes.func.isRequired,
};
