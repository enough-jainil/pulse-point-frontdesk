-- SQL for existing Supabase database structure
-- This works with your current database schema

-- Insert sample data into existing tables

-- First, let's add some sample members using the existing structure
INSERT INTO members (first_name, last_name, email, phone, address, city, state, pincode, date_of_birth, gender, emergency_contact_name, emergency_contact_phone, member_id, status) VALUES
('Azim Imran', 'Bhaiji', 'azim.bhaiji@example.com', '+91-9876543210', '123 Fitness Street', 'Mumbai', 'Maharashtra', '400001', '1990-05-15', 'Male', 'Fatima Bhaiji', '+91-9876543211', 'MEM001', 'active'),
('Mohammad', 'Oliya', 'mohammad.oliya@example.com', '+91-9876543212', '456 Health Avenue', 'Mumbai', 'Maharashtra', '400002', '1985-08-22', 'Male', 'Aisha Oliya', '+91-9876543213', 'MEM002', 'active'),
('Priya', 'Sharma', 'priya.sharma@example.com', '+91-9876543214', '789 Wellness Lane', 'Mumbai', 'Maharashtra', '400003', '1992-12-10', 'Female', 'Raj Sharma', '+91-9876543215', 'MEM003', 'active'),
('Rajesh', 'Kumar', 'rajesh.kumar@example.com', '+91-9876543216', '321 Gym Road', 'Mumbai', 'Maharashtra', '400004', '1988-03-18', 'Male', 'Sunita Kumar', '+91-9876543217', 'MEM004', 'active'),
('Sneha', 'Patel', 'sneha.patel@example.com', '+91-9876543218', '654 Fitness Plaza', 'Mumbai', 'Maharashtra', '400005', '1995-07-25', 'Female', 'Amit Patel', '+91-9876543219', 'MEM005', 'active')
ON CONFLICT (email) DO NOTHING;

-- Add some sample membership packages
INSERT INTO membership_packages (name, description, price, selling_price, duration_days, type, discount, status) VALUES
('Basic Gym', 'Access to gym equipment and basic facilities', 2499.00, 1999.00, 30, 'monthly', 20.00, 'active'),
('Premium Gym', 'Gym access with personal trainer sessions', 4999.00, 3999.00, 90, 'quarterly', 20.00, 'active'),
('Platinum Membership', 'Complete fitness package with all amenities', 9999.00, 7999.00, 180, 'half-yearly', 20.00, 'active'),
('Annual Gold', 'Best value annual membership', 19999.00, 15999.00, 365, 'yearly', 20.00, 'active'),
('Student Package', 'Special discounted package for students', 1999.00, 1499.00, 30, 'monthly', 25.00, 'active')
ON CONFLICT (name) DO NOTHING;

-- Add sample member memberships
INSERT INTO member_memberships (member_id, package_id, start_date, end_date, amount_paid, status, payment_status) VALUES
(
  (SELECT id FROM members WHERE email = 'azim.bhaiji@example.com'),
  (SELECT id FROM membership_packages WHERE name = 'Premium Gym'),
  '2025-07-01',
  '2025-10-01',
  3999.00,
  'active',
  'paid'
),
(
  (SELECT id FROM members WHERE email = 'mohammad.oliya@example.com'),
  (SELECT id FROM membership_packages WHERE name = 'Basic Gym'),
  '2025-07-01',
  '2025-08-01',
  1999.00,
  'active',
  'paid'
),
(
  (SELECT id FROM members WHERE email = 'priya.sharma@example.com'),
  (SELECT id FROM membership_packages WHERE name = 'Platinum Membership'),
  '2025-06-15',
  '2025-12-15',
  7999.00,
  'active',
  'paid'
),
(
  (SELECT id FROM members WHERE email = 'rajesh.kumar@example.com'),
  (SELECT id FROM membership_packages WHERE name = 'Annual Gold'),
  '2025-01-01',
  '2026-01-01',
  15999.00,
  'active',
  'paid'
),
(
  (SELECT id FROM members WHERE email = 'sneha.patel@example.com'),
  (SELECT id FROM membership_packages WHERE name = 'Student Package'),
  '2025-07-10',
  '2025-08-10',
  1499.00,
  'active',
  'pending'
)
ON CONFLICT DO NOTHING;

