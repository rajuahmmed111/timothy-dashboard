import React, { useState } from "react";
import { Table, Button, Tag, Modal, Form, Input, Select, DatePicker, InputNumber, message } from "antd";
import { Plus, Calendar, Percent, DollarSign, Users, Clock, Trash2 } from "lucide-react";
import { useGetPromoCodesQuery, useCreatePromoCodeMutation, useDeletePromoCodeMutation } from "../redux/api/promoCodes/promoCodesApi";
import AdminProfile from "../pages/dashboard/components/AdminProfile";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

const PromoCodesManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  
  const { data: promoCodesData, isLoading, error, refetch } = useGetPromoCodesQuery();
  const [createPromoCode, { isLoading: isCreating }] = useCreatePromoCodeMutation();
  const [deletePromoCode, { isLoading: isDeleting }] = useDeletePromoCodeMutation();

  const promoCodes = promoCodesData?.data || [];

  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return `$${(amount / 100).toLocaleString()}`;
  };

  const getStatusColor = (validTo) => {
    const now = new Date();
    const expiryDate = new Date(validTo);
    
    if (expiryDate < now) {
      return 'error'; // Expired
    } else if (expiryDate - now < 7 * 24 * 60 * 60 * 1000) {
      return 'warning'; // Expires within 7 days
    }
    return 'success'; // Active
  };

  const getStatusText = (validTo) => {
    const now = new Date();
    const expiryDate = new Date(validTo);
    
    if (expiryDate < now) {
      return 'Expired';
    } else if (expiryDate - now < 7 * 24 * 60 * 60 * 1000) {
      return 'Expiring Soon';
    }
    return 'Active';
  };

  const handleCreatePromoCode = async (values) => {
    try {
      const promoCodeData = {
        code: values.code.toUpperCase(),
        discountType: values.discountType,
        discountValue: values.discountValue,
        validFrom: values.dateRange[0].format('YYYY-MM-DD'),
        validTo: values.dateRange[1].format('YYYY-MM-DD'),
        usageLimit: values.usageLimit,
        perUserLimit: values.perUserLimit,
        minimumAmount: values.minimumAmount * 100, // Convert to cents
      };

      const response = await createPromoCode(promoCodeData);
      
      // Check if the response indicates success
      if (response.data?.success || response.data?.message?.includes('successfully')) {
        message.success('Promo code created successfully!');
        setIsModalVisible(false);
        form.resetFields();
        refetch();
      } else {
        // Handle API error response
        const errorMessage = response.data?.message || response.error?.data?.message || 'Failed to create promo code. Please try again.';
        message.error(errorMessage);
      }
    } catch (error) {
      // Handle network or other errors
      const errorMessage = error?.data?.message || error?.message || 'Failed to create promo code. Please try again.';
      message.error(errorMessage);
    }
  };

  const handleDeletePromoCode = async (id, code) => {
    Modal.confirm({
      title: 'Delete Promo Code',
      content: `Are you sure you want to delete the promo code "${code}"? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deletePromoCode(id).unwrap();
          message.success('Promo code deleted successfully!');
          refetch();
        } catch (error) {
          if (error?.data?.message) {
            message.error(error.data.message);
          } else {
            message.error('Failed to delete promo code. Please try again.');
          }
        }
      },
    });
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (code) => (
        <div className="flex items-center gap-2">
          <Tag color="blue" className="font-mono font-semibold">
            {code}
          </Tag>
        </div>
      ),
    },
    {
      title: "Discount",
      key: "discount",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Percent className="w-4 h-4 text-green-600" />
          <span className="font-semibold text-green-600">
            {record.discountValue}%
          </span>
        </div>
      ),
    },
    {
      title: "Min Amount",
      dataIndex: "minimumAmount",
      key: "minimumAmount",
      render: (amount) => (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-500" />
          <span>{formatAmount(amount)}</span>
        </div>
      ),
    },
    {
      title: "Valid Period",
      key: "validPeriod",
      render: (_, record) => (
        <div className="text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>From: {formatDate(record.validFrom)}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="w-3 h-3" />
            <span>To: {formatDate(record.validTo)}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Tag color={getStatusColor(record.validTo)}>
          {getStatusText(record.validTo)}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button
            type="text"
            danger
            size="small"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => handleDeletePromoCode(record.id, record.code)}
            loading={isDeleting}
            className="flex items-center justify-center hover:bg-red-50"
            title="Delete promo code"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="px-0 sm:px-6 bg-grayLightBg min-h-screen font-sans">
      <AdminProfile headingText="Promo Codes Management" />
      
      <div className="md:p-6 p-2 sm:p-6 bg-grayLightBg md:min-h-screen font-sans w-full">
        {/* Header + Add Button */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Promo Codes
          </h2>
          
          <Button
            type="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalVisible(true)}
            className="bg-orangePrimary text-gray-900 border-orangePrimary hover:bg-orange-600"
          >
            Create Promo Code
          </Button>
        </div>

      {/* Table */}
      <div className="w-[20rem] md:w-full mx-auto sm:overflow-scroll md:overflow-auto">
        <div className="w-full flex justify-center">
          <div className="w-full overflow-x-auto border rounded-lg bg-white">
            <Table
              columns={columns}
              dataSource={Array.isArray(promoCodes) ? promoCodes : []}
              rowKey="id"
              loading={isLoading}
              scroll={{ x: true }}
              pagination={{
                position: ["bottomCenter"],
                pageSize: 10,
                showSizeChanger: false,
              }}
              locale={{
                emptyText: (
                  <div className="py-8">
                    <div className="text-gray-500 mb-2">No promo codes found</div>
                    <div className="text-gray-400 text-sm">
                      Create your first promo code to get started
                    </div>
                  </div>
                ),
              }}
            />
          </div>
        </div>
      </div>

      {/* Create Promo Code Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-orangePrimary" />
            <span>Create New Promo Code</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreatePromoCode}
          className="mt-4"
        >
          <Form.Item
            label="Promo Code"
            name="code"
            rules={[
              { required: true, message: 'Please enter promo code' },
              { min: 3, message: 'Code must be at least 3 characters' },
              { max: 20, message: 'Code must not exceed 20 characters' },
            ]}
          >
            <Input
              placeholder="e.g., CAR20, HOTEL15"
              className="uppercase"
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                form.setFieldsValue({ code: value });
              }}
            />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Discount Type"
              name="discountType"
              rules={[{ required: true, message: 'Please select discount type' }]}
              initialValue="PERCENTAGE"
            >
              <Select 
                placeholder="Select discount type"
                disabled
              >
                <Option value="PERCENTAGE">Percentage (%)</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Discount Value (%)"
              name="discountValue"
              rules={[
                { required: true, message: 'Please enter discount value' },
                { type: 'number', min: 1, message: 'Value must be greater than 0' },
                { type: 'number', max: 100, message: 'Percentage cannot exceed 100%' },
              ]}
            >
              <InputNumber
                placeholder="20"
                className="w-full"
                min={1}
                max={100}
                step={1}
                precision={0}
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Valid Period"
            name="dateRange"
            rules={[{ required: true, message: 'Please select valid period' }]}
          >
            <RangePicker
              className="w-full"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Usage Limit"
              name="usageLimit"
              rules={[
                { required: true, message: 'Please enter usage limit' },
                { type: 'number', min: 1, message: 'Limit must be greater than 0' },
              ]}
            >
              <InputNumber
                placeholder="1000"
                className="w-full"
                min={1}
              />
            </Form.Item>

            <Form.Item
              label="Per User Limit"
              name="perUserLimit"
              rules={[
                { required: true, message: 'Please enter per user limit' },
                { type: 'number', min: 1, message: 'Limit must be greater than 0' },
              ]}
            >
              <InputNumber
                placeholder="1"
                className="w-full"
                min={1}
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Minimum Amount ($)"
            name="minimumAmount"
            rules={[
              { required: true, message: 'Please enter minimum amount' },
              { type: 'number', min: 0, message: 'Amount must be 0 or greater' },
            ]}
          >
            <InputNumber
              placeholder="50.00"
              className="w-full"
              min={0}
              step={0.01}
              precision={2}
            />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating}
              className="bg-orangePrimary border-orangePrimary hover:bg-orange-600"
            >
              Create Promo Code
            </Button>
          </div>
        </Form>
      </Modal>
      </div>
    </div>
  );
};

export default PromoCodesManagement;
