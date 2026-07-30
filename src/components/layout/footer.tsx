import React from "react";
import Link from "next/link";
import { Zap, Phone, Mail, MapPin, ArrowRight, Shield, Truck, Clock, Star } from "lucide-react";

const productLinks = [
  { href: "/products?category=den-dien-dan-dung", label: "Đèn Điện Dân Dụng" },
  { href: "/products?category=den-hang-hai", label: "Đèn Hàng Hải" },
  { href: "/products?category=nang-luong-mat-troi", label: "Năng Lượng Mặt Trời" },
  { href: "/products?category=inverter", label: "Inverter" },
  { href: "/products?category=pin-luu-tru", label: "Pin Lưu Trữ" },
  { href: "/products?category=dich-vu-lap-dat", label: "Dịch Vụ Lắp Đặt" },
];

const supportLinks = [
  { href: "/order/track", label: "Tra Cứu Đơn Hàng" },
  { href: "/warranty", label: "Yêu Cầu Bảo Hành" },
  { href: "/cart", label: "Giỏ Hàng" },
  { href: "/products", label: "Tất Cả Sản Phẩm" },
];

const promises = [
  { icon: Truck, text: "Giao hàng toàn quốc" },
  { icon: Shield, text: "Bảo hành chính hãng" },
  { icon: Clock, text: "Hỗ trợ 24/7" },
  { icon: Star, text: "10+ năm kinh nghiệm" },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Promise bar */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {promises.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.text} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-blue-600/20 border border-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4.5 w-4.5 text-blue-400" style={{ width: "1.1rem", height: "1.1rem" }} />
                  </div>
                  <span className="text-sm font-semibold text-slate-300">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/30">
                <Zap className="h-5 w-5 text-white fill-white" />
              </div>
              <div>
                <span className="font-heading font-black text-lg text-white leading-none block">NKS Electric</span>
                <span className="text-[10px] text-slate-500 font-medium">Điện & Năng Lượng Mặt Trời</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Chuyên cung cấp đèn điện, hệ thống năng lượng mặt trời, inverter và dịch vụ lắp đặt chuyên nghiệp trên toàn quốc.
            </p>

            {/* CTA */}
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 px-3 py-2 rounded-xl transition-all"
            >
              Xem sản phẩm <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest">
              Danh Mục
            </h3>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-blue-400 font-medium text-sm transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-blue-500 transition-colors flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest">
              Hỗ Trợ
            </h3>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-blue-400 font-medium text-sm transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-blue-500 transition-colors flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest">
              Liên Hệ
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-400 leading-snug">
                  Tỉnh Bình Thuận, Việt Nam
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-green-400 flex-shrink-0" />
                <a href="tel:0567810709" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
                  0567 810 709
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <a href="mailto:info@nks-electric.vn" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
                  info@nks-electric.vn
                </a>
              </li>
            </ul>

            {/* Certifications */}
            <div className="mt-5 p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <p className="text-[11px] font-bold text-slate-400 mb-2">✅ Đã xác thực</p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-[10px] bg-green-500/15 border border-green-500/20 text-green-400 px-2 py-0.5 rounded-md font-semibold">DMCA Protected</span>
                <span className="text-[10px] bg-blue-500/15 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-md font-semibold">SSL Secured</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-slate-500 text-xs font-medium text-center sm:text-left">
            © 2024 NKS Electric. Bảo lưu mọi quyền.
          </p>
          <p className="text-slate-600 text-xs font-medium">
            Phát triển bởi <span className="text-blue-500 font-semibold">Huỳnh Gia Phước</span> · Full-Stack Dev
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
