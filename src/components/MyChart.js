import React from 'react';
import {useState, useEffect} from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

const currency = new Intl.NumberFormat("us-US", { style: "currency", currency: "USD", useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 });

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const data = {
    startDate:"",
    balance:[],
    principal:[],
    interest:[], 
    timeLabels:[], 
    loanLabels:[],
};

export function renderChart(startDate, balance, principal, interest, timeLabels, loanLabels) {
    data.startDate=startDate;
    data.balance=balance.map((item)=>{return item;});
    data.principal=principal.map((item)=>{return item;});
    data.interest=interest.map((item)=>{return item;}); 
    data.timeLabels=timeLabels.map((item)=>{return item;}); 
    data.loanLabels=loanLabels.map((item)=>{return item;});
    // console.log(balance, principal, interest);
};

const ChartComponent = () => {
  const [chartData, setChartData] = useState({
    startDate:"",
    balance:[],
    principal:[],
    interest:[], 
    timeLabels:[], 
    loanLabels:[],
});
function monthYear(nbr) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let dt = new Date(chartData.startDate);
  dt.setMonth(dt.getMonth() + nbr);
  const pmonth = months[dt.getMonth()];
  const pyear = dt.getFullYear();
  return pmonth + " " + pyear;
}
const appData  = {
  //    labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
  labels: chartData.timeLabels,
  datasets: [
    {
      //   data: [86,114,106,106,107,111,133,221,783,2478],
      data: chartData.balance,
      label: "Balance",
      borderColor: "#3e95cd",
      borderWidth: 4,
      fill: false,
      pointBorderWidth: 0,
      pointHoverRadius: 4,
      pointHoverBorderWidth: 4,
      pointRadius: 0,
      pointHitRadius: 0,
    },
    {
      //   data: [282,350,411,502,635,809,947,1402,3700,5267],
      data: chartData.principal,
      label: "Principal",
      borderColor: "#8e5ea2",
      borderWidth: 4,
      pointBorderWidth: 0,
      pointHoverRadius: 4,
      pointHoverBorderWidth: 4,
      pointRadius: 0,
      pointHitRadius: 0,
      fill: false,
    },
    {
      //   data: [168,170,178,190,203,276,408,547,675,734],
      data: chartData.interest,
      label: "Interest",
      borderColor: "#3cba9f",
      borderWidth: 4,
      pointBorderWidth: 0,
      pointHoverRadius: 4,
      pointHoverBorderWidth: 4,
      pointRadius: 0,
      pointHitRadius: 0,
      fill: false,
    },
  ],
};

const options = {
  responsive: true,
  title: {
    display: true,
    text: "Amortization Schedule",
  },
  scales: {
    y: {
      ticks: {
        min: 0,
        max: 10000000,
        stepSize: 10000,
        // Include a dollar sign in the ticks
        callback: function (value, index, ticks) {
          return "$" + value;
        },
        font: {
          size: 9,
        },
      },
    },
  },
  interaction: {
    mode: "index",
  },
  tooltips: {
    mode: "index",
    intersect: false,
  },
  hover: {
    mode: "index",
    intersect: false,
  },
  onHover: (event, active, chart) => {
    if (active.length) {
      let first = active[0];
      let index = first.index;
      let hoverBalance = chart.data.datasets[0].data[index];
      let hoverPrincipal = chart.data.datasets[1].data[index];
      let hoverInterest = chart.data.datasets[2].data[index];
      document.getElementById("line-date").textContent = monthYear(index);
      document.getElementById("line-balance").textContent = currency.format(hoverBalance);
      document.getElementById("line-principal").textContent = currency.format(hoverPrincipal);
      document.getElementById("line-interest").textContent = currency.format(hoverInterest);
      // console.log(chart.data.datasets);
    }
  },
};

const plugins = {
  datalabels: {
    anchor: "end",
    align: "end",
    backgroundColor: null,
    borderColor: null,
    borderRadius: 4,
    borderWidth: 1,
    color: "#223388",
    font: function (context) {
      var width = context.chart.width;
      var size = Math.round(width / 60);
      return {
        size: size,
        weight: 600,
      };
    },
    offset: 4,
    padding: 0,
    formatter: function (value) {
      return Math.round(value * 10) / 10;
    },
    tooltip: {
      enabled: false, // <-- this option disables tooltips
    },
  },
};

  const chart = () => {
      setChartData(chartData => {
        // console.log(data);
            return {
            ...chartData, ...data
            }
      });
    };

    useEffect(() => {
      chart();
    },[]);

    return (
      <div>
        <Line data={appData} options={options} plugins={plugins}/>
      </div>
    );
};

export default ChartComponent;
