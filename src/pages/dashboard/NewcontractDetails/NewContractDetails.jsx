
import { User, Building, Calendar, Hash, Phone, Mail, DollarSign, Clock } from 'lucide-react';
import { useParams } from 'react-router-dom';

const NewContractDetails = () => {
     


    const {id} = useParams();
  // Mock data - in real app this would come from API based on id
  const contractData = {
    id: id,
    partnerName: 'TechSolutions Inc.',
    serviceName: 'Cloud Infrastructure Management',
    userName: 'John Anderson',
    date: '2024-01-15',
    status: ' completed',
    value: '$45,000',
    duration: '12 months',
    startDate: '2024-01-15',
    partnerContact: {
      email: 'contact@techsolutions.com',
      phone: '+1 (555) 123-4567',
      address: '123 Business Ave, Tech City, TC 12345'
    },
    userContact: {
      email: 'john.anderson@company.com',
      phone: '+1 (555) 987-6543'
    },
    description: 'Comprehensive cloud infrastructure management services including server maintenance, security monitoring, backup solutions, and 24/7 technical support.'
  };

  const handleBack = () => {
    window.history.back();
  };

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
                <p className="text-lg font-semibold mt-1" style={{ color: '#0d0d0d' }}>{contractData.id}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm" style={{ border: '1px solid #d1d5db' }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#dcfce7' }}>
                <DollarSign className="w-6 h-6" style={{ color: '#009106' }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Contract Value</p>
                <p className="text-lg font-semibold mt-1" style={{ color: '#0d0d0d' }}>{contractData.value}</p>
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
                <p className="text-lg font-semibold mt-1" style={{ color: '#0d0d0d' }}>{contractData.startDate}</p>
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
                <p className="text-lg font-semibold mt-1" style={{ color: '#0d0d0d' }}>{contractData.startDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Service Information */}
          <div className="bg-white rounded-lg shadow-sm" style={{ border: '1px solid #d1d5db' }}>
            <div className="px-6 py-4" style={{ borderBottom: '1px solid #d1d5db' }}>
              <h3 className="text-lg font-semibold" style={{ color: '#0d0d0d' }}>Service Information</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#6b7280' }}>Service Name</label>
                  <p className="text-base font-medium" style={{ color: '#0d0d0d' }}>{contractData.serviceName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#6b7280' }}>Description</label>
                  <p className="text-sm leading-relaxed" style={{ color: '#0d0d0d' }}>{contractData.description}</p>
                </div>
                {/* <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#6b7280' }}>Contract Date</label>
                  <p className="text-base font-medium" style={{ color: '#0d0d0d' }}>{contractData.date}</p>
                </div> */}
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
                    <p className="text-base font-semibold mt-1" style={{ color: '#0d0d0d' }}>{contractData.partnerName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#dcfce7' }}>
                    <Mail className="w-6 h-6" style={{ color: '#009106' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Email</p>
                    <p className="text-base font-medium mt-1" style={{ color: '#1e40af' }}>{contractData.partnerContact.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fff0dd' }}>
                    <Phone className="w-6 h-6" style={{ color: '#ea580c' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Phone</p>
                    <p className="text-base font-medium mt-1" style={{ color: '#0d0d0d' }}>{contractData.partnerContact.phone}</p>
                  </div>
                </div>
                
                {/* <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mt-1" style={{ backgroundColor: '#fff0dd' }}>
                    <MapPin className="w-6 h-6" style={{ color: '#ff9000' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Address</p>
                    <p className="text-base font-medium mt-1 leading-relaxed" style={{ color: '#0d0d0d' }}>{contractData.partnerContact.address}</p>
                  </div>
                </div> */}
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
                  <p className="text-base font-semibold mt-1" style={{ color: '#0d0d0d' }}>{contractData.userName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#dcfce7' }}>
                  <Mail className="w-6 h-6" style={{ color: '#009106' }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Email</p>
                  <p className="text-base font-medium mt-1" style={{ color: '#1e40af' }}>{contractData.userContact.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fff0dd' }}>
                  <Phone className="w-6 h-6" style={{ color: '#ea580c' }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Phone</p>
                  <p className="text-base font-medium mt-1" style={{ color: '#0d0d0d' }}>{contractData.userContact.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewContractDetails;