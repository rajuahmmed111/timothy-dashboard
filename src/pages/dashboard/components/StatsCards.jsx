
import { User, DollarSign, Users, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Total User",
    value: "12,530",
    icon: <User className="w-5 h-5 text-brandGray" />,
    trend: "3.1",
    change: "+0.49% this week",
  },
  {
    title: "Revenue",
    value: "$3,530",
    icon: <DollarSign className="w-5 h-5 text-brandGray" />,
    trend: "2.8",
    change: "+0.32% this week",
  },
  {
    title: "Total Subscribe",
    value: "8,245",
    icon: <Users className="w-5 h-5 text-brandGray" />,
    trend: "4.2",
    change: "+0.67% this week",
  },
];

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-green-600 p-4 sm:p-6 flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
            {stat.icon}
          </div>
          <h3 className="text-brandGray text-sm sm:text-base font-medium mb-1 sm:mb-2">
            {stat.title}
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-darkGray mb-2 sm:mb-3 font-sans">
            {stat.value}
          </p>
          <div className="flex items-center gap-1 sm:gap-2 text-sm font-sans">
            <div className="flex items-center gap-1 text-xl">
              <TrendingUp className="w-6 h-6 text-brandGreen" />
              <span className="text-brandGreen font-medium">{stat.trend}</span>
            </div>
            <span className="text-brandGray text-xl">{stat.change}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
