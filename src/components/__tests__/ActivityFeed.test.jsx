import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ActivityFeed from "../ActivityFeed";

test("ActivityFeed lists provided activities", () => {
  // pass React nodes so component can render them safely
  const data = [
    <span key="1">User signed up</span>,
    <span key="2">Order placed</span>
  ];
  render(<ActivityFeed data={data} />);
  expect(screen.getByText(/User signed up/i)).toBeInTheDocument();
  expect(screen.getByText(/Order placed/i)).toBeInTheDocument();
});