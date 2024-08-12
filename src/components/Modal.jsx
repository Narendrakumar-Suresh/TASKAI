import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useState } from "react";
import PropTypes from "prop-types";

export default function Modals({ isOpen, onClose, onAddSubTask }) {
  const [subTaskText, setSubTaskText] = useState("");

  const handleSubmit = () => {
    if (subTaskText.trim()) {
      onAddSubTask(subTaskText);
      setSubTaskText("");
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Add Sub-Task</ModalHeader>
        <ModalBody>
          <Input
            value={subTaskText}
            onChange={(e) => setSubTaskText(e.target.value)}
            label="Enter Sub-Task"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button color="primary" onPress={handleSubmit}>
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

Modals.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddSubTask: PropTypes.func.isRequired,
};
