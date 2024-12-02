'use client'
// src/inventory/components/InventoryTable.tsx
import React, { useState } from 'react';
import { Table, Button, Popconfirm, Space } from 'antd';

interface InventoryItem {
  id: number;
  grade: string;
  outerDiameter: string;
  thickness: string;
  quantity: number;
}

interface InventoryTableProps {
  onEdit: (item: InventoryItem) => void;
  onDelete: () => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ onEdit, onDelete }) => {
  // Dummy Data for the table
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([
    { id: 1, grade: 'Grade A', outerDiameter: '50mm', thickness: '1mm', quantity: 100 },
    { id: 2, grade: 'Grade B', outerDiameter: '75mm', thickness: '2mm', quantity: 150 },
    { id: 3, grade: 'Grade C', outerDiameter: '100mm', thickness: '3mm', quantity: 200 },
  ]);

  // Handle item deletion
  const handleDelete = (id: number) => {
    const filteredData = inventoryData.filter(item => item.id !== id);
    setInventoryData(filteredData);
    onDelete(); // Placeholder for handling state refresh
  };

  // Define table columns
  const columns = [
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
    },
    {
      title: 'Outer Diameter',
      dataIndex: 'outerDiameter',
      key: 'outerDiameter',
    },
    {
      title: 'Thickness',
      dataIndex: 'thickness',
      key: 'thickness',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: InventoryItem) => (
        <Space>
          <Button type="link" onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this item?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={inventoryData}
      rowKey={(record) => record.id.toString()}
    />
  );
};

export default InventoryTable;
