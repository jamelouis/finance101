import "./App.css";
import { Octokit } from "octokit";
import { useEffect, useState } from "react";
import ReactEChart from "echarts-for-react";
import { mockData } from './data.js'
import DatePickerComponent from "./DatePicker";
import { owner, repo, token } from "./config";
import TransactionComponent from "./Transaction";
import { Watermark } from 'antd';
import { Alert } from 'antd';

function b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}


function App() {
  console.log(mockData);
  const [data, setData] = useState(mockData);
  const [dataPath, setDataPath] = useState({});
  useEffect(() => {
    if(dataPath['path']===undefined) return;
    const octokit = new Octokit({
      auth: token ,
    });

    octokit
      .request("Get /repos/{owner}/{repo}/contents/{path}", {
        owner: owner,
        repo: repo,
        path: dataPath['path'],
        headers: {
          Accept: "application/vnd.github+jso",
          "X-Github-Api-Version": "2022-11-28",
        },
      })
      .then((data2) => {
        const newData = b64_to_utf8(data2.data.content);
        const newDataJson = JSON.parse(newData);
        setData(newDataJson);
        console.log(newDataJson);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dataPath]);
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
console.log(dataPath);
  const option = {
    title: {
      text: dataPath['date'] === undefined ? "mockData" : dataPath['date'],
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
        <DatePickerComponent onDataPathChange={(dataPath)=>setDataPath(dataPath)}/>
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
