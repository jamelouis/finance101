import { DatePicker } from "antd";
import { useState, useEffect } from 'react';
import './App.css'


import { owner, repo } from "./config";

export default function DatePickerComponent( {onDataPathChange} ) {
    const [validDates, setvalidDates] = useState([]);
  useEffect(() => {
    const path = 'data/portfolios.json';
    fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`)
    .then(res => res.json())
      .then((data2) => {
        setvalidDates(data2.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [onDataPathChange]);

  console.log(validDates);
    const disabledDate = (current) => {
        const day = current.format('YYYY-MM-DD');
        const found = validDates.includes(day); 
        return !found;
    };

    const onChange = (date) => {
        if(date === null) return;
        const day = date.format('YYYY-MM-DD');
        const found = validDates.find((item)=> item === day);
        onDataPathChange(found);
    }
    return (
        <div class='picker'>
            <DatePicker disabledDate={disabledDate} onChange={onChange}/>
        </div>
    )
}