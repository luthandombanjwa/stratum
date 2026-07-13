import React, { useEffect, useRef } from "react";
import Plottable from "plottable";
import * as d3 from "d3";

// ── CHART 1 — SLA Breach Trend (Line Chart) ──────────────────────────────────
export function BreachTrendChart() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Mock data — 30 days of breach risk scores
    const data = [
      { day: "Apr 1", score: 12 },
      { day: "Apr 3", score: 18 },
      { day: "Apr 5", score: 15 },
      { day: "Apr 7", score: 32 },
      { day: "Apr 9", score: 28 },
      { day: "Apr 11", score: 45 },
      { day: "Apr 13", score: 38 },
      { day: "Apr 15", score: 52 },
      { day: "Apr 17", score: 41 },
      { day: "Apr 19", score: 67 },
      { day: "Apr 21", score: 58 },
      { day: "Apr 23", score: 73 },
      { day: "Apr 25", score: 61 },
      { day: "Apr 27", score: 79 },
      { day: "Apr 29", score: 85 },
      { day: "May 1", score: 71 },
      { day: "May 3", score: 63 },
      { day: "May 5", score: 88 },
      { day: "May 7", score: 76 },
      { day: "May 9", score: 92 },
    ];

    const xScale = new Plottable.Scales.Category();
    const yScale = new Plottable.Scales.Linear();
    yScale.domain([0, 100]);

    const xAxis = new Plottable.Axes.Category(xScale, "bottom");
    xAxis.tickLabelAngle(90);

    const yAxis = new Plottable.Axes.Numeric(yScale, "left");

    const dataset = new Plottable.Dataset(data);

    const linePlot = new Plottable.Plots.Line()
      .addDataset(dataset)
      .x((d) => d.day, xScale)
      .y((d) => d.score, yScale)
      .attr("stroke", "#1C6E42")
      .attr("stroke-width", 2);

    const areaPlot = new Plottable.Plots.Area()
      .addDataset(dataset)
      .x((d) => d.day, xScale)
      .y((d) => d.score, yScale)
      .y0(0)
      .attr("fill", "#1C6E42")
      .attr("fill-opacity", 0.08)
      .attr("stroke", "none");

    const plotGroup = new Plottable.Components.Group([areaPlot, linePlot]);

    const chart = new Plottable.Components.Table([
      [yAxis, plotGroup],
      [null, xAxis],
    ]);

    chart.renderTo(containerRef.current);

    const applyStyles = () => {
      d3.select(containerRef.current)
        .selectAll(".tick text")
        .style("fill", "#5F6B7C")
        .style("font-size", "11px")
        .style("font-family", "Inter");
      d3.select(containerRef.current)
        .selectAll(".domain")
        .style("stroke", "#252A31");
      d3.select(containerRef.current)
        .selectAll(".tick line")
        .style("stroke", "#252A31");
    };

    applyStyles();

    const tooltip = new Plottable.Interactions.Pointer();
    tooltip.attachTo(linePlot);

    const handleResize = () => {
      chart.redraw();
      applyStyles();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      chart.destroy();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "220px" }} />;
}

// ── CHART 2 — Cases by Priority (Bar Chart) ──────────────────────────────────
export function CasesByPriorityChart() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const data = [
      { priority: "Critical", count: 4 },
      { priority: "High", count: 9 },
      { priority: "Medium", count: 14 },
      { priority: "Low", count: 7 },
    ];

    const colorMap = {
      Critical: "#AC2F33",
      High: "#C87619",
      Medium: "#1F4E79",
      Low: "#1C6E42",
    };

    const xScale = new Plottable.Scales.Category();
    const yScale = new Plottable.Scales.Linear();
    yScale.domain([0, 20]);

    const xAxis = new Plottable.Axes.Category(xScale, "bottom");
    const yAxis = new Plottable.Axes.Numeric(yScale, "left");

    const dataset = new Plottable.Dataset(data);

    const barPlot = new Plottable.Plots.Bar()
      .addDataset(dataset)
      .x((d) => d.priority, xScale)
      .y((d) => d.count, yScale)
      .attr("fill", (d) => colorMap[d.priority] || "#1C6E42");

    const chart = new Plottable.Components.Table([
      [yAxis, barPlot],
      [null, xAxis],
    ]);

    chart.renderTo(containerRef.current);

    const applyStyles = () => {
      d3.select(containerRef.current)
        .selectAll(".tick text")
        .style("fill", "#5F6B7C")
        .style("font-size", "11px")
        .style("font-family", "Inter");
      d3.select(containerRef.current)
        .selectAll(".domain")
        .style("stroke", "#252A31");
      d3.select(containerRef.current)
        .selectAll(".tick line")
        .style("stroke", "#252A31");
    };

    applyStyles();

    const handleResize = () => {
      chart.redraw();
      applyStyles();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      chart.destroy();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "220px" }} />;
}

// ── CHART 3 — Resolution Time by Agent (Horizontal Bar) ──────────────────────
export function ResolutionTimeChart() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const data = [
      { agent: "N. Mokoena", avgTime: 42 },
      { agent: "J. Patel", avgTime: 67 },
      { agent: "L. Mensah", avgTime: 31 },
      { agent: "K. Dlamini", avgTime: 88 },
      { agent: "A. Nkosi", avgTime: 55 },
    ];

    const xScale = new Plottable.Scales.Linear();
    xScale.domain([0, 120]);
    const yScale = new Plottable.Scales.Category();

    const xAxis = new Plottable.Axes.Numeric(xScale, "bottom");
    const yAxis = new Plottable.Axes.Category(yScale, "left");

    const dataset = new Plottable.Dataset(data);

    const barPlot = new Plottable.Plots.Bar("horizontal")
      .addDataset(dataset)
      .x((d) => d.avgTime, xScale)
      .y((d) => d.agent, yScale)
      .attr("fill", "#1C6E42")
      .attr("fill-opacity", 0.85);

    const chart = new Plottable.Components.Table([
      [yAxis, barPlot],
      [null, xAxis],
    ]);

    chart.renderTo(containerRef.current);

    const applyStyles = () => {
      d3.select(containerRef.current)
        .selectAll(".tick text")
        .style("fill", "#5F6B7C")
        .style("font-size", "11px")
        .style("font-family", "Inter");
      d3.select(containerRef.current)
        .selectAll(".domain")
        .style("stroke", "#252A31");
      d3.select(containerRef.current)
        .selectAll(".tick line")
        .style("stroke", "#252A31");
    };

    applyStyles();

    const handleResize = () => {
      chart.redraw();
      applyStyles();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      chart.destroy();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "220px" }} />;
}
