import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Spin, Avatar } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  ArrowLeftOutlined,
  IdcardOutlined,
  CrownOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleUser } from '../../../redux/features/user/getSIngleUserSlice';

const RoleDetailsReadOnly = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { singleUser, loading } = useSelector((state) => state.singleUser);
  const user = singleUser?.data;

  useEffect(() => {
    if (id) {
      dispatch(getSingleUser(id));
    }
  }, [dispatch, id]);

  if (loading || !user) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
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
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Back
      </Button>

      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={user.profileImage || "https://i.ibb.co/Ps9gZ8DD/Profile-image.png"}
              size={40}
              style={{ marginRight: 12 }}
            />
            <span>Admin Details: {user.fullName}</span>
          </div>
        }
        bordered={false}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label={<><IdcardOutlined /> ID</>}>
            {user.id}
          </Descriptions.Item>
          <Descriptions.Item label={<><UserOutlined /> Name</>}>
            {user.fullName}
          </Descriptions.Item>
          <Descriptions.Item label={<><MailOutlined /> Email</>}>
            {user.email}
          </Descriptions.Item>
          <Descriptions.Item label={<><CrownOutlined /> Role</>}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()}
          </Descriptions.Item>
          <Descriptions.Item label={<><PhoneOutlined /> Phone</>}>
            {user.contactNumber || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label={<><HomeOutlined /> Address</>}>
            {user.address || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label={<><CalendarOutlined /> Start Date</>}>
            {dayjs(user.createdAt).format('MMMM D, YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label={<><CalendarOutlined /> Years with Company</>}>
            {dayjs().diff(user.createdAt, 'year')} years
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Button
            type="primary"
            onClick={() => navigate(`/dashboard/role/details/${id}`)}
            style={{ marginRight: 16 }}
          >
            Edit Partner
          </Button>
          <Button onClick={() => navigate(-1)}>Return to List</Button>
        </div>
      </Card>
    </div>
  );
};

export default RoleDetailsReadOnly;
