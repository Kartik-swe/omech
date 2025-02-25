"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, message, Card } from "antd";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);

    try {
      const response = await fetch("https://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data,"login data"); // Debugging
        
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        message.success("Login successful!");
        window.location.href = "/materials"; // Redirect to dashboard
        // router.push("/materials"); // Redirect to dashboard
      } else {
        message.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      message.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
    className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray-100"
    style={{ zIndex: 9999 }}
  >
      <Card title="Login" className="w-96 shadow-lg rounded-lg">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
