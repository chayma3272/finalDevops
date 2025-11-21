import ToDoList from "./ToDoList";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <ToDoList />

      <Toaster position="top-right" />
    </>
  );
};

export default App;
