import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Select,
  message,
  Spin,
  Modal,
  Card,
  Descriptions,
  Avatar,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { deleteSingleUser, getSingleUser } from "../../../redux/features/user/getSIngleUserSlice";
import { useDispatch, useSelector } from 'react-redux';

const RoleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  
  const { singleUser, loading } = useSelector((state) => state.singleUser);
  const user = singleUser?.data;


    useEffect(() => {
      if (id) {
        dispatch(getSingleUser(id));
      }
    }, [dispatch, id]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user?.fullName,
        email: user?.email,
        role: user?.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase(),
        phone: user?.contactNumber || "N/A",
        address: user?.address || "N/A",
      });
    }
  }, [user, form]);

  const showUpdateConfirm = (values) => {
    Modal.confirm({
      title: "Confirm Update",
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Are you sure you want to update this admin's details?</p>
          <Card bordered={false} style={{ marginTop: 16 }}>
            <Descriptions column={1}>
              <Descriptions.Item label="Name">{values.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{values.email}</Descriptions.Item>
              <Descriptions.Item label="Role">{values.role}</Descriptions.Item>
              <Descriptions.Item label="Phone">{values.phone}</Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      ),
      okText: "Yes, Update",
      cancelText: "Cancel",
      onOk: () => handleUpdate(values),
    });
  };

  const handleUpdate = async (values) => {
    try {
      console.log('Update values:', values);
      // Here you would typically dispatch an update action
      // await dispatch(updateUser({ id, ...values }));
      
      message.success("Admin details updated successfully!");
    } catch (error) {
      message.error("Failed to update admin details");
    }
  };

  const showDeleteConfirm = () => {
    Modal.confirm({
      title: "Delete Admin",
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Are you sure you want to delete this admin?</p>
          <div style={{ display: "flex", alignItems: "center", marginTop: 16 }}>
            <Avatar 
              src={user?.profileImage || "https://i.ibb.co/Ps9gZ8DD/Profile-image.png"} 
              size={64} 
            />
            <div style={{ marginLeft: 16 }}>
              <p><strong>{user?.fullName}</strong></p>
              <p>{user?.email}</p>
              <p>{user?.role}</p>
            </div>
          </div>
        </div>
      ),
      okText: "Yes, Delete",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      onOk: handleDelete,
    });
  };

  const handleDelete = async () => {
    try {
       dispatch(deleteSingleUser(id));
      message.success("Admin deleted successfully!");
      navigate('/dashboard/role');
    } catch (error) {
      message.error("Failed to delete admin");
    }
  };

  if (loading || !user) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Button
        type="text"
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        ← Back to Admins
      </Button>

      <Card
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={user?.profileImage || "https://i.ibb.co/Ps9gZ8DD/Profile-image.png"}
              size={40}
              style={{ marginRight: 12 }}
            />
            <span>Edit Admin: {user?.fullName}</span>
          </div>
        }
        bordered={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={showUpdateConfirm}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input the email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input prefix={<MailOutlined />} readOnly />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select the role!" }]}
          >
            <Select>
              <Select.Option value="Admin">Admin</Select.Option>
              <Select.Option value="SuperAdmin">Super Admin</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please input the phone number!" },
            ]}
          >
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please input the address!" }]}
          >
            <Input.TextArea rows={3} prefix={<HomeOutlined />} />
          </Form.Item>

          <Form.Item style={{ marginTop: 32 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ marginRight: 16 }}
            >
              Update Admin
            </Button>
            <Button 
              danger 
              onClick={showDeleteConfirm} 
              loading={loading}
            >
              Delete Admin
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RoleDetails;