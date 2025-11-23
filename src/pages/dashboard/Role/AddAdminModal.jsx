import { Modal, Form, Input, Select, message } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createAdminBySuperAdmin,
  resetUserState,
} from "../../../redux/features/user/userSlice";

const AddAdminModal = ({ open, onClose, refetchAdmins }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { loading, success, error } = useSelector((state) => state.user);

  const handleSubmit = (values) => {
    const { name: fullName, email, password, userType: role } = values;
    dispatch(createAdminBySuperAdmin({ email, password, role, fullName }));
  };

  // Show success message and close modal
  useEffect(() => {
    if (success) {
      message.success("Admin created successfully!");
      form.resetFields();
      dispatch(resetUserState());
      onClose();
      refetchAdmins?.();
    }
  }, [success]);

  // Show error message
  useEffect(() => {
    if (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Something went wrong";
      message.error(errorMessage);
    }
  }, [error]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open]);

  return (
    <Modal
      title="Make Admin"
      open={open}
      onCancel={onClose}
      onOk={() => {
        form
          .validateFields()
          .then(handleSubmit)
          .catch((info) => console.log("Validation Failed:", info));
      }}
      okText="Submit"
      okButtonProps={{
        className: "!bg-orangePrimary !text-black hover:!bg-orange-300",
      }}
      cancelText="Cancel"
      confirmLoading={loading}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input placeholder="Type Here" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input placeholder="Type Here" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please enter password" }]}
        >
          <Input.Password placeholder="••••••••••••" />
        </Form.Item>

        <Form.Item
          name="userType"
          label="Role"
          rules={[{ required: true, message: "Please select role" }]}
          initialValue="ADMIN"
        >
          <Select>
            <Select.Option value="ADMIN">Admin</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAdminModal;
