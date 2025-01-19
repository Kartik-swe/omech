"use client"
import React from 'react';
import { Table } from 'antd';

// Function to transform flat data to a nested structure
function transformToNestedData(flatData:any) {
  const dataMap: { [key: string]: any } = {};
  const nestedData: any[] = [];

  // Map data by SLITTING_SRNO
  flatData.forEach((item:any) => {
    dataMap[item.SLITTING_SRNO] = { ...item, children: [] };
  });

  // Build hierarchy using SLITTING_SRNO_FK
  flatData.forEach((item:any) => {
    if (item.SLITTING_SRNO_FK) {
      dataMap[item.SLITTING_SRNO_FK].children.push(dataMap[item.SLITTING_SRNO]);
    } else {
      nestedData.push(dataMap[item.SLITTING_SRNO]);
    }
  });

  return nestedData;
}

// Recursive component for rendering nested table
interface DataRecord {
  DC_NO: string;
  SLITTING_DATE: string;
  SLITTING_WIDTH: string;
  SLITTING_SRNO: string;
  children?: DataRecord[];
}

const RecursiveNestedTable: React.FC<{ data: DataRecord[], level?: number }> = ({ data, level = 1 }) => {
  const columns = [
    { title: 'DC No', dataIndex: 'DC_NO', key: 'DC_NO' },
    { title: 'Slitting Date', dataIndex: 'SLITTING_DATE', key: 'SLITTING_DATE' },
    { title: 'Slitting Width', dataIndex: 'SLITTING_WIDTH', key: 'SLITTING_WIDTH' },
    { title: 'Level', dataIndex: 'LEVEL', key: 'LEVEL' },
  ];

  // Row style customization based on the level
const rowStyle = (level: number) => ({
    border: '1px solid #ccc',
    padding: '10px',
    backgroundColor: level === 1 ? '#f7f7f7' : level === 2 ? '#eaf3f3' : level === 3 ? '#e8f0f1' : '#f0f5f5',
  });

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="SLITTING_SRNO"
      style={rowStyle(level)}  // Apply row style based on the level
      expandable={{
        expandedRowRender: (record: DataRecord) =>
          record.children && record.children.length > 0 ? (
            <RecursiveNestedTable data={record.children} level={level + 1} />
          ) : null,
      }}
      pagination={false}
    />
  );
};

// Sample flat data
const flatData = [
  { SLITTING_SRNO: 1, SLITTING_SRNO_FK: null, LEVEL: 1, DC_NO: 'DC1001', SLITTING_DATE: '2025-01-10', SLITTING_WIDTH: '50mm', SLITTING_WEIGHT: 50.0 },
  { SLITTING_SRNO: 2, SLITTING_SRNO_FK: 1, LEVEL: 2, DC_NO: 'DC1002', SLITTING_DATE: '2025-01-11', SLITTING_WIDTH: '30mm', SLITTING_WEIGHT: 30.0 },
  { SLITTING_SRNO: 3, SLITTING_SRNO_FK: 2, LEVEL: 3, DC_NO: 'DC1003', SLITTING_DATE: '2025-01-12', SLITTING_WIDTH: '20mm', SLITTING_WEIGHT: 20.0 },
  { SLITTING_SRNO: 4, SLITTING_SRNO_FK: 3, LEVEL: 4, DC_NO: 'DC1004', SLITTING_DATE: '2025-01-13', SLITTING_WIDTH: '10mm', SLITTING_WEIGHT: 10.0 },
  { SLITTING_SRNO: 5, SLITTING_SRNO_FK: 4, LEVEL: 5, DC_NO: 'DC1005', SLITTING_DATE: '2025-01-14', SLITTING_WIDTH: '5mm', SLITTING_WEIGHT: 5.0 },
];

// Transform flat data to nested format
const nestedData = transformToNestedData(flatData);


const slitTable = () => {
  return (
    <div>
      <h1>Recursive Nested Table</h1>
      <RecursiveNestedTable data={nestedData} />
    </div>
  );
};

export default slitTable;
