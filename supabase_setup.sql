-- ==============================================================================
-- DYADIA LENS - HỆ THỐNG CƠ SỞ DỮ LIỆU SUPABASE TOÀN DIỆN
-- File: supabase_setup.sql
-- Hướng dẫn: Mở Supabase Dashboard -> Vào mục SQL Editor -> Nhấn 'New query' ->
--             Dán toàn bộ nội dung script này vào và bấm 'Run'.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. BẢNG HỒ SƠ NGƯỜI DÙNG (public.profiles)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Bật Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Chính sách bảo mật RLS cho profiles
DROP POLICY IF EXISTS "Cho phép người dùng xem hồ sơ của chính mình" ON public.profiles;
CREATE POLICY "Cho phép người dùng xem hồ sơ của chính mình"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Cho phép người dùng tạo hồ sơ của chính mình" ON public.profiles;
CREATE POLICY "Cho phép người dùng tạo hồ sơ của chính mình"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Cho phép người dùng cập nhật hồ sơ của chính mình" ON public.profiles;
CREATE POLICY "Cho phép người dùng cập nhật hồ sơ của chính mình"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger tự động đồng bộ khi khách hàng đăng ký tài khoản qua Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, created_at, updated_at)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ------------------------------------------------------------------------------
-- 2. BẢNG PHÂN LOẠI & TỒN KHO THEO ĐỘ CẬN (public.product_variants)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT,
  prescription_power TEXT NOT NULL,
  stock_quantity INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_product_power UNIQUE (product_id, prescription_power)
);

CREATE INDEX IF NOT EXISTS idx_product_variants_prod_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_power ON public.product_variants(prescription_power);

-- Bật RLS cho product_variants (Công khai xem tồn kho để chọn mua)
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Công khai xem biến thể độ cận" ON public.product_variants;
CREATE POLICY "Công khai xem biến thể độ cận"
  ON public.product_variants FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Cho phép server quản lý biến thể" ON public.product_variants;
CREATE POLICY "Cho phép server quản lý biến thể"
  ON public.product_variants FOR ALL
  USING (true)
  WITH CHECK (true);


-- ------------------------------------------------------------------------------
-- 3. BẢNG ĐƠN HÀNG (public.orders)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id BIGSERIAL PRIMARY KEY,
  order_code TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'cod',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_code ON public.orders(order_code);

-- Bật RLS cho orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Khách hàng xem đơn hàng của mình" ON public.orders;
CREATE POLICY "Khách hàng xem đơn hàng của mình"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Khách hàng tạo đơn hàng" ON public.orders;
CREATE POLICY "Khách hàng tạo đơn hàng"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Cập nhật đơn hàng" ON public.orders;
CREATE POLICY "Cập nhật đơn hàng"
  ON public.orders FOR UPDATE
  USING (auth.uid() = user_id);


-- ------------------------------------------------------------------------------
-- 4. BẢNG MÃ KHUYẾN MÃI / VOUCHER (public.coupons)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL DEFAULT 'percentage', -- 'percentage' hoặc 'fixed'
  discount_value NUMERIC NOT NULL,
  min_order_value NUMERIC DEFAULT 0,
  max_discount NUMERIC,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Bật RLS cho coupons
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Công khai xem mã giảm giá hợp lệ" ON public.coupons;
CREATE POLICY "Công khai xem mã giảm giá hợp lệ"
  ON public.coupons FOR SELECT
  USING (is_active = true);

-- Thêm các mã giảm giá mặc định của Dyadia Lens
INSERT INTO public.coupons (code, discount_type, discount_value, min_order_value, is_active)
VALUES
  ('WELCOME10', 'percentage', 10, 0, true),
  ('LENS50K', 'fixed', 50000, 399000, true),
  ('FREESHIP', 'fixed', 30000, 299000, true),
  ('DYADIA20', 'percentage', 20, 500000, true)
ON CONFLICT (code) DO NOTHING;


-- ------------------------------------------------------------------------------
-- 5. FUNCTION TRỪ TỒN KHO AN TOÀN KHI ĐẶT HÀNG (decrement_variant_stock)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.decrement_variant_stock(
  p_product_id TEXT,
  p_power TEXT,
  p_qty INTEGER
)
RETURNS void AS $$
BEGIN
  -- Trừ tồn kho phân loại độ cận
  UPDATE public.product_variants
  SET stock_quantity = GREATEST(0, stock_quantity - p_qty),
      updated_at = now()
  WHERE product_id = p_product_id
    AND prescription_power = p_power;

  -- Trừ tồn kho tổng của sản phẩm
  UPDATE public.products
  SET stock_quantity = GREATEST(0, COALESCE(stock_quantity, 0) - p_qty),
      updated_at = now()
  WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ------------------------------------------------------------------------------
-- 6. TỰ ĐỘNG KHỞI TẠO TỒN KHO ĐỘ CẬN CHO TẤT CẢ SẢN PHẨM KÍNH ÁP TRÒNG
-- (Tạo 23 mức độ cận từ 0.00 đến -8.00 cho mỗi mẫu lens, số lượng mặc định 50 chiếc)
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  prod RECORD;
  power_val TEXT;
  powers TEXT[] := ARRAY[
    '0.00', '-0.50', '-1.00', '-1.25', '-1.50', '-1.75', '-2.00',
    '-2.25', '-2.50', '-2.75', '-3.00', '-3.25', '-3.50', '-3.75',
    '-4.00', '-4.50', '-5.00', '-5.50', '-6.00', '-6.50', '-7.00',
    '-7.50', '-8.00'
  ];
BEGIN
  FOR prod IN SELECT id, sku FROM public.products WHERE product_type = 'contact_lens' OR product_type IS NULL LOOP
    FOREACH power_val IN ARRAY powers LOOP
      INSERT INTO public.product_variants (product_id, sku, prescription_power, stock_quantity)
      VALUES (
        prod.id,
        COALESCE(prod.sku, prod.id) || '-' || REPLACE(REPLACE(power_val, '.', ''), '-', 'M'),
        power_val,
        50
      )
      ON CONFLICT (product_id, prescription_power) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;
