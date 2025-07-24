-- SQL for the EXACT current database structure shown in the image
-- This matches your actual database schema

-- Add sample membership packages
INSERT INTO membership_packages (name, type, duration_days, price, selling_price, discount, description, status) VALUES
('Basic Gym', 'monthly', 30, 2499.00, 1999.00, 20.00, 'Access to gym equipment and basic facilities', 'active'),
('Premium Gym', 'quarterly', 90, 4999.00, 3999.00, 20.00, 'Gym access with personal trainer sessions', 'active'),
('Platinum Membership', 'half-yearly', 180, 9999.00, 7999.00, 20.00, 'Complete fitness package with all amenities', 'active'),
('Annual Gold', 'yearly', 365, 19999.00, 15999.00, 20.00, 'Best value annual membership', 'active'),
('Student Package', 'monthly', 30, 1999.00, 1499.00, 25.00, 'Special discounted package for students', 'active')
ON CONFLICT (name) DO NOTHING;

-- Add sample member memberships (without separate members table)
INSERT INTO member_memberships (member_id, package_id, start_date, end_date, amount_paid, payment_status, status) VALUES
('MEM001', (SELECT id FROM membership_packages WHERE name = 'Premium Gym'), '2025-07-01', '2025-10-01', 3999.00, 'paid', 'active'),
('MEM002', (SELECT id FROM membership_packages WHERE name = 'Basic Gym'), '2025-07-01', '2025-08-01', 1999.00, 'paid', 'active'),
('MEM003', (SELECT id FROM membership_packages WHERE name = 'Platinum Membership'), '2025-06-15', '2025-12-15', 7999.00, 'paid', 'active'),
('MEM004', (SELECT id FROM membership_packages WHERE name = 'Annual Gold'), '2025-01-01', '2026-01-01', 15999.00, 'paid', 'active'),
('MEM005', (SELECT id FROM membership_packages WHERE name = 'Student Package'), '2025-07-10', '2025-08-10', 1499.00, 'pending', 'active')
ON CONFLICT DO NOTHING;

-- Add sample invoices
INSERT INTO invoices (invoice_no, customer_name, customer_email, customer_phone, invoice_date, due_date, amount, balance_due, status) VALUES
('INV-001', 'Azim Imran Bhaiji', 'azim.bhaiji@example.com', '+91-9876543210', '2025-07-14', '2025-07-21', 17135.88, 0, 'paid'),
('INV-002', 'Mohammad Oliya', 'mohammad.oliya@example.com', '+91-9876543212', '2025-07-14', '2025-07-21', 17135.88, 0, 'paid'),
('INV-003', 'Priya Sharma', 'priya.sharma@example.com', '+91-9876543214', '2025-06-15', '2025-06-22', 8581.83, 0, 'paid'),
('INV-004', 'Sneha Patel', 'sneha.patel@example.com', '+91-9876543218', '2025-07-10', '2025-08-10', 1609.10, 1609.10, 'pending'),
('INV-005', 'Rajesh Kumar', 'rajesh.kumar@example.com', '+91-9876543216', '2025-07-20', '2025-07-27', 12999.00, 0, 'paid')
ON CONFLICT (invoice_no) DO NOTHING;

-- Add sample payments
INSERT INTO payments (invoice_no, customer_name, customer_phone, payment_date, amount, balance_due, payment_mode, reference_no, invoice_id) VALUES
('INV-001', 'Azim Imran Bhaiji', '+91-9876543210', '2025-07-14', 17135.88, 0, 'UPI', 'UPI-TXN-001', (SELECT id FROM invoices WHERE invoice_no = 'INV-001')),
('INV-002', 'Mohammad Oliya', '+91-9876543212', '2025-07-14', 17135.88, 0, 'Cash', 'CASH-001', (SELECT id FROM invoices WHERE invoice_no = 'INV-002')),
('INV-003', 'Priya Sharma', '+91-9876543214', '2025-06-15', 8581.83, 0, 'Card', 'CARD-TXN-001', (SELECT id FROM invoices WHERE invoice_no = 'INV-003')),
('INV-005', 'Rajesh Kumar', '+91-9876543216', '2025-07-20', 12999.00, 0, 'Bank Transfer', 'BANK-TXN-001', (SELECT id FROM invoices WHERE invoice_no = 'INV-005'))
ON CONFLICT DO NOTHING;

-- Add sample wellness services
INSERT INTO services (title, description, status) VALUES
('Swedish Massage', 'Relaxing full body massage with essential oils', 'active'),
('Deep Tissue Massage', 'Therapeutic massage for muscle tension relief', 'active'),
('Aromatherapy', 'Stress relief massage with aromatic oils', 'active'),
('Hot Stone Therapy', 'Healing massage using heated stones', 'active'),
('Reflexology', 'Foot massage targeting pressure points', 'active'),
('Face Cleanup', 'Deep cleansing facial treatment', 'active'),
('Body Scrub', 'Exfoliating treatment for smooth skin', 'active'),
('Hair Spa', 'Nourishing hair treatment with natural oils', 'active')
ON CONFLICT (title) DO NOTHING;

-- Add sample wellness packages
INSERT INTO wellness_packages (title, sessions, duration_minutes, mrp, selling_price, discount, status, service_id) VALUES
('Relaxation Package', 3, 60, 10000.00, 8000.00, 20.00, 'active', (SELECT id FROM services WHERE title = 'Swedish Massage')),
('Therapeutic Package', 4, 75, 15000.00, 12000.00, 20.00, 'active', (SELECT id FROM services WHERE title = 'Deep Tissue Massage')),
('Beauty & Wellness', 5, 60, 18000.00, 15000.00, 16.67, 'active', (SELECT id FROM services WHERE title = 'Face Cleanup')),
('Quick Refresh', 2, 30, 6000.00, 5000.00, 16.67, 'active', (SELECT id FROM services WHERE title = 'Reflexology')),
('Ultimate Spa', 6, 90, 25000.00, 20000.00, 20.00, 'active', (SELECT id FROM services WHERE title = 'Hot Stone Therapy'))
ON CONFLICT (title) DO NOTHING;

