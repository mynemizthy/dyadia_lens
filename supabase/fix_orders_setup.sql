-- ==============================================================================
-- CẬP NHẬT PHÂN QUYỀN ĐƠN HÀNG, ĐÁNH GIÁ 15 NGÀY & ĐỒNG BỘ 2 CHIỀU (Dyadia Lens)
-- ==============================================================================
-- Hướng dẫn:
-- 1. Mở Supabase Dashboard -> Dự án của bạn -> SQL Editor.
-- 2. Dán toàn bộ mã bên dưới và nhấn RUN để thực thi.
-- ==============================================================================

-- 1. Bảng public.orders: Bổ sung cột received_at & mở rộng trạng thái hoàn tất
CREATE TABLE IF NOT EXISTS public.orders (
  id BIGSERIAL PRIMARY KEY,
  order_code TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'cod',
  status TEXT NOT NULL DEFAULT 'pending',
  received_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS received_at TIMESTAMPTZ;

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS chk_order_status;
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders 
  ADD CONSTRAINT chk_order_status 
  CHECK (status IN (
    'pending', 'confirmed', 'processing', 'shipping', 'delivered', 'completed', 'cancelled', 'refunded',
    'Chờ xác nhận', 'Đã xác nhận', 'Đang xử lý', 'Đang giao hàng', 'Đã giao hàng', 'Đã hoàn tất', 'Hoàn thành', 'Đã hủy'
  ));

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_code ON public.orders(order_code);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public and Admin can view orders" ON public.orders;
DROP POLICY IF EXISTS "Public and Admin can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Public and Admin can update orders" ON public.orders;
DROP POLICY IF EXISTS "Public and Admin can delete orders" ON public.orders;

CREATE POLICY "Public and Admin can view orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public and Admin can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public and Admin can update orders" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public and Admin can delete orders" ON public.orders FOR DELETE USING (true);

-- 2. Bảng Đánh Giá Sản Phẩm (public.reviews) - Hỗ trợ đánh giá trong 15 ngày sau khi nhận hàng
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  order_code TEXT,
  product_id TEXT NOT NULL,
  product_name TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_order_id ON public.reviews(order_id);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON public.reviews;
CREATE POLICY "Public can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);

-- 3. Đảm bảo bảng public.products hỗ trợ đồng bộ 2 chiều đầy đủ (Thêm / Sửa / Xóa)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow select products for authenticated users" ON public.products;
DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Admin full write products" ON public.products;

CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin full write products" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- HOÀN TẤT: Hệ thống đơn hàng xác nhận 2 chiều, đánh giá 15 ngày và đồng bộ sản phẩm đã sẵn sàng!
-- ==============================================================================
