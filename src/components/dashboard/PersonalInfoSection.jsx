const PersonalInfoSection = ({ userData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div>
        <h3 className="text-lg font-semibold text-darkGray mb-4">
          Personal Information
        </h3>
        <div className="space-y-3">
          <div>
            <span className="text-brandGray">User ID:</span>
            <span className="ml-2 text-darkGray">{userData.id}</span>
          </div>
          <div>
            <span className="text-brandGray">User Role:</span>
            <span className="ml-2 text-darkGray">{userData.role}</span>
          </div>
          <div>
            <span className="text-brandGray">Phone:</span>
            <span className="ml-2 text-darkGray">{userData.phone}</span>
          </div>
          <div>
            <span className="text-brandGray">Join Date:</span>
            <span className="ml-2 text-darkGray">{userData.joinDate}</span>
          </div>
          <div>
            <span className="text-brandGray">Last Login:</span>
            <span className="ml-2 text-darkGray">{userData.lastLogin}</span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-darkGray mb-4">Address</h3>
        <p className="text-brandGray">{userData.address}</p>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
