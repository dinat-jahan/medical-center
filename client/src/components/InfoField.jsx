export const InfoField = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 bg-teal-50 p-3 rounded-xl">
    <div className="text-teal-500 text-lg mt-1">{icon}</div>
    <div className="w-full">
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="text-base font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);