-- Add sample inquiries
INSERT INTO inquiries (name, email, mobile, inquiry_date, notes, status, source) VALUES
('John Doe', 'john.doe@example.com', '+91-9876543220', '2025-07-20', 'Interested in gym membership. Asked about packages and pricing.', 'pending', 'website'),
('Jane Smith', 'jane.smith@example.com', '+91-9876543221', '2025-07-21', 'Wants personal training sessions. Inquired about trainers availability.', 'contacted', 'phone'),
('Mike Johnson', 'mike.johnson@example.com', '+91-9876543222', '2025-07-22', 'Asked about group classes - yoga and zumba timings.', 'pending', 'walk-in'),
('Sarah Wilson', 'sarah.wilson@example.com', '+91-9876543223', '2025-07-23', 'Requested facility tour. Scheduled for this weekend.', 'closed', 'website'),
('David Brown', 'david.brown@example.com', '+91-9876543224', '2025-07-24', 'Corporate membership inquiry for 50+ employees.', 'pending', 'email')
ON CONFLICT DO NOTHING;

-- Add sample invoices
INSERT INTO invoices (invoice_no, customer_name, customer_phone, customer_email, amount, balance_due, invoice_date, due_date, status) VALUES
('INV-001', 'Azim Imran Bhaiji', '+91-9876543210', 'azim.bhaiji@example.com', 17135.88, 0, '2025-07-14', '2025-07-21', 'paid'),
('INV-002', 'Mohammad Oliya', '+91-9876543212', 'mohammad.oliya@example.com', 17135.88, 0, '2025-07-14', '2025-07-21', 'paid'),
('INV-003', 'Priya Sharma', '+91-9876543214', 'priya.sharma@example.com', 8581.83, 0, '2025-06-15', '2025-06-22', 'paid'),
('INV-004', 'Sneha Patel', '+91-9876543218', 'sneha.patel@example.com', 1609.10, 1609.10, '2025-07-10', '2025-08-10', 'pending')
ON CONFLICT (invoice_no) DO NOTHING;

-- Add sample payments
INSERT INTO payments (invoice_no, customer_name, customer_phone, amount, payment_mode, payment_date, reference_no, invoice_id) VALUES
('INV-001', 'Azim Imran Bhaiji', '+91-9876543210', 17135.88, 'UPI', '2025-07-14', 'UPI-TXN-001', (SELECT id FROM invoices WHERE invoice_no = 'INV-001')),
('INV-002', 'Mohammad Oliya', '+91-9876543212', 17135.88, 'Cash', '2025-07-14', 'CASH-001', (SELECT id FROM invoices WHERE invoice_no = 'INV-002')),
('INV-003', 'Priya Sharma', '+91-9876543214', 8581.83, 'Card', '2025-06-15', 'CARD-TXN-001', (SELECT id FROM invoices WHERE invoice_no = 'INV-003'))
ON CONFLICT DO NOTHING;

-- Add sample wellness services
INSERT INTO services (title, description, status) VALUES
('Swedish Massage', 'Relaxing full body massage with essential oils', 'active'),
('Deep Tissue Massage', 'Therapeutic massage for muscle tension relief', 'active'),
('Aromatherapy', 'Stress relief massage with aromatic oils', 'active'),
('Hot Stone Therapy', 'Healing massage using heated stones', 'active'),
('Reflexology', 'Foot massage targeting pressure points', 'active'),
('Face Cleanup', 'Deep cleansing facial treatment', 'active'),
('Body Scrub', 'Exfoliating treatment for smooth skin', 'active')
ON CONFLICT (title) DO NOTHING;

-- Add sample wellness packages
INSERT INTO wellness_packages (title, mrp, selling_price, discount, duration_minutes, sessions, status, service_id) VALUES
('Relaxation Package', 10000.00, 8000.00, 20.00, 60, 3, 'active', (SELECT id FROM services WHERE title = 'Swedish Massage')),
('Therapeutic Package', 15000.00, 12000.00, 20.00, 75, 4, 'active', (SELECT id FROM services WHERE title = 'Deep Tissue Massage')),
('Beauty & Wellness', 18000.00, 15000.00, 16.67, 60, 5, 'active', (SELECT id FROM services WHERE title = 'Face Cleanup')),
('Quick Refresh', 6000.00, 5000.00, 16.67, 30, 2, 'active', (SELECT id FROM services WHERE title = 'Reflexology'))
ON CONFLICT (title) DO NOTHING;

