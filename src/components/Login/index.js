import React, { useState } from "react";
import Logo from "../../assets/logo.webp";
import { Button, Input, Form, Card, message } from "antd";
import Cookies from "js-cookie";

function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const response = await fetch("http://10.255.254.142:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user in cookies
        Cookies.set("access_token", data.access_token, { expires: 1 }); 
        Cookies.set("user", JSON.stringify(data.user), { expires: 1 });

        message.success(`Welcome, ${data.user.username}!`);
        onLogin(); 
      } else {
        message.error(data.detail || "Login failed. Check your credentials.");
      }
    } catch (err) {
      console.error(err);
      message.error("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen w-full bg-cover bg-center"
      style={{
        backgroundImage:
          "url(https://intercitymoney.co.uk/en/images/banner/2.jpg)",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Floating shapes */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/20 rounded-full blur-3xl animate-pulse"></div>

      {/* Login card */}
      <Card className="relative z-10 w-full max-w-lg p-10 rounded-3xl shadow-2xl bg-white/90 backdrop-blur-md transform transition-all hover:scale-105 duration-500">
        {/* Logo */}
        <div className="flex flex-col items-center mb-2">
          <img src={Logo} alt="Logo" className=" h-10 mb-4 animate-bounce" />
          <h2 className="text-lg font-extrabold text-blue-900 text-center animate-pulse">
            Welcome to Your Control Center!
          </h2>
          <p className="text-center text-sm">Sign in to access your dashboard</p>
        </div>

        {/* Form */}
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input
              placeholder="Enter your username"
              size="large"
              className="rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              placeholder="Enter your password"
              size="large"
              className="rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-900 hover:from-blue-700 hover:to-blue-800 text-white text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;