import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  message,
  Spin,
  Modal,
  Card,
  Descriptions,
  Avatar,
  Select,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateSuperAdminAccessMutation } from "../../../redux/api/admin/adminApi";
import { deleteSingleUser, getSingleUser } from "../../../redux/features/user/getSIngleUserSlice";

const RoleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { singleUser, loading } = useSelector((state) => state.singleUser);
  const user = singleUser?.data;
  const [updateSuperAdminAccess, { isLoading: updating }] = useUpdateSuperAdminAccessMutation();

  useEffect(() => {
    if (id) {
      dispatch(getSingleUser(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user?.fullName,
        status: user?.status || "INACTIVE",
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
              <Descriptions.Item label="Status">{values.status}</Descriptions.Item>
              <Descriptions.Item label="Phone">{values.phone}</Descriptions.Item>
              <Descriptions.Item label="Address">{values.address}</Descriptions.Item>
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
      // Build payload and call API via thunk
      const payload = {
        fullName: values?.name,
        status: values?.status,
        address: values?.address,
        contactNumber: values?.phone,
      };

      const res = await updateSuperAdminAccess({ id, data: payload }).unwrap();
      message.success(res?.message || "Admin details updated successfully!");
      // Refresh user data
      dispatch(getSingleUser(id));
    } catch (error) {
      const errMsg = error?.data?.message || error?.message || "Failed to update admin details";
      message.error(errMsg);
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
              src={
                user?.profileImage ||
                "https://i.ibb.co/Ps9gZ8DD/Profile-image.png"
              }
              size={64}
            />
            <div style={{ marginLeft: 16 }}>
              <p>
                <strong>{user?.fullName}</strong>
              </p>
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
      navigate("/dashboard/role");
    } catch (error) {
      message.error("Failed to delete admin");
    }
  };

  if (loading || !user) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
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
              src={
                user?.profileImage ||
                "https://i.ibb.co/Ps9gZ8DD/Profile-image.png"
              }
              size={40}
              style={{ marginRight: 12 }}
            />
            <span>Edit Admin: {user?.fullName}</span>
          </div>
        }
        bordered={false}
      >
        <Form form={form} layout="vertical" onFinish={showUpdateConfirm}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select a status!" }]}
          >
            <Select>
              <Select.Option value="ACTIVE">ACTIVE</Select.Option>
              <Select.Option value="INACTIVE">INACTIVE</Select.Option>
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
            <Button danger onClick={showDeleteConfirm} loading={loading}>
              Delete Admin
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RoleDetails;
