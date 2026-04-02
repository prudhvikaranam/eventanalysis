import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MetricsCard from "../MetricsCard";

test("MetricsCard shows title and value", () => {
  render(<MetricsCard title="Users" value={123} />);
  expect(screen.getByText(/Users/i)).toBeInTheDocument();
  expect(screen.getByText(/123/)).toBeInTheDocument();
});