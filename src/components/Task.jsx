import { Card, CardBody, Checkbox } from "@nextui-org/react";
import Dropdowns from "./Dropdown";
import PropTypes from "prop-types";
export default function Task({
  task,
  subTasks,
  onAddSubTask,
  onDeleteTask,
  onDeleteSubTask,
  onGenerateSubtasks,
}) {
  return (
    <div className="p-2">
      <Card>
        <CardBody className="flex flex-col gap-2">
          {/* Main Task */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) {
                    onDeleteTask(task.id);
                  }
                }}
              />
              <p className="text-lg font-bold">{task.task_text}</p>
            </div>
            <Dropdowns
              onAddSubTask={() => onAddSubTask(task.id)}
              onDeleteTask={() => onDeleteTask(task.id)}
              onGenerateSubtasks={() => onGenerateSubtasks(task)}
            />
          </div>
          {subTasks && subTasks.length > 0 && (
            <div className="flex flex-col p-3">
              {subTasks.map((subTask) => (
                <div key={subTask.id} className="flex items-center gap-2">
                  <Checkbox
                    onChange={(e) => {
                      if (e.target.checked) {
                        onDeleteSubTask(subTask.id);
                      }
                    }}
                  />
                  <p className="text-sm text-gray-600">{subTask.task_text}</p>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    task_text: PropTypes.string.isRequired,
  }).isRequired,
  subTasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      task_text: PropTypes.string.isRequired,
    })
  ), // Remove isRequired
  onAddSubTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onDeleteSubTask: PropTypes.func.isRequired,
  onGenerateSubtasks: PropTypes.func.isRequired,
};
