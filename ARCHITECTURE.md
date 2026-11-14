# KIẾN TRÚC TỔNG THỂ HỆ THỐNG WEBSITE THƯƠNG MẠI ĐIỆN TỬ & TRỢ LÝ ẢO AI CHATBOT DYADIA LENS

> **Dự án:** Hệ thống Thương mại Điện tử Kính Áp Tròng Hàn Quốc Dyadia Lens & Trợ lý Ảo AI Concierge  
> **Phiên bản:** 2.0 (Commercial Architecture Standard)  
> **Mô hình triển khai:** Decoupled Microservices / Serverless Data Layer + Workflow Automation  

---

## 1. TỔNG QUAN KIẾN TRÚC PHÂN TẦNG (HIGH-LEVEL 4-TIER ARCHITECTURE)

Hệ thống Dyadia Lens được thiết kế theo mô hình kiến trúc 4 phân tầng độc lập (**4-Tier Architecture**), đảm bảo tính module hóa, bảo mật đa lớp và khả năng mở rộng linh hoạt:

1. **Client / Presentation Layer (Tầng giao diện người dùng):** Ứng dụng Single Page Application (SPA) xây dựng trên nền tảng **React 18 + TypeScript + Vite + Tailwind CSS**, tích hợp widget Chatbot AI Concierge tương tác thời gian thực.
2. **Backend & Proxy Layer (Tầng máy chủ & Điều phối API):** Máy chủ **Node.js + Express**, đóng vai trò API Gateway, xử lý xác thực quyền quản trị (Admin RBAC), định giá lens lẻ, và làm cầu nối bảo mật giữa Frontend và n8n Webhook.
3. **AI Agent & Automation Orchestration Layer (Tầng trí tuệ nhân tạo & Tự động hóa n8n):** Hệ thống tự động hóa **n8n Workflow**, tích hợp LangChain Agent, LLM (OpenAI / Gemini), bộ nhớ hội thoại phiên làm việc (Postgres Chat Memory) và bộ 6 công cụ truy vấn dữ liệu nghiệp vụ (Tools).
4. **Data & Cloud Infrastructure Layer (Tầng dữ liệu & Lưu trữ đám mây Supabase):** Cơ sở dữ liệu quan hệ **Supabase PostgreSQL** với bảo mật cấp hàng (Row Level Security - RLS), các hàm xử lý nguyên tử (Stored Procedure / RPC), dịch vụ xác thực **Supabase Auth** và mạng phân phối nội dung ảnh **Supabase Storage CDN**.

---

## 2. SƠ ĐỒ KIẾN TRÚC TỔNG THỂ HỆ THỐNG (SYSTEM ARCHITECTURE DIAGRAM)

