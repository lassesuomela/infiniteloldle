import React, { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ComposedChart,
  Legend,
} from "recharts";

export default function StatsData() {
  return (
    <>
      <h3 className="text-center pb-3 pt-4">My stats</h3>
      <div className="d-grid justify-content-center text-center card p-5"></div>
    </>
  );
}
