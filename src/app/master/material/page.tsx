"use client";
import { useState } from "react";
import { Tabs, Card, Button, Input, Form, message, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, SaveOutlined, PlusOutlined } from "@ant-design/icons";

const ProductMaterialManagement = () => {
  const [pipeSizes, setPipeSizes] = useState<{ id: number; value: string }[]>([]);
  const [materialGrades, setMaterialGrades] = useState<{ id: number; value: string }[]>([]);
  const [ODs, setODs] = useState<{ id: number; value: string }[]>([]);
  const [newValue, setNewValue] = useState<string>("");
  const [editingItem, setEditingItem] = useState<{ id: number; value: string } | null>(null);

  const handleAdd = (setter: Function, items: { id: number; value: string }[]) => {
    if (!newValue.trim()) {
      message.error("Input cannot be empty!");
      return;
    }
    setter([...items, { id: Date.now(), value: newValue.trim() }]);
    setNewValue("");
  };

  const handleEdit = (id: number, value: string, setter: Function, items: { id: number; value: string }[]) => {
    setter(items.map((item) => (item.id === id ? { ...item, value } : item)));
    setEditingItem(null);
  };

  const handleDelete = (id: number, setter: Function, items: { id: number; value: string }[]) => {
    setter(items.filter((item) => item.id !== id));
  };

  const renderCards = (
    data: { id: number; value: string }[],
    setter: Function
  ) => {
    return data.map((item) => (
      <Card
        key={item.id}
        style={{ width: 300, margin: "10px" }}
        title={
          editingItem?.id === item.id ? (
            <Input
              value={editingItem.value}
              onChange={(e) =>
                setEditingItem((prev) => (prev ? { ...prev, value: e.target.value } : null))
              }
            />
          ) : (
            item.value
          )
        }
        actions={[
          editingItem?.id === item.id ? (
            <Tooltip title="Save">
              <SaveOutlined
                key="save"
                onClick={() =>
                  handleEdit(editingItem.id, editingItem.value, setter, data)
                }
              />
            </Tooltip>
          ) : (
            <Tooltip title="Edit">
              <EditOutlined
                key="edit"
                onClick={() => setEditingItem({ id: item.id, value: item.value })}
              />
            </Tooltip>
          ),
          <Tooltip title="Delete">
            <DeleteOutlined
              key="delete"
              onClick={() => handleDelete(item.id, setter, data)}
            />
          </Tooltip>,
        ]}
      />
    ));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Product & Material Management</h1>
      <Tabs defaultActiveKey="1">
        {/* Pipe Sizes */}
        <Tabs.TabPane tab="Pipe Sizes" key="1">
          <Form layout="inline" style={{ marginBottom: "20px" }}>
            <Form.Item>
              <Input
                placeholder="Pipe Size"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleAdd(setPipeSizes, pipeSizes)}
              >
                Add
              </Button>
            </Form.Item>
          </Form>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {renderCards(pipeSizes, setPipeSizes)}
          </div>
        </Tabs.TabPane>

        {/* Material Grades */}
        <Tabs.TabPane tab="Material Grades" key="2">
          <Form layout="inline" style={{ marginBottom: "20px" }}>
            <Form.Item>
              <Input
                placeholder="Material Grade"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleAdd(setMaterialGrades, materialGrades)}
              >
                Add
              </Button>
            </Form.Item>
          </Form>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {renderCards(materialGrades, setMaterialGrades)}
          </div>
        </Tabs.TabPane>

        {/* ODs */}
        <Tabs.TabPane tab="OD" key="3">
          <Form layout="inline" style={{ marginBottom: "20px" }}>
            <Form.Item>
              <Input
                placeholder="Outer Diameter (OD)"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleAdd(setODs, ODs)}
              >
                Add
              </Button>
            </Form.Item>
          </Form>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {renderCards(ODs, setODs)}
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default ProductMaterialManagement;