```mermaid
flowchart TD
    subgraph ClientLayer ["1. TẦNG GIAO DIỆN NGƯỜI DÙNG (CLIENT LAYER)"]
        UI_Web["Website Khách Hàng (React SPA / Vite / Tailwind)"]
        UI_Admin["Trang Quản Trị Admin (Dashboard / CMS / Báo Cáo)"]
        UI_Chat["Widget Dyadia Concierge (Chatbot Nổi 24/7)"]
    end

    subgraph BackendLayer ["2. TẦNG MÁY CHỦ & ĐIỀU PHỐI (BACKEND LAYER)"]
        Server_API["Express API Gateway (server.ts)"]
        Auth_Service["Xác Thực Quyền Quản Trị & Profile (JWT / Auth)"]
        Order_Controller["Bộ Điều Phối Đơn Hàng & Giá Lẻ 1 Chiếc"]
        Proxy_Chat["Chat Proxy Controller (/api/chat)"]
    end

    subgraph n8nLayer ["3. TẦNG TRÍ TUỆ NHÂN TẠO & WORKFLOW (N8N AGENT LAYER)"]
        Webhook_In["n8n Webhook Listener (/dyadia-chat)"]
        Agent["AI Agent: Dyadia Concierge (LangChain Agent 1.7)"]
        LLM["Large Language Model (OpenAI gpt-5-mini / Gemini)"]
        Memory["Postgres Chat Memory (Session-based History)"]
        
        subgraph Toolset ["Bộ 6 Công Cụ Nghiệp Vụ (AI Tools)"]
            T1["tra_cuu_san_pham (Supabase Tool)"]
            T2["kiem_tra_ton_kho (Postgres Tool / check_lens_inventory)"]
            T3["tra_cuu_don_hang (Postgres Tool / lookup_order)"]
            T4["tra_cuu_chinh_sach (Supabase Tool / store_policies)"]
            T5["tra_cuu_faq (Supabase Tool / store_faqs)"]
            T6["kiem_tra_ma_giam_gia (Postgres Tool / coupons)"]
        end
        
        Formatter["Format Output Data (JSON / Markdown Sanitize)"]
        Webhook_Out["Respond to Webhook"]
    end

    subgraph DatabaseLayer ["4. TẦNG DỮ LIỆU & BẢO MẬT (SUPABASE CLOUD)"]
        DB_Postgres[("Supabase PostgreSQL Database")]
        
        subgraph Tables ["Bảng Dữ Liệu"]
            Tab_Prod["public.products (35+ Sản phẩm)"]
            Tab_Var["public.product_variants (Tồn kho theo độ cận 0.00 -> -8.00)"]
            Tab_Ord["public.orders (Đơn hàng web & bot)"]
            Tab_Prof["public.profiles (Phân quyền Admin & User)"]
            Tab_Rev["public.reviews (Đánh giá 1-5 sao)"]
            Tab_Cont["public.store_content, policies, faqs"]
        end
        
        subgraph RPCs ["Hàm Xử Lý Nguyên Tử (Functions / RPC)"]
            RPC_Stock["decrement_variant_stock()"]
            RPC_CheckStock["check_lens_inventory()"]
            RPC_Order["lookup_order()"]
        end
        
        Auth_Supabase["Supabase Auth (auth.users)"]
        CDN_Storage["Storage Bucket: product-images (CDN Ảnh)"]
    end

    %% Client -> Backend & Chat
    UI_Web --> Server_API
    UI_Admin --> Server_API
    UI_Chat --> Proxy_Chat
    Proxy_Chat --> Webhook_In

    %% Backend -> Supabase
    Server_API --> DB_Postgres
    Server_API --> Auth_Supabase
    Order_Controller --> RPC_Stock

    %% n8n Internal Flow
    Webhook_In --> Agent
    Agent --- LLM
    Agent --- Memory
    Agent --> Toolset
    Toolset --> DB_Postgres
    Agent --> Formatter
    Formatter --> Webhook_Out
    Webhook_Out --> Proxy_Chat

    %% Database Internal Links
    DB_Postgres --- Tables
    DB_Postgres --- RPCs
    Auth_Supabase -.->|"Trigger on_auth_user_created"| Tab_Prof
    Tab_Prod -.->|"CDN URLs"| CDN_Storage
```

---

## 3. CHI TIẾT TỪNG PHÂN TẦNG CÔNG NGHỆ

### 3.1. Tầng Giao Diện (Presentation Layer)
* **Công nghệ chủ đạo:** React 18, TypeScript, Tailwind CSS, Lucide React, Vite Bundler.
* **Các module chức năng:**
  * **Trang chủ (Home):** Hero Carousel chuyển động, Bộ sưu tập nổi bật (*Cat-titude*, *Dolly*, *One&Only*), Bảng chọn nhanh theo nhu cầu, Lookbook Instagram thời thượng liên kết chính thức `@hapakristin.global`.
  * **Cửa hàng & Bộ lọc (Catalog & Filter):** Lọc theo bộ sưu tập, màu sắc (Nâu, Xám, Choco, Đen, Tím khói, Xanh rêu), chu kỳ sử dụng (1 Ngày, 1 Tháng) và khoảng giá.
  * **Chi tiết sản phẩm (Product Detail Page):** Chọn độ cận độc lập cho Mắt Trái / Mắt Phải, kiểm tra tình trạng tồn kho tức thì, hiển thị A+ Content phong cách K-Beauty.
  * **Giỏ hàng & Thanh toán (Cart & Checkout):** Hỗ trợ tính giá theo từng chiếc lẻ, áp dụng mã voucher (`WELCOME10`, `LENS50K`, `FREESHIP`), tính phí giao hàng tự động.
  * **Quản trị hệ thống (Admin Portal):** Quản lý 35 sản phẩm, chỉnh sửa biến thể tồn kho 23 độ cận, đổi trạng thái đơn hàng, duyệt đánh giá sản phẩm.
  * **Dyadia Concierge Widget:** Hộp thoại trò chuyện nổi góc màn hình, tự động kết nối n8n Webhook, hiển thị hình ảnh sản phẩm định dạng thẻ trực quan.

### 3.2. Tầng Máy Chủ Điều Phối (Backend Layer)
* **Công nghệ:** Node.js, Express Framework, TypeScript (`tsx server.ts`).
* **Vai trò an ninh:**
  * **Ẩn danh Webhook n8n:** Tuyệt đối không để lộ URL Webhook n8n ra ngoài trình duyệt khách hàng; mọi tin nhắn chat đều đi qua proxy `/api/chat` của server.
  * **Đảm bảo toàn vẹn giỏ hàng:** Máy chủ tự động tính toán lại tổng tiền từ ID sản phẩm và số lượng chiếc, ngăn chặn việc can thiệp giá từ phía client.
  * **Xác thực quyền Admin (RBAC):** Kiểm tra JWT Token và tra cứu cột `role = 'admin'` trong bảng `public.profiles` trước khi cho phép thực thi các API quản trị (`/api/admin/*`).

### 3.3. Tầng Trí Tuệ Nhân Tạo & Tự Động Hóa (AI Agent & n8n Layer)
* **Mô hình AI:** LangChain ReAct Agent (OpenAI Chat Model `gpt-5-mini` / `gpt-4o-mini` hoặc Google Gemini 2.5 Flash).
* **Bộ nhớ ngữ cảnh (Chat Memory):** Sử dụng `Postgres Chat Memory` liên kết qua bảng `n8n_chat_histories` trong Supabase, lưu vết lịch sử chat theo từng `sessionId` duy nhất của người dùng.
* **Bộ 6 Công Cụ Nghiệp Vụ (AI Tools):**
  1. `tra_cuu_san_pham`: Tìm kiếm sản phẩm theo tên tiếng Anh, tone màu hoặc danh mục. Trả về tên, giá 1 chiếc, mô tả và link ảnh `image_url`.
  2. `kiem_tra_ton_kho`: Gọi hàm `public.check_lens_inventory($1, $2)` xử lý thông minh độ cận, tự động chuẩn hóa chuỗi `-2` thành `-2.00`, kiểm tra số lượng vỉ lẻ còn trong kho.
  3. `tra_cuu_don_hang`: Gọi hàm `public.lookup_order($1, $2)` yêu cầu bảo mật 2 lớp: Mã đơn (`DYA-...`) VÀ Số điện thoại đặt hàng.
  4. `tra_cuu_chinh_sach`: Tra cứu chính sách giao hàng, đổi trả 7 ngày 1-1, bảo mật thông tin.
  5. `tra_cuu_faq`: Tra cứu 14 câu hỏi nhãn khoa thường gặp (hướng dẫn tháo, đeo, vệ sinh, hạn dùng).
  6. `kiem_tra_ma_giam_gia`: Xác thực mã voucher hợp lệ trong bảng `public.coupons`.
* **Hàng rào kiểm soát (Safety Boundaries):**
  * Khóa dải độ cận từ `0.00` đến tối đa `-8.00` độ (không báo "hết hàng" khi khách hỏi 9 độ; giải thích uyển chuyển về việc hạ độ khi đeo kính áp tròng).
  * Khóa chức năng đặt hàng: AI không tự nhận địa chỉ để chốt đơn giả định, mà hướng dẫn khách 3 bước đặt hàng chuẩn xác trên website.

