import ToDoList from "./ToDoList";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <ToDoList />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </>
  );
};

export default App;