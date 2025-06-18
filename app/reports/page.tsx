"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/userApi";
import { getGoalsByUserUuid } from "@/lib/reportsApi";
import { getBudgetsByUserUuid } from "@/lib/budgetApi";
import { getTransactions } from "@/lib/transactionApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import {
  Bar,
  Line,
  Pie,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  LineChart,
  PieChart,
  Cell,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#0088FE"];

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);

  const handleExportPDF = async () => {
    if (!contentRef.current) return;

    const canvas = await html2canvas(contentRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const scale = Math.min(
      pageWidth / canvas.width,
      pageHeight / canvas.height
    );

    const imgWidth = canvas.width * scale;
    const imgHeight = canvas.height * scale;

    const marginX = (pageWidth - imgWidth) / 2;
    const marginY = 10; // ili 0 za vrh

    pdf.addImage(imgData, "PNG", marginX, marginY, imgWidth, imgHeight);
    pdf.save("financial-report.pdf");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getCurrentUser();
        if (!user) return;

        const [txns, budg, gls] = await Promise.all([
          getTransactions(user.userId),
          getBudgetsByUserUuid(user.userUuid),
          getGoalsByUserUuid(user.userUuid),
        ]);

        setTransactions(txns);
        setBudgets(budg);
        setGoals(gls);

        let income = 0;
        let expenses = 0;
        txns.forEach((t) => {
          const category = t.categoryId;
          if (!category) return;
          if (category % 2 === 0) income += t.amount;
          else expenses += t.amount;
        });

        setTotalIncome(income);
        setTotalExpenses(expenses);
        setTotalSavings(income - expenses);
      } catch (error) {
        console.error("Error loading report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const incomeVsExpensesData = [
    { name: "Income", value: totalIncome },
    { name: "Expenses", value: totalExpenses },
    { name: "Savings", value: totalSavings },
  ];

  const goalChartData = goals.map((g: any) => ({
    name: g.name,
    progress: Math.round((g.currAmount / g.targetAmount) * 100),
  }));

  const budgetChartData = budgets.map((b: any) => ({
    name: `#${b.categoryId} (${b.period})`,
    usage: Math.round((b.currentAmount / b.amount) * 100),
  }));

  const spendingTrendData = transactions.map((t: any) => ({
    date: new Date(t.date).toLocaleDateString(),
    amount: t.amount * (t.categoryId % 2 === 0 ? 1 : -1),
  }));

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 p-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[150px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div ref={contentRef}>
      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Financial Overview</h1>
          <Button onClick={handleExportPDF}>Export to PDF</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-green-600">
                {totalIncome.toFixed(2)} $
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-red-600">
                {totalExpenses.toFixed(2)} $
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">
                {totalSavings.toFixed(2)} $
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeVsExpensesData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {incomeVsExpensesData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Goal Completion</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={goalChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="progress" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget Usage</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={budgetChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="usage" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spending Trend Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spendingTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#ff7f50" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