-- Add sample wellness appointments
INSERT INTO appointments (appointment_id, customer_name, customer_phone, customer_email, appointment_date, appointment_time, amount, appointment_status, payment_status, package_id) VALUES
('APT-001', 'Priya Sharma', '+91-9876543214', 'priya.sharma@example.com', '2025-07-25', '10:00:00', 8000.00, 'scheduled', 'paid', (SELECT id FROM wellness_packages WHERE title = 'Relaxation Package')),
('APT-002', 'Azim Imran Bhaiji', '+91-9876543210', 'azim.bhaiji@example.com', '2025-07-26', '14:00:00', 12000.00, 'scheduled', 'paid', (SELECT id FROM wellness_packages WHERE title = 'Therapeutic Package')),
('APT-003', 'Rajesh Kumar', '+91-9876543216', 'rajesh.kumar@example.com', '2025-07-24', '16:30:00', 5000.00, 'completed', 'paid', (SELECT id FROM wellness_packages WHERE title = 'Quick Refresh')),
('APT-004', 'Sneha Patel', '+91-9876543218', 'sneha.patel@example.com', '2025-07-27', '11:00:00', 15000.00, 'scheduled', 'pending', (SELECT id FROM wellness_packages WHERE title = 'Beauty & Wellness'))
ON CONFLICT (appointment_id) DO NOTHING;

-- Update any existing data status
UPDATE members SET status = 'active' WHERE status IS NULL;
UPDATE membership_packages SET status = 'active' WHERE status IS NULL;
UPDATE inquiries SET status = 'pending' WHERE status IS NULL;
UPDATE services SET status = 'active' WHERE status IS NULL;
UPDATE wellness_packages SET status = 'active' WHERE status IS NULL;

-- Create some useful views for easier data access
CREATE OR REPLACE VIEW member_details AS
SELECT 
    m.id,
    CONCAT(m.first_name, ' ', m.last_name) as full_name,
    m.email,
    m.phone,
    m.member_id,
    m.status,
    m.created_at
FROM members m;

CREATE OR REPLACE VIEW active_memberships AS
SELECT 
    mm.id,
    CONCAT(m.first_name, ' ', m.last_name) as member_name,
    m.email,
    m.phone,
    mp.name as package_name,
    mp.price,
    mm.start_date,
    mm.end_date,
    mm.amount_paid,
    mm.status,
    mm.payment_status,
    CASE 
        WHEN mm.end_date < CURRENT_DATE THEN 'expired'
        WHEN mm.end_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'expiring_soon'
        ELSE 'active'
    END as renewal_status
FROM member_memberships mm
JOIN members m ON mm.member_id = m.id
JOIN membership_packages mp ON mm.package_id = mp.id
WHERE mm.status = 'active';

-- Display success message
SELECT 'Sample data inserted successfully! Check the following tables:' as message
UNION ALL
SELECT '- members (' || COUNT(*) || ' records)' FROM members
UNION ALL
SELECT '- membership_packages (' || COUNT(*) || ' records)' FROM membership_packages
UNION ALL
SELECT '- member_memberships (' || COUNT(*) || ' records)' FROM member_memberships
UNION ALL
SELECT '- inquiries (' || COUNT(*) || ' records)' FROM inquiries
UNION ALL
SELECT '- invoices (' || COUNT(*) || ' records)' FROM invoices
UNION ALL
SELECT '- payments (' || COUNT(*) || ' records)' FROM payments
UNION ALL
SELECT '- services (' || COUNT(*) || ' records)' FROM services
UNION ALL
SELECT '- wellness_packages (' || COUNT(*) || ' records)' FROM wellness_packages
UNION ALL
SELECT '- appointments (' || COUNT(*) || ' records)' FROM appointments;
