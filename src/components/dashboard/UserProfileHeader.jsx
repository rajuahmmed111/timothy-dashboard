const UserProfileHeader = ({ userData }) => {
  return (
    <div className="flex items-center mb-8">
      <img
        src={userData.profileImage}
        alt={userData.name}
        className="w-20 h-20 rounded-full mr-6"
      />
      <div>
        <h2 className="text-2xl font-bold text-darkGray">{userData.name}</h2>
        <p className="text-brandGray">{userData.email}</p>
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
            userData.status === "Active"
              ? "bg-greenMutedBg text-brandGreen"
              : "bg-redMutedBg text-red-800"
          }`}
        >
          {userData.status}
        </span>
      </div>
    </div>
  );
};

export default UserProfileHeader;
