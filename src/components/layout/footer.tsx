import Link from "next/link";
import { Zap, Phone, Mail, MapPin, Globe, Play } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white text-gray-700 border-t border-gray-200 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#1D4ED8] rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="font-heading font-black text-lg text-[#1D4ED8]">NKS Electric</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-4 font-medium">
              Chuyên cung cấp đèn điện, hệ thống năng lượng mặt trời, inverter và
              dịch vụ lắp đặt điện chuyên nghiệp trên toàn quốc.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 hover:bg-[#1D4ED8] hover:text-white rounded-lg flex items-center justify-center transition-colors text-gray-500"
                aria-label="Website"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 hover:bg-red-600 hover:text-white rounded-lg flex items-center justify-center transition-colors text-gray-500"
                aria-label="Video"
              >
                <Play className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-base uppercase">Danh Mục Sản Phẩm</h3>
            <ul className="space-y-2">
              {[
                { href: "/products?category=den-dien-dan-dung", label: "Đèn Điện Dân Dụng" },
                { href: "/products?category=den-hang-hai", label: "Đèn Hàng Hải" },
                { href: "/products?category=nang-luong-mat-troi", label: "Năng Lượng Mặt Trời" },
                { href: "/products?category=inverter", label: "Inverter" },
                { href: "/products?category=pin-luu-tru", label: "Pin Lưu Trữ" },
                { href: "/products?category=dich-vu-lap-dat", label: "Dịch Vụ Lắp Đặt" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-[#1D4ED8] font-medium text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-base uppercase">Hỗ Trợ</h3>
            <ul className="space-y-2">
              {[
                { href: "/order/track", label: "Tra Cứu Đơn Hàng" },
                { href: "/warranty", label: "Tra Cứu Bảo Hành" },
                { href: "/warranty", label: "Yêu Cầu Bảo Hành" },
                { href: "/cart", label: "Giỏ Hàng" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-[#1D4ED8] font-medium text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-base uppercase">Liên Hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-600 font-medium">
                <MapPin className="h-4 w-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
                <span>123 Đường Nguyễn Văn A, Quận 1, TP.HCM</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                <Phone className="h-4 w-4 text-[#EF4444] flex-shrink-0" />
                <a href="tel:0567810709" className="hover:text-[#1D4ED8] transition-colors">
                  0567810709
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                <Mail className="h-4 w-4 text-[#EF4444] flex-shrink-0" />
                <a
                  href="mailto:info@nks-electric.vn"
                  className="hover:text-[#1D4ED8] transition-colors"
                >
                  info@nks-electric.vn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col items-center justify-center gap-2">
          <p className="text-gray-400 font-semibold text-[13px] text-center w-full">
            Huỳnh Gia Phước - Dev Full-Stack, sđt liên hệ : 0567810709
          </p>
        </div>
      </div>
    </footer>
  );
}
