
import React, { useState, useEffect } from 'react';
import TimeframeSelector from './components/TimeframeSelector';
import Chart from './components/Chart';
import data from './data/data.json';

import './App.css'


const filterDataByTimeframe = (data, timeframe) => {
  if (timeframe === 'daily') {
    return data;
  } else if (timeframe === 'weekly') {

    const weeklyData = [];
    let currentWeek = [];
    data.forEach((entry, index) => {
      currentWeek.push(entry);
      if ((index + 1) % 7 === 0 || index === data.length - 1) {
        const avgValue = currentWeek.reduce((acc, val) => acc + val.value, 0) / currentWeek.length;
        weeklyData.push({
          timestamp: currentWeek[0].timestamp,
          value: avgValue,
        });
        currentWeek = [];
      }
    });
    return weeklyData;
  } else if (timeframe === 'monthly') {

    const monthlyData = [];
    let currentMonth = [];
    let currentMonthName = new Date(data[0].timestamp).getMonth();
    data.forEach((entry, index) => {
      const monthName = new Date(entry.timestamp).getMonth();
      if (monthName !== currentMonthName || index === data.length - 1) {
        const avgValue = currentMonth.reduce((acc, val) => acc + val.value, 0) / currentMonth.length;
        monthlyData.push({
          timestamp: currentMonth[0].timestamp,
          value: avgValue,
        });
        currentMonth = [];
        currentMonthName = monthName;
      }
      currentMonth.push(entry);
    });
    return monthlyData;
  }
};

const App = () => {
  const [timeframe, setTimeframe] = useState('daily');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(filterDataByTimeframe(data, timeframe));
  }, [timeframe]);

  const handleClick = (e) => {
    if (e && e.activeLabel) {
      const clickedData = data.find((d) => d.timestamp === e.activeLabel);
      alert(`Clicked data point: ${JSON.stringify(clickedData)}`);
    }
  };

  return (
    <div className="App">
      <TimeframeSelector onSelect={setTimeframe} />
      <div className="chart-container">
        <Chart data={filteredData} onClick={handleClick} />
      </div>
    </div>
  );
};

export default App;
