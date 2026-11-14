-- ==============================================================================
-- DYADIA LENS: SUPABASE SQL MIGRATION
-- Chạy các lệnh SQL này trong Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. BẢNG PRODUCT_VARIANTS (Quản lý tồn kho kính áp tròng theo từng độ cận)
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  prescription_power TEXT NOT NULL, -- Ví dụ: '0.00', '-0.50', '-1.00', ..., '-8.00'
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_product_power UNIQUE (product_id, prescription_power)
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);

-- 2. HÀM NGUYÊN TỬ TRỪ TỒN KHO PHÂN LOẠI (Atomic Stock Decrement)
CREATE OR REPLACE FUNCTION public.decrement_variant_stock(
  p_product_id TEXT,
  p_power TEXT,
  p_qty INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.product_variants
  SET 
    stock_quantity = GREATEST(0, stock_quantity - p_qty),
    updated_at = now()
  WHERE product_id = p_product_id AND prescription_power = p_power;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. TRIGGER TỰ ĐỘNG TẠO PROFILE KHI KHÁCH HÀNG ĐĂNG KÝ (Supabase Auth Trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Đăng ký trigger trên auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. BẢO MẬT ROW LEVEL SECURITY (RLS)

-- A. Bảng products: Khách hàng chỉ có quyền ĐỌC (SELECT), không thể sửa giá hoặc tồn kho
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow select products for authenticated users" ON public.products;
CREATE POLICY "Allow select products for authenticated users"
  ON public.products
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- B. Bảng product_variants: Khách hàng chỉ có quyền ĐỌC (SELECT)
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow select variants for all users" ON public.product_variants;
CREATE POLICY "Allow select variants for all users"
  ON public.product_variants
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- C. Bảng profiles: Khách hàng chỉ được xem và cập nhật hồ sơ của chính mình
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- D. Bảng orders: Khách hàng chỉ được xem đơn hàng của chính mình
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
CREATE POLICY "Users can insert own orders"
  ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
