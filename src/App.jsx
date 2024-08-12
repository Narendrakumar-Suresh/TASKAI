import "./App.css";
import Navbar from "./components/Navbar";
import { Input, Button } from "@nextui-org/react";
import Task from "./components/Task";
import { useState, useEffect } from "react";
import Modals from "./components/Modal";
import { supabase } from "./lib/helper/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLoggedIn } from "./features/auth/authSlice";
import generateSubtasks from "./config/gemini";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function addSubtasksToSupabase(subtasks, parentTaskId) {
    try {
      // Find the parent task in todoList to get its Sno
      const parentTask = todoList.find((task) => task.id === parentTaskId);
      const parentSno = parentTask ? parentTask.Sno : null;

      // Get current user
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData.user) {
        console.error("Error fetching user or user missing:", userError);
        return;
      }

      // Format subtasks to match your Supabase schema
      const formattedSubtasks = subtasks.map((subtaskText) => ({
        user_id: userData.user.id, // Ensure user ID is included
        task_text: subtaskText,
        parenttaskid: parentTaskId,
        Sno: parentSno, // Assign the same Sno as the parent task
      }));

      // Insert formatted subtasks into Supabase
      const { data, error } = await supabase
        .from("tasks")
        .insert(formattedSubtasks)
        .select(); // Fetch the inserted rows

      if (error) {
        console.error("Error adding subtasks:", error);
        return;
      }

      if (data && data.length > 0) {
        // Update the todoList state with the new subtasks
        const updatedTaskList = todoList.map((task) => {
          if (task.id === parentTaskId) {
            return {
              ...task,
              subTasks: [...(task.subTasks || []), ...data],
            };
          }
          return task;
        });

        setTodoList(updatedTaskList);
      } else {
        console.error("No subtasks returned from the database");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }

  // Check user session on component mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          console.error("Error fetching session or session missing:", error);
          dispatch(setLoggedIn(false));
          navigate("/login");
        } else {
          dispatch(setLoggedIn(true));
          await fetchTasks(data.session.user.id); // Fetch tasks if logged in
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        dispatch(setLoggedIn(false));
        navigate("/login");
      }
    };
    checkUser();
  }, [dispatch, navigate]);

  // Fetch tasks from the database
  // Fetch tasks and their subtasks from the database
  const fetchTasks = async (userId) => {
    try {
      const { data: parentTasks, error: parentTasksError } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .is("parenttaskid", null); // Fetch only parent tasks

      if (parentTasksError) {
        console.error("Error fetching parent tasks:", parentTasksError);
        return;
      }

      // Fetch all subtasks in a single query for improved performance
      const { data: subTasks, error: subTasksError } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .not("parenttaskid", "is", null); // All subtasks for the user

      if (subTasksError) {
        console.error("Error fetching subtasks:", subTasksError);
        return;
      }

      // Combine parent tasks with their respective subtasks
      const tasksWithSubtasks = parentTasks.map((parentTask) => {
        const matchingSubTasks = subTasks.filter(
          (subTask) => subTask.parenttaskid === parentTask.id
        );

        return { ...parentTask, subTasks: matchingSubTasks };
      });

      setTodoList(tasksWithSubtasks || []);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const handleOpenModal = (taskId) => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  const handleAddTask = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return alert("Enter task");

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Error fetching user:", userError);
      return;
    }

    try {
      // Fetch the highest Sno
      const { data: maxSnoData, error: maxSnoError } = await supabase
        .from("tasks")
        .select("Sno")
        .order("Sno", { ascending: false })
        .limit(1);

      if (maxSnoError) {
        console.error("Error fetching max Sno:", maxSnoError);
        return;
      }

      const newSno = maxSnoData.length > 0 ? maxSnoData[0].Sno + 1 : 1;

      const newTask = {
        user_id: userData.user.id,
        task_text: trimmedInput,
        parenttaskid: null,
        Sno: newSno,
      };

      const { data, error } = await supabase
        .from("tasks")
        .insert([newTask])
        .select();

      if (error) {
        console.error("Error adding task:", error);
        return;
      }

      if (data && data.length > 0) {
        setTodoList((prev) => [...prev, data[0]]);
        setInputValue("");
      } else {
        console.error("No task returned from the database");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const handleAddSubTask = async (subTaskText) => {
    const trimmedSubTaskText = subTaskText.trim();
    if (!selectedTaskId || !trimmedSubTaskText) return;

    const { data: userData } = await supabase.auth.getUser();

    const parentTask = todoList.find((task) => task.id === selectedTaskId);
    const newSubTask = {
      user_id: userData.user.id,
      task_text: trimmedSubTaskText,
      parenttaskid: selectedTaskId,
      Sno: parentTask.Sno, // Inherit Sno from parent task
    };

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([newSubTask])
        .select();

      if (error) {
        console.error("Error adding subtask:", error);
        return;
      }

      if (data && data.length > 0) {
        const updatedTaskList = todoList.map((task) => {
          if (task.id === selectedTaskId) {
            return {
              ...task,
              subTasks: [...(task.subTasks || []), data[0]],
            };
          }
          return task;
        });

        setTodoList(updatedTaskList);
        setIsModalOpen(false);
      } else {
        console.error("No subtask returned from the database");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      // First, delete all subtasks associated with the main task
      const { data: subTasks, error: subTasksError } = await supabase
        .from("tasks")
        .select("id")
        .eq("parenttaskid", taskId);

      if (subTasksError) {
        console.error("Error fetching subtasks:", subTasksError);
        return;
      }

      if (subTasks && subTasks.length > 0) {
        const subTaskIds = subTasks.map((subTask) => subTask.id);

        // Delete all subtasks
        const { error: deleteSubTasksError } = await supabase
          .from("tasks")
          .delete()
          .in("id", subTaskIds);

        if (deleteSubTasksError) {
          console.error("Error deleting subtasks:", deleteSubTasksError);
          return;
        }
      }

      // Now, delete the main task
      const { data, error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (error) {
        alert("Error deleting task:", error);
        return;
      }

      setTodoList((prevList) => prevList.filter((task) => task.id !== taskId));
    } catch (err) {
      alert("Unexpected error:", err);
    }
  };

  const handleDeleteSubTask = async (subTaskId) => {
    try {
      // Optimistic update: remove the subtask from the UI
      const updatedTaskList = todoList.map((task) => {
        if (
          task.subTasks &&
          task.subTasks.some((subTask) => subTask.id === subTaskId)
        ) {
          return {
            ...task,
            subTasks: task.subTasks.filter(
              (subTask) => subTask.id !== subTaskId
            ),
          };
        }
        return task;
      });
      setTodoList(updatedTaskList);

      // Send delete request to Supabase
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", subTaskId);

      if (error) {
        console.error("Error deleting subtask:", error);
        // Revert UI state on error
        const originalTaskList = await fetchTasks(
          await supabase.auth
            .getUser()
            .then((userData) => userData.data.user.id)
        );
        setTodoList(originalTaskList);
      } else {
        alert("Subtask deleted successfully.");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      // Revert UI state on error
      const originalTaskList = await fetchTasks(
        await supabase.auth.getUser().then((userData) => userData.data.user.id)
      );
      setTodoList(originalTaskList);
    }
  };

  const handleGenerateSubtasks = async (mainTask) => {
    const generatedSubtasks = await generateSubtasks(mainTask.task_text);

    if (generatedSubtasks.length > 0) {
      await addSubtasksToSupabase(generatedSubtasks, mainTask.id);
    } else {
      console.error("No subtasks generated.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default behavior of the Enter key (like form submission)
      handleAddTask();
    }
  };
  return (
    <>
      {isLoggedIn && (
        <div className="flex flex-col h-screen">
          <Navbar />
          <div className="flex-grow overflow-y-auto p-4">
            {todoList.map((item) => (
              <Task
                key={item.id}
                task={item}
                subTasks={item.subTasks} // Ensuring subTasks is an array
                onAddSubTask={() => handleOpenModal(item.id)}
                onDeleteTask={handleDeleteTask}
                onDeleteSubTask={handleDeleteSubTask}
                onGenerateSubtasks={handleGenerateSubtasks}
              />
            ))}
          </div>
          <div className="p-4">
            <div className="flex flex-row gap-2">
              <Input
                clearable
                bordered
                size="lg"
                placeholder="Add a new task"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ width: "50%" }}
              />
              <Button auto onClick={handleAddTask} css={{ width: "30%" }}>
                Add Task
              </Button>
            </div>
          </div>
          <Modals
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAddSubTask={handleAddSubTask}
          />
        </div>
      )}
    </>
  );
}

export default App;
