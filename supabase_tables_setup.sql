-- Complete Supabase Database Setup for Pulse Point Front Desk
-- Run this in Supabase SQL Editor

-- Enable RLS (Row Level Security) for all tables
-- Note: You may need to set up policies based on your authentication requirements

-- 1. Members Table
CREATE TABLE IF NOT EXISTS members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    gender VARCHAR(10),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    profile_photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Membership Packages Table
CREATE TABLE IF NOT EXISTS membership_packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_months INTEGER NOT NULL,
    features TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Member Memberships Table (Junction table for member-package relationship)
CREATE TABLE IF NOT EXISTS member_memberships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    package_id UUID REFERENCES membership_packages(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, expired, cancelled
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, overdue
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, contacted, closed
    priority VARCHAR(10) DEFAULT 'medium', -- low, medium, high
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    package_id UUID REFERENCES membership_packages(id),
    base_amount DECIMAL(10,2) NOT NULL,
    cgst_amount DECIMAL(10,2) DEFAULT 0,
    sgst_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, paid, overdue
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50), -- cash, upi, card, bank_transfer
    payment_date DATE DEFAULT CURRENT_DATE,
    transaction_reference VARCHAR(255),
    status VARCHAR(20) DEFAULT 'completed', -- pending, completed, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Wellness Services Table
CREATE TABLE IF NOT EXISTS wellness_services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_minutes INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Wellness Packages Table
CREATE TABLE IF NOT EXISTS wellness_packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    services TEXT[], -- Array of service names or IDs
    validity_days INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Wellness Appointments Table
