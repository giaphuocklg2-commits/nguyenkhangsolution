import {
  Truck,
  RotateCcw,
  HeadphonesIcon,
  BadgePercent,
} from "lucide-react";

const services = [
  {
    icon: Truck,
    title: "Giao hỏa tốc 4h",
    description: "Nhận hàng ngay trong ngày",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: RotateCcw,
    title: "Đổi trả miễn phí",
    description: "Trong vòng 30 ngày",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: HeadphonesIcon,
    title: "Hỗ trợ 24/7",
    description: "Tư vấn & CSKH tận tâm",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: BadgePercent,
    title: "Báo giá SLL",
    description: "Chiết khấu cao cho đại lý",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

export function HomeServices() {
  return (
    <section className="bg-white border-y border-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-x-0 lg:divide-x divide-gray-100">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className={`flex items-center gap-4 p-4 lg:p-0 ${
                  index !== 0 ? "lg:pl-8" : ""
                }`}
              >
                <div
                  className={`w-12 h-12 ${service.bg} rounded-full flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className={`h-6 w-6 ${service.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-0.5">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
