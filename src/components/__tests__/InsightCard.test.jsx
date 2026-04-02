import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import InsightCard from "../InsightCard";

test("InsightCard renders provided text", () => {
  render(<InsightCard text="AI suggests increasing ads" />);
  expect(screen.getByText(/AI suggests increasing ads/i)).toBeInTheDocument();
});