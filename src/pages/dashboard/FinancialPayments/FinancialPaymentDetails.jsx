import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Row, Col, Typography, Descriptions, Divider, Button, Tag, Spin, Alert } from "antd";
import { ArrowLeft, User, Building2, CreditCard, Calendar, DollarSign, Shield, Globe } from "lucide-react";
import { useGetFinanceDetailsQuery } from "../../../redux/api/finances/financesApi";

const { Title, Text } = Typography;


const FinancialPaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: financeData, isLoading, error } = useGetFinanceDetailsQuery(id);

  const payment = financeData?.data?.payment;
  const user = financeData?.data?.user;
  const partner = financeData?.data?.partner;

  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount, currency) => {
    const currencySymbols = {
      'usd': '$',
      'ngn': '₦',
      'eur': '€',
      'gbp': '£'
    };
    const symbol = currencySymbols[currency?.toLowerCase()] || '$';
    return `${symbol}${(amount / 100).toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return 'success';
      case 'REFUNDED':
        return 'error';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType?.toUpperCase()) {
      case 'HOTEL':
        return <Building2 className="w-4 h-4" />;
      case 'CAR':
        return <Globe className="w-4 h-4" />;
      case 'SECURITY':
        return <Shield className="w-4 h-4" />;
      case 'ATTRACTION':
        return <Calendar className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4 text-gray-600">Loading payment details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Button 
            icon={<ArrowLeft className="w-4 h-4" />} 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            Back to Payments
          </Button>
          <Alert
            message="Error Loading Payment Details"
            description="Unable to load payment information. Please try again later."
            type="error"
            showIcon
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            icon={<ArrowLeft className="w-4 h-4" />} 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            Back to Payments
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <Title level={2} className="!mb-2">Payment Details</Title>
              <Text type="secondary" className="text-lg">
                Transaction ID: {payment?.id?.slice(-12) || 'N/A'}
              </Text>
            </div>
            <Tag color={getStatusColor(payment?.status)} className="text-lg px-4 py-2">
              {payment?.status || 'Unknown'}
            </Tag>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          {/* Payment Information */}
          <Col xs={24} lg={12}>
            <Card 
              title={
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span>Payment Information</span>
                </div>
              } 
              className="h-full"
            >
              <Descriptions column={1} size="middle">
                <Descriptions.Item label="Amount">
                  <span className="text-2xl font-bold text-green-600">
                    {formatAmount(payment?.amount, payment?.currency)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Currency">
                  <Tag color="blue">{payment?.currency?.toUpperCase() || 'N/A'}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Payment Method">
                  <span className="capitalize">{payment?.paymentMethod || 'N/A'}</span>
                </Descriptions.Item>
                <Descriptions.Item label="Provider">
                  <Tag color="purple">{payment?.provider || 'N/A'}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Service Type">
                  <div className="flex items-center gap-2">
                    {getServiceIcon(payment?.serviceType)}
                    <span>{payment?.serviceType || 'N/A'}</span>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Country">
                  {payment?.country || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Session ID">
                  <Text code className="text-xs">{payment?.sessionId || 'N/A'}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Payment Intent">
                  <Text code className="text-xs">{payment?.payment_intent || 'N/A'}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* Financial Breakdown */}
          <Col xs={24} lg={12}>
            <Card 
              title={
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span>Financial Breakdown</span>
                </div>
              }
              className="h-full"
            >
              <Descriptions column={1} size="middle">
                <Descriptions.Item label="Total Amount">
                  <span className="font-semibold">
                    {formatAmount(payment?.amount, payment?.currency)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Admin Commission">
                  <span className="text-orange-600">
                    {formatAmount(payment?.admin_commission, payment?.currency)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Service Fee">
                  <span className="text-blue-600">
                    {formatAmount(payment?.service_fee, payment?.currency)}
                  </span>
                </Descriptions.Item>
                {payment?.paystack_fee && (
                  <Descriptions.Item label="Paystack Fee">
                    <span className="text-purple-600">
                      {formatAmount(payment.paystack_fee, payment?.currency)}
                    </span>
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Transaction ID">
                  <Text code>{payment?.transactionId || 'N/A'}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* User Information */}
          <Col xs={24} lg={12}>
            <Card 
              title={
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Customer Information</span>
                </div>
              }
              className="h-full"
            >
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={user?.profileImage || 'https://via.placeholder.com/60'} 
                  alt="User" 
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-lg">{user?.fullName || 'N/A'}</div>
                  <div className="text-gray-500">{user?.email || 'N/A'}</div>
                </div>
              </div>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="User ID">
                  <Text code className="text-xs">{user?.id || 'N/A'}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Role">
                  <Tag color="green">{user?.role || 'N/A'}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Contact Number">
                  {user?.contactNumber || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                  {user?.address || 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* Partner Information */}
          <Col xs={24} lg={12}>
            <Card 
              title={
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  <span>Partner Information</span>
                </div>
              }
              className="h-full"
            >
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={partner?.profileImage || 'https://via.placeholder.com/60'} 
                  alt="Partner" 
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-lg">{partner?.fullName || 'N/A'}</div>
                  <div className="text-gray-500">{partner?.email || 'N/A'}</div>
                </div>
              </div>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Partner ID">
                  <Text code className="text-xs">{partner?.id || 'N/A'}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Role">
                  <Tag color="purple">{partner?.role || 'N/A'}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Contact Number">
                  {partner?.contactNumber || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                  {partner?.address || 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* Booking Information */}
          <Col xs={24}>
            <Card 
              title={
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <span>Booking & Timeline Information</span>
                </div>
              }
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Descriptions column={1} size="small" title="Booking IDs">
                    <Descriptions.Item label="Hotel Booking">
                      <Text code>{payment?.hotel_bookingId || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Car Booking">
                      <Text code>{payment?.car_bookingId || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Security Booking">
                      <Text code>{payment?.security_bookingId || 'N/A'}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Attraction Booking">
                      <Text code>{payment?.attraction_bookingId || 'N/A'}</Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col xs={24} md={12}>
                  <Descriptions column={1} size="small" title="Timeline">
                    <Descriptions.Item label="Created At">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(payment?.createdAt)}
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(payment?.updatedAt)}
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Description">
                      {payment?.description || 'No description provided'}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default FinancialPaymentDetails;
