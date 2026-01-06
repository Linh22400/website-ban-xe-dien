export const metadata = {
  title: "Chính Sách Bảo Hành | Xe Điện Xanh",
  description: "Thông tin chính sách bảo hành và hỗ trợ sau bán hàng tại Xe Điện Xanh.",
};

export default function WarrantyPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-6 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Chính Sách Bảo Hành
          </h1>
          <p className="text-muted-foreground">
            Thông tin tổng quan về bảo hành và hỗ trợ sau bán hàng.
          </p>
        </div>

        <div className="space-y-6">
          <section className="bg-card p-6 md:p-8 rounded-2xl border border-border">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Phạm vi áp dụng</h2>
            <p className="text-muted-foreground leading-relaxed">
              Chính sách bảo hành áp dụng theo từng dòng xe/linh kiện và điều kiện của hãng.
              Thời hạn và hạng mục bảo hành có thể khác nhau giữa các sản phẩm.
            </p>
          </section>

          <section className="bg-card p-6 md:p-8 rounded-2xl border border-border">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Hồ sơ & điều kiện</h2>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              <li>Hóa đơn/phiếu mua hàng hoặc thông tin đơn hàng.</li>
              <li>Sản phẩm còn trong thời hạn bảo hành theo quy định của hãng.</li>
              <li>Không áp dụng cho các trường hợp hư hỏng do tác động ngoại lực, tự ý can thiệp/sửa chữa.</li>
            </ul>
          </section>

          <section className="bg-card p-6 md:p-8 rounded-2xl border border-border">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Quy trình hỗ trợ</h2>
            <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
              <li>Liên hệ hotline hoặc đến showroom gần nhất.</li>
              <li>Cung cấp mã đơn hàng/số điện thoại đặt hàng để xác minh.</li>
              <li>Nhân viên tiếp nhận, kiểm tra tình trạng và hướng dẫn xử lý.</li>
            </ol>
          </section>

          <section className="bg-secondary/30 p-6 md:p-8 rounded-2xl border border-white/10">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Lưu ý</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nội dung trang này là thông tin tổng quan. Để có thông tin chính xác theo từng sản phẩm,
              vui lòng liên hệ đội ngũ hỗ trợ hoặc xem thông tin bảo hành kèm theo sản phẩm.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
