import { useState, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import AdminProfile from '../components/AdminProfile';
import { useGetAllNotificationsQuery, useMarkNotificationAsReadMutation, notificationManageApi } from '../../../redux/api/notifications/notificationManageApi';
import { useDispatch } from 'react-redux';

const Notification = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, isFetching } = useGetAllNotificationsQuery({ page, limit });
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();

  const notifications = Array.isArray(data?.data?.data) ? data.data.data : [];
  const total = data?.data?.meta?.total ?? 0;
  const hasMore = notifications.length < total;

  const formatTime = (isoString) => {
    try {
      return new Date(isoString).toLocaleString();
    } catch {
      return '';
    }
  };

  const markAsRead = async (id) => {
    try {
      // optimistic cache update
      dispatch(
        notificationManageApi.util.updateQueryData(
          'getAllNotifications',
          { page, limit },
          (draft) => {
            if (Array.isArray(draft?.data?.data)) {
              draft.data.data = draft.data.data.map((n) =>
                n.id === id ? { ...n, read: true } : n
              );
            }
          }
        )
      );
      await markNotificationAsRead(id).unwrap();
    } catch (e) {
      // On failure, let next refetch correct it implicitly if needed
      // Optionally, add a toast here
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
<div className='px-0 md:px-6'>

  <AdminProfile headingText='Notification'></AdminProfile>
      <div className="min-h-screen bg-gray-50 my-6">
      {/* Ant Design Header */}
      {/* <div className="bg-white shadow-sm">
        <div className=" px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <h1 className="text-lg font-medium text-gray-900">Notifications</h1>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors duration-200"
              >
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Mark all as read</span>
                <span className="sm:hidden">Mark all</span>
              </button>
            )}
          </div>
        </div>
      </div> */}

      {/* Content */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards - Hidden on mobile */}
        {/* <div className="hidden md:grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Bell className="w-5 h-5 text-gray-400" />
              </div>
              <div className="ml-3 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total</dt>
                  <dd className="text-lg font-semibold text-gray-900">{notifications.length}</dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <div className="ml-3 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Unread</dt>
                  <dd className="text-lg font-semibold text-gray-900">{unreadCount}</dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="ml-3 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Read</dt>
                  <dd className="text-lg font-semibold text-gray-900">{notifications.length - unreadCount}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div> */}

        {/* Notifications List */}
        <div className="bg-white rounded-lg border">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative flex items-start gap-4 p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200 ${
                    !notification.read ? 'bg-blue-50/50' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white bg-blue-500`}>
                      <Bell className="w-4 h-4" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`text-sm font-medium ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className={`text-sm ${!notification.read ? 'text-gray-800' : 'text-gray-600'}`}>
                          {notification.body}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                      
                      {/* Mark as read button */}
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors duration-200 whitespace-nowrap"
                        >
                          <Check className="w-3 h-3" />
                          <span className="hidden sm:inline">Mark as read</span>
                          <span className="sm:hidden">Read</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {/* Load more */}
              <div className="p-4 text-center">
                {hasMore && (
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={isFetching}
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md disabled:opacity-50"
                  >
                    {isFetching ? 'Loading...' : 'Load more'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        {/* {notifications.length > 0 && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-4 text-sm text-gray-500">
              <span>{notifications.length} total notifications</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>{unreadCount} unread</span>
            </div>
          </div>
        )} */}
      </div>
    </div>
</div>
  );
};

export default Notification;