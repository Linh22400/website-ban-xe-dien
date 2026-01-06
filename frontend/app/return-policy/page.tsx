export const metadata = {
  title: "Chính Sách Đổi Trả | Xe Điện Xanh",
  description: "Thông tin tổng quan về đổi trả và hỗ trợ sau mua hàng tại Xe Điện Xanh.",
};

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-6 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Chính Sách Đổi Trả
          </h1>
          <p className="text-muted-foreground">
            Thông tin tổng quan về việc đổi trả và hỗ trợ khi phát sinh vấn đề.
          </p>
        </div>

        <div className="space-y-6">
          <section className="bg-card p-6 md:p-8 rounded-2xl border border-border">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Nguyên tắc chung</h2>
            <p className="text-muted-foreground leading-relaxed">
              Chính sách đổi trả phụ thuộc theo từng sản phẩm, tình trạng hàng hóa và quy định của hãng.
              Trường hợp phát sinh, đội ngũ hỗ trợ sẽ xác minh và hướng dẫn phương án phù hợp.
            </p>
          </section>

          <section className="bg-card p-6 md:p-8 rounded-2xl border border-border">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Trường hợp có thể hỗ trợ</h2>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              <li>Sản phẩm lỗi kỹ thuật theo xác nhận của trung tâm bảo hành/hãng.</li>
              <li>Giao sai mẫu/màu/phiên bản so với đơn đặt.</li>
              <li>Sản phẩm/linh kiện thiếu hoặc hư hỏng trong quá trình vận chuyển (cần báo sớm).</li>
            </ul>
          </section>

          <section className="bg-card p-6 md:p-8 rounded-2xl border border-border">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Quy trình yêu cầu</h2>
            <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
              <li>Chuẩn bị mã đơn hàng và số điện thoại đặt hàng.</li>
              <li>Liên hệ hotline / đến showroom để được tiếp nhận.</li>
              <li>Kiểm tra tình trạng và xác nhận phương án (đổi/hoàn/khắc phục).</li>
            </ol>
          </section>

          <section className="bg-secondary/30 p-6 md:p-8 rounded-2xl border border-white/10">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Lưu ý</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nội dung trang này là thông tin tổng quan. Điều kiện/chi phí phát sinh (nếu có) sẽ được thông báo
              sau khi xác minh thực tế.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
