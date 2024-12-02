'use client'
// src/inventory/components/StockAlerts.tsx
import React from 'react';
import { List, Alert } from 'antd';

interface StockAlertsProps {
  stockAlerts: any[];
}

const StockAlerts: React.FC<StockAlertsProps> = ({ stockAlerts }) => {
  // Dummy Data for low stock alerts
  const dummyStockAlerts = [
    { grade: 'Grade A', outerDiameter: '50mm', thickness: '1mm', quantity: 5 },
    { grade: 'Grade B', outerDiameter: '75mm', thickness: '2mm', quantity: 10 },
  ];

  return (
    <div style={{ marginTop: 24 }}>
      <Alert message="Low Stock Alerts" type="warning" showIcon />
      <List
        dataSource={dummyStockAlerts}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={`Grade: ${item.grade} | OD: ${item.outerDiameter} | Thickness: ${item.thickness}`}
              description={`Quantity: ${item.quantity}`}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default StockAlerts;
