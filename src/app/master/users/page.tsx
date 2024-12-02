// /pages/system-user-management/index.tsx
"use client"
import { useState } from "react";
import { Table, Button, Form, Input, Tabs } from "antd";

const SystemUserManagement = () => {
  const { TabPane } = Tabs;
  const [users, setUsers] = useState<{ name: string, role : string }[]>([]);
  const [newUserName, setNewUserName] = useState("");
  const [newUserRole, setNewUserRole] = useState("");

  const handleAddUser = () => {
    setUsers([...users, { name: newUserName, role: newUserRole }]);
    setNewUserName(""); // Clear input
    setNewUserRole(""); // Clear input
  };

  const Tbl_Users = [
    {first_name : "Karan" , last_name : "Jadhav" ,user_name : "karJad001",user_type : "Admin" , status : "Active" },
    {first_name : "Karan" , last_name : "Jadhav" ,user_name : "karJad002",user_type : "Staff" , status : "Active" },
    {first_name : "Karan" , last_name : "Jadhav" ,user_name : "karJad003",user_type : "Staff" , status : "Active" },
  ]

  const Col_Tbl_Users = [
    { title: 'First Name', dataIndex: 'first_name' },
    { title: 'Last Name', dataIndex: 'last_name' },
    { title: 'User Name', dataIndex: 'user_name' },
    { title: 'Role', dataIndex: 'user_type' },
    { title: 'Status', dataIndex: 'status' },
  ]

  return (
    <div>
      <h1>System & User Management</h1>
      <Tabs defaultActiveKey="1">
        {/* Tab for Users */}
        <TabPane tab="Users" key="1">
          <Form layout="inline">
            <Form.Item>
              <Input
                placeholder="User Name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Input
                placeholder="Role"
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button onClick={handleAddUser} type="primary">
                Add User
              </Button>
            </Form.Item>
          </Form>

          <Table
            columns={Col_Tbl_Users}
            dataSource={Tbl_Users}
            rowKey="name"
            className="mt-3"
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SystemUserManagement;
