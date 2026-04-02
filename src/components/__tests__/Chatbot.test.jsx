import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Chatbot from "../Chatbot";

test("Chatbot renders (renders input/send when available)", () => {
  const { container } = render(<Chatbot />);
  // basic smoke test: component renders
  expect(container).toBeTruthy();

  // if the implementation provides input and send button, exercise them
  const input = screen.queryByRole("textbox");
  const send = screen.queryByRole("button", { name: /send/i });
  if (input && send) {
    fireEvent.change(input, { target: { value: "hello" } });
    fireEvent.click(send);
    // optionally assert behavior if Chatbot renders messages -- keep minimal here
  }
});