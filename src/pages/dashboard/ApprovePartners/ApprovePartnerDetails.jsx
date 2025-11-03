import { useParams, useNavigate } from "react-router-dom";
import { Card, Descriptions, Button, message, Row, Col, Avatar, Modal, Spin, Alert } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  ShopOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  IdcardOutlined,
  ArrowLeftOutlined,
  EnvironmentOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { 
  useGetInactivePartnerQuery, 
  useUpdatePartnerStatusActiveMutation, 
  useUpdatePartnerStatusRejectMutation 
} from "../../../redux/api/userApi";

const ApprovePartnerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();
  
  // API hooks
  const { data: partnerData, isLoading, error } = useGetInactivePartnerQuery(id);
  const [updatePartnerStatusActive, { isLoading: isApproving }] = useUpdatePartnerStatusActiveMutation();
  const [updatePartnerStatusReject, { isLoading: isRejecting }] = useUpdatePartnerStatusRejectMutation();
  
  const partner = partnerData?.data;
  
  if (isLoading) {
    return (
      <div style={{ padding: "24px" }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }
  
  if (error || !partner) {
    return (
      <div style={{ padding: "24px" }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
          style={{ marginBottom: 16 }}
        >
          Back to List
        </Button>
        <Alert
          message="Error"
          description={error?.data?.message || "Partner not found"}
          type="error"
          showIcon
        />
      </div>
    );
  }

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const showApproveConfirm = () => {
    modal.confirm({
      title: 'Confirm Approval',
      content: (
        <div>
          <p>Are you sure you want to approve this partner?</p>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 16 }}>
            <Avatar src={partner.profileImage} size={64} />
            <div style={{ marginLeft: 16 }}>
              <p><strong>{partner.fullName}</strong></p>
              <p>{partner.email}</p>
            </div>
          </div>
        </div>
      ),
      okText: 'Yes, Approve',
      cancelText: 'Cancel',
      onOk: handleApprove,
    });
  };

  const showRejectConfirm = () => {
    modal.confirm({
      title: 'Confirm Rejection',
      content: (
        <div>
          <p>Are you sure you want to reject this partner?</p>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 16 }}>
            <Avatar src={partner.profileImage} size={64} />
            <div style={{ marginLeft: 16 }}>
              <p><strong>{partner.fullName}</strong></p>
              <p>{partner.email}</p>
            </div>
          </div>
        </div>
      ),
      okText: 'Yes, Reject',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk: handleReject,
    });
  };

  const handleApprove = async () => {
    try {
      const response = await updatePartnerStatusActive(id);
      
      if (response.data?.success) {
        messageApi.success({
          content: response.data.message || `${partner.fullName}'s request has been approved!`,
          duration: 3,
        });
        
        setTimeout(() => {
          navigate(-1);
        }, 3000);
      } else {
        const errorMessage = response.error?.data?.message || response.data?.message || 'Failed to approve partner';
        messageApi.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to approve partner';
      messageApi.error(errorMessage);
    }
  };

  const handleReject = async () => {
    try {
      const response = await updatePartnerStatusReject(id);
      
      if (response.data?.success) {
        messageApi.success({
          content: response.data.message || `${partner.fullName}'s request has been rejected.`,
          duration: 3,
        });
        
        setTimeout(() => {
          navigate(-1);
        }, 3000);
      } else {
        const errorMessage = response.error?.data?.message || response.data?.message || 'Failed to reject partner';
        messageApi.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to reject partner';
      messageApi.error(errorMessage);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      {modalContextHolder}
      
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={handleGoBack}
        style={{ marginBottom: 16 }}
      >
        Back to List
      </Button>
      
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={partner.profileImage} size={40} style={{ marginRight: 12 }} />
            <span>Partner Approval Details</span>
          </div>
        }
        bordered={false}
        style={{ width: "100%" }}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label={<><IdcardOutlined /> ID</>}>
            {partner.id}
          </Descriptions.Item>
          <Descriptions.Item label={<><UserOutlined /> Full Name</>}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={partner.profileImage} size={24} style={{ marginRight: 8 }} />
              {partner.fullName || 'N/A'}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label={<><MailOutlined /> Email</>}>
            {partner.email}
          </Descriptions.Item>
          <Descriptions.Item label={<><PhoneOutlined /> Contact Number</>}>
            {partner.contactNumber || 'Not provided'}
          </Descriptions.Item>
          <Descriptions.Item label={<><EnvironmentOutlined /> Address</>}>
            {partner.address || 'Not provided'}
          </Descriptions.Item>
          <Descriptions.Item label={<><EnvironmentOutlined /> Country</>}>
            {partner.country || 'Not specified'}
          </Descriptions.Item>
          <Descriptions.Item label={<><ShopOutlined /> Role</>}>
            {partner.role === 'BUSINESS_PARTNER' ? 'Business Partner' : partner.role === 'SERVICE_PROVIDER' ? 'Service Provider' : partner.role}
          </Descriptions.Item>
          <Descriptions.Item label={<><CalendarOutlined /> Applied Date</>}>
            {dayjs(partner.createdAt).format("DD MMM YYYY, hh:mm A")}
          </Descriptions.Item>
          <Descriptions.Item label={<><CalendarOutlined /> Last Updated</>}>
            {dayjs(partner.updatedAt).format("DD MMM YYYY, hh:mm A")}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <span style={{ color: partner.status === "INACTIVE" ? "orange" : 
                          partner.status === "ACTIVE" ? "green" : "red" }}>
              {partner.status === 'INACTIVE' ? 'Pending' : partner.status === 'ACTIVE' ? 'Active' : partner.status === 'REJECTED' ? 'Rejected' : partner.status}
            </span>
          </Descriptions.Item>
        </Descriptions>

        {partner.status === "INACTIVE" && (
          <Row justify="center" gutter={16} style={{ marginTop: "24px" }}>
            <Col>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                size="large"
                onClick={showApproveConfirm}
                loading={isApproving}
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              >
                Approve
              </Button>
            </Col>
            <Col>
              <Button
                danger
                icon={<CloseOutlined />}
                size="large"
                onClick={showRejectConfirm}
                loading={isRejecting}
              >
                Reject
              </Button>
            </Col>
          </Row>
        )}
      </Card>
    </div>
  );
};

export default ApprovePartnerDetails;