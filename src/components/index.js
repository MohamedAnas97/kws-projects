import React, { useState, useEffect } from "react";
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
  message,
  Avatar,
  Space,
  Popconfirm,
} from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
  TeamOutlined,
  DollarOutlined,
  RiseOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Cookies from "js-cookie";
import moment from "moment";
import Logo from "../assets/logo.webp";

const { Header, Content, Footer, Sider } = Layout;

function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [usersData, setUsersData] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  // Dashboard Cards
  const cards = [
    { title: "Total Users", value: usersData.length, icon: <TeamOutlined />, gradient: "from-blue-500 to-blue-700" },
    { title: "Active Sessions", value: 450, icon: <UserOutlined />, gradient: "from-green-500 to-green-700" },
    { title: "New Signups", value: 75, icon: <RiseOutlined />, gradient: "from-purple-500 to-purple-700" },
    { title: "Revenue", value: "$5400", icon: <DollarOutlined />, gradient: "from-yellow-500 to-orange-500" },
  ];

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://10.255.254.142:8000/api/users", {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });
      const data = await res.json();
      setUsersData(data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Logout
  const handleLogout = () => {
    Cookies.remove("access_token");
    window.location.href = "/";
  };

  // Add/Edit User (with dummy images)
  const handleAddEditUser = async (values) => {
    try {
    const payload = {
  username: values.firstName,
  email: values.email || "",
  password: "123456",
  roleid: values.role === "Admin" ? 1 : 2,
  phone_no: values.phone,
  user_no: (editingUser ? editingUser.user_no : Date.now().toString()), // <-- convert to string
  first_name: values.firstName,
  last_name: values.lastName || "",
  surname: values.surname,
  date_of_birth: values.dob ? values.dob.format("YYYY-MM-DD") : "",
  joining_date: values.joiningDate ? values.joiningDate.format("YYYY-MM-DD") : "",
  address: values.address || "",
  profile_image: "https://via.placeholder.com/150",
  passport_file: "https://via.placeholder.com/150",
};

      const url = editingUser
        ? `http://10.255.254.142:8000/api/users/${editingUser.id}`
        : "http://10.255.254.142:8000/api/users";

      const res = await fetch(url, {
        method: editingUser ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        message.success(`User ${editingUser ? "Updated" : "Created"} ✅`);
        setIsModalOpen(false);
        setEditingUser(null);
        form.resetFields();
        fetchUsers();
      } else {
        message.error(data.detail || "API Error ❌");
      }
    } catch (err) {
      console.error(err);
      message.error("API Error ❌");
    }
  };

  // Delete User
  const handleDeleteUser = async (id) => {
    try {
      await fetch(`http://10.255.254.142:8000/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });
      message.success("User Deleted ✅");
      fetchUsers();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete user");
    }
  };

  // Table Columns
  const columns = [
    {
      title: "Profile",
      dataIndex: "profile_image",
      key: "profile_image",
      render: (text) => <Avatar src={text || "https://via.placeholder.com/40"} />,
    },
    { title: "Name", key: "name", render: (_, record) => `${record.first_name} ${record.last_name}` },
    { title: "Surname", dataIndex: "surname", key: "surname" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone_no", key: "phone_no" },
    {
      title: "DOB",
      dataIndex: "date_of_birth",
      key: "date_of_birth",
      render: (text) => (text ? moment(text).format("YYYY-MM-DD") : "-"),
    },
    {
      title: "Joining Date",
      dataIndex: "joining_date",
      key: "joining_date",
      render: (text) => (text ? moment(text).format("YYYY-MM-DD") : "-"),
    },
    {
      title: "Passport",
      dataIndex: "passport_file",
      key: "passport_file",
      render: (text) => <Avatar src={text || "https://via.placeholder.com/40"} />,
    },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              form.setFieldsValue({
                ...record,
                dob: record.date_of_birth ? moment(record.date_of_birth) : null,
                joiningDate: record.joining_date ? moment(record.joining_date) : null,
              });
              setEditingUser(record);
              setIsModalOpen(true);
            }}
          />
          <Popconfirm title="Delete this user?" onConfirm={() => handleDeleteUser(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Render Content
  const renderContent = () => {
    if (selectedMenu === "1") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-r ${card.gradient} shadow-xl transform transition-all duration-300 hover:scale-105`}
            >
              <div className="absolute top-4 right-4 text-5xl opacity-20">{card.icon}</div>
              <h2 className="text-lg font-medium">{card.title}</h2>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
              <div className="mt-4 text-sm opacity-80">Updated just now 🚀</div>
            </div>
          ))}
        </div>
      );
    }
    if (selectedMenu === "2") {
      return (
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">User Management</h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingUser(null);
                form.resetFields();
                setIsModalOpen(true);
              }}
            >
              Add User
            </Button>
          </div>
          <Table dataSource={usersData} columns={columns} rowKey="id" bordered pagination={{ pageSize: 5 }} scroll={{ x: 1200 }} />

          <Modal
            title={<span className="text-2xl font-extrabold text-blue-900">{editingUser ? "Edit User" : "Create New User"}</span>}
            open={isModalOpen}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingUser(null);
              form.resetFields();
            }}
            footer={null}
            width={900}
          >
            <Form layout="vertical" form={form} onFinish={handleAddEditUser} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item name="surname" label="Surname" rules={[{ required: true }]}>
                  <Input placeholder="Enter surname" />
                </Form.Item>
                <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                  <Input placeholder="Enter first name" />
                </Form.Item>
                <Form.Item name="lastName" label="Last Name">
                  <Input placeholder="Enter last name" />
                </Form.Item>
                <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
                  <Input placeholder="+971 ..." />
                </Form.Item>
                <Form.Item name="dob" label="Date of Birth">
                  <DatePicker className="w-full" />
                </Form.Item>
                <Form.Item name="joiningDate" label="Joining Date">
                  <DatePicker className="w-full" />
                </Form.Item>
                <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                  <Select placeholder="Select role">
                    <Select.Option value="Admin">Admin</Select.Option>
                    <Select.Option value="User">User</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="email" label="Email">
                  <Input placeholder="Enter email" />
                </Form.Item>
                <Form.Item name="address" label="Address">
                  <Input.TextArea rows={2} placeholder="Enter address" />
                </Form.Item>
              </div>
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingUser(null);
                    form.resetFields();
                  }}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingUser ? "Update User" : "Create User"}
                </Button>
              </div>
            </Form>
          </Modal>
        </div>
      );
    }
    return <h2>Settings</h2>;
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="p-4 text-center">
          <img src={Logo} alt="logo" className="h-10 mx-auto" />
        </div>
        <Menu theme="dark" defaultSelectedKeys={["1"]} onClick={(e) => setSelectedMenu(e.key)}>
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<DesktopOutlined />}>
            Users
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="flex justify-end bg-white p-4 shadow">
          <Button danger onClick={handleLogout}>
            Logout
          </Button>
        </Header>
        <Content className="m-5 p-5 bg-white rounded shadow">
          <Breadcrumb style={{ marginBottom: "16px" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>{selectedMenu === "1" ? "Dashboard" : "Users"}</Breadcrumb.Item>
          </Breadcrumb>
          {renderContent()}
        </Content>
        <Footer style={{ textAlign: "center" }}>Admin Panel ©2026</Footer>
      </Layout>
    </Layout>
  );
}

export default Dashboard;