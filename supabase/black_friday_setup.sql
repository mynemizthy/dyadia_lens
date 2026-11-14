-- ====================================================================
-- DYADIA LENS - CHIẾN DỊCH BLACK FRIDAY
-- TẠO BẢNG public.black_friday_subscribers TRÊN SUPABASE
-- ====================================================================

-- 1. Tạo bảng lưu trữ danh sách khách hàng đăng ký nhận tin Black Friday
CREATE TABLE IF NOT EXISTS public.black_friday_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    campaign_name TEXT DEFAULT 'Black Friday 2026',
    source TEXT DEFAULT 'popup',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Đánh index trên cột email để tối ưu tìm kiếm và tránh trùng lặp
CREATE INDEX IF NOT EXISTS idx_black_friday_subscribers_email 
ON public.black_friday_subscribers (email);

-- 3. Kích hoạt Row Level Security (RLS)
ALTER TABLE public.black_friday_subscribers ENABLE ROW LEVEL SECURITY;

-- 4. Cho phép khách hàng vãng lai đăng ký qua website (INSERT không cần đăng nhập)
DROP POLICY IF EXISTS "Cho phép khách đăng ký email Black Friday" ON public.black_friday_subscribers;
CREATE POLICY "Cho phép khách đăng ký email Black Friday"
ON public.black_friday_subscribers
FOR INSERT
WITH CHECK (true);

-- 5. Cho phép xem danh sách đăng ký Black Friday
DROP POLICY IF EXISTS "Cho phép xem danh sách Black Friday" ON public.black_friday_subscribers;
CREATE POLICY "Cho phép xem danh sách Black Friday"
ON public.black_friday_subscribers
FOR SELECT
USING (true);

-- 6. Trigger tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION public.update_black_friday_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_black_friday_subscribers_updated_at ON public.black_friday_subscribers;
CREATE TRIGGER trigger_black_friday_subscribers_updated_at
BEFORE UPDATE ON public.black_friday_subscribers
FOR EACH ROW
EXECUTE FUNCTION public.update_black_friday_updated_at();

-- Thông báo hoàn tất
COMMENT ON TABLE public.black_friday_subscribers IS 'Danh sách khách hàng đăng ký nhận thông báo ưu đãi Black Friday';
