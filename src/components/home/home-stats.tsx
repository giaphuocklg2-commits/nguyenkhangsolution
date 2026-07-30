const stats = [
  { value: "500+", label: "Sản phẩm", suffix: "" },
  { value: "2000", label: "Khách hàng", suffix: "+" },
  { value: "99", label: "Hài lòng", suffix: "%" },
  { value: "5", label: "Năm kinh nghiệm", suffix: "+" },
];

export function HomeStats() {
  return (
    <section className="bg-yellow-500  py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading text-3xl md:text-4xl font-bold text-white mb-1">
                {stat.value}
                <span className="text-yellow-100">{stat.suffix}</span>
              </div>
              <div className="text-yellow-100 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
