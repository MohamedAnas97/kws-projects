import React, { useState } from "react";
import {
  Layout,
  Menu,
  Breadcrumb,
  Button,
  Table,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Upload,
} from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
  TeamOutlined,
  DollarOutlined,
  RiseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Cookies from "js-cookie";
import Logo from "../assets/logo.webp";

const { Header, Content, Footer, Sider } = Layout;

function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // 🔥 Cards Data
  const cards = [
    {
      title: "Total Users",
      value: 1200,
      icon: <TeamOutlined />,
      gradient: "from-blue-500 to-blue-700",
    },
    {
      title: "Active Sessions",
      value: 450,
      icon: <UserOutlined />,
      gradient: "from-green-500 to-green-700",
    },
    {
      title: "New Signups",
      value: 75,
      icon: <RiseOutlined />,
      gradient: "from-purple-500 to-purple-700",
    },
    {
      title: "Revenue",
      value: "$5400",
      icon: <DollarOutlined />,
      gradient: "from-yellow-500 to-orange-500",
    },
  ];

  // 👥 Users Table Data
  const [usersData, setUsersData] = useState([
    { key: 1, name: "Aslam", email: "aslam@gmail.com", role: "Admin" },
    { key: 2, name: "Mohammed", email: "mohammed@gmail.com", role: "User" },
  ]);

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
  ];

  // 🔐 Logout
  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("user");
    window.location.href = "/";
  };

  // ➕ Add User Submit
  const handleAddUser = (values) => {
    const newUser = {
      key: usersData.length + 1,
      name: `${values.firstName} ${values.lastName}`,
      email: values.email || "N/A",
      role: values.role,
    };

    setUsersData([...usersData, newUser]);
    setIsModalOpen(false);
    form.resetFields();
  };

  // 🎯 Render Content
  const renderContent = () => {
    if (selectedMenu === "1") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-r ${card.gradient}
              shadow-xl transform transition-all duration-300 hover:scale-105`}
            >
              <div className="absolute top-4 right-4 text-5xl opacity-20">
                {card.icon}
              </div>

              <h2 className="text-lg font-medium">{card.title}</h2>
              <p className="text-3xl font-bold mt-2">{card.value}</p>

              <div className="mt-4 text-sm opacity-80">
                Updated just now 🚀
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (selectedMenu === "2") {
      return (
        <div className="bg-white p-4 rounded-xl shadow">
          {/* Top */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">User Management</h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
            >
              Add User
            </Button>
          </div>

          {/* Table */}
          <Table dataSource={usersData} columns={columns} bordered />

          {/* Modal */}
       <Modal
  title={<span className="text-xl font-extrabold text-blue-900">Create New User</span>}
  open={isModalOpen}
  onCancel={() => setIsModalOpen(false)}
  footer={null}
  width={1200}
>
  <Form layout="vertical" form={form} onFinish={handleAddUser} className="space-y-2">
    
    {/* Personal Info */}
    <div className="p-4 bg-blue-50 rounded-xl shadow-sm border border-blue-100">
      <h3 className="text-lg font-bold text-blue-900 mb-4">👤 Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Form.Item name="surname" label="Surname" rules={[{ required: true }]}>
          <Input placeholder="Enter surname" size="large" className="rounded-lg border-blue-300 focus:ring-2 focus:ring-blue-400" />
        </Form.Item>
        <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
          <Input placeholder="Enter first name" size="large" className="rounded-lg border-blue-300 focus:ring-2 focus:ring-blue-400" />
        </Form.Item>
        <Form.Item name="lastName" label="Last Name">
          <Input placeholder="Enter last name" size="large" className="rounded-lg border-blue-300 focus:ring-2 focus:ring-blue-400" />
        </Form.Item>
        <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
          <Input placeholder="+971 ..." size="large" className="rounded-lg border-blue-300 focus:ring-2 focus:ring-blue-400" />
        </Form.Item>
        <Form.Item name="dob" label="Date of Birth">
          <DatePicker className="w-full rounded-lg border-blue-300 focus:ring-2 focus:ring-blue-400" size="large" />
        </Form.Item>
      </div>
    </div>

    {/* Work Info */}
    <div className="p-4 bg-green-50 rounded-xl shadow-sm border border-green-100">
      <h3 className="text-lg font-bold text-green-900 mb-4">💼 Work Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
          <Select size="large" placeholder="Select role" className="rounded-lg border-green-300 focus:ring-2 focus:ring-green-400">
            <Select.Option value="Admin">Admin</Select.Option>
            <Select.Option value="User">User</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="department" label="Department">
          <Input placeholder="Enter department" size="large" className="rounded-lg border-green-300 focus:ring-2 focus:ring-green-400" />
        </Form.Item>
        <Form.Item name="joiningDate" label="Joining Date">
          <DatePicker className="w-full rounded-lg border-green-300 focus:ring-2 focus:ring-green-400" size="large" />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input placeholder="Enter email" size="large" className="rounded-lg border-green-300 focus:ring-2 focus:ring-green-400" />
        </Form.Item>
      </div>
      <Form.Item name="address" label="Address">
        <Input.TextArea rows={3} placeholder="Enter full address" className="rounded-lg border-green-300 focus:ring-2 focus:ring-green-400" />
      </Form.Item>
    </div>

    {/* Document Upload */}
    <div className="p-4 bg-purple-50 rounded-xl shadow-sm border border-purple-100">
      <h3 className="text-lg font-bold text-purple-900 mb-4">📄 Documents</h3>
      <div className="grid grid-cols-2 gap-6">
        <Form.Item name="profileImage" label="Profile Image">
          <Upload listType="picture-card" beforeUpload={() => false} maxCount={1}>
            <div className="flex flex-col items-center justify-center text-purple-600">
              <PlusOutlined />
              <span className="text-xs mt-1">Upload</span>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item name="passportImage" label="Passport Image">
          <Upload listType="picture-card" beforeUpload={() => false} maxCount={1}>
            <div className="flex flex-col items-center justify-center text-purple-600">
              <PlusOutlined />
              <span className="text-xs mt-1">Upload</span>
            </div>
          </Upload>
        </Form.Item>
      </div>
    </div>

    {/* Footer Buttons */}
    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
      <Button onClick={() => setIsModalOpen(false)} className="rounded-lg">
        Cancel
      </Button>
      <Button type="primary" htmlType="submit" className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-900 px-6 font-bold shadow-lg">
        Create User
      </Button>
    </div>
  </Form>
</Modal>
        </div>
      );
    }

    if (selectedMenu === "3") {
      return <p>Settings page</p>;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="flex items-center justify-center p-4">
          <img src={Logo} alt="Logo" className="h-10" />
        </div>

        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          onClick={(e) => setSelectedMenu(e.key)}
        >
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<DesktopOutlined />}>
            Users
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            Settings
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main */}
      <Layout>
        <Header className="bg-white flex justify-end items-center pr-5 shadow">
          <Button danger type="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Header>

        <Content className="m-5 p-5 bg-white rounded shadow">
          <Breadcrumb style={{ marginBottom: "16px" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>
              {selectedMenu === "1"
                ? "Dashboard"
                : selectedMenu === "2"
                ? "Users"
                : "Settings"}
            </Breadcrumb.Item>
          </Breadcrumb>

          {renderContent()}
        </Content>

        <Footer style={{ textAlign: "center" }}>
          Admin Panel ©2026
        </Footer>
      </Layout>
    </Layout>
  );
}

export default Dashboard;