CREATE TABLE IF NOT EXISTS wellness_appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    service_id UUID REFERENCES wellness_services(id),
    package_id UUID REFERENCES wellness_packages(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, completed, cancelled, no_show
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_phone ON members(phone);
CREATE INDEX IF NOT EXISTS idx_member_memberships_member_id ON member_memberships(member_id);
CREATE INDEX IF NOT EXISTS idx_member_memberships_package_id ON member_memberships(package_id);
CREATE INDEX IF NOT EXISTS idx_member_memberships_status ON member_memberships(status);
CREATE INDEX IF NOT EXISTS idx_invoices_member_id ON invoices(member_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_member_id ON payments(member_id);
CREATE INDEX IF NOT EXISTS idx_wellness_appointments_member_id ON wellness_appointments(member_id);
CREATE INDEX IF NOT EXISTS idx_wellness_appointments_date ON wellness_appointments(appointment_date);

-- Insert Sample Data

-- Sample Members
INSERT INTO members (name, email, phone, address, date_of_birth, gender, emergency_contact_name, emergency_contact_phone) VALUES
('Azim Imran Bhaiji', 'azim.bhaiji@example.com', '+91-9876543210', '123 Fitness Street, Mumbai, MH 400001', '1990-05-15', 'Male', 'Fatima Bhaiji', '+91-9876543211'),
('Mohammad Oliya', 'mohammad.oliya@example.com', '+91-9876543212', '456 Health Avenue, Mumbai, MH 400002', '1985-08-22', 'Male', 'Aisha Oliya', '+91-9876543213'),
('Priya Sharma', 'priya.sharma@example.com', '+91-9876543214', '789 Wellness Lane, Mumbai, MH 400003', '1992-12-10', 'Female', 'Raj Sharma', '+91-9876543215'),
('Rajesh Kumar', 'rajesh.kumar@example.com', '+91-9876543216', '321 Gym Road, Mumbai, MH 400004', '1988-03-18', 'Male', 'Sunita Kumar', '+91-9876543217'),
('Sneha Patel', 'sneha.patel@example.com', '+91-9876543218', '654 Fitness Plaza, Mumbai, MH 400005', '1995-07-25', 'Female', 'Amit Patel', '+91-9876543219');

-- Sample Membership Packages
INSERT INTO membership_packages (name, description, price, duration_months, features) VALUES
('Basic Gym', 'Access to gym equipment and basic facilities', 1999.00, 1, ARRAY['Gym Equipment Access', 'Locker Facility', 'Basic Support']),
('Premium Gym', 'Gym access with personal trainer sessions', 3999.00, 3, ARRAY['Gym Equipment Access', 'Personal Trainer', 'Nutrition Guidance', 'Locker Facility']),
('Platinum Membership', 'Complete fitness package with all amenities', 7999.00, 6, ARRAY['Gym Equipment Access', 'Personal Trainer', 'Nutrition Guidance', 'Spa Access', 'Group Classes', 'Premium Locker']),
('Annual Gold', 'Best value annual membership', 15999.00, 12, ARRAY['All Gym Access', 'Unlimited Trainer Sessions', 'Spa & Wellness', 'Guest Passes', 'Priority Booking']),
('Student Package', 'Special discounted package for students', 1499.00, 1, ARRAY['Gym Equipment Access', 'Locker Facility', 'Student ID Required']);

-- Sample Member Memberships
INSERT INTO member_memberships (member_id, package_id, start_date, end_date, status, payment_status) VALUES
((SELECT id FROM members WHERE email = 'azim.bhaiji@example.com'), (SELECT id FROM membership_packages WHERE name = 'Premium Gym'), '2025-07-01', '2025-10-01', 'active', 'paid'),
((SELECT id FROM members WHERE email = 'mohammad.oliya@example.com'), (SELECT id FROM membership_packages WHERE name = 'Basic Gym'), '2025-07-01', '2025-08-01', 'active', 'paid'),
((SELECT id FROM members WHERE email = 'priya.sharma@example.com'), (SELECT id FROM membership_packages WHERE name = 'Platinum Membership'), '2025-06-15', '2025-12-15', 'active', 'paid'),
((SELECT id FROM members WHERE email = 'rajesh.kumar@example.com'), (SELECT id FROM membership_packages WHERE name = 'Annual Gold'), '2025-01-01', '2026-01-01', 'active', 'paid'),
((SELECT id FROM members WHERE email = 'sneha.patel@example.com'), (SELECT id FROM membership_packages WHERE name = 'Student Package'), '2025-07-10', '2025-08-10', 'active', 'pending');

-- Sample Inquiries
INSERT INTO inquiries (name, email, phone, subject, message, status, priority) VALUES
('John Doe', 'john.doe@example.com', '+91-9876543220', 'Membership Inquiry', 'I am interested in joining your gym. Could you please provide more details about your packages?', 'pending', 'medium'),
('Jane Smith', 'jane.smith@example.com', '+91-9876543221', 'Personal Training', 'I would like to know about personal training sessions and their costs.', 'contacted', 'high'),
('Mike Johnson', 'mike.johnson@example.com', '+91-9876543222', 'Group Classes', 'Do you offer yoga and zumba classes? What are the timings?', 'pending', 'low'),
('Sarah Wilson', 'sarah.wilson@example.com', '+91-9876543223', 'Facility Tour', 'Can I schedule a facility tour this weekend?', 'closed', 'medium'),
('David Brown', 'david.brown@example.com', '+91-9876543224', 'Corporate Membership', 'We are looking for corporate membership for our company employees.', 'pending', 'high');

-- Sample Invoices
INSERT INTO invoices (invoice_number, member_id, package_id, base_amount, cgst_amount, sgst_amount, total_amount, status, due_date) VALUES
('INV-001', (SELECT id FROM members WHERE email = 'azim.bhaiji@example.com'), (SELECT id FROM membership_packages WHERE name = 'Premium Gym'), 14519.90, 1307.99, 1307.99, 17135.88, 'paid', '2025-07-14'),
('INV-002', (SELECT id FROM members WHERE email = 'mohammad.oliya@example.com'), (SELECT id FROM membership_packages WHERE name = 'Basic Gym'), 14519.90, 1307.99, 1307.99, 17135.88, 'paid', '2025-07-14'),
('INV-003', (SELECT id FROM members WHERE email = 'priya.sharma@example.com'), (SELECT id FROM membership_packages WHERE name = 'Platinum Membership'), 7272.73, 654.55, 654.55, 8581.83, 'paid', '2025-06-15'),
('INV-004', (SELECT id FROM members WHERE email = 'sneha.patel@example.com'), (SELECT id FROM membership_packages WHERE name = 'Student Package'), 1363.64, 122.73, 122.73, 1609.10, 'pending', '2025-08-10');

-- Sample Payments
INSERT INTO payments (invoice_id, member_id, amount, payment_method, payment_date, transaction_reference, status) VALUES
((SELECT id FROM invoices WHERE invoice_number = 'INV-001'), (SELECT id FROM members WHERE email = 'azim.bhaiji@example.com'), 17135.88, 'upi', '2025-07-14', 'UPI-TXN-001', 'completed'),
((SELECT id FROM invoices WHERE invoice_number = 'INV-002'), (SELECT id FROM members WHERE email = 'mohammad.oliya@example.com'), 17135.88, 'cash', '2025-07-14', 'CASH-001', 'completed'),
((SELECT id FROM invoices WHERE invoice_number = 'INV-003'), (SELECT id FROM members WHERE email = 'priya.sharma@example.com'), 8581.83, 'card', '2025-06-15', 'CARD-TXN-001', 'completed');

-- Sample Wellness Services
INSERT INTO wellness_services (name, description, price, duration_minutes) VALUES
('Swedish Massage', 'Relaxing full body massage with essential oils', 2500.00, 60),
('Deep Tissue Massage', 'Therapeutic massage for muscle tension relief', 3000.00, 75),
('Aromatherapy', 'Stress relief massage with aromatic oils', 2000.00, 45),
('Hot Stone Therapy', 'Healing massage using heated stones', 3500.00, 90),
('Reflexology', 'Foot massage targeting pressure points', 1500.00, 30),
('Face Cleanup', 'Deep cleansing facial treatment', 1200.00, 60),
('Body Scrub', 'Exfoliating treatment for smooth skin', 2200.00, 45);

-- Sample Wellness Packages
INSERT INTO wellness_packages (name, description, price, services, validity_days) VALUES
('Relaxation Package', 'Complete relaxation experience', 8000.00, ARRAY['Swedish Massage', 'Aromatherapy', 'Face Cleanup'], 30),
('Therapeutic Package', 'Pain relief and muscle recovery', 12000.00, ARRAY['Deep Tissue Massage', 'Hot Stone Therapy', 'Reflexology'], 45),
('Beauty & Wellness', 'Complete beauty and wellness treatment', 15000.00, ARRAY['Swedish Massage', 'Face Cleanup', 'Body Scrub', 'Aromatherapy'], 60),
('Quick Refresh', 'Express wellness session', 5000.00, ARRAY['Reflexology', 'Face Cleanup'], 15);

-- Sample Wellness Appointments
INSERT INTO wellness_appointments (member_id, service_id, appointment_date, appointment_time, status, notes) VALUES
((SELECT id FROM members WHERE email = 'priya.sharma@example.com'), (SELECT id FROM wellness_services WHERE name = 'Swedish Massage'), '2025-07-25', '10:00:00', 'scheduled', 'First time customer'),
((SELECT id FROM members WHERE email = 'azim.bhaiji@example.com'), (SELECT id FROM wellness_services WHERE name = 'Deep Tissue Massage'), '2025-07-26', '14:00:00', 'scheduled', 'Muscle tension in shoulders'),
((SELECT id FROM members WHERE email = 'rajesh.kumar@example.com'), (SELECT id FROM wellness_services WHERE name = 'Hot Stone Therapy'), '2025-07-24', '16:30:00', 'completed', 'Great session, customer satisfied'),
((SELECT id FROM members WHERE email = 'sneha.patel@example.com'), (SELECT id FROM wellness_services WHERE name = 'Face Cleanup'), '2025-07-27', '11:00:00', 'scheduled', 'Regular customer');

-- Enable RLS on all tables (optional, configure policies as needed)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_appointments ENABLE ROW LEVEL SECURITY;

-- Create simple policies to allow all operations for authenticated users
-- Note: Customize these policies based on your security requirements

CREATE POLICY "Allow all operations for authenticated users" ON members
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON membership_packages
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON member_memberships
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON inquiries
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON invoices
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON payments
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON wellness_services
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON wellness_packages
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON wellness_appointments
    FOR ALL USING (auth.role() = 'authenticated');

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_membership_packages_updated_at BEFORE UPDATE ON membership_packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_member_memberships_updated_at BEFORE UPDATE ON member_memberships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wellness_services_updated_at BEFORE UPDATE ON wellness_services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wellness_packages_updated_at BEFORE UPDATE ON wellness_packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wellness_appointments_updated_at BEFORE UPDATE ON wellness_appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
