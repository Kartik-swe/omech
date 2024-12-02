'use client'
// src/inventory/components/AddEditInventoryModal.tsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';

interface AddEditInventoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (itemData: any) => void;
  editingItem: any;
}

const AddEditInventoryModal: React.FC<AddEditInventoryModalProps> = ({
  visible,
  onClose,
  onSave,
  editingItem,
}) => {
  const [form] = Form.useForm();

  // Populate form if editing
  useEffect(() => {
    if (editingItem) {
      form.setFieldsValue(editingItem);
    } else {
      form.resetFields();
    }
  }, [editingItem, form]);

  // Handle form submission
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSave(values);
    });
  };

  return (
    <Modal
      open={visible}
      title={editingItem ? 'Edit Inventory' : 'Add Inventory'}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {editingItem ? 'Update' : 'Add'}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="grade" label="Grade" rules={[{ required: true }]}>
          <Input placeholder="Enter grade" />
        </Form.Item>
        <Form.Item name="outerDiameter" label="Outer Diameter" rules={[{ required: true }]}>
          <Input placeholder="Enter outer diameter" />
        </Form.Item>
        <Form.Item name="thickness" label="Thickness" rules={[{ required: true }]}>
          <Input placeholder="Enter thickness" />
        </Form.Item>
        <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
          <Input type="number" placeholder="Enter quantity" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEditInventoryModal;
