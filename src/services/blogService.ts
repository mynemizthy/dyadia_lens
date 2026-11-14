/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlogPost } from '../types/blog.ts';

const BLOG_STORAGE_KEY = 'dyadia_blog_posts_v5';

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    "id": "post-1",
    "slug": "bi-quyet-chon-do-can-chuan-xac-khi-mua-kinh-ap-trong-online",
    "title": "Bí quyết chọn độ cận chuẩn xác khi mua kính áp tròng online",
    "excerpt": "Hướng dẫn cách chọn độ cận lens chuẩn xác, bảng quy đổi độ cận từ kính gọng sang kính áp tròng và những lưu ý nhãn khoa quan trọng khi mua online.",
    "cover_image": "/images/blogs/blog_01_banner.jpg",
    "category": "Bí quyết chọn lens",
    "author": {
      "name": "Admin",
      "role": "Quản trị viên"
    },
    "read_time_minutes": 4,
    "created_at": "2026-11-05T08:00:00.000Z",
    "published": true,
    "blocks": [
      {
        "id": "p1-1",
        "type": "paragraph",
        "content": "Bạn đang cận 3 độ, 4 độ hay thậm chí 6 độ và muốn mua kính áp tròng online? Một trong những câu hỏi đầu tiên chắc chắn là: Nên chọn lens có độ cận giống kính gọng hay phải giảm độ?"
      },
      {
        "id": "p1-2",
        "type": "paragraph",
        "content": "Thực tế, độ cận trên kính gọng và độ cận của kính áp tròng không phải lúc nào cũng giống nhau. Chọn sai độ có thể khiến bạn nhìn không rõ, khó chịu hoặc nhanh mỏi mắt khi sử dụng."
      },
      {
        "id": "p1-3",
        "type": "heading",
        "content": "1. Vì sao độ cận của lens có thể khác kính gọng?"
      },
      {
        "id": "p1-4",
        "type": "paragraph",
        "content": "Kính gọng thường nằm cách mắt một khoảng nhất định (khoảng 12mm), trong khi kính áp tròng được đặt trực tiếp trên bề mặt giác mạc. Sự khác biệt về khoảng cách này được gọi là khoảng cách đỉnh kính (Vertex Distance)."
      },
      {
        "id": "p1-5",
        "type": "paragraph",
        "content": "Khi độ cận tăng cao, ảnh hưởng của khoảng cách này càng đáng kể. Vì vậy, thông số kính áp tròng đôi khi cần được điều chỉnh giảm so với đơn kính gọng để mắt nhìn thoải mái và không bị quá tải."
      },
      {
        "id": "p1-6",
        "type": "paragraph",
        "content": "Đây cũng là lý do bạn không nên tự động chọn lens theo đúng con số trên kính gọng, đặc biệt khi có độ cận từ -3.25 Diopter trở lên."
      },
      {
        "id": "p1-7",
        "type": "heading",
        "content": "2. Bảng quy đổi độ cận tham khảo"
      },
      {
        "id": "p1-8",
        "type": "paragraph",
        "content": "Theo bảng quy đổi tham khảo tiêu chuẩn trong danh mục sản phẩm Dyadia:"
      },
      {
        "id": "p1-9",
        "type": "table",
        "content": "Bảng quy đổi độ cận",
        "extra": {
          "tableHeaders": [
            "Độ cận kính gọng",
            "Độ lens tham khảo",
            "Mức điều chỉnh"
          ],
          "tableRows": [
            [
              "0.00 đến -3.00 Diopter",
              "Giữ nguyên độ",
              "Không giảm"
            ],
            [
              "-3.25 đến -5.00 Diopter",
              "Giảm 0.25 Diopter",
              "-0.25 D"
            ],
            [
              "-5.25 đến -7.00 Diopter",
              "Giảm 0.50 Diopter",
              "-0.50 D"
            ],
            [
              "-7.25 đến -8.00 Diopter",
              "Giảm 0.75 Diopter",
              "-0.75 D"
            ]
          ]
        }
      },
      {
        "id": "p1-10",
        "type": "paragraph",
        "content": "Ví dụ minh họa:\n• Kính gọng -2.50: độ lens tham khảo -2.50.\n• Kính gọng -4.00: độ lens tham khảo -3.75.\n• Kính gọng -6.00: độ lens tham khảo -5.50.\n• Kính gọng -7.50: độ lens tham khảo -6.75."
      },
      {
        "id": "p1-11",
        "type": "tip",
        "content": "Lưu ý: Đây là bảng tham khảo tiêu chuẩn, không phải công thức áp dụng cứng nhắc cho tất cả mọi người. Độ kính áp tròng lý tưởng nên được xác định dựa trên kết quả khám khúc xạ và thử kính chuyên biệt."
      },
      {
        "id": "p1-12",
        "type": "heading",
        "content": "3. Những điều cần kiểm tra trước khi đặt lens online"
      },
      {
        "id": "p1-13",
        "type": "paragraph",
        "content": "• Kiểm tra đơn kính: Nếu đơn kính gọng đã quá 6 tháng, hãy kiểm tra lại thị lực trước khi đặt hàng.\n• Phân biệt độ cận hai mắt: Hơn 70% người đeo có độ cận lệch nhau. Đừng mặc định hai mắt có cùng độ cận.\n• Kiểm tra tình trạng loạn thị: Người bị loạn thị trên 0.75 độ có thể cần dòng lens toric chuyên biệt.\n• Tham khảo ý kiến chuyên môn: Đặc biệt đối với người lần đầu sử dụng lens hoặc có độ cận cao."
      },
      {
        "id": "p1-14",
        "type": "heading",
        "content": "4. Chọn đúng độ – bước đầu tiên để có trải nghiệm hoàn hảo"
      },
      {
        "id": "p1-15",
        "type": "paragraph",
        "content": "Một đôi lens phù hợp không chỉ giúp bạn nhìn rõ mà còn cần đáp ứng các thông số về độ cong (Base Curve), đường kính (DIA) và khả năng tương thích với giác mạc. Tại Dyadia, bạn có thể dễ dàng chọn riêng từng chiếc lens với các mức độ cận khác nhau, ví dụ như mẫu [Cat-titude Kristin - Tabby Brown](/products/cat-titude-kristin-tabby-brown) cực kỳ êm ái cho đôi mắt."
      },
      {
        "id": "p1-16",
        "type": "product_card",
        "content": "Sản phẩm gợi ý cho mắt cận tự nhiên:",
        "extra": {
          "productName": "Cat-titude Kristin - Tabby Brown",
          "productSlug": "cat-titude-kristin-tabby-brown",
          "productPrice": 95000,
          "productImage": "https://redobljqvbrouykjrcdo.supabase.co/storage/v1/object/public/product-images/products/cat-titude/tabby-brown-001.jpg"
        }
      }
    ]
  },
  {
    "id": "post-2",
    "slug": "silicone-hydrogel-la-gi-vi-sao-duoc-quan-tam-khi-chon-lens",
    "title": "Silicone Hydrogel là gì? Vì sao được quan tâm khi chọn lens?",
    "excerpt": "Tìm hiểu chất liệu Silicone Hydrogel thế hệ mới: khả năng truyền dẫn oxy vượt trội, đặc tính ngậm nước và lý do được ưa chuộng hàng đầu cho mắt nhạy cảm.",
    "cover_image": "/images/blogs/blog_02_banner.jpg",
    "category": "Cẩm nang nhãn khoa",
    "author": {
      "name": "Admin",
      "role": "Quản trị viên"
    },
    "read_time_minutes": 5,
    "created_at": "2026-11-06T09:30:00.000Z",
    "published": true,
    "blocks": [
      {
        "id": "p2-1",
        "type": "paragraph",
        "content": "Khi chọn mua kính áp tròng, bạn thường quan tâm đến màu sắc, kích thước hay độ cận. Nhưng có một yếu tố quan trọng không kém mà nhiều người dễ bỏ qua: chất liệu lens."
      },
      {
        "id": "p2-2",
        "type": "paragraph",
        "content": "Trong số các chất liệu phổ biến hiện nay, Silicone Hydrogel được chú ý nhờ khả năng truyền oxy vượt trội. Vậy chất liệu này có gì đặc biệt và tại sao ngày càng xuất hiện trong nhiều dòng kính áp tròng cao cấp?"
      },
      {
        "id": "p2-3",
        "type": "heading",
        "content": "1. Silicone Hydrogel là gì?"
      },
      {
        "id": "p2-4",
        "type": "paragraph",
        "content": "Silicone Hydrogel là chất liệu kính áp tròng mềm sinh học kết hợp giữa silicone và hydrogel."
      },
      {
        "id": "p2-5",
        "type": "paragraph",
        "content": "Điểm nổi bật của chất liệu này nằm ở khả năng cho oxy thẩm thấu trực tiếp. Silicone giúp tăng khả năng truyền oxy gấp nhiều lần đến giác mạc, trong khi hydrogel góp phần duy trì độ mềm dẻo và đặc tính ngậm nước êm ái."
      },
      {
        "id": "p2-6",
        "type": "paragraph",
        "content": "Đây là yếu tố đáng quan tâm bởi giác mạc không có mạch máu và lấy oxy trực tiếp từ không khí. Khi sử dụng kính áp tròng cả ngày, chỉ số truyền oxy (Dk/t) của lens là một trong những tiêu chí sức khỏe quan trọng nhất."
      },
      {
        "id": "p2-7",
        "type": "heading",
        "content": "2. Ba ưu điểm đáng chú ý của Silicone Hydrogel"
      },
      {
        "id": "p2-8",
        "type": "paragraph",
        "content": "• Khả năng truyền oxy tối ưu: So với vật liệu hydrogel truyền thống, Silicone Hydrogel cho lượng oxy đi qua cao hơn gấp 5 lần, giúp mắt luôn thở tự nhiên và hạn chế tình trạng đỏ mắt, thiếu oxy giác mạc.\n• Phù hợp với nhiều nhu cầu sử dụng: Chất liệu này được ứng dụng linh hoạt trong cả lens dùng 1 ngày tiện lợi lẫn lens thay thế định kỳ 1 tháng.\n• Không chỉ phụ thuộc vào hàm lượng nước: Một hiểu lầm phổ biến là lens có % nước càng cao thì càng êm. Thực tế, lens ngậm nước quá cao có thể hút ngược nước mắt tự nhiên. Silicone Hydrogel duy trì độ ẩm cân bằng 43% - 48%, giữ mắt ẩm mượt bền bỉ suốt cả ngày dài."
      },
      {
        "id": "p2-9",
        "type": "heading",
        "content": "3. Khám phá các dòng Silicone Hydrogel tại Dyadia"
      },
      {
        "id": "p2-10",
        "type": "paragraph",
        "content": "Tại Dyadia, toàn bộ các bộ sưu tập chủ lực đều ứng dụng công nghệ chất liệu Silicone Hydrogel cao cấp:\n• [Cat-titude Kristin](/products/cat-titude-kristin-tabby-brown) và [Dolly Series](/products/dolly-black): Dòng lens 1 ngày, chất liệu Silicone Hydrogel cao cấp, hàm lượng nước 45% mềm mại.\n• [Bean Series](/products/bean-raw-brown), [One&Only 1 tháng](/products/one-and-only-brown-1-thang) và [Secretive Series](/products/secretive-black): Dòng lens 1 tháng với chất liệu PC + Silicone Hydrogel chống bám cặn protein và độ ẩm 48%."
      },
      {
        "id": "p2-11",
        "type": "product_card",
        "content": "Lens 1 ngày Silicone Hydrogel được yêu thích:",
        "extra": {
          "productName": "Cat-titude Kristin - Tabby Brown",
          "productSlug": "cat-titude-kristin-tabby-brown",
          "productPrice": 95000,
          "productImage": "https://redobljqvbrouykjrcdo.supabase.co/storage/v1/object/public/product-images/products/cat-titude/tabby-brown-001.jpg"
        }
      },
      {
        "id": "p2-12",
        "type": "product_card",
        "content": "Lens 1 tháng PC + Silicone Hydrogel cao cấp:",
        "extra": {
          "productName": "One&Only Brown (1 tháng)",
          "productSlug": "one-and-only-brown-1-thang",
          "productPrice": 149000,
          "productImage": "https://redobljqvbrouykjrcdo.supabase.co/storage/v1/object/public/product-images/products/one-and-only-1M/brown-001.jpg"
        }
      },
      {
        "id": "p2-13",
        "type": "heading",
        "content": "4. Silicone Hydrogel có phải lựa chọn phù hợp với tất cả mọi người?"
      },
      {
        "id": "p2-14",
        "type": "paragraph",
        "content": "Dù có nhiều điểm vượt trội, cảm giác đeo thoải mái còn tùy thuộc vào cơ địa tuyến lệ, độ cong giác mạc và thói quen sinh hoạt. Nếu bạn có mắt đặc biệt nhạy cảm, thường xuyên làm việc máy tính trong môi trường điều hòa khô lạnh, hãy kết hợp thêm nước nhỏ mắt chuyên dụng để tăng cường độ ẩm."
      },
      {
        "id": "p2-15",
        "type": "tip",
        "content": "Khuyến cáo: Đừng chỉ chọn lens vì hoa văn và màu sắc bắt mắt. Hãy bắt đầu từ chất liệu an toàn, thông số vừa vặn và sự tương thích sinh học với đôi mắt của bạn!"
      }
    ]
  },
  {
    "id": "post-3",
    "slug": "top-4-tone-lens-tu-nhien-chuan-phong-cach-clean-girl-han-quoc",
    "title": "Top 4 tone lens tự nhiên chuẩn phong cách Clean Girl Hàn Quốc",
    "excerpt": "Bí quyết sở hữu đôi mắt trong veo tự nhiên đúng chuẩn Clean Girl K-Beauty với 4 tone lens tự nhiên nhất từ bộ sưu tập Cat-titude và Dolly.",
    "cover_image": "/images/blogs/blog_03_banner.jpg",
    "category": "Phong cách & Make-up",
    "author": {
      "name": "Admin",
      "role": "Quản trị viên"
    },
    "read_time_minutes": 4,
    "created_at": "2026-11-07T10:15:00.000Z",
    "published": true,
    "blocks": [
      {
        "id": "p3-1",
        "type": "paragraph",
        "content": "Không cần makeup cầu kỳ hay những màu lens quá nổi bật, phong cách Clean Girl vẫn luôn tạo nên sức hút khó cưỡng nhờ vẻ ngoài trong trẻo, tinh giản và thanh lịch."
      },
      {
        "id": "p3-2",
        "type": "paragraph",
        "content": "Một trong những bí quyết giúp hoàn thiện phong cách này chính là lựa chọn màu kính áp tròng phù hợp. Những gam nâu mật ong, đen tự nhiên và nâu chocolate thường được phái đẹp Hàn Quốc yêu thích bởi khả năng tạo điểm nhấn dịu dàng cho đôi mắt mà không làm tổng thể trở nên gượng gạo."
      },
      {
        "id": "p3-3",
        "type": "paragraph",
        "content": "Nếu bạn đang tìm kiếm một màu lens tự nhiên để diện hằng ngày khi đi học, đi làm hay gặp gỡ bạn bè, hãy khám phá ngay 4 gợi ý xuất sắc dưới đây từ Dyadia!"
      },
      {
        "id": "p3-4",
        "type": "heading",
        "content": "1. Tabby Brown – Nâu mật ong ngọt ngào"
      },
      {
        "id": "p3-5",
        "type": "paragraph",
        "content": "Nhẹ nhàng, nữ tính và sở hữu ánh nhìn long lanh. [Tabby Brown](/products/cat-titude-kristin-tabby-brown) thuộc dòng Cat-titude Kristin danh tiếng, mang sắc nâu mật ong pha ánh vàng kem ấm áp. Thiết kế vân lens có điểm nhấn highlight tinh tế giúp mắt bắt sáng rạng rỡ dưới mọi góc nhìn."
      },
      {
        "id": "p3-6",
        "type": "product_card",
        "content": "Tone nâu mật ong trong veo:",
        "extra": {
          "productName": "Cat-titude Kristin - Tabby Brown",
          "productSlug": "cat-titude-kristin-tabby-brown",
          "productPrice": 95000,
          "productImage": "https://redobljqvbrouykjrcdo.supabase.co/storage/v1/object/public/product-images/products/cat-titude/tabby-brown-001.jpg"
        }
      },
      {
        "id": "p3-7",
        "type": "heading",
        "content": "2. Dolly Black – Đen tự nhiên, thanh lịch"
      },
      {
        "id": "p3-8",
        "type": "paragraph",
        "content": "Đơn giản nhưng vô cùng cuốn hút. [Dolly Black](/products/dolly-black) mang sắc đen trong trẻo, tạo hiệu ứng viền mống mắt sắc nét và có chiều sâu hun hút. Tone màu này cực kỳ phù hợp cho những ai yêu thích vẻ đẹp tự nhiên mộc mạc, không muốn làm biến đổi màu mắt gốc."
      },
      {
        "id": "p3-9",
        "type": "product_card",
        "content": "Tone đen tự nhiên thanh lịch:",
        "extra": {
          "productName": "Dolly Black",
          "productSlug": "dolly-black",
          "productPrice": 89000,
          "productImage": "https://redobljqvbrouykjrcdo.supabase.co/storage/v1/object/public/product-images/products/dolly/black-001.jpg"
        }
      },
      {
        "id": "p3-10",
        "type": "heading",
        "content": "3. Dolly Choco – Nâu chocolate ấm áp"
      },
      {
        "id": "p3-11",
        "type": "paragraph",
        "content": "Dễ phối đồ, dễ ứng dụng với mọi layout trang điểm. [Dolly Choco](/products/dolly-choco) là sự lựa chọn an toàn tuyệt đối cho người mới bắt đầu. Sắc nâu socola dịu dàng mang lại cảm giác ấm áp, mềm mại, tôn da người Châu Á một cách tự nhiên nhất."
      },
      {
        "id": "p3-12",
        "type": "product_card",
        "content": "Tone nâu socola ấm áp:",
        "extra": {
          "productName": "Dolly Choco",
          "productSlug": "dolly-choco",
          "productPrice": 89000,
          "productImage": "https://redobljqvbrouykjrcdo.supabase.co/storage/v1/object/public/product-images/products/dolly/choco-001.jpg"
        }
      },
      {
        "id": "p3-13",
        "type": "heading",
        "content": "4. Choco Paw – Nâu khói cá tính"
      },
      {
        "id": "p3-14",
        "type": "paragraph",
        "content": "Một chút biến tấu mới mẻ cho ánh nhìn thêm phần kiêu kỳ. Cùng thuộc bộ sưu tập Cat-titude Kristin, [Choco Paw](/products/cat-titude-kristin-choco-paw) sở hữu sắc nâu khói với vân viền mềm mại, tạo hiệu ứng mắt mèo tinh nghịch và thời thượng."
      },
      {
        "id": "p3-15",
        "type": "product_card",
        "content": "Tone nâu khói mắt mèo cá tính:",
        "extra": {
          "productName": "Cat-titude Kristin - Choco Paw",
          "productSlug": "cat-titude-kristin-choco-paw",
          "productPrice": 95000,
          "productImage": "https://redobljqvbrouykjrcdo.supabase.co/storage/v1/object/public/product-images/products/cat-titude/choco-paw-001.jpg"
        }
      },
      {
        "id": "p3-16",
        "type": "tip",
        "content": "Bí quyết makeup chuẩn Clean Girl:\n• Lớp nền: Cushion mỏng nhẹ, bắt sáng tự nhiên ở gò má.\n• Má hồng: Tone cam đào hoặc hồng phấn phẩy nhẹ ngang sống mũi.\n• Đôi mắt: Mascara tơi mi, đường kẻ eyeliner mảnh đuôi mắt.\n• Son môi: Son bóng màu MLBB (hồng đào hoặc nude mật ong)."
      },
      {
        "id": "p3-17",
        "type": "paragraph",
        "content": "Cả 4 mẫu lens trên đều thuộc nhóm lens 1 ngày cao cấp, chất liệu Silicone Hydrogel, đường kính tiêu chuẩn DIA 14.2mm và Graphic DIA 13.6mm vừa vặn. Hãy ghé danh mục sản phẩm của Dyadia để chọn cho mình sắc màu yêu thích ngay hôm nay!"
      }
    ]
  },
  {
    "id": "post-4",
    "slug": "huong-dan-ve-sinh-va-bao-quan-kinh-ap-trong-dung-cach-cho-nguoi-moi-bat-dau",
    "title": "Hướng dẫn vệ sinh và bảo quản kính áp tròng đúng cách cho người mới bắt đầu",
    "excerpt": "Cẩm nang từng bước vệ sinh, bảo quản lens chuẩn y khoa, những sai lầm nghiêm trọng cần tránh và cách sử dụng nước ngâm Renu, nhỏ mắt Opti-Free.",
    "cover_image": "/images/blogs/blog_04_banner.jpg",
    "category": "Cẩm nang nhãn khoa",
    "author": {
      "name": "Admin",
      "role": "Quản trị viên"
    },
    "read_time_minutes": 5,
    "created_at": "2026-11-08T08:30:00.000Z",
    "published": true,
    "blocks": [
      {
        "id": "p4-1",
        "type": "paragraph",
        "content": "Kính áp tròng mang đến sự tiện lợi tuyệt vời và giúp bạn tự tin thay đổi diện mạo mà không còn phụ thuộc vào cặp kính gọng vướng víu. Tuy nhiên, để sử dụng lens an toàn và bền đẹp, việc vệ sinh và bảo quản là quy trình sống còn không thể xem nhẹ."
      },
      {
        "id": "p4-2",
        "type": "paragraph",
        "content": "Đặc biệt với những bạn mới bắt đầu làm quen với lens, không ít trường hợp gặp phải tình trạng lens bị khô cứng, cộm ngứa hay nhanh rách chỉ vì chưa nắm rõ các bước chăm sóc cơ bản. Vậy cần trang bị những phụ kiện gì và làm sạch lens như thế nào?"
      },
      {
        "id": "p4-3",
        "type": "heading",
        "content": "1. Chuẩn bị đầy đủ bộ dụng cụ vệ sinh lens"
      },
      {
        "id": "p4-4",
        "type": "paragraph",
        "content": "Đối với kính áp tròng có hạn dùng định kỳ (1 tháng hoặc dài hạn), bạn cần trang bị trọn bộ phụ kiện chuẩn y tế:\n• [Khay đựng lens mini kèm dụng cụ đeo](/products/khay-dung-lens-kem-dung-cu): Hộp đựng có nắp vặn kín khít, kèm que gắp và đầu đeo silicone vô trùng.\n• [Dung dịch ngâm lens Bausch + Lomb Renu Fresh (355ml)](/products/nuoc-ngam-lens-renu-fresh-355ml): Dung dịch đa năng 4 trong 1 (rửa, khử trùng, ngâm và loại bỏ cặn protein).\n• [Nước nhỏ mắt chuyên dụng Opti-Free (12ml)](/products/nuoc-nho-mat-opti-free-12ml): Cấp ẩm tức thì, chống khô cộm khi làm việc nhiều giờ liền.\n• Khăn bông sạch không xơ: Để lau khô hoàn toàn tay trước khi chạm vào lens.\n\nRiêng đối với dòng lens 1 ngày tiện lợi, bạn không cần khay hay nước ngâm vì lens chỉ dùng một lần rồi bỏ đi."
      },
      {
        "id": "p4-5",
        "type": "product_card",
        "content": "Nước ngâm lens đa năng Renu Fresh (Chai lớn 355ml):",
        "extra": {
          "productName": "Nước ngâm lens Bausch + Lomb Renu Fresh (355ml)",
          "productSlug": "nuoc-ngam-lens-renu-fresh-355ml",
          "productPrice": 286000,
          "productImage": "https://redobljqvbrouykjrcdo.supabase.co/storage/v1/object/public/product-images/other/renu-001.jpg"
        }
      },
      {
        "id": "p4-6",
        "type": "product_card",
        "content": "Nước nhỏ mắt chuyên dụng Opti-Free Rewetting Drops:",
        "extra": {
          "productName": "Nước nhỏ mắt Opti-Free Puremoist Rewetting Drops (12ml)",
          "productSlug": "nuoc-nho-mat-opti-free-12ml",
          "productPrice": 120000,
          "productImage": "https://redobljqvbrouykjrcdo.supabase.co/storage/v1/object/public/product-images/other/renu-001.jpg"
        }
      },
      {
        "id": "p4-7",
        "type": "product_card",
        "content": "Khay đựng lens mini kèm dụng cụ đeo tiện lợi:",
        "extra": {
          "productName": "Khay đựng lens mini kèm dụng cụ (giao màu ngẫu nhiên)",
          "productSlug": "khay-dung-lens-kem-dung-cu",
          "productPrice": 15000,
          "productImage": "https://redobljqvbrouykjrcdo.supabase.co/storage/v1/object/public/product-images/other/lens-case-001.jpg"
        }
      },
      {
        "id": "p4-8",
        "type": "heading",
        "content": "2. Các bước vệ sinh lens dài hạn chuẩn y khoa"
      },
      {
        "id": "p4-9",
        "type": "paragraph",
        "content": "• Bước 1 - Rửa tay sạch sẽ: Luôn rửa tay bằng xà phòng diệt khuẩn không mùi và lau khô hoàn toàn bằng khăn sạch không xơ sợi.\n• Bước 2 - Tháo lens cẩn thận: Đặt lens lên lòng bàn tay sạch, tránh móng tay cào xước bề mặt kính.\n• Bước 3 - Rửa sạch (Rubbing): Nhỏ 3 giọt dung dịch Renu Fresh lên mặt lens, dùng phần thịt ngón tay nhẹ nhàng chà theo đường kính trong 20 giây để đánh bay cặn protein.\n• Bước 4 - Tráng lens (Rinsing): Xịt tráng đều hai mặt lens bằng dung dịch mới trong 5 giây.\n• Bước 5 - Ngâm khử trùng: Đặt lens vào khay chứa đầy dung dịch Renu mới, đậy chặt nắp và ngâm tối thiểu 4 - 6 tiếng trước lần đeo tiếp theo."
      },
      {
        "id": "p4-10",
        "type": "heading",
        "content": "3. Những sai lầm chết người cần tuyệt đối tránh"
      },
      {
        "id": "p4-11",
        "type": "tip",
        "content": "Nguyên tắc bảo vệ mắt tuyệt đối:\n• KHÔNG bao giờ dùng nước máy, nước đóng chai hay nước muối sinh lý tự chế để ngâm lens (nguy cơ nhiễm ký sinh trùng Acanthamoeba gây viêm loét giác mạc).\n• KHÔNG châm thêm nước ngâm mới vào nước cũ trong khay.\n• KHÔNG tái sử dụng nước ngâm của ngày hôm trước.\n• KHÔNG đeo lens đi bơi hoặc đi ngủ qua đêm.\n• Vệ sinh khay đựng hàng tuần bằng nước ngâm và thay mới khay mỗi 2-3 tháng."
      },
      {
        "id": "p4-12",
        "type": "heading",
        "content": "4. Bao lâu nên thay lens mới?"
      },
      {
        "id": "p4-13",
        "type": "paragraph",
        "content": "• Lens 1 ngày: Tháo bỏ ngay sau khi kết thúc một ngày sử dụng (tối đa 8-12 tiếng), tuyệt đối không tái ngâm để dùng lại.\n• Lens 1 tháng: Thời hạn 30 ngày tính từ ngày bóc niêm phong nắp vỉ, không tính theo số lần đeo thực tế. Sau 30 ngày, cần thay cặp lens mới để đảm bảo độ trong suốt và vô trùng cho giác mạc."
      }
    ]
  },
  {
    "id": "post-5",
    "slug": "mat-nhay-cam-de-kho-nen-chon-kinh-ap-trong-nhu-the-nao",
    "title": "Mắt nhạy cảm, dễ khô: Nên chọn kính áp tròng như thế nào?",
    "excerpt": "Bí quyết chọn lens êm ái cho mắt nhạy cảm, mắt hay bị khô cộm: Ưu tiên lens 1 ngày Silicone Hydrogel, cách cấp ẩm với nước nhỏ mắt chuyên dụng.",
    "cover_image": "/images/blogs/blog_05_banner.jpg",
    "category": "Bí quyết chọn lens",
    "author": {
      "name": "Admin",
      "role": "Quản trị viên"
    },
    "read_time_minutes": 4,
    "created_at": "2026-11-09T09:00:00.000Z",
    "published": true,
    "blocks": [
      {
        "id": "p5-1",
        "type": "paragraph",
        "content": "Bạn rất yêu thích kính áp tròng để tự tin tỏa sáng nhưng lại luôn lo lắng về cảm giác khô rát, cộm ngứa hay đỏ mắt sau vài giờ đeo? Đây là nỗi niềm chung của rất nhiều bạn có cơ địa mắt nhạy cảm hoặc làm việc văn phòng tiếp xúc máy tính liên tục."
      },
      {
        "id": "p5-2",
        "type": "paragraph",
        "content": "Thực tế, mắt nhạy cảm hoàn toàn có thể diện lens thoải mái nếu bạn thấu hiểu cơ chế của mắt, lựa chọn đúng chất liệu, thời hạn sử dụng và có chế độ dưỡng ẩm phù hợp."
      },
      {
        "id": "p5-3",
        "type": "heading",
        "content": "1. Ưu tiên số 1: Dòng lens 1 ngày tiện lợi"
      },
      {
        "id": "p5-4",
        "type": "paragraph",
        "content": "Lens dùng 1 ngày là giải pháp lý tưởng nhất cho mắt nhạy cảm. Mỗi ngày bạn sử dụng một cặp lens mới vô trùng 100%, không lo tích tụ cặn bẩn hay protein từ không khí. Sau một ngày làm việc, bạn chỉ cần tháo bỏ mà không cần các bước ngâm tẩy phức tạp."
      },
      {
        "id": "p5-5",
        "type": "paragraph",
        "content": "Tại Dyadia, bạn có thể tham khảo 3 dòng lens 1 ngày Silicone Hydrogel êm ái hàng đầu:\n• [Dolly Series](/products/dolly-black): Thiết kế vân viền nhẹ nhàng, êm ái cho mắt làm việc cả ngày.\n• [Cat-titude Kristin](/products/cat-titude-kristin-tabby-brown): Đỉnh cao hiệu ứng mắt mèo long lanh với công nghệ giữ ẩm siêu việt.\n• [One&Only 1 ngày](/products/one-and-only-brown-1-ngay): Tự nhiên chuẩn Hàn Quốc cho mắt luôn trong trẻo."
      },
      {
        "id": "p5-6",
        "type": "heading",
        "content": "2. Quan tâm đến chất liệu Silicone Hydrogel và khả năng dẫn khí"
      },
      {
        "id": "p5-7",
        "type": "paragraph",
        "content": "Chất liệu Silicone Hydrogel mang lại lượng oxy thẩm thấu đến giác mạc cao gấp 5 lần so với chất liệu thông thường, giúp mắt không bị mờ nhòe hay ngột ngạt khi đeo lâu. Thêm vào đó, hàm lượng nước vừa phải 45% giúp màng lens giữ ẩm cân bằng mà không hút nước mắt tự nhiên của bạn."
      },
      {
        "id": "p5-8",
        "type": "heading",
        "content": "3. Chọn màu lens theo phong cách cá nhân"
      },
      {
        "id": "p5-9",
        "type": "paragraph",
        "content": "Dyadia mang đến bảng màu phong phú đáp ứng mọi sở thích:\n• Tone Đen tự nhiên: [Dolly Black](/products/dolly-black).\n• Tone Nâu ấm áp: [Dolly Choco](/products/dolly-choco), [Choco Paw](/products/cat-titude-kristin-choco-paw), [Tabby Brown](/products/cat-titude-kristin-tabby-brown).\n• Tone Be và Xám thanh lịch: [Dolly Beige](/products/dolly-beige), [Lady Beige](/products/cat-titude-kristin-lady-beige), [Dolly Gray](/products/dolly-gray).\n• Tone Độc đáo, quyến rũ: [Dolly Lavender](/products/dolly-lavender), [One&Only Olive](/products/one-and-only-olive), [Secretive Olive](/products/secretive-olive), [Stay Pretty - Lucky Green](/products/stay-pretty-lucky-green)."
      },
      {
        "id": "p5-10",
        "type": "product_card",
        "content": "Sản phẩm đề xuất cho mắt nhạy cảm:",
        "extra": {
          "productName": "Dolly Black",
          "productSlug": "dolly-black",
          "productPrice": 89000,
          "productImage": "https://redobljqvbrouykjrcdo.supabase.co/storage/v1/object/public/product-images/products/dolly/black-001.jpg"
        }
      },
      {
        "id": "p5-11",
        "type": "product_card",
        "content": "Nước nhỏ mắt nhân tạo cấp ẩm tức thì:",
        "extra": {
          "productName": "Nước nhỏ mắt Opti-Free Puremoist Rewetting Drops (12ml)",
          "productSlug": "nuoc-nho-mat-opti-free-12ml",
          "productPrice": 120000,
          "productImage": "https://redobljqvbrouykjrcdo.supabase.co/storage/v1/object/public/product-images/other/renu-001.jpg"
        }
      },
      {
        "id": "p5-12",
        "type": "heading",
        "content": "4. Những nguyên tắc vàng cho đôi mắt dễ khô"
      },
      {
        "id": "p5-13",
        "type": "tip",
        "content": "Mẹo giữ mắt êm dịu suốt ngày dài:\n• Nhỏ mắt trước khi đeo và nhỏ định kỳ mỗi 2-3 tiếng bằng nước nhỏ mắt chuyên dụng Opti-Free.\n• Giữ khoảng cách và chớp mắt thường xuyên khi làm việc với màn hình máy tính.\n• Không hướng luồng gió điều hòa hay quạt thổi trực diện vào mặt.\n• Tháo lens ngay lập tức nếu cảm thấy đau cộm bất thường."
      }
    ]
  },
  {
    "id": "post-6",
    "slug": "nguoi-moi-bat-dau-deo-lens-can-chuan-bi-gi",
    "title": "Người mới bắt đầu đeo lens cần chuẩn bị gì?",
    "excerpt": "Checklist trọn bộ đồ dùng và cẩm nang cho người mới tập đeo lens: Bảng so sánh lens 1 ngày vs lens 1 tháng, thao tác đeo tháo an toàn và phụ kiện cần thiết.",
    "cover_image": "/images/blogs/blog_06_banner.jpg",
    "category": "Bí quyết chọn lens",
    "author": {
      "name": "Admin",
      "role": "Quản trị viên"
    },
    "read_time_minutes": 5,
    "created_at": "2026-11-10T11:00:00.000Z",
    "published": true,
    "blocks": [
      {
        "id": "p6-1",
        "type": "paragraph",
        "content": "Lần đầu đeo kính áp tròng có thể khiến bạn cảm thấy hơi bối rối: Cần mua những dụng cụ nào? Có cần dung dịch ngâm không? Nên chọn lens 1 ngày hay lens 1 tháng để dễ làm quen nhất?"
      },
      {
        "id": "p6-2",
        "type": "paragraph",
        "content": "Thực tế, việc chuẩn bị không hề phức tạp như bạn nghĩ. Bạn chỉ cần xác định rõ loại lens mình muốn sử dụng và trang bị đầy đủ những phụ kiện vệ sinh thiết yếu để quá trình đeo, tháo và chăm sóc lens diễn ra suôn sẻ, an toàn."
      },
      {
        "id": "p6-3",
        "type": "heading",
        "content": "1. Những vật dụng cơ bản ai cũng nên có"
      },
      {
        "id": "p6-4",
        "type": "paragraph",
        "content": "Dù chọn bất kỳ loại lens nào, bạn cũng nên chuẩn bị sẵn sàng các vật dụng cơ bản sau:\n• Gương soi: Ưu tiên gương có chân đứng vững chãi, đặt tại nơi đủ ánh sáng tự nhiên để dễ quan sát giác mạc.\n• Xà phòng diệt khuẩn: Rửa sạch đôi bàn tay trước khi tiếp xúc với kính áp tròng.\n• Khăn sạch không xơ: Lau khô tay để tránh bụi vải bám vào bề mặt lens.\n• [Nước nhỏ mắt Opti-Free chuyên dụng](/products/nuoc-nho-mat-opti-free-12ml): Dùng làm mềm mắt trước khi đeo và tháo lens.\n• Kính gọng dự phòng: Đem theo trong túi để thay thế khi mắt cần nghỉ ngơi."
      },
      {
        "id": "p6-5",
        "type": "heading",
        "content": "2. Chuẩn bị thêm gì tùy theo loại lens?"
      },
      {
        "id": "p6-6",
        "type": "table",
        "content": "Bảng so sánh vật dụng cần thiết theo loại lens",
        "extra": {
          "tableHeaders": [
            "Loại lens",
            "Vật dụng cần chuẩn bị",
            "Đặc điểm sử dụng"
          ],
          "tableRows": [
            [
              "Lens 1 ngày",
              "Hộp đựng khi mang theo (nếu cần), lens dự phòng",
              "Dùng 1 lần rồi bỏ, cực kỳ tiện lợi, không cần khay ngâm hay nước ngâm"
            ],
            [
              "Lens 1 tháng",
              "Khay ngâm, dung dịch ngâm đa năng Renu, nhíp silicone",
              "Cần vệ sinh, thay nước ngâm mới và bảo quản theo hướng dẫn mỗi ngày"
            ]
          ]
        }
      },
      {
        "id": "p6-7",
        "type": "paragraph",
        "content": "Nếu bạn có lịch trình bận rộn và không muốn thực hiện nhiều bước vệ sinh, lens 1 ngày là sự lựa chọn hoàn hảo. Ngược lại, nếu chọn lens 1 tháng để tiết kiệm chi phí, bạn cần duy trì thói quen ngâm rửa cẩn thận bằng [Dung dịch Renu Fresh](/products/nuoc-ngam-lens-renu-fresh-120ml) và bảo quản trong [Khay đựng lens mini](/products/khay-dung-lens-kem-dung-cu)."
      },
      {
        "id": "p6-8",
        "type": "product_card",
        "content": "Khay đựng lens kèm dụng cụ gắp đeo vệ sinh:",
        "extra": {
          "productName": "Khay đựng lens mini kèm dụng cụ (giao màu ngẫu nhiên)",
          "productSlug": "khay-dung-lens-kem-dung-cu",
          "productPrice": 15000,
          "productImage": "https://redobljqvbrouykjrcdo.supabase.co/storage/v1/object/public/product-images/other/lens-case-001.jpg"
        }
      },
      {
        "id": "p6-9",
        "type": "product_card",
        "content": "Dung dịch ngâm rửa lens Bausch + Lomb Renu Fresh (120ml):",
        "extra": {
          "productName": "Nước ngâm lens Bausch + Lomb Renu Fresh (120ml)",
          "productSlug": "nuoc-ngam-lens-renu-fresh-120ml",
          "productPrice": 135000,
          "productImage": "https://redobljqvbrouykjrcdo.supabase.co/storage/v1/object/public/product-images/other/renu-001.jpg"
        }
      },
      {
        "id": "p6-10",
        "type": "heading",
        "content": "3. Những điều người mới cần biết trước lần đeo đầu tiên"
      },
      {
        "id": "p6-11",
        "type": "tip",
        "content": "Hướng dẫn cho lần đầu đeo lens:\n• Kiểm tra chiều của lens: Đặt lens lên đầu ngón tay. Nếu mép lens có hình chữ U cong tròn là mặt đúng; nếu mép loe ra hình chiếc bát có vành là mặt trái.\n• Nhỏ 1 giọt nước mắt nhân tạo Opti-Free vào mắt trước khi đeo để mắt êm ái.\n• Tập đeo trong thời gian ngắn: Ngày đầu tiên chỉ nên đeo từ 2-4 tiếng, sau đó tăng dần 6-8 tiếng ở các ngày tiếp theo để giác mạc làm quen."
      },
      {
        "id": "p6-12",
        "type": "heading",
        "content": "4. Sẵn sàng bắt đầu hành trình tỏa sáng cùng Dyadia!"
      },
      {
        "id": "p6-13",
        "type": "paragraph",
        "content": "Một đôi lens phù hợp không chỉ giúp bạn có đôi mắt to tròn, long lanh mà còn tôn vinh vẻ đẹp tự nhiên và phong cách cá nhân của bạn. Hãy khám phá ngay các bộ sưu tập kính áp tròng Hàn Quốc chính hãng tại Dyadia để chọn cho mình đôi lens ưng ý nhất!"
      }
    ]
  }
];

export const blogService = {
  getPosts(): BlogPost[] {
    try {
      const raw = localStorage.getItem(BLOG_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Error reading blog posts from storage:', err);
    }
    return INITIAL_BLOG_POSTS;
  },

  getPostBySlug(slug: string): BlogPost | null {
    const posts = this.getPosts();
    return posts.find((p) => p.slug === slug) || null;
  },

  savePost(post: BlogPost): void {
    const posts = this.getPosts();
    const index = posts.findIndex((p) => p.id === post.id);
    let updated: BlogPost[];
    if (index >= 0) {
      updated = [...posts];
      updated[index] = post;
    } else {
      updated = [post, ...posts];
    }
    try {
      localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Error saving post:', err);
    }
  },

  deletePost(id: string): void {
    const posts = this.getPosts().filter((p) => p.id !== id);
    try {
      localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  },

  saveAllPosts(posts: BlogPost[]): void {
    try {
      localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
    } catch (err) {
      console.error('Error saving all posts:', err);
    }
  },
};
