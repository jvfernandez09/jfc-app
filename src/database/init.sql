DROP TABLE IF EXISTS task_assignments CASCADE;
DROP TABLE IF EXISTS person_tags CASCADE;
DROP TABLE IF EXISTS business_tags CASCADE;
DROP TABLE IF EXISTS business_categories CASCADE;

DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS people CASCADE;
DROP TABLE IF EXISTS businesses CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_email TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  is_done BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS business_categories (
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (business_id, category_id)
);

CREATE TABLE IF NOT EXISTS business_tags (
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (business_id, tag_id)
);

CREATE TABLE IF NOT EXISTS person_tags (
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (person_id, tag_id)
);

CREATE TABLE IF NOT EXISTS task_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  CHECK (
    (business_id IS NOT NULL AND person_id IS NULL)
    OR
    (business_id IS NULL AND person_id IS NOT NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS uniq_task_business
ON task_assignments(task_id, business_id)
WHERE business_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uniq_task_person
ON task_assignments(task_id, person_id)
WHERE person_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_people_business_id ON people(business_id);

CREATE INDEX IF NOT EXISTS idx_business_categories_business_id
ON business_categories(business_id);

CREATE INDEX IF NOT EXISTS idx_business_categories_category_id
ON business_categories(category_id);

CREATE INDEX IF NOT EXISTS idx_business_tags_business_id
ON business_tags(business_id);

CREATE INDEX IF NOT EXISTS idx_business_tags_tag_id
ON business_tags(tag_id);

CREATE INDEX IF NOT EXISTS idx_person_tags_person_id
ON person_tags(person_id);

CREATE INDEX IF NOT EXISTS idx_person_tags_tag_id
ON person_tags(tag_id);

CREATE INDEX IF NOT EXISTS idx_task_assignments_task_id
ON task_assignments(task_id);

CREATE INDEX IF NOT EXISTS idx_task_assignments_business_id
ON task_assignments(business_id);

CREATE INDEX IF NOT EXISTS idx_task_assignments_person_id
ON task_assignments(person_id);

INSERT INTO users (id, name, email, password_hash)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Admin User', 'admin@test.com', '$2a$10$testhash')
ON CONFLICT (email) DO NOTHING;

INSERT INTO businesses (id, name, description)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'Jollibee Foods Corp', 'Food & beverage company'),
  ('22222222-2222-2222-2222-222222222223', 'Tech Startup PH', 'Software & services')
ON CONFLICT DO NOTHING;

INSERT INTO categories (id, name)
VALUES
  ('33333333-3333-3333-3333-333333333331', 'Food'),
  ('33333333-3333-3333-3333-333333333332', 'Retail'),
  ('33333333-3333-3333-3333-333333333333', 'Technology')
ON CONFLICT (name) DO NOTHING;

INSERT INTO tags (id, name)
VALUES
  ('44444444-4444-4444-4444-444444444441', 'VIP'),
  ('44444444-4444-4444-4444-444444444442', 'Priority'),
  ('44444444-4444-4444-4444-444444444443', 'Hot Lead'),
  ('44444444-4444-4444-4444-444444444444', 'Cold Lead')
ON CONFLICT (name) DO NOTHING;

INSERT INTO people (id, first_name, last_name, email, phone, business_id)
VALUES
  ('55555555-5555-5555-5555-555555555551', 'Juan', 'Dela Cruz', 'juan@test.com', '09171234567', '22222222-2222-2222-2222-222222222222'),
  ('55555555-5555-5555-5555-555555555552', 'Maria', 'Santos', 'maria@test.com', '09181234567', '22222222-2222-2222-2222-222222222222'),
  ('55555555-5555-5555-5555-555555555553', 'Pedro', 'Reyes', 'pedro@test.com', '09221234567', '22222222-2222-2222-2222-222222222223'),
  ('55555555-5555-5555-5555-555555555554', 'Anne', 'Lopez', 'anne@test.com', '09061234567', NULL)
ON CONFLICT (email) DO NOTHING;

-- BUSINESS ↔ CATEGORIES
INSERT INTO business_categories (business_id, category_id)
VALUES
  ('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333331'),
  ('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333332'),
  ('22222222-2222-2222-2222-222222222223', '33333333-3333-3333-3333-333333333333')
ON CONFLICT DO NOTHING;

INSERT INTO business_tags (business_id, tag_id)
VALUES
  ('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444441'),
  ('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444442'),
  ('22222222-2222-2222-2222-222222222223', '44444444-4444-4444-4444-444444444443')
ON CONFLICT DO NOTHING;

INSERT INTO person_tags (person_id, tag_id)
VALUES
  ('55555555-5555-5555-5555-555555555551', '44444444-4444-4444-4444-444444444441'),
  ('55555555-5555-5555-5555-555555555551', '44444444-4444-4444-4444-444444444443'),
  ('55555555-5555-5555-5555-555555555552', '44444444-4444-4444-4444-444444444442'),
  ('55555555-5555-5555-5555-555555555553', '44444444-4444-4444-4444-444444444444')
ON CONFLICT DO NOTHING;

INSERT INTO tasks (id, title, description, is_done)
VALUES
  ('66666666-6666-6666-6666-666666666661', 'Call customer', 'Follow up regarding contract', false),
  ('66666666-6666-6666-6666-666666666662', 'Send quotation', 'Send pricing details via email', false),
  ('66666666-6666-6666-6666-666666666663', 'Onboarding meeting', 'Schedule onboarding session', true)
ON CONFLICT DO NOTHING;

INSERT INTO task_assignments (id, task_id, business_id, person_id)
VALUES
  ('77777777-7777-7777-7777-777777777771', '66666666-6666-6666-6666-666666666661', NULL, '55555555-5555-5555-5555-555555555551'),
  ('77777777-7777-7777-7777-777777777772', '66666666-6666-6666-6666-666666666662', '22222222-2222-2222-2222-222222222222', NULL),
  ('77777777-7777-7777-7777-777777777773', '66666666-6666-6666-6666-666666666663', NULL, '55555555-5555-5555-5555-555555555553')
ON CONFLICT DO NOTHING;
