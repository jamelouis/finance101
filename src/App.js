import "./App.css";
import { useEffect, useState } from "react";
import ReactEChart from "echarts-for-react";
import { mockData } from './data.js'
import DatePickerComponent from "./DatePicker";
import { owner, repo } from "./config";
import TransactionComponent from "./Transaction";
import { Watermark } from 'antd';
import { Alert } from 'antd';


function App() {
  const [data, setData] = useState(mockData);
  const [date, setDate] = useState('');
  useEffect(() => {
    if(date==='' || date === undefined) return;

    const path = `data/portfolios/${date}.json`;
    fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`)
    .then(res=>res.json())
      .then((data2) => {
        setData(data2);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [date]);
  const labelOption = {
    show: true,
    formatter: function(value) {
        return value.name + " " + Math.floor(value.value*100)/10 + "%";
    },
    fontSize: 10,
    rich: {
        name: {}
    }
};
  const option = {
    title: {
      text: date, 
      right: '0',
      bottom: '0',
    },
    tooltip: {},
    legend: {},
    label: labelOption,
    series: [
      {
        type: "sunburst",
        data: data,
        radius: [0, "90%"],
        sort: undefined,
        emphasis: {
          focus: "ancestor",
        },
        levels: [
          {
            r1: "10%",
          },
          {
            r0: "12%",
            r: "35%",
            itemStyle: {
              borderWidth: 2,
            },
            label: {
              align: "right",
            },
          },
          {
            r0: "35%",
            r: "60%",
            label: {
              align: "right",
            },
          },
          {
            r0: "60%",
            r: "85%",
            label: {
              align: "right",
            },
          },
          {
            r0: "85%",
            r: "88%",
            label: {
              position: "outside",
              formatter: "{b}%",
            },
          },
        ],
      },
    ],
  };

  return (
    <div>
    <h1 class='center'>ETF150📝</h1>

    <div class='container'>
      <Alert message="个人记录，非投资建议" type="error" />
      <div class='portfolio'>
        <Watermark content={owner}>
        <DatePickerComponent onDataPathChange={(newDate)=>setDate(newDate)}/>
        <ReactEChart option={option} style={{height: '640px'}}/>
          </Watermark> 
      </div>
      <div class='transaction'>
        <TransactionComponent />
      </div>
      </div>
    </div>
  );
}

export default App;
