import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import toast from "react-hot-toast";
import axios from "axios";
import Tooltip from "./Tooltip";
import ListItemSkeleton from "./ListItemSkeleton";
import { useState } from "react";

const ListItem = ({ todoList, setAddTask, isListLoading, fetchTodoList }) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isCompleteLoading, setIsCompleteLoading] = useState(false);

  const API_BACKEND = import.meta.env.VITE_API_BASE_URL;

  // Set task for editing
  const handleEdit = (task) => {
    setAddTask(task);
  };

  // Delete task using its unique id
  const handleDelete = (_id) => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    async function deleteTodoList() {
      setIsDeleteLoading(true);
      try {
        const res = await axios.delete(`${API_BACKEND}/delete/${_id}`, headers);

        toast.success(res?.data?.message);
        await fetchTodoList();
      } catch (err) {
        const message =
          err.response?.data?.errorMessage || "Something went wrong!";
        console.error("Error:", message);
        toast.error(message);
      } finally {
        setIsDeleteLoading(false);
      }
    }
    deleteTodoList();
  };

  // Toggle completion for a task using its unique id
  const handleComplete = (currentTask) => {
    const updatedTask = {
      ...currentTask,
      isCompleted: !currentTask.isCompleted,
    };

    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    async function updateTodoList() {
      setIsCompleteLoading(true);
      try {
        await axios.put(
          `${API_BACKEND}/update/${currentTask._id}`,
          updatedTask,
          headers
        );

        toast.success(
          currentTask.isCompleted
            ? `${currentTask.task} - Task not completed`
            : `${currentTask.task} - Task completed`
        );
        await fetchTodoList();
      } catch (err) {
        const message =
          err.response?.data?.errorMessage || "Something went wrong!";
        console.error("Error:", message);
        toast.error(message);
      } finally {
        setIsCompleteLoading(false);
      }
    }
    updateTodoList();
  };

  return (
    <div className="w-full space-y-4">
      {isListLoading ? (
        <ListItemSkeleton />
      ) : (
        todoList.map((list) => (
          <div
            key={list._id}
            className="flex flex-row justify-between items-start gap-x-3"
          >
            <div
              className={`flex flex-row justify-start items-start gap-x-4 ${
                isCompleteLoading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={() => !isCompleteLoading && handleComplete(list)}
            >
              <span className="h-5 w-5">
                {list.isCompleted ? (
                  <FaCheckCircle color="#16a34a" size={22} />
                ) : (
                  <FaRegCircle color="#484d5c" size={22} />
                )}
              </span>

              <span
                className={`break-all ${
                  list.isCompleted ? "line-through" : "no-underline"
                }`}
              >
                {list.task}
              </span>
            </div>

            <div className="flex flex-row gap-3">
              <Tooltip text="Edit">
                <div
                  className="h-5 w-5 cursor-pointer text-green-700 hover:text-green-900"
                  onClick={() => handleEdit(list)}
                >
                  <TbEdit size={20} />
                </div>
              </Tooltip>
              <Tooltip text="Delete">
                <div
                  className={`h-5 w-5  ${
                    isDeleteLoading
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 cursor-pointer hover:text-rose-800"
                  }`}
                  onClick={() => {
                    if (!isDeleteLoading) handleDelete(list._id);
                  }}
                >
                  <RiDeleteBin6Line size={20} />
                </div>
              </Tooltip>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ListItem;
