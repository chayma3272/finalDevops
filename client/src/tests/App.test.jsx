import { render, screen } from "@testing-library/react";
import App from "../App";

test("render titre todo list", () => {
  render(<App />);
  expect(screen.getByText(/todo/i)).toBeInTheDocument();
});