### 3.4. Tầng Cơ Sở Dữ Liệu & Đám Mây (Supabase Cloud)
* **Cơ sở dữ liệu:** PostgreSQL 15 quản lý bởi Supabase Cloud.
* **Bảo mật Row Level Security (RLS):** Phân tách quyền đọc công khai (Anon) cho danh mục sản phẩm, chính sách và quyền ghi chỉ dành cho tài khoản Admin hoặc Service Role.
* **Xử lý giao dịch nguyên tử (ACID Transactions):** Sử dụng hàm Stored Procedure `decrement_variant_stock` để trừ đồng thời tồn kho của biến thể độ cận và tồn kho tổng của sản phẩm, chống race condition khi nhiều khách cùng đặt hàng.

---

## 4. MÔ HÌNH DỮ LIỆU THỰC THỂ QUAN HỆ (ENTITY-RELATIONSHIP DIAGRAM - ERD)

```mermaid
erDiagram
    auth_users ||--|| profiles : "1:1 (id = auth.uid())"
    products ||--|{ product_variants : "1:N (has variants)"
    products ||--o{ reviews : "1:N (receives)"
    profiles ||--o{ orders : "1:N (places)"
    orders ||--o{ reviews : "1:N (reviewed in 15 days)"

    auth_users {
        uuid id PK
        string email
        timestamp created_at
    }

    profiles {
        uuid id PK,FK "Tham chiếu auth.users(id)"
        string full_name
        string phone
        string role "admin | customer"
        timestamp updated_at
    }

    products {
        string id PK "prod-dy-..."
        string product_name
        string slug UK
        string category "1 Ngày | 1 Tháng"
        numeric price "Giá theo 1 chiếc lẻ"
        string image_url "CDN link"
        string[] gallery_images
        string[] a_plus_content
        int stock_quantity
        string product_type "contact_lens | accessory"
    }

    product_variants {
        uuid id PK
        string product_id FK "Tham chiếu products(id)"
        string sku UK
        string prescription_power "0.00 đến -8.00"
        int stock_quantity
        timestamp updated_at
    }

    orders {
        bigserial id PK
        string order_code UK "DYA-YYYYMMDD-XXXX"
        uuid user_id FK "Tham chiếu auth.users"
        jsonb customer "Tên, SĐT, Địa chỉ"
        jsonb items "Danh sách chiếc lens, độ cận, giá"
        numeric total_amount
        string payment_method "cod | banking"
        string status "pending | confirmed | shipping | completed"
        timestamp received_at
        timestamp created_at
    }

    reviews {
        string id PK
        string order_id FK
        string product_id FK
        uuid user_id FK
        string reviewer_name
        int rating "1 đến 5 sao"
        text comment
        timestamp created_at
    }

    coupons {
        uuid id PK
        string code UK "WELCOME10, FREESHIP..."
        string discount_type "percentage | fixed"
        numeric discount_value
        numeric min_order_value
        boolean is_active
        timestamp expires_at
    }
```

---

## 5. SƠ ĐỒ LUỒNG DỮ LIỆU NGHIỆP VỤ (SEQUENCE DIAGRAMS)

### 5.1. Luồng Tư Vấn Sản Phẩm, Kiểm Tra Tồn Kho & Gửi Ảnh

```mermaid
sequenceDiagram
    autonumber
    actor Khach as Khách Hàng
    participant UI as Chatbot Widget (Web)
    participant Server as Express Proxy (/api/chat)
    participant n8n as n8n AI Concierge Agent
    participant DB as Supabase Database (Postgres)

    Khach->>UI: "Mẫu Cat-titude Tabby Brown còn cận 2.5 độ không shop?"
    UI->>Server: POST /api/chat { message, sessionId }
    Server->>n8n: POST /dyadia-chat Webhook
    
    Note over n8n: AI suy luận: Cần tìm Tabby Brown và độ -2.50
    n8n->>DB: Gọi check_lens_inventory('Tabby Brown', '-2.50')
    DB-->>n8n: Trả về JSON: in_stock=true, stock=48, price=85000, image_url='...'
    
    Note over n8n: AI định dạng câu trả lời ngọt ngào, báo giá 1 chiếc lẻ, đính kèm ảnh Markdown
    n8n-->>Server: Trả về JSON { reply: "... ![Tabby Brown](image_url)", images: [...] }
    Server-->>UI: 200 OK { success: true, reply }
    UI-->>Khach: Hiển thị tin nhắn tư vấn + Ảnh lens sắc nét + Nút xem chi tiết
```

