/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Heart,
  Palette,
  Compass,
  Award,
  Clock,
  Truck,
  Eye,
  Check,
  PackageCheck,
  Headphones,
  FileCheck2,
} from 'lucide-react';

export const About: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'story' | 'standards' | 'partner' | 'identity' | 'services'>('story');

  const colorPalette = [
    { name: 'Hồng phấn (Chủ đạo)', hex: '#FDDFEF', textDark: true, usage: 'Nền logo, điểm nhấn nhận diện thương hiệu' },
    { name: 'Nâu mận nhạt (Chủ đạo)', hex: '#85505A', textDark: false, usage: 'Biểu tượng xoáy mống mắt và ký tự thương hiệu' },
    { name: 'Hồng cánh sen (Nhấn)', hex: '#D96B8A', textDark: false, usage: 'Nút hành động chính (CTA), nhãn bộ sưu tập' },
    { name: 'Hồng đậm (Nhấn)', hex: '#BB5371', textDark: false, usage: 'Thanh định vị danh mục, trạng thái hoạt động' },
    { name: 'Hồng nhạt (Phụ)', hex: '#FDE7F1', textDark: true, usage: 'Thanh thông báo ưu đãi và khung thông tin phụ trợ' },
    { name: 'Trắng hồng (Nền)', hex: '#FFF9FA', textDark: true, usage: 'Gam màu nền không gian trải nghiệm toàn website' },
    { name: 'Nâu mận đậm (Văn bản)', hex: '#3A232B', textDark: false, usage: 'Tiêu đề trang trọng và chữ nhận diện Dyadia' },
    { name: 'Xanh đen đậm (Văn bản)', hex: '#0F172B', textDark: false, usage: 'Nội dung thông số nhãn khoa và mô tả chi tiết' },
  ];

  const standards = [
    {
      title: '100% Nhập Khẩu Chính Hãng',
      desc: 'Toàn bộ kính áp tròng được nhập khẩu trực tiếp từ Seoul (Hàn Quốc), nguyên seal vô trùng với mã vạch truy xuất nguồn gốc rõ ràng.',
      icon: ShieldCheck,
    },
    {
      title: 'Chất Liệu Sinh Học Cao Cấp',
      desc: 'Ứng dụng chất liệu tân tiến Phosphorylcholine (PC) & Silicone Hydrogel giúp khóa ẩm vượt trội, thẩm thấu oxy cao và ngăn ngừa bám bẩn.',
      icon: Eye,
    },
    {
      title: 'Tiên Phong Mua Lẻ Theo Chiếc',
      desc: 'Thấu hiểu khách hàng có độ cận lệch nhau ở hai mắt, Dyadia cung cấp giải pháp mua lẻ từng chiếc linh hoạt, tối ưu chi phí tối đa.',
      icon: PackageCheck,
    },
    {
      title: 'Tư Vấn Nhãn Khoa & AI 24/7',
      desc: 'Hệ thống trợ lý tư vấn thông minh cùng đội ngũ chuyên viên hỗ trợ đọc đơn kính, chọn chuẩn độ cong (BC) và đường kính (DIA) cho mắt.',
      icon: Headphones,
    },
  ];

  const certifications = [
    {
      name: 'KFDA (Hàn Quốc)',
      desc: 'Chứng nhận đạt tiêu chuẩn an toàn trang thiết bị y tế và quang học từ Cục Quản lý Thực phẩm & Dược phẩm Hàn Quốc.',
    },
    {
      name: 'CE 0197 (Châu Âu)',
      desc: 'Đạt chứng chỉ chất lượng nghiêm ngặt của Liên minh Châu Âu về thiết bị bảo vệ và chăm sóc sức khỏe thị giác.',
    },
    {
      name: 'ISO 13485:2016',
      desc: 'Tiêu chuẩn quốc tế về hệ thống quản lý chất lượng dành riêng cho lĩnh vực sản xuất thiết bị y tế vô trùng.',
    },
    {
      name: 'Khuyến Nghị Y Khoa',
      desc: 'Tuân thủ nghiêm ngặt các hướng dẫn vệ sinh và chăm sóc giác mạc theo quy chuẩn nhãn khoa hiện hành.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12">
      {/* 1. Header Banner */}
      <div className="text-center space-y-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FDDFEF] border border-rose-200/80 rounded-full text-xs font-semibold text-[#85505A]">
          <Sparkles className="w-3.5 h-3.5 text-[#D96B8A]" />
          <span>Thương hiệu phân phối kính áp tròng Hàn Quốc chính hãng</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-normal text-[#3A232B] tracking-tight leading-tight">
          Nơi Ánh Nhìn Xuyên Qua Lens Trở Nên Rực Rỡ
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Dyadia Lens là ngôi nhà của những thiết kế kính áp tròng thời thượng chuẩn phong cách K-Beauty. Chúng tôi đồng hành cùng bạn khám phá vẻ đẹp tự nhiên của đôi mắt qua các bộ sưu tập Hapa Kristin chính hãng, tiêu chuẩn nhãn khoa quốc tế và dịch vụ tư vấn cá nhân hóa tận tâm.
        </p>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <button
            type="button"
            onClick={() => setActiveTab('story')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'story'
                ? 'bg-[#D96B8A] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-rose-50 border border-rose-100'
            }`}
          >
            1. Câu chuyện thương hiệu
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('standards')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'standards'
                ? 'bg-[#D96B8A] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-rose-50 border border-rose-100'
            }`}
          >
            2. Tiêu chuẩn & Cam kết
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('partner')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'partner'
                ? 'bg-[#D96B8A] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-rose-50 border border-rose-100'
            }`}
          >
            3. Đối tác Hapa Kristin & Đại sứ
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('identity')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'identity'
                ? 'bg-[#D96B8A] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-rose-50 border border-rose-100'
            }`}
          >
            4. Bộ nhận diện thương hiệu
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'services'
                ? 'bg-[#D96B8A] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-rose-50 border border-rose-100'
            }`}
          >
            5. Dịch vụ & Trải nghiệm
          </button>
        </div>
      </div>

      {/* 2. TAB CONTENT: Brand Story */}
      {activeTab === 'story' && (
        <div className="space-y-12">
          {/* Logo & Linguistic Philosophy */}
          <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#FDDFEF] to-[#FFF5F8] rounded-2xl border border-rose-200/60 shadow-inner">
              <img
                src="/images/logo/dyadia-logo.jpg"
                alt="Logo chính thức Dyadia Lens"
                className="w-64 h-64 sm:w-72 sm:h-72 object-contain rounded-2xl shadow-sm"
              />
              <span className="mt-4 text-xs font-medium text-[#85505A] tracking-wider uppercase text-center">
                Biểu tượng chính thức thương hiệu Dyadia Lens
              </span>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 rounded-full text-xs font-semibold text-[#B84A6A]">
                <Compass className="w-3.5 h-3.5" />
                <span>Nguồn gốc tên gọi Dyadia</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#3A232B]">
                Triết lý tên gọi và biểu tượng ánh nhìn
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tên <strong>"Dyadia"</strong> được sáng tạo từ sự giao thoa tinh tế giữa khoa học quang học và nghệ thuật tôn vinh vẻ đẹp đôi mắt. Từng âm tiết mang trọn thông điệp mà thương hiệu gửi gắm:
              </p>

              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3 p-3.5 bg-[#FFF9FA] border border-rose-100 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-[#FDDFEF] text-[#85505A] flex items-center justify-center font-bold text-xs shrink-0">
                    dia-
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#3A232B]">Tiền tố Hy Lạp dia- ("Xuyên qua & Kết nối")</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Lấy cảm hứng từ thuật ngữ quang học <em>diopter</em> (độ khúc xạ), gợi hình ảnh ánh nhìn trong veo xuyên qua lớp màng kính áp tròng để mở ra một góc nhìn thế giới rạng ngời, tự tin.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-[#FFF9FA] border border-rose-100 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-[#FDDFEF] text-[#85505A] flex items-center justify-center font-bold text-xs shrink-0">
                    DIA
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#3A232B]">Ký hiệu Đường kính giác mạc (Diameter)</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Thông số kỹ thuật nhãn khoa cốt lõi trên mỗi sản phẩm kính áp tròng. Dyadia đề cao sự vừa vặn êm ái, đảm bảo mọi sản phẩm đều phù hợp với cấu trúc mắt người Châu Á.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-[#FFF9FA] border border-rose-100 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-[#FDDFEF] text-[#85505A] flex items-center justify-center font-bold text-xs shrink-0">
                    -ia
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#3A232B]">Hậu tố -ia ("Xứ sở của cái đẹp")</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Biến Dyadia thành một không gian tràn ngập cảm hứng làm đẹp, nơi khách hàng an tâm tìm thấy những gam màu lens thời thượng và cẩm nang chăm sóc mắt chuẩn chuyên gia.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sứ mệnh & Tầm nhìn */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-gradient-to-br from-white to-[#FFF5F8] border border-rose-100 rounded-3xl space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#FDDFEF] text-[#D96B8A] flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif font-normal text-[#3A232B]">Sứ Mệnh Của Chúng Tôi</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Đưa kính áp tròng trở thành một phần tự nhiên trong chu trình làm đẹp hàng ngày của phái đẹp Việt Nam. Chúng tôi cam kết mang lại sản phẩm an toàn tuyệt đối, xóa tan định kiến về sự cộm khô bằng chất liệu sinh học cao cấp và dịch vụ tư vấn tận tâm.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-white to-[#FFF5F8] border border-rose-100 rounded-3xl space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#FDDFEF] text-[#D96B8A] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif font-normal text-[#3A232B]">Tầm Nhìn Thương Hiệu</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Trở thành hệ thống phân phối kính áp tròng thời trang Hàn Quốc uy tín hàng đầu tại Việt Nam, tiên phong cập nhật xu hướng K-Beauty thịnh hành và ứng dụng công nghệ tư vấn thông minh để mỗi khách hàng đều tìm được chiếc lens sinh ra dành riêng cho mình.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB CONTENT: Standards & Commitments */}
      {activeTab === 'standards' && (
        <div className="space-y-12">
          {/* Sứ mệnh tháo gỡ rào cản cho người đeo lens */}
          <div className="space-y-6">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#D96B8A] font-semibold">Định vị giá trị</span>
              <h3 className="text-2xl sm:text-3xl font-serif font-normal text-[#3A232B]">
                Bốn cam kết vàng từ Nhà phân phối Dyadia Lens
              </h3>
              <p className="text-xs text-slate-600">
                Chúng tôi giải quyết triệt để những băn khoăn lớn nhất của khách hàng khi tìm kiếm kính áp tròng chất lượng cao.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {standards.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="p-6 bg-white border border-rose-100 rounded-2xl shadow-xs space-y-3 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF0F5] text-[#D96B8A] flex items-center justify-center">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-[#3A232B]">{item.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quy trình kiểm soát chất lượng chính ngạch */}
          <div className="bg-gradient-to-r from-[#FFF5F8] via-white to-[#FFF5F8] border border-rose-100 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#D96B8A] font-semibold">Quy chuẩn vận hành</span>
              <h3 className="text-2xl font-serif font-normal text-[#3A232B]">
                Quy trình kiểm soát sản phẩm nghiêm ngặt
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-5 bg-white border border-rose-100 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#B84A6A]">
                  <span className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center">1</span>
                  <span>Nhập khẩu trực tiếp từ Hàn Quốc</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sản phẩm được vận chuyển bằng đường hàng không với điều kiện bảo quản nhiệt độ nghiêm ngặt, đảm bảo lớp màng ngậm nước luôn ở trạng thái hoàn hảo nhất.
                </p>
              </div>

              <div className="p-5 bg-white border border-rose-100 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#B84A6A]">
                  <span className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center">2</span>
                  <span>Kiểm tra vô trùng & Nguyên seal</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Từng vỉ lens và hộp sản phẩm được đối soát số lô (Lot Number), hạn sử dụng (EXP) và độ nguyên vẹn của màng nhôm niêm phong trước khi xuất kho.
                </p>
              </div>

              <div className="p-5 bg-white border border-rose-100 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#B84A6A]">
                  <span className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center">3</span>
                  <span>Đóng gói cao cấp kèm phụ kiện</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mỗi đơn hàng đều được bọc chống sốc kỹ lưỡng và tặng kèm khay đựng lens cao cấp kháng khuẩn, nhíp gắp silicone êm ái bảo vệ bề mặt lens.
                </p>
              </div>
            </div>
          </div>

          {/* Chứng nhận quốc tế */}
          <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <h4 className="text-base font-serif font-medium text-[#3A232B] flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#D96B8A]" />
              <span>Chứng nhận chất lượng & Tiêu chuẩn nhãn khoa quốc tế</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {certifications.map((cert, idx) => (
                <div key={idx} className="p-4 bg-[#FFF9FA] border border-rose-100 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-[#B84A6A]">{cert.name}</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{cert.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT: Partner Hapa Kristin */}
      {activeTab === 'partner' && (
        <div className="space-y-12">
          <div className="bg-gradient-to-br from-white via-[#FFF5F8] to-[#FFE8EE] border border-rose-100 rounded-3xl p-8 sm:p-12 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-rose-200 rounded-full text-xs font-semibold text-[#D96B8A]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Đối tác chiến lược thương hiệu</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#3A232B] leading-snug">
                Hapa Kristin – Thương hiệu K-Lens đình đám bậc nhất Châu Á
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Hapa Kristin (thuộc tập đoàn PPB Studios, Seoul) là thương hiệu tiên phong định hình lại phong cách làm đẹp đôi mắt trên toàn cầu. Khác biệt với những dòng lens truyền thống, Hapa Kristin biến mỗi chiếc kính áp tròng thành một tác phẩm nghệ thuật, mang đến ánh nhìn trong veo, có chiều sâu và phản chiếu cảm xúc tinh tế.
              </p>
              <div className="space-y-2 pt-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D96B8A] shrink-0" />
                  <span><strong>Đại sứ thương hiệu toàn cầu:</strong> Jang Wonyoung (IVE) – Biểu tượng nhan sắc tạo nên làn sóng "Wonyoungism" rực rỡ</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D96B8A] shrink-0" />
                  <span><strong>Hiện diện tại 10+ quốc gia:</strong> Hệ thống cửa hàng tại Hàn Quốc, Nhật Bản, Đài Loan, Singapore và Hoa Kỳ</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D96B8A] shrink-0" />
                  <span><strong>Flagship Store Quốc Tế:</strong> Cửa hàng trải nghiệm nổi tiếng trên đại lộ thời trang danh giá Melrose Avenue, Los Angeles (Mỹ)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D96B8A] shrink-0" />
                  <span><strong>Được phân phối chính thức tại Dyadia Lens:</strong> Cam kết 100% hàng mới, nguyên seal vô trùng y tế</span>
                </div>
              </div>
            </div>

            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-rose-50 border border-rose-100 shadow-md">
              <img
                src="/images/banners/catitude-banner.webp"
                alt="Hapa Kristin & Jang Wonyoung"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 5 Collections Grid */}
          <div className="space-y-6">
            <h3 className="text-2xl font-serif font-normal text-center text-[#3A232B]">
              Năm bộ sưu tập Hapa Kristin phân phối chính hãng tại Dyadia Lens
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-white border border-rose-100 rounded-2xl shadow-xs space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D96B8A]">01 · Bán chạy nhất</span>
                <h4 className="text-base font-serif font-semibold text-[#3A232B]">Cat-titude Kristin Series</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Thiết kế viền mở tròng tinh nghịch, tạo chiều sâu mắt mèo kiêu kỳ nhưng vẫn giữ nét mềm mại với các tone Tabby Brown, Sapphire Gray và Choco Paw.
                </p>
              </div>

              <div className="p-6 bg-white border border-rose-100 rounded-2xl shadow-xs space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D96B8A]">02 · Biểu tượng K-Beauty</span>
                <h4 className="text-base font-serif font-semibold text-[#3A232B]">One&Only Kristin Series</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dòng lens tự nhiên bán chạy số 1 Châu Á với dải highlight mô phỏng ánh hoàng hôn lung linh, giúp đôi mắt bừng sáng tự nhiên trong mọi góc nhìn.
                </p>
              </div>

              <div className="p-6 bg-white border border-rose-100 rounded-2xl shadow-xs space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D96B8A]">03 · Búp bê ngọt ngào</span>
                <h4 className="text-base font-serif font-semibold text-[#3A232B]">Dolly Kristin Series</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Đường viền tròn búp bê ngây thơ, kết hợp bảng màu tone ấm tôn vinh làn da người Châu Á với các tone Choco, Gray, Beige, Lavender và Black.
                </p>
              </div>

              <div className="p-6 bg-white border border-rose-100 rounded-2xl shadow-xs space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D96B8A]">04 · Trong trẻo tinh khôi</span>
                <h4 className="text-base font-serif font-semibold text-[#3A232B]">First Love Kristin Series</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tái hiện nét thuần khiết của mối tình đầu với hiệu ứng mống mắt mờ ảo, lý tưởng cho môi trường học tập và công sở hàng ngày.
                </p>
              </div>

              <div className="p-6 bg-white border border-rose-100 rounded-2xl shadow-xs space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D96B8A]">05 · Mộng mơ sương khói</span>
                <h4 className="text-base font-serif font-semibold text-[#3A232B]">Secret Garden Kristin Series</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bảng màu huyền bí pha trộn giữa sắc xanh lá non, tím khói và ánh hổ phách ma mị, tạo điểm nhấn ấn tượng cho những bữa tiệc tối sang trọng.
                </p>
              </div>

              <div className="p-6 bg-[#FFF5F8] border border-rose-200 rounded-2xl shadow-xs flex flex-col justify-center items-center text-center space-y-3">
                <h4 className="text-base font-serif font-semibold text-[#3A232B]">Khám phá trọn bộ 35 sản phẩm</h4>
                <p className="text-xs text-slate-600">Mua lẻ từng chiếc theo độ cận độc lập cho 2 mắt</p>
                <Link
                  to="/products"
                  className="px-5 py-2 bg-[#D96B8A] text-white text-xs font-semibold rounded-full hover:bg-[#C24A6D] transition-colors shadow-xs"
                >
                  Xem cửa hàng ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: Brand Identity */}
      {activeTab === 'identity' && (
        <div className="space-y-12">
          {/* Tagline Showcase */}
          <div className="text-center p-8 bg-gradient-to-r from-[#FDDFEF] via-[#FFF5F8] to-[#FDDFEF] border border-rose-200 rounded-3xl shadow-xs space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#85505A] font-semibold">Khẩu hiệu thương hiệu (Tagline)</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#3A232B]">
              “Chạm ánh nhìn, bừng cá tính”
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto pt-1 leading-relaxed">
              Câu khẩu hiệu với nhịp điệu 3-3 hài hòa. Vế đầu <em>"chạm ánh nhìn"</em> mô tả khoảnh khắc chiếc lens êm ái đặt lên mắt; vế sau <em>"bừng cá tính"</em> khẳng định thần thái tự tin, cuốn hút mà bạn sẵn sàng đón nhận.
            </p>
          </div>

          {/* Color Palette */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs uppercase tracking-widest text-[#D96B8A] font-semibold">Bảng mã màu chuẩn</span>
              <h3 className="text-2xl font-serif font-normal text-[#3A232B] mt-1">
                Hệ thống màu sắc nhận diện thương hiệu Dyadia Lens
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {colorPalette.map((col, idx) => (
                <div key={idx} className="bg-white border border-rose-100 rounded-2xl overflow-hidden shadow-xs">
                  <div
                    className="h-24 w-full flex items-end justify-between p-3"
                    style={{ backgroundColor: col.hex }}
                  >
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        col.textDark ? 'bg-black/10 text-slate-800' : 'bg-white/20 text-white'
                      }`}
                    >
                      {col.hex}
                    </span>
                  </div>
                  <div className="p-3.5 space-y-1">
                    <h5 className="text-xs font-bold text-[#3A232B]">{col.name}</h5>
                    <p className="text-[11px] text-slate-500 leading-normal">{col.usage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <h4 className="text-base font-serif font-medium text-[#3A232B] flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#D96B8A]" />
              <span>Hệ thống phân cấp phông chữ (Typography)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-5 bg-[#FFF9FA] border border-rose-100 rounded-2xl space-y-2">
                <span className="text-xs font-mono font-bold text-[#B84A6A]">Phông Có Chân (Serif)</span>
                <h5 className="text-xl font-serif font-normal text-[#3A232B]">Playfair Display / Serif</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sử dụng cho các tiêu đề chính, tên bộ sưu tập và trích dẫn thương hiệu, mang lại cảm giác thanh lịch, nghệ thuật và trang nhã như một tạp chí thời trang K-Beauty.
                </p>
              </div>

              <div className="p-5 bg-[#FFF9FA] border border-rose-100 rounded-2xl space-y-2">
                <span className="text-xs font-mono font-bold text-[#B84A6A]">Phông Không Chân (Sans-serif)</span>
                <h5 className="text-xl font-sans font-medium text-slate-800">Be Vietnam Pro / Inter</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Áp dụng cho toàn bộ thông số kỹ thuật, mô tả sản phẩm, cẩm nang hướng dẫn và hệ thống điều hướng. Đảm bảo trải nghiệm đọc thông thoáng, rõ nét và tối ưu tiếng Việt.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: Customer Services & Experience */}
      {activeTab === 'services' && (
        <div className="space-y-12">
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#D96B8A] font-semibold">Đặc quyền khách hàng</span>
              <h3 className="text-2xl sm:text-3xl font-serif font-normal text-[#3A232B]">
                Trải nghiệm mua sắm độc quyền tại Dyadia Lens
              </h3>
              <p className="text-xs text-slate-600">
                Mỗi đơn hàng tại Dyadia đều là một món quà chăm sóc chu đáo dành cho đôi mắt của bạn.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-white border border-rose-100 rounded-2xl shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#D96B8A] flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#3A232B]">Giao Hàng Nhanh & Miễn Phí</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Miễn phí vận chuyển toàn quốc cho đơn từ 299.000đ. Đóng gói hộp cứng cao cấp chống va đập, bảo vệ sản phẩm nguyên vẹn tới tay bạn.
                </p>
              </div>

              <div className="p-6 bg-white border border-rose-100 rounded-2xl shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#D96B8A] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#3A232B]">Đổi Trả Bảo Hành 7 Ngày</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Hỗ trợ đổi mới 1-1 miễn phí nếu sản phẩm có lỗi rách vỉ, cộm rát từ nhà sản xuất. Đội ngũ CSKH luôn sẵn sàng giải quyết trong vòng 24 giờ.
                </p>
              </div>

              <div className="p-6 bg-white border border-rose-100 rounded-2xl shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#D96B8A] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#3A232B]">Tặng Kèm Khay Đựng Lens</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mọi đơn hàng đều được tặng kèm bộ khay gương và nhíp gắp kháng khuẩn chuyên dụng, giúp bạn dễ dàng bảo quản lens sạch sẽ ở bất cứ đâu.
                </p>
              </div>
            </div>
          </div>

          {/* Hướng dẫn chọn lens an toàn */}
          <div className="p-8 bg-gradient-to-r from-[#FFF5F8] to-[#FFF0F4] border border-rose-200 rounded-3xl space-y-4">
            <h4 className="text-lg font-serif font-normal text-[#3A232B]">
              Lời khuyên chăm sóc mắt từ chuyên gia Dyadia
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#D96B8A] shrink-0 mt-0.5" />
                <span>Rửa tay sạch bằng xà phòng không mùi và lau khô trước khi tiếp xúc với kính áp tròng.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#D96B8A] shrink-0 mt-0.5" />
                <span>Không đeo lens khi đi ngủ hoặc đi bơi để bảo vệ giác mạc khỏi nguy cơ nhiễm khuẩn.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#D96B8A] shrink-0 mt-0.5" />
                <span>Nhỏ mắt cấp ẩm chuyên dụng cách mỗi 2–3 tiếng để duy trì độ êm ái suốt cả ngày dài.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#D96B8A] shrink-0 mt-0.5" />
                <span>Thay khay đựng lens định kỳ 3 tháng một lần và bảo quản nước ngâm ở nơi khô thoáng.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Bottom Distributor CTA */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-[#FFF5F8] via-[#FFF0F4] to-[#FDDFEF] border border-rose-200 rounded-3xl text-xs text-slate-600 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 font-serif font-medium text-[#3A232B] text-base">
            <Heart className="w-4 h-4 text-[#D96B8A]" />
            <span>Dyadia Lens – Đồng hành cùng vẻ đẹp ánh nhìn của bạn</span>
          </div>
          <p className="max-w-2xl leading-relaxed text-slate-600">
            Cam kết 100% kính áp tròng Hapa Kristin chính hãng nhập khẩu Hàn Quốc. Trải nghiệm mua sắm an tâm với giải pháp mua lẻ theo từng mắt và dịch vụ tư vấn cá nhân hóa tận tâm.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D96B8A] hover:bg-[#C24A6D] text-white text-xs font-semibold rounded-full transition-colors shadow-xs"
          >
            <span>Khám phá bộ sưu tập</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/blog"
            className="px-5 py-2.5 bg-white hover:bg-rose-50 text-[#85505A] border border-rose-200 text-xs font-semibold rounded-full transition-colors shadow-2xs"
          >
            Cẩm nang làm đẹp
          </Link>
        </div>
      </div>
    </div>
  );
};
