-- Simple SQL insert for existing database structure
-- No conflict handling - just direct inserts

-- First add sample members (they need to exist before member_memberships)
INSERT INTO members (id, first_name, last_name, email, phone, address, city, state, pincode, date_of_birth, gender, emergency_contact_name, emergency_contact_phone, member_id, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Azim Imran', 'Bhaiji', 'azim.bhaiji@example.com', '+91-9876543210', '123 Fitness Street', 'Mumbai', 'Maharashtra', '400001', '1990-05-15', 'Male', 'Fatima Bhaiji', '+91-9876543211', 'MEM001', 'active'),
('550e8400-e29b-41d4-a716-446655440002', 'Mohammad', 'Oliya', 'mohammad.oliya@example.com', '+91-9876543212', '456 Health Avenue', 'Mumbai', 'Maharashtra', '400002', '1985-08-22', 'Male', 'Aisha Oliya', '+91-9876543213', 'MEM002', 'active'),
('550e8400-e29b-41d4-a716-446655440003', 'Priya', 'Sharma', 'priya.sharma@example.com', '+91-9876543214', '789 Wellness Lane', 'Mumbai', 'Maharashtra', '400003', '1992-12-10', 'Female', 'Raj Sharma', '+91-9876543215', 'MEM003', 'active'),
('550e8400-e29b-41d4-a716-446655440004', 'Rajesh', 'Kumar', 'rajesh.kumar@example.com', '+91-9876543216', '321 Gym Road', 'Mumbai', 'Maharashtra', '400004', '1988-03-18', 'Male', 'Sunita Kumar', '+91-9876543217', 'MEM004', 'active'),
('550e8400-e29b-41d4-a716-446655440005', 'Sneha', 'Patel', 'sneha.patel@example.com', '+91-9876543218', '654 Fitness Plaza', 'Mumbai', 'Maharashtra', '400005', '1995-07-25', 'Female', 'Amit Patel', '+91-9876543219', 'MEM005', 'active');

-- Add sample membership packages with specific UUIDs
INSERT INTO membership_packages (id, name, type, duration_days, price, selling_price, discount, description, status) VALUES
('a1111111-e29b-41d4-a716-446655440001', 'Basic Gym', 'monthly', 30, 2499.00, 1999.00, 20.00, 'Access to gym equipment and basic facilities', 'active'),
('a1111111-e29b-41d4-a716-446655440002', 'Premium Gym', 'quarterly', 90, 4999.00, 3999.00, 20.00, 'Gym access with personal trainer sessions', 'active'),
('a1111111-e29b-41d4-a716-446655440003', 'Platinum Membership', 'half-yearly', 180, 9999.00, 7999.00, 20.00, 'Complete fitness package with all amenities', 'active'),
('a1111111-e29b-41d4-a716-446655440004', 'Annual Gold', 'yearly', 365, 19999.00, 15999.00, 20.00, 'Best value annual membership', 'active'),
('a1111111-e29b-41d4-a716-446655440005', 'Student Package', 'monthly', 30, 1999.00, 1499.00, 25.00, 'Special discounted package for students', 'active');

-- Add sample member memberships
INSERT INTO member_memberships (member_id, package_id, start_date, end_date, amount_paid, payment_status, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'a1111111-e29b-41d4-a716-446655440001', '2025-07-01', '2025-10-01', 3999.00, 'paid', 'active'),
('550e8400-e29b-41d4-a716-446655440002', 'a1111111-e29b-41d4-a716-446655440002', '2025-07-01', '2025-08-01', 1999.00, 'paid', 'active'),
('550e8400-e29b-41d4-a716-446655440003', 'a1111111-e29b-41d4-a716-446655440003', '2025-06-15', '2025-12-15', 7999.00, 'paid', 'active'),
('550e8400-e29b-41d4-a716-446655440004', 'a1111111-e29b-41d4-a716-446655440004', '2025-01-01', '2026-01-01', 15999.00, 'paid', 'active'),
('550e8400-e29b-41d4-a716-446655440005', 'a1111111-e29b-41d4-a716-446655440005', '2025-07-10', '2025-08-10', 1499.00, 'pending', 'active');

-- Add sample invoices with specific UUIDs
INSERT INTO invoices (id, invoice_no, customer_name, customer_email, customer_phone, invoice_date, due_date, amount, balance_due, status) VALUES
('d4444444-e29b-41d4-a716-446655440001', 'INV-001', 'Azim Imran Bhaiji', 'azim.bhaiji@example.com', '+91-9876543210', '2025-07-14', '2025-07-21', 4718.82, 0, 'paid'),
('d4444444-e29b-41d4-a716-446655440002', 'INV-002', 'Mohammad Oliya', 'mohammad.oliya@example.com', '+91-9876543212', '2025-07-14', '2025-07-21', 2358.82, 0, 'paid'),
('d4444444-e29b-41d4-a716-446655440003', 'INV-003', 'Priya Sharma', 'priya.sharma@example.com', '+91-9876543214', '2025-06-15', '2025-06-22', 9438.82, 0, 'paid'),
('d4444444-e29b-41d4-a716-446655440004', 'INV-004', 'Rajesh Kumar', 'rajesh.kumar@example.com', '+91-9876543216', '2025-01-01', '2026-01-01', 18878.82, 0, 'paid'),
('d4444444-e29b-41d4-a716-446655440005', 'INV-005', 'Sneha Patel', 'sneha.patel@example.com', '+91-9876543218', '2025-07-10', '2025-08-10', 1768.82, 1768.82, 'pending');

-- Add sample payments using proper invoice UUIDs
INSERT INTO payments (invoice_no, customer_name, customer_phone, payment_date, amount, balance_due, payment_mode, reference_no, invoice_id) VALUES
('INV-001', 'Azim Imran Bhaiji', '+91-9876543210', '2025-07-14', 4718.82, 0, 'UPI', 'UPI-TXN-001', 'd4444444-e29b-41d4-a716-446655440001'),
('INV-002', 'Mohammad Oliya', '+91-9876543212', '2025-07-14', 2358.82, 0, 'Cash', 'CASH-001', 'd4444444-e29b-41d4-a716-446655440002'),
('INV-003', 'Priya Sharma', '+91-9876543214', '2025-06-15', 9438.82, 0, 'Card', 'CARD-TXN-001', 'd4444444-e29b-41d4-a716-446655440003'),
('INV-004', 'Rajesh Kumar', '+91-9876543216', '2025-01-01', 18878.82, 0, 'Bank Transfer', 'BANK-TXN-001', 'd4444444-e29b-41d4-a716-446655440004');

-- Add sample wellness services with specific UUIDs
INSERT INTO services (id, title, description, status) VALUES
('b2222222-e29b-41d4-a716-446655440001', 'Swedish Massage', 'Relaxing full body massage with essential oils', 'active'),
('b2222222-e29b-41d4-a716-446655440002', 'Deep Tissue Massage', 'Therapeutic massage for muscle tension relief', 'active'),
('b2222222-e29b-41d4-a716-446655440003', 'Aromatherapy', 'Stress relief massage with aromatic oils', 'active'),
('b2222222-e29b-41d4-a716-446655440004', 'Hot Stone Therapy', 'Healing massage using heated stones', 'active'),
('b2222222-e29b-41d4-a716-446655440005', 'Reflexology', 'Foot massage targeting pressure points', 'active'),
('b2222222-e29b-41d4-a716-446655440006', 'Face Cleanup', 'Deep cleansing facial treatment', 'active'),
('b2222222-e29b-41d4-a716-446655440007', 'Body Scrub', 'Exfoliating treatment for smooth skin', 'active'),
('b2222222-e29b-41d4-a716-446655440008', 'Hair Spa', 'Nourishing hair treatment with natural oils', 'active');

-- Add sample wellness packages with UUIDs
INSERT INTO wellness_packages (id, title, sessions, duration_minutes, mrp, selling_price, discount, status, service_id) VALUES
('c3333333-e29b-41d4-a716-446655440001', 'Relaxation Package', 3, 60, 10000.00, 8000.00, 20.00, 'active', 'b2222222-e29b-41d4-a716-446655440001'),
('c3333333-e29b-41d4-a716-446655440002', 'Therapeutic Package', 4, 75, 15000.00, 12000.00, 20.00, 'active', 'b2222222-e29b-41d4-a716-446655440002'),
('c3333333-e29b-41d4-a716-446655440003', 'Beauty & Wellness', 5, 60, 18000.00, 15000.00, 16.67, 'active', 'b2222222-e29b-41d4-a716-446655440006'),
('c3333333-e29b-41d4-a716-446655440004', 'Quick Refresh', 2, 30, 6000.00, 5000.00, 16.67, 'active', 'b2222222-e29b-41d4-a716-446655440005'),
('c3333333-e29b-41d4-a716-446655440005', 'Ultimate Spa', 6, 90, 25000.00, 20000.00, 20.00, 'active', 'b2222222-e29b-41d4-a716-446655440004');

-- Add sample wellness appointments using proper UUIDs
INSERT INTO appointments (appointment_id, customer_name, customer_email, customer_phone, appointment_date, appointment_time, amount, appointment_status, payment_status, package_id) VALUES
('APT-001', 'Priya Sharma', 'priya.sharma@example.com', '+91-9876543214', '2025-07-25', '10:00:00', 8000.00, 'scheduled', 'paid', 'c3333333-e29b-41d4-a716-446655440001'),
('APT-002', 'Azim Imran Bhaiji', 'azim.bhaiji@example.com', '+91-9876543210', '2025-07-26', '14:00:00', 12000.00, 'scheduled', 'paid', 'c3333333-e29b-41d4-a716-446655440002'),
('APT-003', 'Rajesh Kumar', 'rajesh.kumar@example.com', '+91-9876543216', '2025-07-24', '16:30:00', 5000.00, 'completed', 'paid', 'c3333333-e29b-41d4-a716-446655440004'),
('APT-004', 'Sneha Patel', 'sneha.patel@example.com', '+91-9876543218', '2025-07-27', '11:00:00', 15000.00, 'scheduled', 'pending', 'c3333333-e29b-41d4-a716-446655440003'),
('APT-005', 'Mohammad Oliya', 'mohammad.oliya@example.com', '+91-9876543212', '2025-07-28', '15:00:00', 20000.00, 'scheduled', 'paid', 'c3333333-e29b-41d4-a716-446655440005');

-- Display success message
SELECT 'Sample data inserted successfully!' as message;
SELECT 'Check your tables - they now have sample data for testing.' as message;
SELECT 'Your AddMember page should now show packages in the dropdown.' as message;
SELECT 'Your Reports page should now display real invoice data.' as message;
