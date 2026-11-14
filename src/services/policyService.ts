/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PolicyItem } from '../types/policy.ts';

export const INITIAL_POLICIES: PolicyItem[] = [
  {
    "id": "cs-kiem-hang",
    "title": "Chính sách kiểm hàng",
    "category": "Kiểm hàng & Giao nhận",
    "icon": "PackageCheck",
    "display_order": 1,
    "content": "Trước khi nhận hàng và thanh toán, Quý Khách được quyền kiểm tra sản phẩm. Không hỗ trợ thử hàng.\nQuý Khách vui lòng mở gói hàng kiểm tra để đảm bảo đơn hàng được giao đúng mẫu mã, số lượng như đơn hàng đã đặt. Không thử hay dùng thử sản phẩm.\nSau khi đồng ý với món hàng được giao đến, Quý Khách thanh toán với nhân viên giao hàng (trường hợp đơn hàng được ship COD) và nhận hàng.\nTrường hợp Quý Khách không ưng ý với sản phẩm, Quý Khách có thể từ chối nhận hàng. Tại đây, chúng tôi sẽ thu thêm chi phí hoàn hàng, tương đương với phí ship của đơn hàng Quý khách đã đặt.\nLưu ý: \n- Khi Quý Khách kiểm tra đơn hàng, nhân viên giao nhận buộc phải đợi Quý Khách kiểm tra hàng hóa bên trong gói hàng. Trường hợp nhân viên từ chối cho Quý Khách kiểm tra hàng hóa, Quý Khách vui lòng liên hệ với Dyadia Lens qua hotline: 0783465079 để được hỗ trợ.\n- Dyadia Lens sẽ không chịu trách nhiệm về số lượng, mẫu mã cũng như lỗi của sản phẩm, sau khi đơn hàng đã được giao hàng thành công.\n- Quý Khách tránh dùng vật sắc nhọn để mở gói hàng để tránh gây hư hỏng cho sản phẩm bên trong. Đối với những trường hợp sản phẩm bị hư hỏng do lỗi từ phía Khách hàng, Dyadia Lens rất tiếc không thể hỗ trợ Quý Khách đổi/trả/bảo hành sản phẩm."
  },
  {
    "id": "cs-doi-tra-hoan-tien",
    "title": "Chính sách đổi trả hoàn tiền",
    "category": "Đổi trả & Bảo hành",
    "icon": "RotateCcw",
    "display_order": 2,
    "content": "1. Điều kiện đổi trả\nQuý Khách hàng cần kiểm tra tình trạng hàng hóa và có thể đổi hàng/ trả lại hàng ngay tại thời điểm giao/nhận hàng trong những trường hợp sau:\nHàng không đúng chủng loại, mẫu mã trong đơn hàng đã đặt hoặc như trên website tại thời điểm đặt hàng.\nKhông đủ số lượng, không đủ bộ như trong đơn hàng.\nTình trạng bên ngoài bị ảnh hưởng như rách bao bì, bong tróc, bể vỡ…\nKhách hàng có trách nhiệm trình giấy tờ liên quan chứng minh sự thiếu sót trên để hoàn thành việc hoàn trả/đổi trả hàng hóa. \n\n2. Quy định về thời gian thông báo và gửi sản phẩm đổi trả\nThời gian thông báo đổi trả: trong vòng 48h kể từ khi nhận sản phẩm đối với trường hợp sản phẩm thiếu phụ kiện, quà tặng hoặc bể vỡ.\nThời gian gửi chuyển trả sản phẩm: trong vòng 14 ngày kể từ khi nhận sản phẩm.\nĐịa điểm đổi trả sản phẩm: Khách hàng có thể mang hàng trực tiếp đến văn phòng/ cửa hàng của chúng tôi hoặc chuyển qua đường bưu điện.\nTrong trường hợp Quý Khách hàng có ý kiến đóng góp/khiếu nại liên quan đến chất lượng sản phẩm, Quý Khách hàng vui lòng liên hệ đường dây chăm sóc khách hàng của chúng tôi.\n\n3. Hình thức đổi trả\n- Chúng tôi thực hiện đổi hàng hóa đúng loại sản phẩm mà khách hàng đặt đối với sản phẩm giao sai hàng/ sai số lượng hoặc khi phát sinh sản phẩm không đạt cam kết.\n- Đổi sản phẩm khác có giá trị tương đương cho khách hàng trong trường hợp sản phẩm khách hàng đã đặt hết hàng nếu khách hàng đồng ý. Trường hợp khách hàng không còn nhu cầu nữa do lỗi hàng hóa hoặc không đồng ý với hàng hóa được đổi lại công ty sẽ hoàn phí cho khách hàng bằng hình thức chuyển khoản hoặc theo phương thức thỏa thuận với khách hàng trong vòng 07 ngày làm việc kể từ ngày nhận được yêu cầu."
  },
  {
    "id": "cs-van-chuyen",
    "title": "Chính sách vận chuyển giao nhận",
    "category": "Vận chuyển & Giao hàng",
    "icon": "Truck",
    "display_order": 3,
    "content": "a) Các phương thức giao hàng \nChúng tôi sử dụng 02 phương thức giao hàng:\n- Khách hàng mua trực tiếp hàng tại công ty, cửa hàng của chúng tôi\n- Ship hàng\n\nb) Thời hạn ước tính cho việc giao hàng \nThông thường sau khi nhận được thông tin đặt hàng chúng tôi sẽ xử lý đơn hàng trong vòng 24h và phản hồi lại thông tin cho khách hàng về việc thanh toán và giao nhận. \nThời gian giao hàng thường trong khoảng từ 3-5 ngày kể từ ngày chốt đơn hàng hoặc theo thỏa thuận với khách khi đặt hàng. \nTuy nhiên, cũng có trường hợp việc giao hàng kéo dài hơn nhưng chỉ xảy ra trong những tình huống bất khả kháng như sau:\n- Nhân viên chúng tôi liên lạc với khách hàng qua điện thoại không được nên không thể giao hàng.\n- Địa chỉ giao hàng bạn cung cấp không chính xác hoặc khó tìm.\n- Số lượng đơn hàng tăng đột biến khiến việc xử lý đơn hàng bị chậm.\n- Đối tác cung cấp hàng chậm hơn dự kiến khiến việc giao hàng bị chậm lại hoặc đối tác vận chuyển giao hàng bị chậm\nVề phí vận chuyển, chúng tôi sử dụng dịch vụ vận chuyển ngoài nên cước phí vận chuyển sẽ được tính theo phí của các đơn vị vận chuyển tùy vào vị trí và khối lượng của đơn hàng, khi liên hệ lại xác nhận đơn hàng với khách sẽ báo mức phí cụ thể cho khách hàng.\n\nc) Các giới hạn về mặt địa lý cho việc giao hàng \nRiêng khách tỉnh có nhu cầu mua số lượng lớn hoặc khách buôn sỉ nếu có nhu cầu mua sản phẩm , chúng tôi sẽ nhờ dịch vụ giao nhận của các công ty vận chuyển và phí sẽ được tính theo phí của các đơn vị cung cấp dịch vụ vận chuyển hoặc theo thoả thuận hợp đồng giữa 2 bên.\n\nd) Phân định trách nhiệm của thương nhân, tổ chức cung ứng dịch vụ logistics về cung cấp chứng từ hàng hóa trong quá trình giao nhận.\nTất cả các đơn hàng đều được đóng gói sẵn sàng trước khi vận chuyển, được niêm phong bởi Dyadia Lens.vn . \nĐơn vị vận chuyển sẽ chỉ chịu trách nhiệm vận chuyển hàng hóa theo nguyên tắc “nguyên đai, nguyên kiện”\nTrên bao bì tất cả các đơn hàng đều có thông tin:\nThông tin Người nhận, bao gồm: Tên người nhận, số điện thoại và địa chỉ người nhận\nMã vận đơn của đơn hàng\nĐể đảm bảo an toàn cho hàng hóa, Dyadia Lens.vn sẽ gửi kèm hóa đơn tài chính hoặc phiếu xuất kho hợp lệ của sản phẩm trong bưu kiện (nếu có).\nHóa đơn tài chính hoặc phiếu xuất kho là căn cứ hỗ trợ quá trình xử lý khiếu nại như: xác định giá trị thị trường của hàng hóa, đảm bảo hàng hóa lưu thông hợp lệ v.v..\n\ne) Trách nhiệm về trường hợp hàng bị hư hỏng do quá trình vận chuyển\nVề việc cung cấp chứng từ hàng hóa trong quá trình giao nhận.\nĐối với hàng hóa bị hư hỏng do quá trình vận chuyển dù là đơn hàng do chính cửa hàng vận chuyển hay do bên thứ 3 vận chuyển thì chúng tôi sẽ là bên đứng ra chịu trách nhiệm giải quyết vấn đề cho khách hàng.\nKhách hàng có quyền từ chối nhận sản phẩm và yêu cầu đổi trả theo quy định “đổi trả hoàn phí” còn mọi vấn đề phát sinh chúng tôi sẽ làm việc lại với đối tác vận chuyển để giải quyết đền bù cho đơn hàng theo thỏa thuận hợp tác giữa công ty với đối tác thứ 3 cung cấp dịch vụ vận chuyển.\nLưu ý: Trường hợp phát sinh chậm trễ trong việc giao hàng chúng tôi sẽ thông tin kịp thời cho khách hàng và khách hàng có thể lựa chọn giữa việc Hủy hoặc tiếp tục chờ hàng."
  },
  {
    "id": "cs-khieu-nai",
    "title": "Chính sách xử lý khiếu nại",
    "category": "Chăm sóc & Khiếu nại",
    "icon": "MessageSquareText",
    "display_order": 4,
    "content": "- Tiếp nhận mọi khiếu nại của khách hàng liên quan đến việc sử dụng dịch vụ của công ty.\n- Tất cả mọi trường hợp bảo hành, quý khách có thể liên hệ với chúng tôi để làm thủ tục bảo hành.\n- Thời gian giải quyết khiếu nại trong thời hạn tối đa là 03 (ba) ngày làm việc kể từ khi nhận được khiếu nại của của khách hàng. Trong trường hợp bất khả kháng 2 bên sẽ tự thương lượng."
  },
  {
    "id": "cs-ban-hang",
    "title": "Chính sách bán hàng",
    "category": "Bán hàng & Cam kết",
    "icon": "ShoppingBag",
    "display_order": 5,
    "content": "Chúng tôi luôn cố gắng nỗ lực chinh phục niềm tin yêu của khách hàng. Niềm vui của quý khách hàng là niềm tự hào của chúng tôi là phương châm của chúng tôi trong mọi chính sách bán hàng\n\nĐáp ứng cho 600.000 khách hàng mỗi năm\nDyadia Lens - Thương hiệu Kính Áp Tròng được tin dùng bởi chất lượng theo tiêu chuẩn Mỹ, tích hợp công nghệ hiện đại, tiên tiến nhất, mang đến đôi mắt sáng khoẻ cho hơn 600.000 khách hàng mỗi năm.\n\nHơn 10 Năm kinh nghiệm trong ngành mắt kính\nDyadia Lens với hơn 10 năm hoạt động trên thị trường, tự hào mang đến các giải pháp giúp khách hàng đẹp hơn, tự tin hơn, và có trải nghiệm mua sắm trên mức mong đợi - Thương hiệu kính áp tròng hàng đầu trong lòng người tiêu dùng.\n\nHơn 300 mẫu sản phẩm cho khách hàng lựa chọn\nDyadia Lens - Nhãn hàng đầu tiên sở hữu kính áp tròng cỡ nhỏ an toàn và chuẩn với mắt của người châu Á. Chúng tôi cung cấp hơn 300 mẫu sản phẩm kính áp tròng đa dạng cho khách hàng thoải mái lựa chọn.\n\nDyadia không bán cái chúng tôi có mà luôn lắng nghe, cung cấp những sản phẩm mà quý khách hàng cần."
  },
  {
    "id": "cs-bao-hanh",
    "title": "Chính sách bảo hành",
    "category": "Đổi trả & Bảo hành",
    "icon": "ShieldCheck",
    "display_order": 6,
    "content": "Sau khi mua sản phẩm của Dyadia tại SHOP hoặc tại các kênh giao hàng trên toàn quốc. Nếu sản phẩm của Dyadia có lỗi gây cộm rát cho mắt quý khách hàng hãy liên hệ trực tiếp Hotline 0783465079 để được hỗ trợ.\n\n1. Trường hợp khách hàng ở tại TPHCM xin vui lòng đến trực tiếp địa chỉ SHOP tại 56, Hoàng Diệu 2, Thủ Đức để được trực tiếp bảo hành.\n2. Trường hợp khách hàng ở xa, ngoại tỉnh vui lòng gửi về cho chúng tôi theo đường chuyển phát. Chúng tôi chấp nhận thanh toán phí vận chuyển khi khách hàng gửi sản phẩm về bảo hành. Sau khi kiểm tra sản phẩm bảo hành chúng tôi sẽ gửi lại tận nơi cho quý khách hàng ở xa. Mọi chi phí giao nhận Dyadia sẽ thanh toán cho khách hàng khi bảo hành."
  },
  {
    "id": "cs-thanh-toan",
    "title": "Chính sách thanh toán",
    "category": "Thanh toán & Hóa đơn",
    "icon": "CreditCard",
    "display_order": 7,
    "content": "Có 3 hình thức thanh toán, khách hàng có thể lựa chọn hình thức thuận tiện và phù hợp với mình nhất:\n\nCách 1: Thanh toán tiền mặt trực tiếp địa chỉ của chúng tôi: Khách hàng mua hàng tại địa điểm kinh doanh của chúng tôi, tại đây KH có thể thanh toán trực tiếp.\n\nCách 2: Thanh toán khi nhận hàng (COD): Với hình thức này khách hàng xem hàng tại nhà, thanh toán tiền mặt cho nhân viên giao nhận hàng\n\nCách 3: Chuyển khoản trước: Quý khách chuyển khoản trước, sau đó chúng tôi tiến hành giao hàng theo thỏa thuận hoặc hợp đồng với Quý khách.\n\nCỬA HÀNG DYADIA\nSỐ TÀI KHOẢN: 00006222165\nNGÂN HÀNG: ACB\n\nLưu ý Nội dung chuyển khoản : ghi rõ Số điện thoại hoặc Số đơn hàng Sau khi chuyển khoản, chúng tôi sẽ liên hệ xác nhận và tiến hành giao hàng.\n\nNếu sau thời gian thỏa thuận mà chúng tôi không giao hàng hoặc không phản hồi lại, quý khách có thể gửi khiếu nại trực tiếp về địa chỉ trụ sở Đối với khách hàng có nhu cầu mua số lượng lớn để kinh doanh hoặc buôn sỉ vui lòng liên hệ trực tiếp với chúng tôi để có chính sách giá cả hợp lý. Và việc thanh toán sẽ được thực hiện theo hợp đồng. Chúng tôi cam kết kinh doanh minh bạch, hợp pháp, bán hàng chất lượng, có nguồn gốc."
  },
  {
    "id": "cs-bao-mat",
    "title": "Bảo mật thông tin khách hàng",
    "category": "Bảo mật & Quyền riêng tư",
    "icon": "Lock",
    "display_order": 8,
    "content": "Chúng tôi tuyệt đối bảo mật mọi thông tin cá nhân của khách hàng khi mua hàng tại Dyadia:\n\n1. Không cung cấp thông tin cá nhân, số điện thoại của khách hàng cho đơn vị khác hoặc người khác.\n\n2. Không làm phiền khách hàng sau khi khách hàng đã mua và sử dụng sản phẩm của Dyadia.\n\n3. Đảm bảo mọi quyền và lợi ích hợp pháp của khách hàng khi sử dụng sản phẩm và dịch vụ của Dyadia.\n\n4. Chỉ gửi thông tin qua Email hoặc số điện thoại cho khách hàng khi có các chương trình khuyến mại.\n\n5. Bảo vệ mọi quyền lợi về hoa hồng cho các khách hàng đã đăng ký làm cộng tác viên của Dyadia."
  },
  {
    "id": "cs-huong-dan-su-dung",
    "title": "Hướng dẫn sử dụng",
    "category": "Cẩm nang sử dụng",
    "icon": "BookOpen",
    "display_order": 9,
    "content": "1. Hướng dẫn mở nắp bảo quản kính áp tròng\n\n- Khi mua Contact Lens hay còn gọi là kính áp tròng, các sản phẩm được bảo quản tuyệt đối an toàn trong chai thủy tinh hoặc vỉ nhựa. Khi sản xuất và đóng gói bảo quản, nhà sản xuất đã sử dụng dung dịch ngâm kính áp tròng làm môi trường bảo quản kính áp tròng.\n\n- Trên nắp bảo quản của chai thủy tinh có để ký hiệu mũi tên hướng lên trên. Còn trên vỉ nhựa có để mũi tên hoặc hình vát góc của tem. Các bạn dựa vào các họa tiết để tìm vị trí mở thích hợp từng loại.\n\n- Các bạn mở nắp bảo quản, lấy kính áp tròng ra cho vào khay Lens chuyên dụng. Thay nước ngâm Lens mới sau đó đậy nắp lại để khoảng 5 phút đến 8 tiếng. Trường hợp bạn cần đeo Lens gấp thì bạn có thể sử dụng ngay khi mở nắp bảo quản. Nếu bạn muốn kính áp tròng mềm hơn, bạn có thể ngâm trong dung dịch ngâm Lens mới trong 8 giờ để Lens mềm và sử dụng thoải mái hơn cho mắt.\n\n2. Hướng dẫn đeo Lens (kính áp tròng)\n\n- Đầu tiên bạn nên rửa tay mình thật sạch bằng xà bông trước khi đeo hay tháo kính áp tròng. Điều này giúp an toàn và hạn chế vi khuẩn lây lan các bệnh lý khác.\n\n- Đặt kính áp tròng lên ngón tay trỏ thuận. Hoặc nếu bạn dùng bộ cây đeo và nhíp gắp Lens thì bạn gắp kính áp tròng đặt lên cây đeo Lens. Hướng mặt của Lens cong đều lên trên và mặt ngoài thường sáng bóng hơn.\n\n- Hai mắt mở thật to và cùng nhìn thẳng vào gương. Dùng tay kia kéo mi mắt trên hoặc kéo mi mắt dưới chùng xuống. Sau đó dùng ngón trỏ hoặc cái kéo mi về hướng trên sao cho vừa đủ và từ từ áp nhẹ lens vào mắt.\n\n- Khẽ chớp nhẹ mắt để Lens áp sát vào giác mạc và vào vị trí đồng tử mắt. \n\n3. Hướng dẫn tháo Lens (kính áp tròng)\n\n- Dùng 2 ngón tay kéo 2 mi mắt mở to. Nhìn thẳng vào gương mắt hướng xuống dưới. \n\n- Dùng ngón tay trỏ và ngón tay cái hoặc nhíp gắp Lens chuyên dụng bóp nhẹ lên bề mặt của kính áp tròng.\n\n- Nhẹ nhàng kéo kính áp tròng ra khỏi mắt và bỏ vào khay nước ngâm bảo quản. \n\n4. Hướng dẫn ngâm rửa Lens (kính áp tròng)\n\n- Đổ nước ngâm rửa kính áp tròng đã sử dụng đi.\n\n- Dùng tay rửa vệ sinh khay đựng Lens loại bỏ các cặn bẩn trong khay.\n\n- Đổ dung dịch ngâm kính áp tròng mới vào khay Lens.\n\n- Đặt Lens lên lòng bàn tay, nhỏ vài giọt nước ngâm Lens lên bề mặt, dùng ngón tay chà nhẹ cho Lens sạch màng bám và cặn bẩn.\n\n- Đặt kính áp tròng đã vệ sinh sạch sẽ vào khay đựng Lens và đậy nắp lại.\n\n5. Hướng dẫn sử dụng nước nhỏ mắt\n\n- Trước khi đeo kính áp tròng các bạn nên sử dụng nước nhỏ mắt dùng cho Lens nhỏ lên giác mạc 1 đến 2 giọt để làm sạch giác mạc. Sau đó bạn có thể đeo kính áp tròng an toàn mà không sợ bị cộm rát do cặn, bụi dính trên giác mạc gây ra.\n\n- Khi bạn đang đeo kính áp tròng mà có dấu hiệu mắt khô, khó chịu, hoặc bạn sử dụng kính áp tròng thời gian dài liên tục. Bạn hãy mang theo chai nước nhỏ mắt và cách 1 đến 2 giờ bạn nhỏ trực tiếp lên kính áp tròng đang đeo 1 đến 2 giọt. Nước nhỏ mắt sẽ làm sạch kính áp tròng của bạn, giữ ẩm và tăng thêm độ mềm cho Lens."
  }
];