-- Add sample wellness appointments
INSERT INTO appointments (appointment_id, customer_name, customer_email, customer_phone, appointment_date, appointment_time, amount, appointment_status, payment_status, package_id) VALUES
('APT-001', 'Priya Sharma', 'priya.sharma@example.com', '+91-9876543214', '2025-07-25', '10:00:00', 8000.00, 'scheduled', 'paid', (SELECT id FROM wellness_packages WHERE title = 'Relaxation Package')),
('APT-002', 'Azim Imran Bhaiji', 'azim.bhaiji@example.com', '+91-9876543210', '2025-07-26', '14:00:00', 12000.00, 'scheduled', 'paid', (SELECT id FROM wellness_packages WHERE title = 'Therapeutic Package')),
('APT-003', 'Rajesh Kumar', 'rajesh.kumar@example.com', '+91-9876543216', '2025-07-24', '16:30:00', 5000.00, 'completed', 'paid', (SELECT id FROM wellness_packages WHERE title = 'Quick Refresh')),
('APT-004', 'Sneha Patel', 'sneha.patel@example.com', '+91-9876543218', '2025-07-27', '11:00:00', 15000.00, 'scheduled', 'pending', (SELECT id FROM wellness_packages WHERE title = 'Beauty & Wellness')),
('APT-005', 'Mohammad Oliya', 'mohammad.oliya@example.com', '+91-9876543212', '2025-07-28', '15:00:00', 20000.00, 'scheduled', 'paid', (SELECT id FROM wellness_packages WHERE title = 'Ultimate Spa'))
ON CONFLICT (appointment_id) DO NOTHING;

-- Update any existing null status fields
UPDATE membership_packages SET status = 'active' WHERE status IS NULL;
UPDATE member_memberships SET status = 'active' WHERE status IS NULL;
UPDATE member_memberships SET payment_status = 'pending' WHERE payment_status IS NULL;
UPDATE invoices SET status = 'pending' WHERE status IS NULL;
UPDATE services SET status = 'active' WHERE status IS NULL;
UPDATE wellness_packages SET status = 'active' WHERE status IS NULL;
UPDATE appointments SET appointment_status = 'scheduled' WHERE appointment_status IS NULL;
UPDATE appointments SET payment_status = 'pending' WHERE payment_status IS NULL;

-- Create useful views for reporting and data access
CREATE OR REPLACE VIEW membership_summary AS
SELECT 
    mp.name as package_name,
    mp.type,
    mp.selling_price,
    COUNT(mm.id) as active_members,
    SUM(mm.amount_paid) as total_revenue
FROM membership_packages mp
LEFT JOIN member_memberships mm ON mp.id = mm.package_id AND mm.status = 'active'
WHERE mp.status = 'active'
GROUP BY mp.id, mp.name, mp.type, mp.selling_price;

CREATE OR REPLACE VIEW revenue_summary AS
SELECT 
    DATE_TRUNC('month', i.invoice_date) as month,
    COUNT(i.id) as total_invoices,
    SUM(i.amount) as total_amount,
    SUM(CASE WHEN i.status = 'paid' THEN i.amount ELSE 0 END) as paid_amount,
    SUM(CASE WHEN i.status = 'pending' THEN i.amount ELSE 0 END) as pending_amount
FROM invoices i
GROUP BY DATE_TRUNC('month', i.invoice_date)
ORDER BY month DESC;

CREATE OR REPLACE VIEW appointment_summary AS
SELECT 
    wp.title as package_name,
    COUNT(a.id) as total_appointments,
    SUM(a.amount) as total_revenue,
    COUNT(CASE WHEN a.appointment_status = 'completed' THEN 1 END) as completed,
    COUNT(CASE WHEN a.appointment_status = 'scheduled' THEN 1 END) as scheduled,
    COUNT(CASE WHEN a.payment_status = 'paid' THEN 1 END) as paid_appointments
FROM appointments a
JOIN wellness_packages wp ON a.package_id = wp.id
GROUP BY wp.id, wp.title;

-- Display success message with record counts
SELECT 'Sample data inserted successfully into your existing database structure!' as message
UNION ALL
SELECT '=== RECORD COUNTS ===' as message
UNION ALL
SELECT 'Membership Packages: ' || COUNT(*) || ' records' as message FROM membership_packages
UNION ALL
SELECT 'Member Memberships: ' || COUNT(*) || ' records' as message FROM member_memberships
UNION ALL
SELECT 'Invoices: ' || COUNT(*) || ' records' as message FROM invoices
UNION ALL
SELECT 'Payments: ' || COUNT(*) || ' records' as message FROM payments
UNION ALL
SELECT 'Services: ' || COUNT(*) || ' records' as message FROM services
UNION ALL
SELECT 'Wellness Packages: ' || COUNT(*) || ' records' as message FROM wellness_packages
UNION ALL
SELECT 'Appointments: ' || COUNT(*) || ' records' as message FROM appointments
UNION ALL
SELECT '=== VIEWS CREATED ===' as message
UNION ALL
SELECT '- membership_summary (package revenue analysis)' as message
UNION ALL
SELECT '- revenue_summary (monthly revenue breakdown)' as message
UNION ALL
SELECT '- appointment_summary (wellness appointment stats)' as message;
