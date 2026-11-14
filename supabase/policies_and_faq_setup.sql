-- ==============================================================================
-- BẢN CẬP NHẬT CHÍNH SÁCH VÀ FAQ CHUẨN DYADIA LENS (9 Chính Sách & 14 FAQ)
-- Chạy script này trong Supabase SQL Editor:
-- https://supabase.com/dashboard/project/redobljqvbrouykjrcdo/sql/new
-- ==============================================================================

-- 1. XÓA CÁC BẢNG CŨ NẾU ĐÃ TỒN TẠI (Tránh lỗi lệch cấu trúc cột như thiếu cột icon)
DROP TABLE IF EXISTS public.policies CASCADE;
DROP TABLE IF EXISTS public.store_policies CASCADE;
DROP TABLE IF EXISTS public.faqs CASCADE;
DROP TABLE IF EXISTS public.store_faqs CASCADE;

-- 2. TẠO BẢNG policies (Chính sách chuẩn)
CREATE TABLE public.policies (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Chung',
  content TEXT NOT NULL,
  icon TEXT DEFAULT 'FileText',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- TẠO BẢNG store_policies (Đồng bộ tương thích)
CREATE TABLE public.store_policies (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Chung',
  content TEXT NOT NULL,
  icon TEXT DEFAULT 'FileText',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. TẠO BẢNG faqs (Câu hỏi thường gặp chuẩn)
CREATE TABLE public.faqs (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- TẠO BẢNG store_faqs (Đồng bộ tương thích)
CREATE TABLE public.store_faqs (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. BẬT ROW LEVEL SECURITY (RLS) & PHÂN QUYỀN TRUY CẬP ĐẦY ĐỦ
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_faqs ENABLE ROW LEVEL SECURITY;

-- Quyền cho policies
DROP POLICY IF EXISTS "Cho phép xem policies" ON public.policies;
CREATE POLICY "Cho phép xem policies" ON public.policies FOR SELECT USING (true);

DROP POLICY IF EXISTS "Cho phép sửa policies" ON public.policies;
CREATE POLICY "Cho phép sửa policies" ON public.policies FOR ALL USING (true) WITH CHECK (true);

-- Quyền cho store_policies
DROP POLICY IF EXISTS "Cho phép xem store_policies" ON public.store_policies;
CREATE POLICY "Cho phép xem store_policies" ON public.store_policies FOR SELECT USING (true);

DROP POLICY IF EXISTS "Cho phép sửa store_policies" ON public.store_policies;
CREATE POLICY "Cho phép sửa store_policies" ON public.store_policies FOR ALL USING (true) WITH CHECK (true);

-- Quyền cho faqs
DROP POLICY IF EXISTS "Cho phép xem faqs" ON public.faqs;
CREATE POLICY "Cho phép xem faqs" ON public.faqs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Cho phép sửa faqs" ON public.faqs;
CREATE POLICY "Cho phép sửa faqs" ON public.faqs FOR ALL USING (true) WITH CHECK (true);

-- Quyền cho store_faqs
DROP POLICY IF EXISTS "Cho phép xem store_faqs" ON public.store_faqs;
CREATE POLICY "Cho phép xem store_faqs" ON public.store_faqs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Cho phép sửa store_faqs" ON public.store_faqs;
CREATE POLICY "Cho phép sửa store_faqs" ON public.store_faqs FOR ALL USING (true) WITH CHECK (true);

-- 5. NẠP 9 CHÍNH SÁCH VÀO BẢNG policies VÀ store_policies
INSERT INTO public.policies (id, title, category, content, icon, display_order)
VALUES
('cs-kiem-hang', 'Chính sách kiểm hàng', 'Kiểm hàng & Giao nhận', 'Trước khi nhận hàng và thanh toán, Quý Khách được quyền kiểm tra sản phẩm. Không hỗ trợ thử hàng.
Quý Khách vui lòng mở gói hàng kiểm tra để đảm bảo đơn hàng được giao đúng mẫu mã, số lượng như đơn hàng đã đặt. Không thử hay dùng thử sản phẩm.
Sau khi đồng ý với món hàng được giao đến, Quý Khách thanh toán với nhân viên giao hàng (trường hợp đơn hàng được ship COD) và nhận hàng.
Trường hợp Quý Khách không ưng ý với sản phẩm, Quý Khách có thể từ chối nhận hàng. Tại đây, chúng tôi sẽ thu thêm chi phí hoàn hàng, tương đương với phí ship của đơn hàng Quý khách đã đặt.
Lưu ý: 
- Khi Quý Khách kiểm tra đơn hàng, nhân viên giao nhận buộc phải đợi Quý Khách kiểm tra hàng hóa bên trong gói hàng. Trường hợp nhân viên từ chối cho Quý Khách kiểm tra hàng hóa, Quý Khách vui lòng liên hệ với Dyadia Lens qua hotline: 0783465079 để được hỗ trợ.
- Dyadia Lens sẽ không chịu trách nhiệm về số lượng, mẫu mã cũng như lỗi của sản phẩm, sau khi đơn hàng đã được giao hàng thành công.
- Quý Khách tránh dùng vật sắc nhọn để mở gói hàng để tránh gây hư hỏng cho sản phẩm bên trong. Đối với những trường hợp sản phẩm bị hư hỏng do lỗi từ phía Khách hàng, Dyadia Lens rất tiếc không thể hỗ trợ Quý Khách đổi/trả/bảo hành sản phẩm.', 'PackageCheck', 1),
('cs-doi-tra-hoan-tien', 'Chính sách đổi trả hoàn tiền', 'Đổi trả & Bảo hành', '1. Điều kiện đổi trả
Quý Khách hàng cần kiểm tra tình trạng hàng hóa và có thể đổi hàng/ trả lại hàng ngay tại thời điểm giao/nhận hàng trong những trường hợp sau:
Hàng không đúng chủng loại, mẫu mã trong đơn hàng đã đặt hoặc như trên website tại thời điểm đặt hàng.
Không đủ số lượng, không đủ bộ như trong đơn hàng.
Tình trạng bên ngoài bị ảnh hưởng như rách bao bì, bong tróc, bể vỡ…
Khách hàng có trách nhiệm trình giấy tờ liên quan chứng minh sự thiếu sót trên để hoàn thành việc hoàn trả/đổi trả hàng hóa. 

2. Quy định về thời gian thông báo và gửi sản phẩm đổi trả
Thời gian thông báo đổi trả: trong vòng 48h kể từ khi nhận sản phẩm đối với trường hợp sản phẩm thiếu phụ kiện, quà tặng hoặc bể vỡ.
Thời gian gửi chuyển trả sản phẩm: trong vòng 14 ngày kể từ khi nhận sản phẩm.
Địa điểm đổi trả sản phẩm: Khách hàng có thể mang hàng trực tiếp đến văn phòng/ cửa hàng của chúng tôi hoặc chuyển qua đường bưu điện.
Trong trường hợp Quý Khách hàng có ý kiến đóng góp/khiếu nại liên quan đến chất lượng sản phẩm, Quý Khách hàng vui lòng liên hệ đường dây chăm sóc khách hàng của chúng tôi.

3. Hình thức đổi trả
- Chúng tôi thực hiện đổi hàng hóa đúng loại sản phẩm mà khách hàng đặt đối với sản phẩm giao sai hàng/ sai số lượng hoặc khi phát sinh sản phẩm không đạt cam kết.
- Đổi sản phẩm khác có giá trị tương đương cho khách hàng trong trường hợp sản phẩm khách hàng đã đặt hết hàng nếu khách hàng đồng ý. Trường hợp khách hàng không còn nhu cầu nữa do lỗi hàng hóa hoặc không đồng ý với hàng hóa được đổi lại công ty sẽ hoàn phí cho khách hàng bằng hình thức chuyển khoản hoặc theo phương thức thỏa thuận với khách hàng trong vòng 07 ngày làm việc kể từ ngày nhận được yêu cầu.', 'RotateCcw', 2),
('cs-van-chuyen', 'Chính sách vận chuyển giao nhận', 'Vận chuyển & Giao hàng', 'a) Các phương thức giao hàng 
Chúng tôi sử dụng 02 phương thức giao hàng:
- Khách hàng mua trực tiếp hàng tại công ty, cửa hàng của chúng tôi
- Ship hàng

b) Thời hạn ước tính cho việc giao hàng 
Thông thường sau khi nhận được thông tin đặt hàng chúng tôi sẽ xử lý đơn hàng trong vòng 24h và phản hồi lại thông tin cho khách hàng về việc thanh toán và giao nhận. 
Thời gian giao hàng thường trong khoảng từ 3-5 ngày kể từ ngày chốt đơn hàng hoặc theo thỏa thuận với khách khi đặt hàng. 
Tuy nhiên, cũng có trường hợp việc giao hàng kéo dài hơn nhưng chỉ xảy ra trong những tình huống bất khả kháng như sau:
- Nhân viên chúng tôi liên lạc với khách hàng qua điện thoại không được nên không thể giao hàng.
- Địa chỉ giao hàng bạn cung cấp không chính xác hoặc khó tìm.
- Số lượng đơn hàng tăng đột biến khiến việc xử lý đơn hàng bị chậm.
- Đối tác cung cấp hàng chậm hơn dự kiến khiến việc giao hàng bị chậm lại hoặc đối tác vận chuyển giao hàng bị chậm
Về phí vận chuyển, chúng tôi sử dụng dịch vụ vận chuyển ngoài nên cước phí vận chuyển sẽ được tính theo phí của các đơn vị vận chuyển tùy vào vị trí và khối lượng của đơn hàng, khi liên hệ lại xác nhận đơn hàng với khách sẽ báo mức phí cụ thể cho khách hàng.

c) Các giới hạn về mặt địa lý cho việc giao hàng 
Riêng khách tỉnh có nhu cầu mua số lượng lớn hoặc khách buôn sỉ nếu có nhu cầu mua sản phẩm , chúng tôi sẽ nhờ dịch vụ giao nhận của các công ty vận chuyển và phí sẽ được tính theo phí của các đơn vị cung cấp dịch vụ vận chuyển hoặc theo thoả thuận hợp đồng giữa 2 bên.

d) Phân định trách nhiệm của thương nhân, tổ chức cung ứng dịch vụ logistics về cung cấp chứng từ hàng hóa trong quá trình giao nhận.
Tất cả các đơn hàng đều được đóng gói sẵn sàng trước khi vận chuyển, được niêm phong bởi Dyadia Lens.vn . 
Đơn vị vận chuyển sẽ chỉ chịu trách nhiệm vận chuyển hàng hóa theo nguyên tắc “nguyên đai, nguyên kiện”
Trên bao bì tất cả các đơn hàng đều có thông tin:
Thông tin Người nhận, bao gồm: Tên người nhận, số điện thoại và địa chỉ người nhận
Mã vận đơn của đơn hàng
Để đảm bảo an toàn cho hàng hóa, Dyadia Lens.vn sẽ gửi kèm hóa đơn tài chính hoặc phiếu xuất kho hợp lệ của sản phẩm trong bưu kiện (nếu có).
Hóa đơn tài chính hoặc phiếu xuất kho là căn cứ hỗ trợ quá trình xử lý khiếu nại như: xác định giá trị thị trường của hàng hóa, đảm bảo hàng hóa lưu thông hợp lệ v.v..

e) Trách nhiệm về trường hợp hàng bị hư hỏng do quá trình vận chuyển
Về việc cung cấp chứng từ hàng hóa trong quá trình giao nhận.
Đối với hàng hóa bị hư hỏng do quá trình vận chuyển dù là đơn hàng do chính cửa hàng vận chuyển hay do bên thứ 3 vận chuyển thì chúng tôi sẽ là bên đứng ra chịu trách nhiệm giải quyết vấn đề cho khách hàng.
Khách hàng có quyền từ chối nhận sản phẩm và yêu cầu đổi trả theo quy định “đổi trả hoàn phí” còn mọi vấn đề phát sinh chúng tôi sẽ làm việc lại với đối tác vận chuyển để giải quyết đền bù cho đơn hàng theo thỏa thuận hợp tác giữa công ty với đối tác thứ 3 cung cấp dịch vụ vận chuyển.
Lưu ý: Trường hợp phát sinh chậm trễ trong việc giao hàng chúng tôi sẽ thông tin kịp thời cho khách hàng và khách hàng có thể lựa chọn giữa việc Hủy hoặc tiếp tục chờ hàng.', 'Truck', 3),
('cs-khieu-nai', 'Chính sách xử lý khiếu nại', 'Chăm sóc & Khiếu nại', '- Tiếp nhận mọi khiếu nại của khách hàng liên quan đến việc sử dụng dịch vụ của công ty.
- Tất cả mọi trường hợp bảo hành, quý khách có thể liên hệ với chúng tôi để làm thủ tục bảo hành.
- Thời gian giải quyết khiếu nại trong thời hạn tối đa là 03 (ba) ngày làm việc kể từ khi nhận được khiếu nại của của khách hàng. Trong trường hợp bất khả kháng 2 bên sẽ tự thương lượng.', 'MessageSquareText', 4),
('cs-ban-hang', 'Chính sách bán hàng', 'Bán hàng & Cam kết', 'Chúng tôi luôn cố gắng nỗ lực chinh phục niềm tin yêu của khách hàng. Niềm vui của quý khách hàng là niềm tự hào của chúng tôi là phương châm của chúng tôi trong mọi chính sách bán hàng

Đáp ứng cho 600.000 khách hàng mỗi năm
Dyadia Lens - Thương hiệu Kính Áp Tròng được tin dùng bởi chất lượng theo tiêu chuẩn Mỹ, tích hợp công nghệ hiện đại, tiên tiến nhất, mang đến đôi mắt sáng khoẻ cho hơn 600.000 khách hàng mỗi năm.

Hơn 10 Năm kinh nghiệm trong ngành mắt kính
Dyadia Lens với hơn 10 năm hoạt động trên thị trường, tự hào mang đến các giải pháp giúp khách hàng đẹp hơn, tự tin hơn, và có trải nghiệm mua sắm trên mức mong đợi - Thương hiệu kính áp tròng hàng đầu trong lòng người tiêu dùng.

Hơn 300 mẫu sản phẩm cho khách hàng lựa chọn
Dyadia Lens - Nhãn hàng đầu tiên sở hữu kính áp tròng cỡ nhỏ an toàn và chuẩn với mắt của người châu Á. Chúng tôi cung cấp hơn 300 mẫu sản phẩm kính áp tròng đa dạng cho khách hàng thoải mái lựa chọn.

Dyadia không bán cái chúng tôi có mà luôn lắng nghe, cung cấp những sản phẩm mà quý khách hàng cần.', 'ShoppingBag', 5),
('cs-bao-hanh', 'Chính sách bảo hành', 'Đổi trả & Bảo hành', 'Sau khi mua sản phẩm của Dyadia tại SHOP hoặc tại các kênh giao hàng trên toàn quốc. Nếu sản phẩm của Dyadia có lỗi gây cộm rát cho mắt quý khách hàng hãy liên hệ trực tiếp Hotline 0783465079 để được hỗ trợ.

1. Trường hợp khách hàng ở tại TPHCM xin vui lòng đến trực tiếp địa chỉ SHOP tại 56, Hoàng Diệu 2, Thủ Đức để được trực tiếp bảo hành.
2. Trường hợp khách hàng ở xa, ngoại tỉnh vui lòng gửi về cho chúng tôi theo đường chuyển phát. Chúng tôi chấp nhận thanh toán phí vận chuyển khi khách hàng gửi sản phẩm về bảo hành. Sau khi kiểm tra sản phẩm bảo hành chúng tôi sẽ gửi lại tận nơi cho quý khách hàng ở xa. Mọi chi phí giao nhận Dyadia sẽ thanh toán cho khách hàng khi bảo hành.', 'ShieldCheck', 6),
('cs-thanh-toan', 'Chính sách thanh toán', 'Thanh toán & Hóa đơn', 'Có 3 hình thức thanh toán, khách hàng có thể lựa chọn hình thức thuận tiện và phù hợp với mình nhất:

Cách 1: Thanh toán tiền mặt trực tiếp địa chỉ của chúng tôi: Khách hàng mua hàng tại địa điểm kinh doanh của chúng tôi, tại đây KH có thể thanh toán trực tiếp.

Cách 2: Thanh toán khi nhận hàng (COD): Với hình thức này khách hàng xem hàng tại nhà, thanh toán tiền mặt cho nhân viên giao nhận hàng

Cách 3: Chuyển khoản trước: Quý khách chuyển khoản trước, sau đó chúng tôi tiến hành giao hàng theo thỏa thuận hoặc hợp đồng với Quý khách.

HỘ KINH DOANH Dyadia Lens
SỐ TÀI KHOẢN: 00006222165
NGÂN HÀNG: ACB

Lưu ý Nội dung chuyển khoản : ghi rõ Số điện thoại hoặc Số đơn hàng Sau khi chuyển khoản, chúng tôi sẽ liên hệ xác nhận và tiến hành giao hàng.

Nếu sau thời gian thỏa thuận mà chúng tôi không giao hàng hoặc không phản hồi lại, quý khách có thể gửi khiếu nại trực tiếp về địa chỉ trụ sở Đối với khách hàng có nhu cầu mua số lượng lớn để kinh doanh hoặc buôn sỉ vui lòng liên hệ trực tiếp với chúng tôi để có chính sách giá cả hợp lý. Và việc thanh toán sẽ được thực hiện theo hợp đồng. Chúng tôi cam kết kinh doanh minh bạch, hợp pháp, bán hàng chất lượng, có nguồn gốc.', 'CreditCard', 7),
('cs-bao-mat', 'Bảo mật thông tin khách hàng', 'Bảo mật & Quyền riêng tư', 'Chúng tôi tuyệt đối bảo mật mọi thông tin cá nhân của khách hàng khi mua hàng tại Dyadia:

1. Không cung cấp thông tin cá nhân, số điện thoại của khách hàng cho đơn vị khác hoặc người khác.

2. Không làm phiền khách hàng sau khi khách hàng đã mua và sử dụng sản phẩm của Dyadia.

3. Đảm bảo mọi quyền và lợi ích hợp pháp của khách hàng khi sử dụng sản phẩm và dịch vụ của Dyadia.

4. Chỉ gửi thông tin qua Email hoặc số điện thoại cho khách hàng khi có các chương trình khuyến mại.

5. Bảo vệ mọi quyền lợi về hoa hồng cho các khách hàng đã đăng ký làm cộng tác viên của Dyadia.', 'Lock', 8),
('cs-huong-dan-su-dung', 'Hướng dẫn sử dụng', 'Cẩm nang sử dụng', '1. Hướng dẫn mở nắp bảo quản kính áp tròng

- Khi mua Contact Lens hay còn gọi là kính áp tròng, các sản phẩm được bảo quản tuyệt đối an toàn trong chai thủy tinh hoặc vỉ nhựa. Khi sản xuất và đóng gói bảo quản, nhà sản xuất đã sử dụng dung dịch ngâm kính áp tròng làm môi trường bảo quản kính áp tròng.

- Trên nắp bảo quản của chai thủy tinh có để ký hiệu mũi tên hướng lên trên. Còn trên vỉ nhựa có để mũi tên hoặc hình vát góc của tem. Các bạn dựa vào các họa tiết để tìm vị trí mở thích hợp từng loại.

- Các bạn mở nắp bảo quản, lấy kính áp tròng ra cho vào khay Lens chuyên dụng. Thay nước ngâm Lens mới sau đó đậy nắp lại để khoảng 5 phút đến 8 tiếng. Trường hợp bạn cần đeo Lens gấp thì bạn có thể sử dụng ngay khi mở nắp bảo quản. Nếu bạn muốn kính áp tròng mềm hơn, bạn có thể ngâm trong dung dịch ngâm Lens mới trong 8 giờ để Lens mềm và sử dụng thoải mái hơn cho mắt.

2. Hướng dẫn đeo Lens (kính áp tròng)

- Đầu tiên bạn nên rửa tay mình thật sạch bằng xà bông trước khi đeo hay tháo kính áp tròng. Điều này giúp an toàn và hạn chế vi khuẩn lây lan các bệnh lý khác.

- Đặt kính áp tròng lên ngón tay trỏ thuận. Hoặc nếu bạn dùng bộ cây đeo và nhíp gắp Lens thì bạn gắp kính áp tròng đặt lên cây đeo Lens. Hướng mặt của Lens cong đều lên trên và mặt ngoài thường sáng bóng hơn.

- Hai mắt mở thật to và cùng nhìn thẳng vào gương. Dùng tay kia kéo mi mắt trên hoặc kéo mi mắt dưới chùng xuống. Sau đó dùng ngón trỏ hoặc cái kéo mi về hướng trên sao cho vừa đủ và từ từ áp nhẹ lens vào mắt.

- Khẽ chớp nhẹ mắt để Lens áp sát vào giác mạc và vào vị trí đồng tử mắt. 

3. Hướng dẫn tháo Lens (kính áp tròng)

- Dùng 2 ngón tay kéo 2 mi mắt mở to. Nhìn thẳng vào gương mắt hướng xuống dưới. 

- Dùng ngón tay trỏ và ngón tay cái hoặc nhíp gắp Lens chuyên dụng bóp nhẹ lên bề mặt của kính áp tròng.

- Nhẹ nhàng kéo kính áp tròng ra khỏi mắt và bỏ vào khay nước ngâm bảo quản. 

4. Hướng dẫn ngâm rửa Lens (kính áp tròng)

- Đổ nước ngâm rửa kính áp tròng đã sử dụng đi.

- Dùng tay rửa vệ sinh khay đựng Lens loại bỏ các cặn bẩn trong khay.

- Đổ dung dịch ngâm kính áp tròng mới vào khay Lens.

- Đặt Lens lên lòng bàn tay, nhỏ vài giọt nước ngâm Lens lên bề mặt, dùng ngón tay chà nhẹ cho Lens sạch màng bám và cặn bẩn.

- Đặt kính áp tròng đã vệ sinh sạch sẽ vào khay đựng Lens và đậy nắp lại.

5. Hướng dẫn sử dụng nước nhỏ mắt

- Trước khi đeo kính áp tròng các bạn nên sử dụng nước nhỏ mắt dùng cho Lens nhỏ lên giác mạc 1 đến 2 giọt để làm sạch giác mạc. Sau đó bạn có thể đeo kính áp tròng an toàn mà không sợ bị cộm rát do cặn, bụi dính trên giác mạc gây ra.

- Khi bạn đang đeo kính áp tròng mà có dấu hiệu mắt khô, khó chịu, hoặc bạn sử dụng kính áp tròng thời gian dài liên tục. Bạn hãy mang theo chai nước nhỏ mắt và cách 1 đến 2 giờ bạn nhỏ trực tiếp lên kính áp tròng đang đeo 1 đến 2 giọt. Nước nhỏ mắt sẽ làm sạch kính áp tròng của bạn, giữ ẩm và tăng thêm độ mềm cho Lens.', 'BookOpen', 9);

INSERT INTO public.store_policies (id, title, category, content, icon, display_order)
VALUES
('cs-kiem-hang', 'Chính sách kiểm hàng', 'Kiểm hàng & Giao nhận', 'Trước khi nhận hàng và thanh toán, Quý Khách được quyền kiểm tra sản phẩm. Không hỗ trợ thử hàng.
Quý Khách vui lòng mở gói hàng kiểm tra để đảm bảo đơn hàng được giao đúng mẫu mã, số lượng như đơn hàng đã đặt. Không thử hay dùng thử sản phẩm.
Sau khi đồng ý với món hàng được giao đến, Quý Khách thanh toán với nhân viên giao hàng (trường hợp đơn hàng được ship COD) và nhận hàng.
Trường hợp Quý Khách không ưng ý với sản phẩm, Quý Khách có thể từ chối nhận hàng. Tại đây, chúng tôi sẽ thu thêm chi phí hoàn hàng, tương đương với phí ship của đơn hàng Quý khách đã đặt.
Lưu ý: 
- Khi Quý Khách kiểm tra đơn hàng, nhân viên giao nhận buộc phải đợi Quý Khách kiểm tra hàng hóa bên trong gói hàng. Trường hợp nhân viên từ chối cho Quý Khách kiểm tra hàng hóa, Quý Khách vui lòng liên hệ với Dyadia Lens qua hotline: 0783465079 để được hỗ trợ.
- Dyadia Lens sẽ không chịu trách nhiệm về số lượng, mẫu mã cũng như lỗi của sản phẩm, sau khi đơn hàng đã được giao hàng thành công.
- Quý Khách tránh dùng vật sắc nhọn để mở gói hàng để tránh gây hư hỏng cho sản phẩm bên trong. Đối với những trường hợp sản phẩm bị hư hỏng do lỗi từ phía Khách hàng, Dyadia Lens rất tiếc không thể hỗ trợ Quý Khách đổi/trả/bảo hành sản phẩm.', 'PackageCheck', 1),
('cs-doi-tra-hoan-tien', 'Chính sách đổi trả hoàn tiền', 'Đổi trả & Bảo hành', '1. Điều kiện đổi trả
Quý Khách hàng cần kiểm tra tình trạng hàng hóa và có thể đổi hàng/ trả lại hàng ngay tại thời điểm giao/nhận hàng trong những trường hợp sau:
Hàng không đúng chủng loại, mẫu mã trong đơn hàng đã đặt hoặc như trên website tại thời điểm đặt hàng.
Không đủ số lượng, không đủ bộ như trong đơn hàng.
Tình trạng bên ngoài bị ảnh hưởng như rách bao bì, bong tróc, bể vỡ…
Khách hàng có trách nhiệm trình giấy tờ liên quan chứng minh sự thiếu sót trên để hoàn thành việc hoàn trả/đổi trả hàng hóa. 

2. Quy định về thời gian thông báo và gửi sản phẩm đổi trả
Thời gian thông báo đổi trả: trong vòng 48h kể từ khi nhận sản phẩm đối với trường hợp sản phẩm thiếu phụ kiện, quà tặng hoặc bể vỡ.
Thời gian gửi chuyển trả sản phẩm: trong vòng 14 ngày kể từ khi nhận sản phẩm.
Địa điểm đổi trả sản phẩm: Khách hàng có thể mang hàng trực tiếp đến văn phòng/ cửa hàng của chúng tôi hoặc chuyển qua đường bưu điện.
Trong trường hợp Quý Khách hàng có ý kiến đóng góp/khiếu nại liên quan đến chất lượng sản phẩm, Quý Khách hàng vui lòng liên hệ đường dây chăm sóc khách hàng của chúng tôi.

3. Hình thức đổi trả
- Chúng tôi thực hiện đổi hàng hóa đúng loại sản phẩm mà khách hàng đặt đối với sản phẩm giao sai hàng/ sai số lượng hoặc khi phát sinh sản phẩm không đạt cam kết.
- Đổi sản phẩm khác có giá trị tương đương cho khách hàng trong trường hợp sản phẩm khách hàng đã đặt hết hàng nếu khách hàng đồng ý. Trường hợp khách hàng không còn nhu cầu nữa do lỗi hàng hóa hoặc không đồng ý với hàng hóa được đổi lại công ty sẽ hoàn phí cho khách hàng bằng hình thức chuyển khoản hoặc theo phương thức thỏa thuận với khách hàng trong vòng 07 ngày làm việc kể từ ngày nhận được yêu cầu.', 'RotateCcw', 2),
('cs-van-chuyen', 'Chính sách vận chuyển giao nhận', 'Vận chuyển & Giao hàng', 'a) Các phương thức giao hàng 
Chúng tôi sử dụng 02 phương thức giao hàng:
- Khách hàng mua trực tiếp hàng tại công ty, cửa hàng của chúng tôi
- Ship hàng

b) Thời hạn ước tính cho việc giao hàng 
Thông thường sau khi nhận được thông tin đặt hàng chúng tôi sẽ xử lý đơn hàng trong vòng 24h và phản hồi lại thông tin cho khách hàng về việc thanh toán và giao nhận. 
Thời gian giao hàng thường trong khoảng từ 3-5 ngày kể từ ngày chốt đơn hàng hoặc theo thỏa thuận với khách khi đặt hàng. 
Tuy nhiên, cũng có trường hợp việc giao hàng kéo dài hơn nhưng chỉ xảy ra trong những tình huống bất khả kháng như sau:
- Nhân viên chúng tôi liên lạc với khách hàng qua điện thoại không được nên không thể giao hàng.
- Địa chỉ giao hàng bạn cung cấp không chính xác hoặc khó tìm.
- Số lượng đơn hàng tăng đột biến khiến việc xử lý đơn hàng bị chậm.
- Đối tác cung cấp hàng chậm hơn dự kiến khiến việc giao hàng bị chậm lại hoặc đối tác vận chuyển giao hàng bị chậm
Về phí vận chuyển, chúng tôi sử dụng dịch vụ vận chuyển ngoài nên cước phí vận chuyển sẽ được tính theo phí của các đơn vị vận chuyển tùy vào vị trí và khối lượng của đơn hàng, khi liên hệ lại xác nhận đơn hàng với khách sẽ báo mức phí cụ thể cho khách hàng.

c) Các giới hạn về mặt địa lý cho việc giao hàng 
Riêng khách tỉnh có nhu cầu mua số lượng lớn hoặc khách buôn sỉ nếu có nhu cầu mua sản phẩm , chúng tôi sẽ nhờ dịch vụ giao nhận của các công ty vận chuyển và phí sẽ được tính theo phí của các đơn vị cung cấp dịch vụ vận chuyển hoặc theo thoả thuận hợp đồng giữa 2 bên.

d) Phân định trách nhiệm của thương nhân, tổ chức cung ứng dịch vụ logistics về cung cấp chứng từ hàng hóa trong quá trình giao nhận.
Tất cả các đơn hàng đều được đóng gói sẵn sàng trước khi vận chuyển, được niêm phong bởi Dyadia Lens.vn . 
Đơn vị vận chuyển sẽ chỉ chịu trách nhiệm vận chuyển hàng hóa theo nguyên tắc “nguyên đai, nguyên kiện”
Trên bao bì tất cả các đơn hàng đều có thông tin:
Thông tin Người nhận, bao gồm: Tên người nhận, số điện thoại và địa chỉ người nhận
Mã vận đơn của đơn hàng
Để đảm bảo an toàn cho hàng hóa, Dyadia Lens.vn sẽ gửi kèm hóa đơn tài chính hoặc phiếu xuất kho hợp lệ của sản phẩm trong bưu kiện (nếu có).
Hóa đơn tài chính hoặc phiếu xuất kho là căn cứ hỗ trợ quá trình xử lý khiếu nại như: xác định giá trị thị trường của hàng hóa, đảm bảo hàng hóa lưu thông hợp lệ v.v..

e) Trách nhiệm về trường hợp hàng bị hư hỏng do quá trình vận chuyển
Về việc cung cấp chứng từ hàng hóa trong quá trình giao nhận.
Đối với hàng hóa bị hư hỏng do quá trình vận chuyển dù là đơn hàng do chính cửa hàng vận chuyển hay do bên thứ 3 vận chuyển thì chúng tôi sẽ là bên đứng ra chịu trách nhiệm giải quyết vấn đề cho khách hàng.
Khách hàng có quyền từ chối nhận sản phẩm và yêu cầu đổi trả theo quy định “đổi trả hoàn phí” còn mọi vấn đề phát sinh chúng tôi sẽ làm việc lại với đối tác vận chuyển để giải quyết đền bù cho đơn hàng theo thỏa thuận hợp tác giữa công ty với đối tác thứ 3 cung cấp dịch vụ vận chuyển.
Lưu ý: Trường hợp phát sinh chậm trễ trong việc giao hàng chúng tôi sẽ thông tin kịp thời cho khách hàng và khách hàng có thể lựa chọn giữa việc Hủy hoặc tiếp tục chờ hàng.', 'Truck', 3),
('cs-khieu-nai', 'Chính sách xử lý khiếu nại', 'Chăm sóc & Khiếu nại', '- Tiếp nhận mọi khiếu nại của khách hàng liên quan đến việc sử dụng dịch vụ của công ty.
- Tất cả mọi trường hợp bảo hành, quý khách có thể liên hệ với chúng tôi để làm thủ tục bảo hành.
- Thời gian giải quyết khiếu nại trong thời hạn tối đa là 03 (ba) ngày làm việc kể từ khi nhận được khiếu nại của của khách hàng. Trong trường hợp bất khả kháng 2 bên sẽ tự thương lượng.', 'MessageSquareText', 4),
('cs-ban-hang', 'Chính sách bán hàng', 'Bán hàng & Cam kết', 'Chúng tôi luôn cố gắng nỗ lực chinh phục niềm tin yêu của khách hàng. Niềm vui của quý khách hàng là niềm tự hào của chúng tôi là phương châm của chúng tôi trong mọi chính sách bán hàng

Đáp ứng cho 600.000 khách hàng mỗi năm
Dyadia Lens - Thương hiệu Kính Áp Tròng được tin dùng bởi chất lượng theo tiêu chuẩn Mỹ, tích hợp công nghệ hiện đại, tiên tiến nhất, mang đến đôi mắt sáng khoẻ cho hơn 600.000 khách hàng mỗi năm.

Hơn 10 Năm kinh nghiệm trong ngành mắt kính
Dyadia Lens với hơn 10 năm hoạt động trên thị trường, tự hào mang đến các giải pháp giúp khách hàng đẹp hơn, tự tin hơn, và có trải nghiệm mua sắm trên mức mong đợi - Thương hiệu kính áp tròng hàng đầu trong lòng người tiêu dùng.

Hơn 300 mẫu sản phẩm cho khách hàng lựa chọn
Dyadia Lens - Nhãn hàng đầu tiên sở hữu kính áp tròng cỡ nhỏ an toàn và chuẩn với mắt của người châu Á. Chúng tôi cung cấp hơn 300 mẫu sản phẩm kính áp tròng đa dạng cho khách hàng thoải mái lựa chọn.

Dyadia không bán cái chúng tôi có mà luôn lắng nghe, cung cấp những sản phẩm mà quý khách hàng cần.', 'ShoppingBag', 5),
('cs-bao-hanh', 'Chính sách bảo hành', 'Đổi trả & Bảo hành', 'Sau khi mua sản phẩm của Dyadia tại SHOP hoặc tại các kênh giao hàng trên toàn quốc. Nếu sản phẩm của Dyadia có lỗi gây cộm rát cho mắt quý khách hàng hãy liên hệ trực tiếp Hotline 0783465079 để được hỗ trợ.

1. Trường hợp khách hàng ở tại TPHCM xin vui lòng đến trực tiếp địa chỉ SHOP tại 56, Hoàng Diệu 2, Thủ Đức để được trực tiếp bảo hành.
2. Trường hợp khách hàng ở xa, ngoại tỉnh vui lòng gửi về cho chúng tôi theo đường chuyển phát. Chúng tôi chấp nhận thanh toán phí vận chuyển khi khách hàng gửi sản phẩm về bảo hành. Sau khi kiểm tra sản phẩm bảo hành chúng tôi sẽ gửi lại tận nơi cho quý khách hàng ở xa. Mọi chi phí giao nhận Dyadia sẽ thanh toán cho khách hàng khi bảo hành.', 'ShieldCheck', 6),
('cs-thanh-toan', 'Chính sách thanh toán', 'Thanh toán & Hóa đơn', 'Có 3 hình thức thanh toán, khách hàng có thể lựa chọn hình thức thuận tiện và phù hợp với mình nhất:

Cách 1: Thanh toán tiền mặt trực tiếp địa chỉ của chúng tôi: Khách hàng mua hàng tại địa điểm kinh doanh của chúng tôi, tại đây KH có thể thanh toán trực tiếp.

Cách 2: Thanh toán khi nhận hàng (COD): Với hình thức này khách hàng xem hàng tại nhà, thanh toán tiền mặt cho nhân viên giao nhận hàng

Cách 3: Chuyển khoản trước: Quý khách chuyển khoản trước, sau đó chúng tôi tiến hành giao hàng theo thỏa thuận hoặc hợp đồng với Quý khách.

HỘ KINH DOANH Dyadia Lens
SỐ TÀI KHOẢN: 00006222165
NGÂN HÀNG: ACB

Lưu ý Nội dung chuyển khoản : ghi rõ Số điện thoại hoặc Số đơn hàng Sau khi chuyển khoản, chúng tôi sẽ liên hệ xác nhận và tiến hành giao hàng.

Nếu sau thời gian thỏa thuận mà chúng tôi không giao hàng hoặc không phản hồi lại, quý khách có thể gửi khiếu nại trực tiếp về địa chỉ trụ sở Đối với khách hàng có nhu cầu mua số lượng lớn để kinh doanh hoặc buôn sỉ vui lòng liên hệ trực tiếp với chúng tôi để có chính sách giá cả hợp lý. Và việc thanh toán sẽ được thực hiện theo hợp đồng. Chúng tôi cam kết kinh doanh minh bạch, hợp pháp, bán hàng chất lượng, có nguồn gốc.', 'CreditCard', 7),
('cs-bao-mat', 'Bảo mật thông tin khách hàng', 'Bảo mật & Quyền riêng tư', 'Chúng tôi tuyệt đối bảo mật mọi thông tin cá nhân của khách hàng khi mua hàng tại Dyadia:

1. Không cung cấp thông tin cá nhân, số điện thoại của khách hàng cho đơn vị khác hoặc người khác.

2. Không làm phiền khách hàng sau khi khách hàng đã mua và sử dụng sản phẩm của Dyadia.

3. Đảm bảo mọi quyền và lợi ích hợp pháp của khách hàng khi sử dụng sản phẩm và dịch vụ của Dyadia.

4. Chỉ gửi thông tin qua Email hoặc số điện thoại cho khách hàng khi có các chương trình khuyến mại.

5. Bảo vệ mọi quyền lợi về hoa hồng cho các khách hàng đã đăng ký làm cộng tác viên của Dyadia.', 'Lock', 8),
('cs-huong-dan-su-dung', 'Hướng dẫn sử dụng', 'Cẩm nang sử dụng', '1. Hướng dẫn mở nắp bảo quản kính áp tròng

- Khi mua Contact Lens hay còn gọi là kính áp tròng, các sản phẩm được bảo quản tuyệt đối an toàn trong chai thủy tinh hoặc vỉ nhựa. Khi sản xuất và đóng gói bảo quản, nhà sản xuất đã sử dụng dung dịch ngâm kính áp tròng làm môi trường bảo quản kính áp tròng.

- Trên nắp bảo quản của chai thủy tinh có để ký hiệu mũi tên hướng lên trên. Còn trên vỉ nhựa có để mũi tên hoặc hình vát góc của tem. Các bạn dựa vào các họa tiết để tìm vị trí mở thích hợp từng loại.

- Các bạn mở nắp bảo quản, lấy kính áp tròng ra cho vào khay Lens chuyên dụng. Thay nước ngâm Lens mới sau đó đậy nắp lại để khoảng 5 phút đến 8 tiếng. Trường hợp bạn cần đeo Lens gấp thì bạn có thể sử dụng ngay khi mở nắp bảo quản. Nếu bạn muốn kính áp tròng mềm hơn, bạn có thể ngâm trong dung dịch ngâm Lens mới trong 8 giờ để Lens mềm và sử dụng thoải mái hơn cho mắt.

2. Hướng dẫn đeo Lens (kính áp tròng)

- Đầu tiên bạn nên rửa tay mình thật sạch bằng xà bông trước khi đeo hay tháo kính áp tròng. Điều này giúp an toàn và hạn chế vi khuẩn lây lan các bệnh lý khác.

- Đặt kính áp tròng lên ngón tay trỏ thuận. Hoặc nếu bạn dùng bộ cây đeo và nhíp gắp Lens thì bạn gắp kính áp tròng đặt lên cây đeo Lens. Hướng mặt của Lens cong đều lên trên và mặt ngoài thường sáng bóng hơn.

- Hai mắt mở thật to và cùng nhìn thẳng vào gương. Dùng tay kia kéo mi mắt trên hoặc kéo mi mắt dưới chùng xuống. Sau đó dùng ngón trỏ hoặc cái kéo mi về hướng trên sao cho vừa đủ và từ từ áp nhẹ lens vào mắt.

- Khẽ chớp nhẹ mắt để Lens áp sát vào giác mạc và vào vị trí đồng tử mắt. 

3. Hướng dẫn tháo Lens (kính áp tròng)

- Dùng 2 ngón tay kéo 2 mi mắt mở to. Nhìn thẳng vào gương mắt hướng xuống dưới. 

- Dùng ngón tay trỏ và ngón tay cái hoặc nhíp gắp Lens chuyên dụng bóp nhẹ lên bề mặt của kính áp tròng.

- Nhẹ nhàng kéo kính áp tròng ra khỏi mắt và bỏ vào khay nước ngâm bảo quản. 

4. Hướng dẫn ngâm rửa Lens (kính áp tròng)

- Đổ nước ngâm rửa kính áp tròng đã sử dụng đi.

- Dùng tay rửa vệ sinh khay đựng Lens loại bỏ các cặn bẩn trong khay.

- Đổ dung dịch ngâm kính áp tròng mới vào khay Lens.

- Đặt Lens lên lòng bàn tay, nhỏ vài giọt nước ngâm Lens lên bề mặt, dùng ngón tay chà nhẹ cho Lens sạch màng bám và cặn bẩn.

- Đặt kính áp tròng đã vệ sinh sạch sẽ vào khay đựng Lens và đậy nắp lại.

5. Hướng dẫn sử dụng nước nhỏ mắt

- Trước khi đeo kính áp tròng các bạn nên sử dụng nước nhỏ mắt dùng cho Lens nhỏ lên giác mạc 1 đến 2 giọt để làm sạch giác mạc. Sau đó bạn có thể đeo kính áp tròng an toàn mà không sợ bị cộm rát do cặn, bụi dính trên giác mạc gây ra.

- Khi bạn đang đeo kính áp tròng mà có dấu hiệu mắt khô, khó chịu, hoặc bạn sử dụng kính áp tròng thời gian dài liên tục. Bạn hãy mang theo chai nước nhỏ mắt và cách 1 đến 2 giờ bạn nhỏ trực tiếp lên kính áp tròng đang đeo 1 đến 2 giọt. Nước nhỏ mắt sẽ làm sạch kính áp tròng của bạn, giữ ẩm và tăng thêm độ mềm cho Lens.', 'BookOpen', 9);

-- 6. NẠP 14 CÂU HỎI FAQ VÀO BẢNG faqs VÀ store_faqs
INSERT INTO public.faqs (id, category, question, answer, display_order)
VALUES
('faq-1', 'Chăm sóc và vệ sinh kính', 'Chăm sóc và vệ sinh kính áp tròng: Những điều nên và không nên làm', 'Nên làm

• Luôn rửa tay trước khi chạm vào kính áp tròng.
• Mỗi lần đều sử dụng dung dịch ngâm kính mới (đối với kính dùng một tháng).
• Thay khay đựng kính định kỳ.
• Tuân thủ lịch đeo kính được khuyến nghị.

Không nên làm

• Ngủ khi đang đeo kính áp tròng.
• Dùng nước hoặc nước bọt để làm sạch kính.
• Đeo kính lâu hơn thời gian được khuyến nghị.
• Dùng chung kính với người khác.', 1),
('faq-2', 'Đeo kính', 'Cách đeo kính áp tròng như thế nào?', 'Hãy rửa tay thật sạch trước khi lấy kính ra khỏi bao bì. Để tránh khó chịu, chỉ trang điểm sau khi đã đeo kính áp tròng.

Rửa sạch tay và lau khô bằng khăn không để lại xơ vải.

Kiểm tra để chắc chắn kính không bị lộn mặt.

Để tránh làm hỏng kính, chỉ dùng phần thịt đầu ngón tay để thao tác. Không đeo kính có dấu hiệu bị rách.

• Nếu mép kính loe ra ngoài, kính đang bị lộn mặt.
• Nếu màu sắc và họa tiết bị mờ, kính đang bị lộn mặt. Nếu kính có hình dạng như chiếc đĩa, kính cũng đang bị lộn mặt.

Dùng một ngón tay nhẹ nhàng giữ mi trên để lông mi không cản trở thao tác. Dùng các ngón tay còn lại kéo mi dưới xuống.

Từ từ đưa kính áp tròng màu về phía mắt. Đặt kính lên củng mạc (phần lòng trắng của mắt), rồi nhẹ nhàng nhắm mắt để kính ổn định vị trí. Lặp lại với mắt còn lại.

Sau khi đeo kính, luôn nhớ làm sạch, tráng rửa và vệ sinh khay đựng kính. Chỉ dùng dung dịch chuyên dụng cho kính áp tròng để tráng rửa kính. TUYỆT ĐỐI KHÔNG dùng nước để làm sạch, làm ẩm hoặc bảo quản kính áp tròng.

Nếu mắt bị ngứa, nhìn mờ hoặc đỏ, hãy liên hệ ngay với bác sĩ mắt.', 2),
('faq-3', 'Tháo kính', 'Cách tháo kính áp tròng như thế nào?', 'Đảm bảo tay sạch và khô trước khi tháo kính.

Rửa sạch tay và lau khô bằng khăn không để lại xơ vải.

Kính cần nằm ở giữa mắt trước khi tháo.

Kéo mép mi trên và mi dưới ra ngoài. Nhẹ nhàng trượt kính xuống phần lòng trắng phía dưới của mắt.

Nhẹ nhàng kẹp kính giữa ngón cái và ngón trỏ, rồi lấy kính ra.

QUAN TRỌNG!
• Bỏ kính áp tròng dùng MỘT NGÀY sau khi sử dụng.
• Nếu dùng kính MỘT THÁNG, hãy làm sạch và khử khuẩn kính trước khi đặt lại vào khay cùng dung dịch mới, sạch.', 3),
('faq-4', 'Đeo kính', 'Cách đeo và tháo kính áp tròng khi để móng tay dài 💅', 'Móng tay dài không có nghĩa là bạn không thể đeo kính áp tròng thoải mái! Chỉ cần điều chỉnh một vài thao tác, bạn có thể đeo và tháo kính mà không để móng tay chạm vào mắt.

✨ Trước khi bắt đầu:
• Luôn rửa tay thật sạch và lau khô.
• Đảm bảo khay đựng kính và dung dịch sạch.
• Cố gắng dùng phần thịt ngón tay, không dùng chóp ngón tay hoặc móng tay.
• Luôn hướng móng tay ra xa mắt.

Đeo kính áp tròng:
1. Dùng phần thịt ngón tay: Đặt kính lên phần thịt mềm của ngón trỏ (không phải chóp ngón tay). Cách này giúp kiểm soát thao tác tốt hơn và giữ móng tay cách xa mắt.
2. Giữ mi mắt ổn định: Dùng một tay nhẹ nhàng giữ mi trên, tay còn lại giữ mi dưới. Cách này giúp hạn chế chớp mắt khi đặt kính.
3. Nhẹ nhàng đặt kính vào mắt: Nhìn thẳng hoặc hơi nhìn lên và nhẹ nhàng đặt kính lên mắt bằng phần thịt ngón tay. Chớp mắt chậm để kính về vị trí giữa mắt.
💡 Mẹo: Nếu móng tay rất dài, hãy thử đưa kính vào từ góc bên thay vì trực diện.

Tháo kính áp tròng:
1️⃣ Kẹp kính bằng phần bên ngón tay: Hơi nhìn lên. Dùng phần thịt của các ngón trỏ (không dùng chóp ngón tay). Nhẹ nhàng đẩy kính từ hai phía đối diện và kẹp lấy kính ra nhẹ nhàng. Giữ móng tay hướng ra xa mắt.
2️⃣ Cuộn hoặc trượt kính: Nhìn lên. Dùng phần thịt ngón trỏ nhẹ nhàng trượt kính xuống về phía mi dưới. Khi trượt xuống, kính sẽ hơi gập lại và dễ lấy ra.
3️⃣ Dùng khớp ngón tay: Hữu ích khi móng tay rất dài. Dùng khớp ngón trỏ thay cho đầu ngón tay. Nhẹ nhàng đẩy kính xuống cho đến khi kính trượt ra.

💗 Mẹo bổ sung cho người để móng tay dài:
• Hãy đeo kính trước khi trang điểm.
• Giữ móng tay nhẵn và được giũa gọn để tránh gây trầy xước.
• Thao tác chậm và nhẹ nhàng, không vội vàng khi thao tác với mắt!
• Nếu mới sử dụng kính áp tròng, hãy luyện tập vài lần cho đến khi thao tác trở nên tự nhiên.', 4),
('faq-5', 'Các loại kính', 'Các loại kính áp tròng', 'Theo chu kỳ sử dụng

• Kính dùng một ngày: Dùng một lần và bỏ vào cuối ngày (vệ sinh nhất và phù hợp với người mới bắt đầu).

• Kính dùng một tháng: Có thể tái sử dụng tối đa một tháng (30 ngày) nếu làm sạch và bảo quản đúng cách (tiết kiệm chi phí nhất).

Theo công dụng

• Kính không độ: Chỉ dùng để thay đổi màu mắt hoặc tạo phong cách.

• Kính có độ: Điều chỉnh thị lực.

• Kính toric: Được thiết kế cho người loạn thị (có thiết kế phân bổ trọng lượng để hạn chế xoay).', 5),
('faq-6', 'Chọn kính', 'Cách chọn kính áp tròng phù hợp', 'Khi chọn kính, chúng tôi khuyên bạn cân nhắc:

• Bán kính cong và đường kính tổng thể: Ảnh hưởng đến độ thoải mái và độ vừa vặn.
• Hàm lượng nước và chất liệu: Quan trọng đối với mắt khô hoặc nhạy cảm.
• Đường kính đồ họa: Quyết định hiệu ứng tự nhiên hay mắt to kiểu búp bê.
• Lối sống: Kính một ngày thuận tiện, kính một tháng phù hợp để sử dụng trong thời gian dài hơn.

👉 Nếu mắt nhạy cảm hoặc mới sử dụng kính áp tròng, bạn rất nên chọn kính dùng một ngày.

❓ Đường kính tổng thể và đường kính đồ họa khác nhau như thế nào?
- Đường kính tổng thể (DIA): Kích thước toàn bộ kính. Ảnh hưởng đến độ vừa vặn và cảm giác thoải mái khi đeo.
- Đường kính đồ họa (G.DIA): Chỉ tính phần có màu của kính. Ảnh hưởng đến hiệu ứng mắt to hoặc tự nhiên.', 6),
('faq-7', 'Chọn kính', 'Hướng dẫn về đường kính đồ họa (G.DIA) 🔍', 'Các kích thước G.DIA khác nhau tạo hiệu ứng như sau:

1️⃣ G.DIA < 13,0 mm = hiệu ứng tự nhiên
Những kích thước này giúp mắt nổi bật hơn nhưng vẫn rất tự nhiên và dịu dàng.

2️⃣ G.DIA từ 13,0 mm đến 13,6 mm = hiệu ứng rõ hơn, mắt búp bê
Kích thước lớn hơn một chút tạo hiệu ứng dễ nhận thấy, nhưng vẫn thanh lịch và nổi bật.

3️⃣ G.DIA > 13,6 mm = hiệu ứng rất rõ
Phù hợp nếu bạn muốn hiệu ứng ấn tượng và nổi bật. Đôi mắt sẽ trở thành điểm nhấn!

Các hướng dẫn này chỉ mang tính tham khảo. G.DIA phù hợp còn phụ thuộc vào kích thước mống mắt riêng của bạn và hiệu ứng bạn mong muốn ✨', 7),
('faq-8', 'Chọn kính', 'Hướng dẫn về bán kính cong (BC) 🔍', 'Bán kính cong (BC): Bán kính cong của mặt sau kính áp tròng, phần ôm sát mắt.

BC trung bình của mọi người khoảng 8,5–8,7 mm. Nếu BC không phù hợp với mắt, kính có thể xê dịch và gây trầy xước mắt. Vì vậy, hãy chọn BC phù hợp để kính vừa vặn với mắt 💖.', 8),
('faq-9', 'Các loại kính', 'Hướng dẫn về hàm lượng nước 🔍', 'Hàm lượng nước trong kính áp tròng rất quan trọng! Nước giúp kính giữ hình dạng và mang lại cảm giác thoải mái khi đeo.

Hãy tìm hiểu hai nhóm: hàm lượng nước thấp và hàm lượng nước cao!

💧 Hàm lượng nước thấp
Ưu điểm:
• Thoải mái khi đeo lâu hơn, phù hợp để duy trì cảm giác dễ chịu cả ngày.
• Ít nhạy cảm với thay đổi của môi trường, giúp giảm lo ngại về tình trạng khô.
• Ít tích tụ protein, giúp kính giữ được độ sạch.
• Tương thích với mọi sản phẩm chăm sóc kính, thuận tiện khi sử dụng.
Nhược điểm:
• Dk (độ thấm oxy) thấp hơn, lượng oxy đến mắt ít hơn.
• Kém linh hoạt hơn, không co giãn bằng kính có hàm lượng nước cao.
• Mỏng và khó thao tác, cần cẩn thận khi đeo hoặc tháo.

💧 Hàm lượng nước cao
Ưu điểm:
• Dễ chịu ngay từ lần đeo đầu tiên, mềm mại và êm.
• Dk cao hơn, giúp mắt nhận được nhiều oxy hơn.
• Nhanh chóng trở lại hình dạng ban đầu sau khi bị ép.
Nhược điểm:
• Dễ hỏng, cần thao tác cẩn thận.
• Kém linh hoạt hơn, không co giãn bằng kính có hàm lượng nước cao.', 9),
('faq-10', 'Chăm sóc và vệ sinh kính', 'Có thể đeo kính áp tròng trong bao lâu?', '• Kính dùng một ngày: Tối đa khoảng 6–8 giờ (tùy mức độ thoải mái).
• Kính dùng một tháng: Thường tối đa 8 giờ mỗi ngày.

⚠️ Nếu mắt bị khô, kích ứng hoặc đỏ, hãy tháo kính ngay.', 10),
('faq-11', 'Chăm sóc và vệ sinh kính', 'Có thể trang điểm khi đeo kính áp tròng không?', 'Có! Hãy đeo kính trước khi trang điểm và tháo kính trước khi làm sạch lớp trang điểm.', 11),
('faq-12', 'Chăm sóc và vệ sinh kính', 'Khi nào KHÔNG nên đeo kính áp tròng?', 'Tránh đeo kính khi bạn có:
• Nhiễm trùng hoặc viêm mắt.
• Khô mắt nghiêm trọng hoặc kích ứng.
• Chấn thương mắt.

Luôn tham khảo ý kiến chuyên gia chăm sóc mắt nếu tình trạng khó chịu kéo dài.', 12),
('faq-13', 'Đeo kính', 'Cách kiểm tra kính áp tròng có bị lộn mặt không?', 'Kiểm tra mép kính:
• Nếu mép kính tạo thành hình chữ U gọn (như chiếc bát), kính đang ở đúng mặt!
• Nếu mép kính loe ra ngoài, kính đang bị lộn mặt!', 13),
('faq-14', 'Chăm sóc và vệ sinh kính', 'Kính áp tròng có thời hạn bảo quản bao lâu? Khi nào hết hạn?', 'Kính áp tròng của chúng tôi có thời hạn bảo quản từ 5 đến 10 năm kể từ ngày sản xuất.

Ngày hết hạn được thể hiện theo định dạng YY-MM-DD (năm-tháng-ngày, mỗi phần gồm hai chữ số).

Ví dụ:
• ⌛ 31-08-01 là ngày hết hạn. Kính sẽ hết hạn vào ngày 31 tháng 8 năm 2031.
• 🏭 24-08-02 là ngày sản xuất, nghĩa là kính được sản xuất vào ngày 2 tháng 8 năm 2024.', 14);

INSERT INTO public.store_faqs (id, category, question, answer, display_order)
VALUES
('faq-1', 'Chăm sóc và vệ sinh kính', 'Chăm sóc và vệ sinh kính áp tròng: Những điều nên và không nên làm', 'Nên làm

• Luôn rửa tay trước khi chạm vào kính áp tròng.
• Mỗi lần đều sử dụng dung dịch ngâm kính mới (đối với kính dùng một tháng).
• Thay khay đựng kính định kỳ.
• Tuân thủ lịch đeo kính được khuyến nghị.

Không nên làm

• Ngủ khi đang đeo kính áp tròng.
• Dùng nước hoặc nước bọt để làm sạch kính.
• Đeo kính lâu hơn thời gian được khuyến nghị.
• Dùng chung kính với người khác.', 1),
('faq-2', 'Đeo kính', 'Cách đeo kính áp tròng như thế nào?', 'Hãy rửa tay thật sạch trước khi lấy kính ra khỏi bao bì. Để tránh khó chịu, chỉ trang điểm sau khi đã đeo kính áp tròng.

Rửa sạch tay và lau khô bằng khăn không để lại xơ vải.

Kiểm tra để chắc chắn kính không bị lộn mặt.

Để tránh làm hỏng kính, chỉ dùng phần thịt đầu ngón tay để thao tác. Không đeo kính có dấu hiệu bị rách.

• Nếu mép kính loe ra ngoài, kính đang bị lộn mặt.
• Nếu màu sắc và họa tiết bị mờ, kính đang bị lộn mặt. Nếu kính có hình dạng như chiếc đĩa, kính cũng đang bị lộn mặt.

Dùng một ngón tay nhẹ nhàng giữ mi trên để lông mi không cản trở thao tác. Dùng các ngón tay còn lại kéo mi dưới xuống.

Từ từ đưa kính áp tròng màu về phía mắt. Đặt kính lên củng mạc (phần lòng trắng của mắt), rồi nhẹ nhàng nhắm mắt để kính ổn định vị trí. Lặp lại với mắt còn lại.

Sau khi đeo kính, luôn nhớ làm sạch, tráng rửa và vệ sinh khay đựng kính. Chỉ dùng dung dịch chuyên dụng cho kính áp tròng để tráng rửa kính. TUYỆT ĐỐI KHÔNG dùng nước để làm sạch, làm ẩm hoặc bảo quản kính áp tròng.

Nếu mắt bị ngứa, nhìn mờ hoặc đỏ, hãy liên hệ ngay với bác sĩ mắt.', 2),
('faq-3', 'Tháo kính', 'Cách tháo kính áp tròng như thế nào?', 'Đảm bảo tay sạch và khô trước khi tháo kính.

Rửa sạch tay và lau khô bằng khăn không để lại xơ vải.

Kính cần nằm ở giữa mắt trước khi tháo.

Kéo mép mi trên và mi dưới ra ngoài. Nhẹ nhàng trượt kính xuống phần lòng trắng phía dưới của mắt.

Nhẹ nhàng kẹp kính giữa ngón cái và ngón trỏ, rồi lấy kính ra.

QUAN TRỌNG!
• Bỏ kính áp tròng dùng MỘT NGÀY sau khi sử dụng.
• Nếu dùng kính MỘT THÁNG, hãy làm sạch và khử khuẩn kính trước khi đặt lại vào khay cùng dung dịch mới, sạch.', 3),
('faq-4', 'Đeo kính', 'Cách đeo và tháo kính áp tròng khi để móng tay dài 💅', 'Móng tay dài không có nghĩa là bạn không thể đeo kính áp tròng thoải mái! Chỉ cần điều chỉnh một vài thao tác, bạn có thể đeo và tháo kính mà không để móng tay chạm vào mắt.

✨ Trước khi bắt đầu:
• Luôn rửa tay thật sạch và lau khô.
• Đảm bảo khay đựng kính và dung dịch sạch.
• Cố gắng dùng phần thịt ngón tay, không dùng chóp ngón tay hoặc móng tay.
• Luôn hướng móng tay ra xa mắt.

Đeo kính áp tròng:
1. Dùng phần thịt ngón tay: Đặt kính lên phần thịt mềm của ngón trỏ (không phải chóp ngón tay). Cách này giúp kiểm soát thao tác tốt hơn và giữ móng tay cách xa mắt.
2. Giữ mi mắt ổn định: Dùng một tay nhẹ nhàng giữ mi trên, tay còn lại giữ mi dưới. Cách này giúp hạn chế chớp mắt khi đặt kính.
3. Nhẹ nhàng đặt kính vào mắt: Nhìn thẳng hoặc hơi nhìn lên và nhẹ nhàng đặt kính lên mắt bằng phần thịt ngón tay. Chớp mắt chậm để kính về vị trí giữa mắt.
💡 Mẹo: Nếu móng tay rất dài, hãy thử đưa kính vào từ góc bên thay vì trực diện.

Tháo kính áp tròng:
1️⃣ Kẹp kính bằng phần bên ngón tay: Hơi nhìn lên. Dùng phần thịt của các ngón trỏ (không dùng chóp ngón tay). Nhẹ nhàng đẩy kính từ hai phía đối diện và kẹp lấy kính ra nhẹ nhàng. Giữ móng tay hướng ra xa mắt.
2️⃣ Cuộn hoặc trượt kính: Nhìn lên. Dùng phần thịt ngón trỏ nhẹ nhàng trượt kính xuống về phía mi dưới. Khi trượt xuống, kính sẽ hơi gập lại và dễ lấy ra.
3️⃣ Dùng khớp ngón tay: Hữu ích khi móng tay rất dài. Dùng khớp ngón trỏ thay cho đầu ngón tay. Nhẹ nhàng đẩy kính xuống cho đến khi kính trượt ra.

💗 Mẹo bổ sung cho người để móng tay dài:
• Hãy đeo kính trước khi trang điểm.
• Giữ móng tay nhẵn và được giũa gọn để tránh gây trầy xước.
• Thao tác chậm và nhẹ nhàng, không vội vàng khi thao tác với mắt!
• Nếu mới sử dụng kính áp tròng, hãy luyện tập vài lần cho đến khi thao tác trở nên tự nhiên.', 4),
('faq-5', 'Các loại kính', 'Các loại kính áp tròng', 'Theo chu kỳ sử dụng

• Kính dùng một ngày: Dùng một lần và bỏ vào cuối ngày (vệ sinh nhất và phù hợp với người mới bắt đầu).

• Kính dùng một tháng: Có thể tái sử dụng tối đa một tháng (30 ngày) nếu làm sạch và bảo quản đúng cách (tiết kiệm chi phí nhất).

Theo công dụng

• Kính không độ: Chỉ dùng để thay đổi màu mắt hoặc tạo phong cách.

• Kính có độ: Điều chỉnh thị lực.

• Kính toric: Được thiết kế cho người loạn thị (có thiết kế phân bổ trọng lượng để hạn chế xoay).', 5),
('faq-6', 'Chọn kính', 'Cách chọn kính áp tròng phù hợp', 'Khi chọn kính, chúng tôi khuyên bạn cân nhắc:

• Bán kính cong và đường kính tổng thể: Ảnh hưởng đến độ thoải mái và độ vừa vặn.
• Hàm lượng nước và chất liệu: Quan trọng đối với mắt khô hoặc nhạy cảm.
• Đường kính đồ họa: Quyết định hiệu ứng tự nhiên hay mắt to kiểu búp bê.
• Lối sống: Kính một ngày thuận tiện, kính một tháng phù hợp để sử dụng trong thời gian dài hơn.

👉 Nếu mắt nhạy cảm hoặc mới sử dụng kính áp tròng, bạn rất nên chọn kính dùng một ngày.

❓ Đường kính tổng thể và đường kính đồ họa khác nhau như thế nào?
- Đường kính tổng thể (DIA): Kích thước toàn bộ kính. Ảnh hưởng đến độ vừa vặn và cảm giác thoải mái khi đeo.
- Đường kính đồ họa (G.DIA): Chỉ tính phần có màu của kính. Ảnh hưởng đến hiệu ứng mắt to hoặc tự nhiên.', 6),
('faq-7', 'Chọn kính', 'Hướng dẫn về đường kính đồ họa (G.DIA) 🔍', 'Các kích thước G.DIA khác nhau tạo hiệu ứng như sau:

1️⃣ G.DIA < 13,0 mm = hiệu ứng tự nhiên
Những kích thước này giúp mắt nổi bật hơn nhưng vẫn rất tự nhiên và dịu dàng.

2️⃣ G.DIA từ 13,0 mm đến 13,6 mm = hiệu ứng rõ hơn, mắt búp bê
Kích thước lớn hơn một chút tạo hiệu ứng dễ nhận thấy, nhưng vẫn thanh lịch và nổi bật.

3️⃣ G.DIA > 13,6 mm = hiệu ứng rất rõ
Phù hợp nếu bạn muốn hiệu ứng ấn tượng và nổi bật. Đôi mắt sẽ trở thành điểm nhấn!

Các hướng dẫn này chỉ mang tính tham khảo. G.DIA phù hợp còn phụ thuộc vào kích thước mống mắt riêng của bạn và hiệu ứng bạn mong muốn ✨', 7),
('faq-8', 'Chọn kính', 'Hướng dẫn về bán kính cong (BC) 🔍', 'Bán kính cong (BC): Bán kính cong của mặt sau kính áp tròng, phần ôm sát mắt.

BC trung bình của mọi người khoảng 8,5–8,7 mm. Nếu BC không phù hợp với mắt, kính có thể xê dịch và gây trầy xước mắt. Vì vậy, hãy chọn BC phù hợp để kính vừa vặn với mắt 💖.', 8),
('faq-9', 'Các loại kính', 'Hướng dẫn về hàm lượng nước 🔍', 'Hàm lượng nước trong kính áp tròng rất quan trọng! Nước giúp kính giữ hình dạng và mang lại cảm giác thoải mái khi đeo.

Hãy tìm hiểu hai nhóm: hàm lượng nước thấp và hàm lượng nước cao!

💧 Hàm lượng nước thấp
Ưu điểm:
• Thoải mái khi đeo lâu hơn, phù hợp để duy trì cảm giác dễ chịu cả ngày.
• Ít nhạy cảm với thay đổi của môi trường, giúp giảm lo ngại về tình trạng khô.
• Ít tích tụ protein, giúp kính giữ được độ sạch.
• Tương thích với mọi sản phẩm chăm sóc kính, thuận tiện khi sử dụng.
Nhược điểm:
• Dk (độ thấm oxy) thấp hơn, lượng oxy đến mắt ít hơn.
• Kém linh hoạt hơn, không co giãn bằng kính có hàm lượng nước cao.
• Mỏng và khó thao tác, cần cẩn thận khi đeo hoặc tháo.

💧 Hàm lượng nước cao
Ưu điểm:
• Dễ chịu ngay từ lần đeo đầu tiên, mềm mại và êm.
• Dk cao hơn, giúp mắt nhận được nhiều oxy hơn.
• Nhanh chóng trở lại hình dạng ban đầu sau khi bị ép.
Nhược điểm:
• Dễ hỏng, cần thao tác cẩn thận.
• Kém linh hoạt hơn, không co giãn bằng kính có hàm lượng nước cao.', 9),
('faq-10', 'Chăm sóc và vệ sinh kính', 'Có thể đeo kính áp tròng trong bao lâu?', '• Kính dùng một ngày: Tối đa khoảng 6–8 giờ (tùy mức độ thoải mái).
• Kính dùng một tháng: Thường tối đa 8 giờ mỗi ngày.

⚠️ Nếu mắt bị khô, kích ứng hoặc đỏ, hãy tháo kính ngay.', 10),
('faq-11', 'Chăm sóc và vệ sinh kính', 'Có thể trang điểm khi đeo kính áp tròng không?', 'Có! Hãy đeo kính trước khi trang điểm và tháo kính trước khi làm sạch lớp trang điểm.', 11),
('faq-12', 'Chăm sóc và vệ sinh kính', 'Khi nào KHÔNG nên đeo kính áp tròng?', 'Tránh đeo kính khi bạn có:
• Nhiễm trùng hoặc viêm mắt.
• Khô mắt nghiêm trọng hoặc kích ứng.
• Chấn thương mắt.

Luôn tham khảo ý kiến chuyên gia chăm sóc mắt nếu tình trạng khó chịu kéo dài.', 12),
('faq-13', 'Đeo kính', 'Cách kiểm tra kính áp tròng có bị lộn mặt không?', 'Kiểm tra mép kính:
• Nếu mép kính tạo thành hình chữ U gọn (như chiếc bát), kính đang ở đúng mặt!
• Nếu mép kính loe ra ngoài, kính đang bị lộn mặt!', 13),
('faq-14', 'Chăm sóc và vệ sinh kính', 'Kính áp tròng có thời hạn bảo quản bao lâu? Khi nào hết hạn?', 'Kính áp tròng của chúng tôi có thời hạn bảo quản từ 5 đến 10 năm kể từ ngày sản xuất.

Ngày hết hạn được thể hiện theo định dạng YY-MM-DD (năm-tháng-ngày, mỗi phần gồm hai chữ số).

Ví dụ:
• ⌛ 31-08-01 là ngày hết hạn. Kính sẽ hết hạn vào ngày 31 tháng 8 năm 2031.
• 🏭 24-08-02 là ngày sản xuất, nghĩa là kính được sản xuất vào ngày 2 tháng 8 năm 2024.', 14);

-- ==============================================================================
-- HOÀN THÀNH: Đã tạo bảng và nạp đủ 9 Chính sách + 14 FAQ lên Supabase!
-- ==============================================================================
