import { render, screen, fireEvent } from "@testing-library/react";
import ListItem from "../ListItem";

describe("ListItem Component", () => {
  const task = {
    id: "1",
    text: "Test Task",
    completed: false
  };

  test("affiche le texte de la tâche", () => {
    render(<ListItem task={task} />);
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  test("le bouton delete déclenche la fonction", () => {
    const onDelete = vi.fn();

    render(<ListItem task={task} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    
    expect(onDelete).toHaveBeenCalledWith("1");
  });

  test("toggle checkbox déclenche la fonction onToggle", () => {
    const onToggle = vi.fn();

    render(<ListItem task={task} onToggle={onToggle} />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(onToggle).toHaveBeenCalledWith("1");
  });
});
