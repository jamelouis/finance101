import { Table, Typography } from "antd";
import { useState, useEffect } from "react";
import { owner, repo } from "./config";

const { Text } = Typography;

function unique(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

export default function TransactionComponent() {
  const [data, setData] = useState({
    dateFilters: [],
    nameFilters: [],
    transactions: [],
  });

  useEffect(() => {
    /*
        const octokit = new Octokit({
        auth: token ,
        });

        octokit
        .request("Get /repos/{owner}/{repo}/contents/{path}", {
            owner: owner,
            repo: repo,
            path: 'data/transactions.json',
            headers: {
            Accept: "application/vnd.github+jso",
            "X-Github-Api-Version": "2022-11-28",
            },
        })
        */
    const path = "data/transactions.json";
    fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`)
      .then((res) => res.json())
      .then((data2) => {
        const transactions = data2["data"];
        const dateFilters = unique(
          transactions.map((t) => {
            return t.date.substring(0, 4);
          })
        )
          .sort()
          .map((t) => {
            return { text: t, value: t };
          });
        const nameFilters = unique(transactions.map((t) => t.name))
          .sort()
          .map((n) => {
            return { text: n, value: n };
          });
        setData({
          dateFilters,
          nameFilters,
          transactions,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      filters: data.dateFilters,
      render: (date) => date.substring(0, 10),
      onFilter: (value, record) => record.date.substring(0, 4) === value,
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        {
          text: "BUY",
          value: "BUY",
        },
        {
          text: "SELL",
          value: "SELL",
        },
        {
          text: "DIVIDEN",
          value: "DIVIDEN",
        },
      ],
      onFilter: (value, record) => record.type.indexOf(value) === 0,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      filters: data.nameFilters,
      onFilter: (value, record) => record.name === value,
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      responsive: ["md"],
      render: (v) => (+v).toFixed(2),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      responsive: ["md"],
      render: (v) => (+v).toFixed(2),
    },
    {
      title: "Fee",
      dataIndex: "fee",
      key: "fee",
      responsive: ["md"],
      render: (v) => (+v).toFixed(2),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (v) => (+v).toFixed(2),
    },
  ];
  return (
    <>
      <Table
        columns={columns}
        dataSource={data.transactions}
        pagination={false}
        size="middle"
        summary={(pageData) => {
            let count = pageData.length;
            let totalQuantity = 0;
            let totalFee = 0;
            let totalValue = 0;
            pageData.forEach( ({ quantity, fee, value}) => {
                totalQuantity += quantity;
                totalFee += fee;
                totalValue += value;
            });
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>交易次数({count})</Table.Summary.Cell>
                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                <Table.Summary.Cell index={2}></Table.Summary.Cell>
                <Table.Summary.Cell index={3}>{(totalValue / totalQuantity).toFixed(2)}</Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  <Text>{totalQuantity.toFixed(2)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                  <Text>{totalFee.toFixed(2)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6}>
                  <Text>{totalValue.toFixed(2)}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </>
  );
}
