// src/components/LayoutComponent.tsx
'use client'
import React from 'react';
import { Layout, Menu, Breadcrumb, theme } from 'antd';
import Link from 'next/link';
import {
  DashboardOutlined,
  DatabaseOutlined,
  StockOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  BuildOutlined,
  UsergroupAddOutlined,
  SyncOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content, Footer } = Layout;



const menuItems = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
    subMenu: [
      {
        key: 'Dashboard',
        label: 'Dashboard',
        link: '/dashboard',
      },
      {
        key: 'Raw_Materials',
        label: 'Raw Materials',
        link: '/materials',
      },
      {
        key: 'Raw_Materials12',
        label: 'Raw Materials',
        link: '/materials/dash1',
      },
      {
        key: 'Raw_Materials2',
        label: 'Raw Materials 2',
        link: '/materials/dash2',
      },
      {
        key: 'slitting_process',
        label: 'Slitting Process',
        link: '/materials/dash3',
      },
      {
        key: 'slitting_process2',
        label: 'Slitting History',
        link: '/materials/dash4',
      },
    ]
  },
  {
    key: 'management',
    icon: <DatabaseOutlined />,
    label: 'Management',
    subMenu: [
      
      {
        key: 'inventoryMaster',
        label: 'Inventory Master',
        link: '/inventory-master',
      },
      {
        key: 'inventory',
        label: 'Inventory',
        link: '/inventory',
      },
      {
        key: 'machine',
        label: 'Machine',
        link: '/machine',
      },
      {
        key: 'production1',
        label: 'Production',
        link: '/production',
      },
    ],
  },{
    key: 'management1',
    icon: <DatabaseOutlined />,
    label: 'Management',
    subMenu: [
      {
        key: 'products',
        label: 'Products',
        link: '/products',
      },
      {
        key: 'inventory',
        label: 'Inventory',
        link: '/inventory',
      },
      {
        key: 'inventory1',
        label: 'Inventory 1',
        link: '/inventory1',
      },
      {
        key: 'inventory2',
        label: 'Inventory 2',
        link: '/inventory2',
      },
      {
        key: 'production',
        label: 'Production',
        link: '/production',
      },
    ],
  },
  // {
  //   key: 'orders',
  //   icon: <ShoppingCartOutlined />,
  //   label: 'Orders',
  //   link: '/orders',
  // },
  {
    key: 'resources',
    icon: <BuildOutlined />,
    label: 'Resources',
    subMenu: [
      {
        key: 'materials',
        label: 'Materials',
        link: '/materials',
      },
      {
        key: 'suppliers',
        label: 'Suppliers',
        link: '/suppliers',
      },
    ],
  },
  // {
  //   key: 'transactions',
  //   icon: <SyncOutlined />,
  //   label: 'Transactions',
  //   link: '/transactions',
  // },
  {
    key: 'reports',
    icon: <BarChartOutlined />,
    label: 'Reports',
    link: '/reports',
  },
  {
    key: 'master',
    icon: <DatabaseOutlined />,
    label: 'Master',
    subMenu: [
      {
        key: 'inventory-stock',
        label: 'Inventory Stock',
        link: '/master/inventory-stock',
      },
      {
        key: 'material',
        label: 'Material',
        link: '/master/material',
      },
      {
        key: 'production',
        label: 'Production',
        link: '/master/production',
      },
      {
        key: 'users',
        label: 'Users',
        link: '/master/users',
      },
    ],
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: 'Settings',
    link: '/settings',
  },
];

const LayoutComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div className="demo-logo" style={{ color: 'white', padding: '16px', fontSize: '18px', textAlign: 'center' }}>
          Omech
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['dashboard']}>
  {menuItems.map(item =>
    item.subMenu ? (
      <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
        {item.subMenu.map(subItem => (
          <Menu.Item key={subItem.key}>
            <Link href={subItem.link}>{subItem.label}</Link>
          </Menu.Item>
        ))}
      </Menu.SubMenu>
    ) : (
      <Menu.Item key={item.key} icon={item.icon}>
        <Link href={item.link}>{item.label}</Link>
      </Menu.Item>
    )
  )}
</Menu>
      </Sider>

      <Layout>
        <Header style={{ background: colorBgContainer, padding: 0, display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1, paddingLeft: 24, fontSize: 18 }}>
            {/* Optional: Add your logo here */}
            <span>Inventory management System</span>
          </div>
          {/* Placeholder for User Profile, Notifications, etc. */}
        </Header>

        <Content style={{ padding: '0 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              background: colorBgContainer,
              minHeight: 280,
              padding: 24,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          {/* Manufacturing System ©{new Date().getFullYear()} Created by Your Team */}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;
