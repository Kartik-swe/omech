// /pages/inventory-stock-management/index.tsx
"use client"
import { useState } from "react";
import { Table, Button, Form, Input, Tabs } from "antd";

const InventoryStockManagement = () => {
  const { TabPane } = Tabs;
  const [stockLevels, setStockLevels] = useState<{ pipe_size: string, quantity : string }[]>([]);
  const [newPipeSize, setNewPipeSize] = useState("");
  const [newQuantity, setNewQuantity] = useState("");

  const handleAddStockLevel = () => {
    setStockLevels([...stockLevels, { pipe_size: newPipeSize, quantity: newQuantity }]);
    setNewPipeSize(""); // Clear input
    setNewQuantity(""); // Clear input
  };

  return (
    <div>
      <h1>Inventory & Stock Management</h1>
      <Tabs defaultActiveKey="1">
        {/* Tab for Stock Levels */}
        <TabPane tab="Stock Levels" key="1">
          <Form layout="inline">
            <Form.Item>
              <Input
                placeholder="Pipe Size"
                value={newPipeSize}
                onChange={(e) => setNewPipeSize(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Input
                placeholder="Quantity"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button onClick={handleAddStockLevel} type="primary">
                Add Stock Level
              </Button>
            </Form.Item>
          </Form>

          <Table
            columns={[{ title: 'Pipe Size', dataIndex: 'pipe_size' }, { title: 'Quantity', dataIndex: 'quantity' }]}
            dataSource={stockLevels}
            rowKey="pipe_size"
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default InventoryStockManagement;
