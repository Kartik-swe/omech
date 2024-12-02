'use client'
// src/inventory/InventoryPage.tsx
import React, { useState } from 'react';
import { Button, Row, Col, Card } from 'antd';
import InventoryFilters from '../components/InventoryFilters';
import InventoryTable from '../components/InventoryTable';
import AddEditInventoryModal from '../components/AddEditInventoryModal';
import StockAlerts from '../components/StockAlerts';

interface InventoryItem {
  id: number;
  grade: string;
  outerDiameter: string;
  thickness: string;
  quantity: number;
}

const InventoryPage: React.FC = () => {
  // Dummy Inventory Data
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, grade: 'Grade A', outerDiameter: '50mm', thickness: '1mm', quantity: 100 },
    { id: 2, grade: 'Grade B', outerDiameter: '75mm', thickness: '2mm', quantity: 150 },
    { id: 3, grade: 'Grade C', outerDiameter: '100mm', thickness: '3mm', quantity: 200 },
  ]);

  // Dummy Low Stock Data
  const [stockAlerts] = useState<InventoryItem[]>([
    { id: 1, grade: 'Grade A', outerDiameter: '50mm', thickness: '1mm', quantity: 5 },
    { id: 2, grade: 'Grade B', outerDiameter: '75mm', thickness: '2mm', quantity: 10 },
  ]);

  // State for filter values and modal visibility
  const [filters, setFilters] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Function to handle filter changes
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // You can implement filtering logic here with the dummy data
  };

  // Function to handle inventory item edit
  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setIsModalVisible(true);
  };

  // Function to handle inventory item save (Add/Update)
  const handleSaveItem = (itemData: any) => {
    if (editingItem) {
      // Update logic with dummy data
      setInventory(prev =>
        prev.map(item => (item.id === editingItem.id ? { ...item, ...itemData } : item))
      );
    } else {
      // Add logic with dummy data
      const newId = inventory.length ? Math.max(...inventory.map(i => i.id)) + 1 : 1;
      setInventory(prev => [...prev, { id: newId, ...itemData }]);
    }

    // Reset modal state
    setEditingItem(null);
    setIsModalVisible(false);
  };

  // Function to handle deletion
  const handleDeleteItem = () => {
    // Update your deletion logic here with dummy data
  };

  // Function to reset the modal state
  const closeModal = () => {
    setEditingItem(null);
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={24}>
        {/* Filters */}
        <Col span={6}>
          <Card title="Filters">
            <InventoryFilters onFilterChange={handleFilterChange} />
          </Card>
        </Col>

        {/* Inventory Table */}
        <Col span={12}>
          <Card
            title="Inventory List"
            extra={
              <Button type="primary" onClick={() => setIsModalVisible(true)}>
                Add Inventory
              </Button>
            }
          >
            <InventoryTable onEdit={handleEditItem} onDelete={handleDeleteItem} />
          </Card>
        </Col>

        {/* Low Stock Alerts */}
        <Col span={6}>
          <Card title="Stock Alerts">
            <StockAlerts stockAlerts={stockAlerts} />
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Inventory Modal */}
      <AddEditInventoryModal
        visible={isModalVisible}
        onClose={closeModal}
        onSave={handleSaveItem}
        editingItem={editingItem}
      />
    </div>
  );
};

export default InventoryPage;