### 5.2. Luồng Khách Hàng Muốn Đặt Hàng & Cơ Chế Khóa Ranh Giới

```mermaid
sequenceDiagram
    autonumber
    actor Khach as Khách Hàng
    participant UI as Chatbot Widget (Web)
    participant n8n as n8n AI Concierge Agent
    participant WebPage as Trang Sản Phẩm & Giỏ Hàng
    participant Server as Backend Server (/api/orders)
    participant DB as Supabase PostgreSQL

    Khach->>UI: "Đặt giúp mình 2 chiếc Tabby Brown độ -2.50 nhé"
    UI->>n8n: Gửi nội dung tin nhắn
    
    Note over n8n: RÀNG BUỘC KÍCH HOẠT:<br/>Không có tool đặt hàng. Cấm xin địa chỉ để đặt giùm!
    n8n-->>UI: "Dạ để nhận đúng độ cận cho từng mắt, bạn thao tác đặt hàng trực tiếp trên web theo 3 bước cực nhanh này nhé: 1. Vào link [Sản phẩm](/products) 2. Chọn độ cận từng mắt 3. Áp mã WELCOME10 giảm 10%... Hoặc gọi Hotline 0783 465 079 nha!"
    
    Khach->>WebPage: Bấm vào link sản phẩm, chọn độ cận L/R, bấm "Thêm vào giỏ"
    Khach->>WebPage: Nhập mã 'WELCOME10', điền địa chỉ, chọn COD
    WebPage->>Server: POST /api/orders { customer, items, total_amount }
    
    Server->>DB: Gọi Function decrement_variant_stock(prod_id, power, qty)
    DB-->>Server: Trừ tồn kho nguyên tử thành công
    Server->>DB: INSERT INTO public.orders
    DB-->>Server: Tạo mã đơn DYA-20261115-XXXX
    Server-->>WebPage: Đặt hàng thành công!
    WebPage-->>Khach: Hiển thị thông báo đặt hàng thành công & mã đơn hàng
```

---

## 6. ĐIỂM SÁNG KỸ THUẬT & TÍNH NĂNG ĐỘC QUYỀN

1. **Kiến trúc Bán lẻ theo 1 chiếc lens (Single Lens Unit Pricing):**  
   Hệ thống cơ sở dữ liệu và giỏ hàng được thiết kế tối ưu riêng cho bài toán cận lệch độ. Không ép buộc khách hàng phải mua nguyên cặp hay nguyên hộp, giúp giảm 50% chi phí cho người dùng mắt lệch độ.
2. **Hệ thống AI Concierge Hybrid (AI + Quy chuẩn Nhãn khoa):**  
   Kết hợp giữa khả năng xử lý ngôn ngữ tự nhiên linh hoạt của LLM và các quy tắc quang học khắt khe (Vertex Distance - hạ độ cận từ -3.00D trở lên, giới hạn trần -8.00D, phân biệt rõ lens 1 ngày và 1 tháng).
3. **Tra cứu bảo mật đơn hàng 2 lớp (Two-Factor Order Lookup):**  
   Khách hàng không thể đoán mã đơn của người khác; hệ thống chỉ trả về thông tin đơn hàng khi cung cấp chính xác đồng thời **Mã đơn hàng** VÀ **Số điện thoại đặt hàng**.
4. **Bộ đệm dự phòng hai chiều (Graceful Degradation):**  
   Nếu n8n Webhook gặp sự cố mạng hoặc hết hạn ngạch API, hệ thống máy chủ và website tự động chuyển sang bộ máy tư vấn Fallback thông minh cục bộ, đảm bảo trải nghiệm khách hàng không bao giờ bị gián đoạn.

---
*Tài liệu kiến trúc hệ thống chính thức – Thương hiệu Kính Áp Tròng Dyadia Lens.*
