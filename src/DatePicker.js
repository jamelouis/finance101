import { DatePicker } from "antd";
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { Octokit } from "octokit";
import './App.css'


import { owner, repo, token, portfolioPath } from "./config";

export default function DatePickerComponent( {onDataPathChange} ) {
    const [validDates, setvalidDates] = useState([]);
  useEffect(() => {
    const octokit = new Octokit({
      auth: token ,
    });

    octokit
      .request("Get /repos/{owner}/{repo}/contents/{path}", {
        owner: owner,
        repo: repo,
        path: portfolioPath,
        headers: {
          Accept: "application/vnd.github+jso",
          "X-Github-Api-Version": "2022-11-28",
        },
      })
      .then((data2) => {
        console.log(data2.data);
        const recordDates = data2.data.map((item)=> 
            {
                return {
                    date: dayjs(item.name.substring(0,10), 'YYYY-MM-DD').format('YYYY-MM-DD'), 
                    path: item.path
                };
            });
        setvalidDates(recordDates);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [onDataPathChange]);

    const disabledDate = (current) => {
        const day = current.format('YYYY-MM-DD');
        const found = validDates.find((item)=> item.date === day) === undefined;
        return found;
    };

    const onChange = (date) => {
        if(date === null) return;
        const day = date.format('YYYY-MM-DD');
        const found = validDates.find((item)=> item.date === day);
        console.log(found);
        onDataPathChange(found);
    }
    return (
        <div class='picker'>
            <DatePicker disabledDate={disabledDate} onChange={onChange}/>
        </div>
    )
}