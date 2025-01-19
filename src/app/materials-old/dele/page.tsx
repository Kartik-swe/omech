"use client";
import React, { useState, useEffect } from 'react';
import {
  Table,
  Modal,
  Form,
  InputNumber,
  Button,
  Select,
  Space,
  DatePicker,
  Spin,
  notification,
  Row,
  Col,
} from 'antd';
import { PlusOutlined, ScissorOutlined } from '@ant-design/icons';

const RawMaterialDashboard = () => {
  const [rawMaterials, setRawMaterials] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Simulate API call to fetch raw materials .....
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Mock data fetch
        const data = [
          { id: 1, vendor: 'Vendor A', date: '2025-01-01', width: 500, weight: 1000 },
          { id: 2, vendor: 'Vendor B', date: '2025-01-02', width: 600, weight: 1200 },
        ];
        setRawMaterials(data);
      } catch (error) {
        notification.error({ message: 'Failed to load raw materials' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSlitMaterial = async (values:any) => {
    try {
      setLoading(true);
      const newMaterial = {
        id: rawMaterials.length + 1,
        vendor: values.vendor,
        date: values.date.format('YYYY-MM-DD'),
        width: values.width,
        weight: values.weight,
      };

      setRawMaterials((prev:any) => [...prev, newMaterial]);
      notification.success({ message: 'Material slit successfully!' });
      form.resetFields();
      setModalVisible(false);
    } catch (error) {
      notification.error({ message: 'Failed to slit material' });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Vendor',
      dataIndex: 'vendor',
      key: 'vendor',
    },
    // {
    //   title: 'Date',
    //   dataIndex: 'date1',
    //   key: 'date',
    // },
    {
      title: 'Width (mm)',
      dataIndex: 'width',
      key: 'width',
    },
    {
      title: 'Weight (kg)',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_:any, record:any) => (
        <Button
          icon={<ScissorOutlined />}
          onClick={() => {
            setModalVisible(true);
            form.setFieldsValue(record);
          }}
        >
          Slit
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
        <h2>Raw Material Dashboard</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Add Material
        </Button>
      </Row>

      {loading ? (
        <Spin tip="Loading Raw Materials...">
          <div style={{ height: 300 }} />
        </Spin>
      ) : (
        <Table dataSource={rawMaterials} columns={columns} rowKey="id" />
      )}

      <Modal
        title={<span style={{ fontWeight: 600 }}>Slit Material</span>}
        visible={modalVisible}
        onCancel={() => {
          form.resetFields();
          setModalVisible(false);
        }}
        footer={null}
        bodyStyle={{ padding: '20px' }}
        centered
      >
        <Form layout="vertical" form={form} onFinish={handleSlitMaterial}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="vendor"
                label="Vendor"
                rules={[{ required: true, message: 'Please select a vendor' }]}
              >
                <Select
                  placeholder="Select Vendor"
                  options={[
                    { label: 'Vendor A', value: 'Vendor A' },
                    { label: 'Vendor B', value: 'Vendor B' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              {/* <Form.Item
                name="date"
                label="Date"
                rules={[{ required: true, message: 'Please select a date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item> */}
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="width"
                label="Slit Width (mm)"
                rules={[{ required: true, message: 'Please enter width' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="weight"
                label="Slit Weight (kg)"
                rules={[{ required: true, message: 'Please enter weight' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end">
            <Space>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Slit
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default RawMaterialDashboard;
