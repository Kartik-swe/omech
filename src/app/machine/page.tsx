'use client';
import React, { useState } from "react";
import { Table } from "antd";

const generateData = (level = 1, parentKey = "") => {
  const data: any[] = [];
  for (let i = 1; i <= 6; i++) {
    const key = `${parentKey}${i}`;
    data.push({
      key,
      name: `Node ${key}`,
      age: 30 + i,
      address: `Address ${key}`,
      children: level < 6 ? generateData(level + 1, `${key}-`) : undefined, // Recursive children
    });
  }
  return data;
};

const ExpandableTable = () => {
  const [data] = useState(generateData());

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Address", dataIndex: "address", key: "address" },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      expandable={{ defaultExpandAllRows: false }}
      pagination={false}
    />
  );
};

export default ExpandableTable;
