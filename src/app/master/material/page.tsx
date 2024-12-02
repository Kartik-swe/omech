// /pages/product-material-management/index.tsx
"use client"
import { useState } from "react";
import { Table, Button, Form, Input, Tabs } from "antd";

const ProductMaterialManagement = () => {
  const { TabPane } = Tabs;
  const [pipeSizes, setPipeSizes] = useState<{ size: string }[]>([]);
  const [materialGrades, setMaterialGrades] = useState<{ grade: string }[]>([]);
  const [pipeFinishes, setPipeFinishes] = useState<{ finish: string }[]>([]);
  const [newPipeSize, setNewPipeSize] = useState("");
  const [newMaterialGrade, setNewMaterialGrade] = useState("");
  const [newFinish, setNewFinish] = useState("");

  const handleAddPipeSize = () => {
    setPipeSizes([...pipeSizes, { size: newPipeSize }]);
    setNewPipeSize(""); // Clear input
  };

  const handleAddMaterialGrade = () => {
    setMaterialGrades([...materialGrades, { grade: newMaterialGrade }]);
    setNewMaterialGrade(""); // Clear input
  };

  const handleAddFinish = () => {
    setPipeFinishes([...pipeFinishes, { finish: newFinish }]);
    setNewFinish(""); // Clear input
  };

  return (
    <div>
      <h1>Product & Material Management</h1>
      <Tabs defaultActiveKey="1">
        {/* Pipe Sizes Tab */}
        <TabPane tab="Pipe Sizes" key="1">
          <Form layout="inline">
            <Form.Item>
              <Input
                placeholder="Pipe Size"
                value={newPipeSize}
                onChange={(e) => setNewPipeSize(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button onClick={handleAddPipeSize} type="primary">
                Add Pipe Size
              </Button>
            </Form.Item>
          </Form>

          <Table
            columns={[{ title: 'Size', dataIndex: 'size' }]}
            dataSource={pipeSizes}
            rowKey="size"
          />
        </TabPane>

        {/* Material Grades Tab */}
        <TabPane tab="Material Grades" key="2">
          <Form layout="inline">
            <Form.Item>
              <Input
                placeholder="Material Grade"
                value={newMaterialGrade}
                onChange={(e) => setNewMaterialGrade(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button onClick={handleAddMaterialGrade} type="primary">
                Add Material Grade
              </Button>
            </Form.Item>
          </Form>

          <Table
            columns={[{ title: 'Material Grade', dataIndex: 'grade' }]}
            dataSource={materialGrades}
            rowKey="grade"
          />
        </TabPane>

        {/* Pipe Finishes Tab */}
        {/* <TabPane tab="Finishes" key="3">
          <Form layout="inline">
            <Form.Item>
              <Input
                placeholder="Finish Type"
                value={newFinish}
                onChange={(e) => setNewFinish(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button onClick={handleAddFinish} type="primary">
                Add Finish Type
              </Button>
            </Form.Item>
          </Form>

          <Table
            columns={[{ title: 'Finish', dataIndex: 'finish' }]}
            dataSource={pipeFinishes}
            rowKey="finish"
          />
        </TabPane> */}
      </Tabs>
    </div>
  );
};

export default ProductMaterialManagement;