const POLICIES_STORAGE_KEY = 'dyadia_policies_v1';

export const policyService = {
  async getPolicies(): Promise<PolicyItem[]> {
    try {
      const res = await fetch('/api/policies');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          localStorage.setItem(POLICIES_STORAGE_KEY, JSON.stringify(json.data));
          return json.data;
        }
      }
    } catch {
      // ignore fetch error and fall back to local storage
    }

    try {
      const raw = localStorage.getItem(POLICIES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore parse error
    }

    return INITIAL_POLICIES;
  },

  async savePolicy(policy: PolicyItem, token?: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/policies/${policy.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'dyadia2026',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(policy),
      });
      if (res.ok) {
        const all = await this.getPolicies();
        const index = all.findIndex((p) => p.id === policy.id);
        const updated = index >= 0 ? all.map((p) => (p.id === policy.id ? policy : p)) : [...all, policy];
        localStorage.setItem(POLICIES_STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('dyadia_policies_updated'));
        return true;
      }
    } catch {
      // server failed
    }

    // fallback to local storage
    const all = await this.getPolicies();
    const index = all.findIndex((p) => p.id === policy.id);
    const updated = index >= 0 ? all.map((p) => (p.id === policy.id ? policy : p)) : [...all, policy];
    localStorage.setItem(POLICIES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('dyadia_policies_updated'));
    return true;
  },

  async deletePolicy(id: string, token?: string): Promise<boolean> {
    try {
      await fetch(`/api/admin/policies/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': 'dyadia2026',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch {
      // ignore
    }

    const all = await this.getPolicies();
    const filtered = all.filter((p) => p.id !== id);
    localStorage.setItem(POLICIES_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('dyadia_policies_updated'));
    return true;
  },
};
