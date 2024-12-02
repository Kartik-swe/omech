// /pages/machine-production-management/index.tsx
"use client"
import { useState } from "react";
import { Table, Button, Form, Input, Tabs } from "antd";

const MachineProductionManagement = () => {
  const { TabPane } = Tabs;
  const [machines, setMachines] = useState<{ name: string }[]>([]);
  const [productionRuns, setProductionRuns] = useState<{ run_id: string }[]>([]);
  const [newMachineName, setNewMachineName] = useState("");
  const [newProductionRunId, setNewProductionRunId] = useState("");

  const handleAddMachine = () => {
    setMachines([...machines, { name: newMachineName }]);
    setNewMachineName(""); // Clear input
  };

  const handleAddProductionRun = () => {
    setProductionRuns([...productionRuns, { run_id: newProductionRunId }]);
    setNewProductionRunId(""); // Clear input
  };

  const Tbl_Machines = [
    {machine_name : "TUBE 01",machine_type : "Pipe Production" , status : "Active" , capacity : 23},
    {machine_name : "TUBE 02",machine_type : "Pipe Production" , status : "Active" , capacity : 23},
    {machine_name : "TUBE 03",machine_type : "Pipe Production" , status : "Active" , capacity : 23},
    {machine_name : "TUBE 04",machine_type : "Pipe Production" , status : "Active" , capacity : 23},
    {machine_name : "LASER 01",machine_type : "Cutting" , status : "Active" , capacity : 23},
    {machine_name : "LASER 02",machine_type : "Cutting" , status : "Active" , capacity : 23},
  ]

  const Col_Tbl_Machines = [
    { title: 'Machine Name', dataIndex: 'machine_name' },
    { title: 'Machine Type', dataIndex: 'machine_type' },
    { title: 'Machine Type', dataIndex: 'status' },
    { title: 'Machine Type', dataIndex: 'capacity' }
  ]

  return (
    <div>
      <h1>Machine & Production Management</h1>
      <Tabs defaultActiveKey="1">
        {/* Tab for Machines */}
        <TabPane tab="Machines" key="1">
          <Form layout="inline">
            <Form.Item>
              <Input
                placeholder="Machine Name"
                value={newMachineName}
                onChange={(e) => setNewMachineName(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Input
                placeholder="Machine Type"
                value={newMachineName}
                onChange={(e) => setNewMachineName(e.target.value)}
              />
            </Form.Item>
            
            <Form.Item>
              <Button onClick={handleAddMachine} type="primary">
                Add Machine
              </Button>
            </Form.Item>
          </Form>

          <Table
            columns={Col_Tbl_Machines}
            dataSource={Tbl_Machines}
            rowKey="name"
            className="mt-3"
          />
        </TabPane>

        {/* Tab for Production Runs */}
        <TabPane tab="Production Runs" key="2">
          <Form layout="inline">
            <Form.Item>
              <Input
                placeholder="Production Run ID"
                value={newProductionRunId}
                onChange={(e) => setNewProductionRunId(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button onClick={handleAddProductionRun} type="primary">
                Add Production Run
              </Button>
            </Form.Item>
          </Form>

          <Table
            columns={[{ title: 'Run ID', dataIndex: 'run_id' }]}
            dataSource={productionRuns}
            rowKey="run_id"
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default MachineProductionManagement;
