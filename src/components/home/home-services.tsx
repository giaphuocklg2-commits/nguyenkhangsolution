import React from "react";
import { Truck, Shield, Wrench, HeadphonesIcon, Star, RefreshCw } from "lucide-react";

const services = [
  {
    icon: Truck,
    title: "Giao Hàng Toàn Quốc",
    desc: "Vận chuyển nhanh chóng đến tận nơi trên 63 tỉnh thành. Đóng gói cẩn thận, an toàn.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200/60",
  },
  {
    icon: Shield,
    title: "Bảo Hành Chính Hãng",
    desc: "Bảo hành từ 12 tháng đến 25 năm tùy sản phẩm. Đổi trả miễn phí trong 30 ngày.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200/60",
  },
  {
    icon: Wrench,
    title: "Lắp Đặt Chuyên Nghiệp",
    desc: "Đội ngũ kỹ sư có chứng chỉ lắp đặt hệ thống điện và NLMT tại nhà bạn.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200/60",
  },
  {
    icon: HeadphonesIcon,
    title: "Hỗ Trợ 24/7",
    desc: "Hotline và chat hỗ trợ kỹ thuật mọi lúc. Phản hồi trong vòng 30 phút.",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200/60",
  },
  {
    icon: Star,
    title: "Sản Phẩm Chính Hãng",
    desc: "100% hàng chính hãng, có tem chống giả và hóa đơn VAT đầy đủ khi mua.",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200/60",
  },
  {
    icon: RefreshCw,
    title: "Trả Góp 0% Lãi Suất",
    desc: "Liên kết với 15+ ngân hàng, trả góp 0% lãi suất lên đến 24 tháng.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200/60",
  },
];

export const HomeServices: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 pb-14">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-500" />
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Dịch Vụ</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          Tại Sao Chọn <span className="gradient-text-blue">NKS Electric?</span>
        </h2>
        <p className="text-slate-500 text-sm mt-2 max-w-lg mx-auto">
          Chúng tôi cam kết mang đến trải nghiệm mua sắm và dịch vụ hậu mãi tốt nhất cho mọi khách hàng
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.title}
              className={`bg-white rounded-2xl border ${service.border} p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex gap-4`}
            >
              <div className={`w-12 h-12 rounded-xl ${service.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon className={`h-6 w-6 ${service.color}`} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-blue-700 transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {service.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HomeServices;
