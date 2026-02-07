-- Fix function search_path issues
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  new_number TEXT;
  counter INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO counter FROM public.purchase_orders;
  new_number := 'PO-' || LPAD(counter::TEXT, 6, '0');
  RETURN new_number;
END;
$$;

-- Fix permissive RLS policies for notifications
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "Authenticated users can insert notifications" ON public.notifications 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Fix permissive RLS policies for product_history
DROP POLICY IF EXISTS "System can insert product history" ON public.product_history;
CREATE POLICY "Authenticated users can insert product history" ON public.product_history 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);