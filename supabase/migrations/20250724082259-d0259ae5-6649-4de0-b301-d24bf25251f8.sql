-- Create storage bucket for service images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('service-images', 'service-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

-- Create storage policies for service images
CREATE POLICY "Anyone can view service images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'service-images');

CREATE POLICY "Authenticated users can upload service images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'service-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update service images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'service-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete service images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'service-images' AND auth.role() = 'authenticated');