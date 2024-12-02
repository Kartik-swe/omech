'use client';
import React from 'react';
import { Table, Button } from 'antd';
// import { CSVLink } from 'react-csv';

const ReportsPage: React.FC = () => {
  const columns = [
    { title: 'Machine', dataIndex: 'machine', key: 'machine' },
    { title: 'Staff', dataIndex: 'staff', key: 'staff' },
    { title: 'Shift', dataIndex: 'shift', key: 'shift' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    { title: 'OD', dataIndex: 'od', key: 'od' },
    { title: 'Thickness', dataIndex: 'thickness', key: 'thickness' },
    { title: 'Grade', dataIndex: 'grade', key: 'grade' },
  ];

  const data = [
    {
      key: '1',
      machine: 'Tube Machine #1',
      staff: 'Staff 1',
      shift: 'Morning',
      date: '2024-11-19',
      quantity: 200,
      od: '50mm',
      thickness: '3mm',
      grade: 'SS304',
    },
    // More rows as required
  ];

  return (
    <div>
      <h2>Reports</h2>
      <Table columns={columns} dataSource={data} />
      {/* <CSVLink data={data} filename="production_reports.csv"> */}
        <Button type="primary" style={{ marginTop: 16 }}>
          Export as CSV
        </Button>
      {/* </CSVLink> */}
    </div>
  );
};

export default ReportsPage;
