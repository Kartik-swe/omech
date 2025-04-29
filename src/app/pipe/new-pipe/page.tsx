"use client";
import { useState } from "react";
import { Table, Button, Card } from "antd";
import PipeProductionForm from "../../components/pipe/PipeProductionForm";

const SlittedCoilsPage = () => {
  const [visible, setVisible] = useState(false);
  const [selectedCoil, setSelectedCoil] = useState(null);

  // Sample Data (Replace with API data)
  const coilsData = [
    { key: 1, name: "Coil A", width: 500, weight: 1200 },
    { key: 2, name: "Coil B", width: 450, weight: 1000 },
    { key: 3, name: "Coil C", width: 550, weight: 1300 },
  ];

  // Function to Open Modal with Selected Coil Data
  const handleMoveToProduction = (coil: any) => {
    setSelectedCoil(coil);
    setVisible(true);
  };

  // Table Columns
  const columns = [
    { title: "Coil Name", dataIndex: "name", key: "name" },
    { title: "Width (mm)", dataIndex: "width", key: "width" },
    { title: "Weight (kg)", dataIndex: "weight", key: "weight" },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Button type="primary" onClick={() => handleMoveToProduction(record)}>
          Move to Production
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card title="Slitted Coils List" bordered={false}>
        <Table columns={columns} dataSource={coilsData} pagination={false} />
      </Card>

      {/* Pipe Production Modal */}
      <PipeProductionForm visible={visible} onClose={() => setVisible(false)} coil={selectedCoil} />
    </div>
  );
};

export default SlittedCoilsPage;
