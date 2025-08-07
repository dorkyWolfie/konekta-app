'use client';
import { useState } from "react";
import { parseISO, format, subDays, addDays, differenceInDays } from "date-fns";
import { CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const daysPerPage = 30;

export default function Chart({ data }) {
  const [page, setPage] = useState(0);

  if (!data || data.length === 0) return <p>Нема податоци</p>;

  const xLabelKey = Object.keys(data[0]).find((key) => key !== "date");

  const today = new Date();
  const endDate = subDays(today, page * daysPerPage);
  const startDate = subDays(endDate, daysPerPage - 1);

  const fullDateRange = [];
  for (let i = 0; i < daysPerPage; i++) {
    fullDateRange.push(addDays(startDate, i));
  }

  const dataMap = new Map();
  data.forEach(item => {
    const d = parseISO(item.date);
    dataMap.set(format(d, 'yyyy-MM-dd'), item[xLabelKey]);
  });

  const dataWithoutGaps = fullDateRange.map(dateObj => {
    const key = format(dateObj, 'yyyy-MM-dd');
    return {
      date: format(dateObj, 'dd-MM'),
      [xLabelKey]: dataMap.get(key) || 0
    };
  });

  const totalDays = differenceInDays(
    parseISO(data[data.length - 1].date),
    parseISO(data[0].date)
  ) + 1;

  const totalPages = Math.ceil(totalDays / daysPerPage);

  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={dataWithoutGaps} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
          <defs>
            <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2B7FFF" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#2B7FFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid horizontal={false} strokeWidth="3" stroke="#f5f5f5" />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tickMargin={10} tick={{ fill: "#aaa" }} />
          <YAxis axisLine={false} tickLine={false} tickMargin={10} tick={{ fill: "#aaa" }} />
          <Tooltip />
          <Area type="monotone" dataKey={xLabelKey} stroke="#2B7FFF" fill="url(#colorFill)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="flex gap-2 items-center px-4 py-1 bg-gray-200 text-sm rounded disabled:opacity-50">
          <FontAwesomeIcon icon={faArrowLeft} />
          <span className="max-md:hidden">Претходна</span>
        </button>
        <span className="text-sm text-gray-500">Страница {page + 1} од {totalPages}</span>
        <button
          disabled={page === totalPages - 1}
          onClick={() => setPage(page + 1)}
          className="flex gap-2 items-center px-4 py-1 bg-gray-200 text-sm rounded disabled:opacity-50">
          <span className="max-md:hidden">Следна</span>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
}