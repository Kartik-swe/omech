// /pages/system-user-management/page.tsx
"use client"
import { useState, useEffect } from "react";
import { Table, Button, Form, Input, Tabs, Select, Modal } from "antd";
import { apiService } from "../../../../utils-old/apiUtils";
import { ApiResponse } from "../../../../utils-old/common_utils";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const SystemUserManagement = () => {
  const { TabPane } = Tabs;
  const [Tbl_Users, setTbl_Users] = useState([]);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState<any>(null); // To store the user currently being edited
  const [isModalVisible, setIsModalVisible] = useState(false); // To control modal visibility for delete confirmation
  const [userToDelete, setUserToDelete] = useState<any>(null); // To store the user to delete

  useEffect(() => {
    Fn_Dt_User_Master();
  }, []);

  const Col_Tbl_Users = [
    { title: 'User Name', dataIndex: 'USERNAME' },
    { title: 'First Name', dataIndex: 'F_NAME' },
    { title: 'Last Name', dataIndex: 'L_NAME' },
    { title: 'Role', dataIndex: 'ROLE' },
    { title: 'Status', dataIndex: 'STATUS' },
    {
      title: 'Action',
      key: 'action',
      render: (_:any, record:any) => (
        <span>
          {/* Edit Button */}
          <Button 
            onClick={() => handleEdit(record)} 
            icon={<EditOutlined />} 
            style={{ marginRight: 10 }} 
          />
          {/* Delete Button */}
          <Button 
            onClick={() => showDeleteConfirm(record)} 
            icon={<DeleteOutlined />} 
            style={{ color: 'red' }} 
          />
        </span>
      )
    }
  ];

  const Fn_Dt_User_Master = async () => {
    try {
      const response: ApiResponse = await apiService.get('master/user', 'application/json');
      if (response.MsgId === 1 && response.Msg) {
        setTbl_Users(response.Msg);
      } else {
        alert(response.Msg); 
      }
    } catch (err) {
      alert('Failed to submit data.');
    }
  };

  const Fn_Iu_User_Master = async (values: any) => {
    const POSTDATA = {
      "USER_SRNO": values.USER_SRNO || 0,
      "USERNAME": values.USERNAME,
      "F_NAME": values.F_NAME,
      "L_NAME": values.L_NAME,
      "ROLE": values.ROLE,
      "IS_ACTIVE": values.IS_ACTIVE,
      "IU_FLAG": editingUser ? 'U' : 'I', // If editing, use 'U' for update, 'I' for insert
    };

    try {
      const response: ApiResponse = await apiService.post('master/user', 'application/json', POSTDATA);
      if (response.MsgId !== 1) {
        alert(response.Msg); 
      } else {
        alert('Data submitted successfully!');
        Fn_Dt_User_Master(); // Refresh the list after submit
        setEditingUser(null); // Reset editing state
      }
    } catch (err) {
      alert('Failed to submit data.');
    }
  };

  // Handler for Edit
  const handleEdit = (record: any) => {
    setEditingUser(record); // Set the user being edited
    form.setFieldsValue({
      USER_SRNO: record.USER_SRNO,
      USERNAME: record.USERNAME,
      F_NAME: record.F_NAME,
      L_NAME: record.L_NAME,
      ROLE: record.ROLE,
      IS_ACTIVE: record.IS_ACTIVE,
    }); // Populate the form with the user's current data
  };

  // Handler for Delete (Show confirmation modal)
  const showDeleteConfirm = (user: any) => {
    setUserToDelete(user); // Set the user to be deleted
    setIsModalVisible(true); // Show the confirmation modal
  };

  // Handle actual delete operation
  const handleDelete = async () => {
    try {
      // Call the API to delete the user
      const response: ApiResponse = await apiService.post('master/user', 'application/json', {
        USER_SRNO: userToDelete.USER_SRNO,
        IU_FLAG: 'D', // Deletion flag
      });

      if (response.MsgId === 1) {
        alert('User deleted successfully!');
        Fn_Dt_User_Master(); // Refresh the list after deletion
      } else {
        alert(response.Msg); // Show error message
      }
    } catch (err) {
      alert('Failed to delete data.');
    }
    setIsModalVisible(false); // Close the modal after deletion
  };

  // Close the confirmation modal
  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal without performing deletion
  };

  return (
    <div>
      <h1>System & User Management</h1>
      <Tabs defaultActiveKey="1">
        {/* Tab for Users */}
        <TabPane tab="Users" key="1">
          <Form
            form={form}
            onFinish={Fn_Iu_User_Master}
            layout="inline"
          >
            <Form.Item name="USER_SRNO" style={{ display: 'none' }}> {/* Hidden field for user ID */}
              <Input />
            </Form.Item>
            <Form.Item name="USERNAME">
              <Input placeholder="User Name" />
            </Form.Item>
            <Form.Item name="F_NAME">
              <Input placeholder="First Name" />
            </Form.Item>
            <Form.Item name="L_NAME">
              <Input placeholder="Last Name" />
            </Form.Item>
            <Form.Item name="ROLE">
              <Select placeholder="Select Role">
                <Select.Option value={1}>Admin</Select.Option>
                <Select.Option value={2}>Manager</Select.Option>
                <Select.Option value={3}>Operator</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="IS_ACTIVE">
              <Select placeholder="Select Status">
                <Select.Option value={1}>Active</Select.Option>
                <Select.Option value={0}>Inactive</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Update User' : 'Add User'}
              </Button>
            </Form.Item>
          </Form>

          <Table
            columns={Col_Tbl_Users}
            dataSource={Tbl_Users}
            rowKey="USERNAME"
            className="mt-3"
          />
        </TabPane>
      </Tabs>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        visible={isModalVisible}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
        cancelButtonProps={{ danger: true }} // Make cancel button red
      >
        <p>Are you sure you want to delete the user {userToDelete?.USERNAME}?</p>
      </Modal>
    </div>
  );
};

export default SystemUserManagement;
