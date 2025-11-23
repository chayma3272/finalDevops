import { render, screen } from "@testing-library/react";
import ToDoList from "../ToDoList";

describe("ToDoList Component", () => {
  test("affiche les tâches", () => {
    const tasks = [
      { id: "1", text: "Task 1", completed: false },
      { id: "2", text: "Task 2", completed: true }
    ];

    render(<ToDoList tasks={tasks} />);

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  test("affiche No tasks si vide", () => {
    render(<ToDoList tasks={[]} />);
    expect(screen.getByText(/no tasks/i)).toBeInTheDocument();
  });
});
