import { User, DollarSign, MessageCircle } from "lucide-react";

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
    },
    {
      id: "finance",
      label: "Finance",
      icon: DollarSign,
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageCircle,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-4 text-sm font-medium ${
                activeTab === tab.id
                  ? "text-yellow-500 border-b-2 border-orangePrimary"
                  : "text-brandGray hover:text-darkGray"
              }`}
            >
              <IconComponent className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;
