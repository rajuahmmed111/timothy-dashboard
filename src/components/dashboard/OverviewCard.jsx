const OverviewCard = ({ title, value, trend }) => {
  const isPositive = trend.includes("↑");
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-brandGray text-sm font-medium">{title}</h3>
      <div className="flex justify-between items-end mt-2">
        <span className="text-2xl font-bold text-darkGray">{value}</span>
        {/* <span
          className={`text-sm ${
            isPositive
              ? "text-brandGreen bg-greenMutedBg p-2 rounded-lg"
              : "text-brandRed bg-redMutedBg p-2 rounded-lg"
          }`}
        >
          {trend}
        </span> */}
      </div>
    </div>
  );
};

export default OverviewCard;
