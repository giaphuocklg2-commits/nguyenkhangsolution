import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

function generateOrderCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "NKS-";
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Categories
  const categories = [
    {
      name: "Đèn Điện Dân Dụng",
      slug: "den-dien-dan-dung",
      description: "Đèn LED, đèn huỳnh quang, đèn tiết kiệm điện cho gia đình",
      image: "/images/categories/den-dan-dung.jpg",
    },
    {
      name: "Đèn Hàng Hải",
      slug: "den-hang-hai",
      description:
        "Đèn chiếu sáng chuyên dụng cho tàu thuyền, cảng biển, hải đăng",
      image: "/images/categories/den-hang-hai.jpg",
    },
    {
      name: "Năng Lượng Mặt Trời",
      slug: "nang-luong-mat-troi",
      description: "Tấm pin mặt trời, hệ thống điện năng lượng mặt trời",
      image: "/images/categories/nlmt.jpg",
    },
    {
      name: "Inverter",
      slug: "inverter",
      description: "Bộ chuyển đổi điện inverter các loại công suất",
      image: "/images/categories/inverter.jpg",
    },
    {
      name: "Pin Lưu Trữ",
      slug: "pin-luu-tru",
      description: "Pin lithium, acquy lưu trữ điện năng lượng mặt trời",
      image: "/images/categories/pin.jpg",
    },
    {
      name: "Dịch Vụ Lắp Đặt",
      slug: "dich-vu-lap-dat",
      description:
        "Dịch vụ lắp đặt hệ thống điện, NLMT tại nhà và doanh nghiệp",
      image: "/images/categories/dich-vu.jpg",
    },
  ];

  console.log("Creating categories...");
  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    createdCategories[cat.slug] = created.id;
  }

  // Products
  const products = [
    {
      name: "Đèn LED Bulb E27 9W",
      slug: "den-led-bulb-e27-9w",
      description: "Đèn LED Bulb tiết kiệm điện, tuổi thọ 25,000 giờ",
      detail:
        "Đèn LED Bulb E27 9W với công nghệ chip LED tiên tiến, tiết kiệm đến 80% điện năng so với đèn sợi đốt. Ánh sáng trắng 6500K hoặc vàng 3000K. Tuổi thọ 25,000 giờ, bảo hành 2 năm.",
      price: 35000,
      salePrice: 29000,
      saleEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      ]),
      stock: 500,
      isFeatured: true,
      categorySlug: "den-dien-dan-dung",
    },
    {
      name: "Đèn Downlight LED 12W Âm Trần",
      slug: "den-downlight-led-12w-am-tran",
      description: "Đèn downlight LED âm trần, chống ẩm IP44",
      detail:
        "Đèn downlight LED 12W âm trần, thiết kế tròn tinh tế phù hợp với mọi không gian. Chỉ số hoàn màu CRI>80, ánh sáng tự nhiên. Chống ẩm IP44, phù hợp phòng tắm, bếp.",
      price: 125000,
      salePrice: null,
      saleEndDate: null,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      ]),
      stock: 200,
      isFeatured: true,
      categorySlug: "den-dien-dan-dung",
    },
    {
      name: "Đèn Hải Đăng LED 100W Chống Nước",
      slug: "den-hai-dang-led-100w-chong-nuoc",
      description: "Đèn hàng hải chuyên dụng, chống nước IP67, góc chiếu 360°",
      detail:
        "Đèn LED hàng hải 100W chuyên dụng cho tàu thuyền. Vỏ nhôm đúc nguyên khối, chống ăn mòn muối biển. Cấp bảo vệ IP67, chịu sóng và áp suất nước. Góc chiếu 360 độ, nhìn thấy từ xa 5 hải lý.",
      price: 2850000,
      salePrice: 2500000,
      saleEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400",
      ]),
      stock: 50,
      isFeatured: true,
      categorySlug: "den-hang-hai",
    },
    {
      name: "Tấm Pin Năng Lượng Mặt Trời 400W Mono",
      slug: "tam-pin-nang-luong-mat-troi-400w-mono",
      description: "Tấm pin NLMT Monocrystalline 400W, hiệu suất 21.3%",
      detail:
        "Tấm pin năng lượng mặt trời 400W sử dụng tế bào Monocrystalline PERC. Hiệu suất chuyển đổi 21.3%, vượt trội trong điều kiện ánh sáng yếu. Khung nhôm anod hóa, chịu tải tuyết 5400Pa. Bảo hành công suất 25 năm.",
      price: 3200000,
      salePrice: 2900000,
      saleEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400",
      ]),
      stock: 100,
      isFeatured: true,
      categorySlug: "nang-luong-mat-troi",
    },
    {
      name: "Inverter Hybrid 5KW 3 Pha",
      slug: "inverter-hybrid-5kw-3-pha",
      description: "Inverter hybrid nối lưới/off-grid 5KW 3 pha",
      detail:
        "Inverter hybrid 5KW 3 pha hỗ trợ cả chế độ nối lưới và off-grid. Tích hợp MPPT 2 kênh, theo dõi điểm công suất cực đại. Màn hình LCD, kết nối WiFi giám sát từ xa. Hiệu suất 97.6%, bảo hành 5 năm.",
      price: 28500000,
      salePrice: null,
      saleEndDate: null,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400",
      ]),
      stock: 20,
      isFeatured: false,
      categorySlug: "inverter",
    },
    {
      name: "Pin LiFePO4 100Ah 48V",
      slug: "pin-lifepo4-100ah-48v",
      description: "Pin lithium LiFePO4 100Ah 48V, BMS tích hợp, 4000+ chu kỳ",
      detail:
        "Pin lưu trữ LiFePO4 100Ah 48V với BMS (Battery Management System) tích hợp bảo vệ quá áp, quá dòng, nhiệt độ. Tuổi thọ 4000+ chu kỳ sạc (80% DoD). An toàn tuyệt đối, không cháy nổ. Kết nối nối tiếp/song song để mở rộng dung lượng.",
      price: 18900000,
      salePrice: 17500000,
      saleEndDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      ]),
      stock: 35,
      isFeatured: true,
      categorySlug: "pin-luu-tru",
    },
    {
      name: "Gói Lắp Đặt NLMT Hộ Gia Đình 5KWp",
      slug: "goi-lap-dat-nlmt-ho-gia-dinh-5kwp",
      description: "Trọn gói lắp đặt hệ thống điện mặt trời 5KWp nối lưới",
      detail:
        "Gói lắp đặt hoàn chỉnh hệ thống điện mặt trời 5KWp nối lưới bao gồm: 12 tấm pin 420W + Inverter 5KW + Khung giá đỡ + Dây điện + Tủ điện + Công lắp đặt + Hỗ trợ thủ tục EVN. Bảo hành thi công 12 tháng.",
      price: 65000000,
      salePrice: 59000000,
      saleEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400",
      ]),
      stock: 999,
      isFeatured: true,
      categorySlug: "dich-vu-lap-dat",
    },
    {
      name: "Đèn Pha LED 200W Hàng Hải",
      slug: "den-pha-led-200w-hang-hai",
      description: "Đèn pha LED 200W chiếu sáng boong tàu, IP66",
      detail:
        "Đèn pha LED 200W chuyên dụng cho chiếu sáng boong tàu và cầu cảng. Thân vỏ nhôm hàng không, chống gỉ sét muối biển. Góc chiếu 120°, quang thông 22,000lm. IP66, chịu rung lắc cấp 5. Phù hợp lắp trên cột cao 6-10m.",
      price: 4500000,
      salePrice: null,
      saleEndDate: null,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400",
      ]),
      stock: 30,
      isFeatured: false,
      categorySlug: "den-hang-hai",
    },
  ];

  console.log("Creating products...");
  for (const product of products) {
    const { categorySlug, ...productData } = product;
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {
        ...productData,
        categoryId: createdCategories[categorySlug],
      },
      create: {
        ...productData,
        categoryId: createdCategories[categorySlug],
      },
    });
  }

  // Staff accounts
  console.log("Creating staff accounts...");
  const staffList = [
    {
      name: "Nguyễn Khang",
      email: "nguyenkhang@shop",
      password: "Kgg@123456",
      role: "SUPER_ADMIN",
    },
    {
      name: "Super Admin",
      email: "admin@nks-electric.vn",
      password: "Admin@123456",
      role: "SUPER_ADMIN",
    },
    {
      name: "Nguyễn Văn Giám Đốc",
      email: "giamdoc@nks-electric.vn",
      password: "Director@123",
      role: "DIRECTOR",
    },
    {
      name: "Trần Thị CSKH",
      email: "cskh@nks-electric.vn",
      password: "Cskh@123456",
      role: "CSKH",
    },
    {
      name: "Lê Văn Seller",
      email: "seller@nks-electric.vn",
      password: "Seller@123",
      role: "SELLER",
    },
    {
      name: "Phạm Thị Kế Toán",
      email: "ketoan@nks-electric.vn",
      password: "Ketoan@123",
      role: "ACCOUNTANT",
    },
  ];

  for (const staff of staffList) {
    const hashedPassword = await bcrypt.hash(staff.password, 12);
    await prisma.staff.upsert({
      where: { email: staff.email },
      update: {},
      create: {
        ...staff,
        password: hashedPassword,
      },
    });
  }

  // Sample order
  console.log("Creating sample orders...");
  const products_db = await prisma.product.findMany({ take: 2 });

  if (products_db.length >= 2) {
    const orderCode = generateOrderCode();
    const order = await prisma.order.upsert({
      where: { orderCode },
      update: {},
      create: {
        orderCode,
        customerName: "Nguyễn Văn Khách",
        phone: "0901234567",
        email: "khach@example.com",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        notes: "Giao trong giờ hành chính",
        status: "CONFIRMED",
        totalAmount: products_db[0].price + products_db[1].price * 2,
        items: {
          create: [
            {
              productId: products_db[0].id,
              name: products_db[0].name,
              quantity: 1,
              price: products_db[0].price,
            },
            {
              productId: products_db[1].id,
              name: products_db[1].name,
              quantity: 2,
              price: products_db[1].price,
            },
          ],
        },
        trackingHistory: {
          create: [
            {
              status: "PENDING",
              note: "Đơn hàng mới được tạo",
              updatedBy: "Hệ thống",
            },
            {
              status: "CONFIRMED",
              note: "Seller đã xác nhận đơn hàng",
              updatedBy: "Lê Văn Seller",
            },
          ],
        },
      },
    });
    console.log(`Created sample order: ${order.orderCode}`);
  }

  console.log("✅ Seed completed!");
  console.log("\n📋 Staff accounts:");
  console.log("  Admin 1: nguyenkhang@shop / Kgg@123456");
  console.log("  Admin 2: admin@nks-electric.vn / Admin@123456");
  console.log("  CSKH: cskh@nks-electric.vn / Cskh@123456");
  console.log("  Seller: seller@nks-electric.vn / Seller@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
