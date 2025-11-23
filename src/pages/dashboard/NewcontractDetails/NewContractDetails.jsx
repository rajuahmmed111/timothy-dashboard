import React from 'react';
import { User, Building, Calendar, Hash, Phone, Mail, DollarSign, Clock, Car, Shield, MapPin, Users } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useGetContractDetailsQuery } from '../../../redux/api/contracts/contractDetailsApi';

const NewContractDetails = () => {
  const { type, id } = useParams();
  
  // Fetch contract details from API
  const { data: contractResponse, isLoading, error } = useGetContractDetailsQuery(
    { type, contractId: id },
    { skip: !type || !id }
  );

  const contractData = contractResponse?.data;

  const handleBack = () => {
    window.history.back();
  };

  // Helper functions to format data based on contract type
  const getServiceName = () => {
    if (!contractData) return '';
    switch (contractData.type) {
      case 'hotel':
        return contractData.hotel?.hotelName || 'Hotel Service';
      case 'car':
        return `${contractData.car?.carModel} ${contractData.car?.carType}` || 'Car Rental';
      case 'security':
        return contractData.security?.securityName || 'Security Service';
      case 'attraction':
        return contractData.attraction?.attractionName || 'Attraction Service';
      default:
        return 'Service';
    }
  };

  const getServiceDescription = () => {
    if (!contractData) return '';
    switch (contractData.type) {
      case 'hotel':
        return contractData.hotel?.hotelRoomDescription || 'Hotel accommodation service';
      case 'car':
        return `Car rental service - ${contractData.car?.carType}`;
      case 'security':
        return contractData.security?.securityDescription || 'Security service';
      case 'attraction':
        return contractData.attraction?.attractionDescription || 'Attraction experience';
      default:
        return 'Service description';
    }
  };

  const getBookingDates = () => {
    if (!contractData) return { start: '', end: '' };
    switch (contractData.type) {
      case 'hotel':
        return {
          start: contractData.bookedFromDate,
          end: contractData.bookedToDate
        };
      case 'car':
        return {
          start: contractData.carBookedFromDate,
          end: contractData.carBookedToDate
        };
      case 'security':
        return {
          start: contractData.securityBookedFromDate,
          end: contractData.securityBookedToDate
        };
      case 'attraction':
        return {
          start: contractData.date,
          end: contractData.date
        };
      default:
        return { start: '', end: '' };
    }
  };

  const getServiceIcon = () => {
    switch (contractData?.type) {
      case 'hotel':
        return Building;
      case 'car':
        return Car;
      case 'security':
        return Shield;
      case 'attraction':
        return MapPin;
      default:
        return Building;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen font-sans flex items-center justify-center" style={{ backgroundColor: '#f9fafb' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contract details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen font-sans flex items-center justify-center" style={{ backgroundColor: '#f9fafb' }}>
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading contract details</p>
          <button 
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!contractData) {
    return (
      <div className="min-h-screen font-sans flex items-center justify-center" style={{ backgroundColor: '#f9fafb' }}>
        <div className="text-center">
          <p className="text-gray-600 mb-4">Contract not found</p>
          <button 
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const ServiceIcon = getServiceIcon();
  const bookingDates = getBookingDates();

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#f9fafb' }}>
      {/* Header */}
      {/* <div className="bg-white shadow-sm" style={{ borderBottom: '1px solid #d1d5db' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 hover:bg-gray-50"
                style={{ color: '#6b7280' }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" style={{ color: '#6b7280' }} />
                <h1 className="text-xl font-semibold" style={{ color: '#0d0d0d' }}>Contract Details</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                contractData.status === ' completed' 
                  ? 'text-green-800' 
                  : 'text-gray-800'
              }`} style={{ 
                backgroundColor: contractData.status === ' completed' ? '#dcfce7' : '#f9fafb',
                color: contractData.status === ' completed' ? '#009106' : '#6b7280'
              }}>
                {contractData.status === ' completed' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                {contractData.status}
              </span>
            </div>
          </div>


        </div>
      </div> */}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Contract Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm" style={{ border: '1px solid #d1d5db' }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#dbeafe' }}>
                <Hash className="w-6 h-6" style={{ color: '#1e40af' }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Contract ID</p>
                <p className="text-xs font-semibold mt-1" style={{ color: '#0d0d0d' }}>{contractData.id}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm" style={{ border: '1px solid #d1d5db' }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#dcfce7' }}>
                <DollarSign className="w-6 h-6" style={{ color: '#009106' }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Total Price</p>
                <p className="text-lg font-semibold mt-1" style={{ color: '#0d0d0d' }}>{formatPrice(contractData.totalPrice)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm" style={{ border: '1px solid #d1d5db' }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fff0dd' }}>
                <Clock className="w-6 h-6" style={{ color: '#ea580c' }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Start Date</p>
                <p className="text-lg font-semibold mt-1" style={{ color: '#0d0d0d' }}>
                  {bookingDates.start ? formatDate(bookingDates.start) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm" style={{ border: '1px solid #d1d5db' }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fff0dd' }}>
                <Calendar className="w-6 h-6" style={{ color: '#ff9000' }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#6b7280' }}>End Date</p>
                <p className="text-lg font-semibold mt-1" style={{ color: '#0d0d0d' }}>
                  {bookingDates.end ? formatDate(bookingDates.end) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Service Information */}
          <div className="bg-white rounded-lg shadow-sm" style={{ border: '1px solid #d1d5db' }}>
            <div className="px-6 py-4" style={{ borderBottom: '1px solid #d1d5db' }}>
              <div className="flex items-center gap-3">
                <ServiceIcon className="w-6 h-6" style={{ color: '#1e40af' }} />
                <h3 className="text-lg font-semibold" style={{ color: '#0d0d0d' }}>Service Information</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#6b7280' }}>Service Type</label>
                  <p className="text-base font-medium capitalize" style={{ color: '#0d0d0d' }}>{contractData.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#6b7280' }}>Service Name</label>
                  <p className="text-base font-medium" style={{ color: '#0d0d0d' }}>{getServiceName()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#6b7280' }}>Description</label>
                  <p className="text-sm leading-relaxed" style={{ color: '#0d0d0d' }}>{getServiceDescription()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#6b7280' }}>Category</label>
                  <p className="text-base font-medium" style={{ color: '#0d0d0d' }}>{contractData.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#6b7280' }}>Booking Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    contractData.bookingStatus === 'CONFIRMED' 
                      ? 'bg-green-100 text-green-800' 
                      : contractData.bookingStatus === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {contractData.bookingStatus}
                  </span>
                </div>
                {/* Additional service-specific details */}
                {contractData.type === 'hotel' && (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#6b7280' }}>Rooms</label>
                        <p className="text-base font-medium" style={{ color: '#0d0d0d' }}>{contractData.rooms}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#6b7280' }}>Adults</label>
                        <p className="text-base font-medium" style={{ color: '#0d0d0d' }}>{contractData.adults}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#6b7280' }}>Children</label>
                        <p className="text-base font-medium" style={{ color: '#0d0d0d' }}>{contractData.children}</p>
                      </div>
                    </div>
                  </>
                )}
                {contractData.type === 'security' && (
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#6b7280' }}>Number of Security</label>
                    <p className="text-base font-medium" style={{ color: '#0d0d0d' }}>{contractData.number_of_security}</p>
                  </div>
                )}
                {contractData.type === 'attraction' && contractData.timeSlot && (
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#6b7280' }}>Time Slot</label>
                    <p className="text-base font-medium" style={{ color: '#0d0d0d' }}>
                      {contractData.timeSlot.from} - {contractData.timeSlot.to}
                    </p>
                  </div>
                )}
                {contractData.promo_code && (
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#6b7280' }}>Promo Code</label>
                    <p className="text-base font-medium" style={{ color: '#0d0d0d' }}>{contractData.promo_code}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Partner Information */}
          <div className="bg-white rounded-lg shadow-sm" style={{ border: '1px solid #d1d5db' }}>
            <div className="px-6 py-4" style={{ borderBottom: '1px solid #d1d5db' }}>
              <h3 className="text-lg font-semibold" style={{ color: '#0d0d0d' }}>Partner Information</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#dbeafe' }}>
                    <Building className="w-6 h-6" style={{ color: '#1e40af' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Partner Name</p>
                    <p className="text-base font-semibold mt-1" style={{ color: '#0d0d0d' }}>
                      {contractData.partner?.fullName || 'Partner Name Not Available'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#dcfce7' }}>
                    <Mail className="w-6 h-6" style={{ color: '#009106' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Email</p>
                    <p className="text-base font-medium mt-1" style={{ color: '#1e40af' }}>
                      {contractData.partner?.email || 'Email Not Available'}
                    </p>
                  </div>
                </div>
                
                {contractData.partner?.contactNumber && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fff0dd' }}>
                      <Phone className="w-6 h-6" style={{ color: '#ea580c' }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Phone</p>
                      <p className="text-base font-medium mt-1" style={{ color: '#0d0d0d' }}>
                        {contractData.partner.contactNumber}
                      </p>
                    </div>
                  </div>
                )}

                {contractData.partner?.profileImage && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
                      <img
                        src={contractData.partner.profileImage}
                        alt="Partner Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Profile Image</p>
                      <p className="text-base font-medium mt-1" style={{ color: '#0d0d0d' }}>Available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* User Information */}
        <div className="bg-white rounded-lg shadow-sm mt-8" style={{ border: '1px solid #d1d5db' }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid #d1d5db' }}>
            <h3 className="text-lg font-semibold" style={{ color: '#0d0d0d' }}>User Information</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#dbeafe' }}>
                  <User className="w-6 h-6" style={{ color: '#1e40af' }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#6b7280' }}>User Name</p>
                  <p className="text-base font-semibold mt-1" style={{ color: '#0d0d0d' }}>
                    {contractData.user?.fullName || 'User Name Not Available'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#dcfce7' }}>
                  <Mail className="w-6 h-6" style={{ color: '#009106' }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Email</p>
                  <p className="text-base font-medium mt-1" style={{ color: '#1e40af' }}>
                    {contractData.user?.email || 'Email Not Available'}
                  </p>
                </div>
              </div>
              
              {contractData.user?.contactNumber && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fff0dd' }}>
                    <Phone className="w-6 h-6" style={{ color: '#ea580c' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Phone</p>
                    <p className="text-base font-medium mt-1" style={{ color: '#0d0d0d' }}>
                      {contractData.user.contactNumber}
                    </p>
                  </div>
                </div>
              )}

              {contractData.user?.profileImage && (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
                    <img
                      src={contractData.user.profileImage}
                      alt="User Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Profile Image</p>
                    <p className="text-base font-medium mt-1" style={{ color: '#0d0d0d' }}>Available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewContractDetails;