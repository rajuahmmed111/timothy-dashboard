
import { Check } from "lucide-react";

const Subscriber = () => {
  const subscriptionData = [
    {
      date: "12/05/25",
      userName: "Hasnain Jarir",
      planName: "Basic",
      price: "$79.99",
      paymentMethod: "Stripe",
      expireDate: "12/05/25",
      status: "active",
    },
    {
      date: "12/05/25",
      userName: "Hasnain Jarir",
      planName: "Pro",
      price: "$07.99",
      paymentMethod: "Stripe",
      expireDate: "12/05/25",
      status: "active",
    },
    {
      date: "12/05/25",
      userName: "Hasnain Jarir",
      planName: "Collector",
      price: "$79.99",
      paymentMethod: "Stripe",
      expireDate: "12/05/25",
      status: "active",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-darkGray mb-6">
        Subscription & Payment
      </h3>

      {/* Mobile Cards */}
      <div className="block md:hidden space-y-4">
        {subscriptionData.map((subscription, index) => (
          <div
            key={index}
            className="border rounded-xl p-4 shadow-sm bg-grayLightBg flex flex-col gap-2"
          >
            <div className="flex justify-between text-sm text-brandGray">
              <span>Date:</span>
              <span className="text-darkGray font-medium">
                {subscription.date}
              </span>
            </div>
            <div className="flex justify-between text-sm text-brandGray">
              <span>User:</span>
              <span className="text-darkGray font-medium">
                {subscription.userName}
              </span>
            </div>
            <div className="flex justify-between text-sm text-brandGray">
              <span>Plan:</span>
              <span className="text-darkGray font-medium">
                {subscription.planName}
              </span>
            </div>
            <div className="flex justify-between text-sm text-brandGray">
              <span>Price:</span>
              <span className="text-darkGray font-medium">
                {subscription.price}
              </span>
            </div>
            <div className="flex justify-between text-sm text-brandGray">
              <span>Payment:</span>
              <span className="text-darkGray font-medium">
                {subscription.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between text-sm text-brandGray">
              <span>Expires:</span>
              <span className="text-darkGray font-medium">
                {subscription.expireDate}
              </span>
            </div>
            <div className="flex justify-between text-sm text-brandGray">
              <span>Status:</span>
              <div className="w-6 h-6 bg-greenMutedBg rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-brandGreen" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 font-bold">
              <th className="py-3 px-4 text-darkGray  text-sm font-bold">
                Date
              </th>
              <th className="py-3 px-4 text-darkGray  text-sm font-bold">
                User Name
              </th>
              <th className="py-3 px-4 text-darkGray  text-sm font-bold">
                Plan Name
              </th>
              <th className="py-3 px-4 text-darkGray  text-sm font-bold">
                Price
              </th>
              <th className="py-3 px-4 text-darkGray font-bold text-sm">
                Provider
              </th>
              <th className="py-3 px-4 text-darkGray font-bold text-sm">
                Expire Date
              </th>
              <th className="py-3 px-4 text-darkGray font-bold text-sm">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {subscriptionData.map((subscription, index) => (
              <tr
                key={index}
                className="hover:bg-grayLightBg transition-colors"
              >
                <td className="py-3 px-4 border-b border-gray-100 text-darkGray">
                  {subscription.date}
                </td>
                <td className="py-3 px-4 border-b border-gray-100 text-darkGray font-medium">
                  {subscription.userName}
                </td>
                <td className="py-3 px-4 border-b border-gray-100 text-darkGray">
                  {subscription.planName}
                </td>
                <td className="py-3 px-4 border-b border-gray-100 text-darkGray">
                  {subscription.price}
                </td>
                <td className="py-3 px-4 border-b border-gray-100 text-darkGray">
                  {subscription.paymentMethod}
                </td>
                <td className="py-3 px-4 border-b border-gray-100 text-darkGray">
                  {subscription.expireDate}
                </td>
                <td className="py-3 px-4 border-b border-gray-100">
                  <div className="w-6 h-6 bg-greenMutedBg rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-brandGreen" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Subscriber;
