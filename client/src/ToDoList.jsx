import { useState, useEffect } from "react";
import { RiCalendarTodoLine } from "react-icons/ri";
import axios from "axios";
import toast from "react-hot-toast";
import ListItem from "./ListItem";

const ToDoList = () => {
  // State Management
  const initialTaskState = { task: "" };
  const [addTask, setAddTask] = useState(initialTaskState);
  const [todoList, setTodoList] = useState([]);
  const [isListLoading, setIsListLoading] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const API_BACKEND = import.meta.env.VITE_API_BASE_URL;

  // API Functions
  const fetchTodoList = async () => {
    try {
      const response = await axios.get(`${API_BACKEND}/get`);
      setTodoList(response.data);
    } catch (error) {
      const message = error.response?.data?.errorMessage || "Something went wrong!";
      console.error("Fetch Error:", message);
      toast.error(message);
    } finally {
      setIsListLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    fetchTodoList();
  }, []);

  // Event Handlers
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (!isButtonLoading) {
      setAddTask((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedTask = addTask.task.trim();
    if (!trimmedTask) return;

    setIsButtonLoading(true);

    try {
      const headers = { headers: { "Content-Type": "application/json" } };

      if (addTask._id) {
        const updatedTask = { ...addTask, task: trimmedTask };
        const response = await axios.put(
          `${API_BACKEND}/update/${addTask._id}`,
          updatedTask,
          headers
        );
        toast.success(response?.data?.message);
      } else {
        const newTask = { task: trimmedTask };
        const response = await axios.post(
          `${API_BACKEND}/new`,
          newTask,
          headers
        );
        toast.success(response?.data?.message);
      }

      await fetchTodoList();
      setAddTask(initialTaskState);
    } catch (error) {
      const message = error.response?.data?.errorMessage || "Something went wrong!";
      console.error("Submit Error:", message);
      toast.error(message);
    } finally {
      setIsButtonLoading(false);
    }
  };

  // Helper Functions
  const getButtonText = () => {
    if (isButtonLoading) return "Processing...";
    return addTask._id ? "UPDATE +" : "ADD +";
  };

  const taskCountText = todoList.length === 1 ? "task" : "tasks";

  // Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform transition-all duration-300 hover:shadow-purple-500/20">
          
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
            <div className="flex items-center justify-center gap-3">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <RiCalendarTodoLine className="text-4xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">To-Do List</h1>
                <p className="text-purple-100 text-sm mt-1">Stay organized, stay productive</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Input Form */}
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="relative group">
                <input
                  id="task"
                  name="task"
                  type="text"
                  required
                  value={addTask.task}
                  onChange={handleChange}
                  placeholder="What needs to be done?"
                  autoComplete="off"
                  disabled={isButtonLoading}
                  className="w-full p-5 pl-6 pr-36 text-lg border-2 border-gray-200 rounded-2xl bg-gray-50/50 
                           focus:bg-white focus:ring-4 focus:ring-purple-200 focus:border-purple-400 
                           transition-all duration-300 outline-none placeholder:text-gray-400
                           disabled:bg-gray-100 disabled:cursor-not-allowed"
                />

                <button
                  type="submit"
                  disabled={isButtonLoading}
                  className={`absolute right-2 top-2 px-8 py-3 font-bold rounded-xl text-white 
                             transition-all duration-300 text-sm tracking-wide
                             ${
                               isButtonLoading
                                 ? "bg-gray-400 cursor-not-allowed"
                                 : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                             }`}
                >
                  {getButtonText()}
                </button>
              </div>
            </form>

            {/* Task List Section */}
            <div className="relative">
              <div className="max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100">
                <ListItem
                  todoList={todoList}
                  setAddTask={setAddTask}
                  isListLoading={isListLoading}
                  fetchTodoList={fetchTodoList}
                />
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="bg-gradient-to-r from-gray-50 to-purple-50/30 border-t border-gray-200/50 px-8 py-5">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm font-medium">
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                  {todoList.length} {taskCountText} total
                </span>
              </p>
              <p className="text-gray-400 text-xs">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-4 text-center">
          <p className="text-white/60 text-xs">Made with ♥ for productivity</p>
        </div>
      </div>
    </div>
  );
};

export default ToDoList;