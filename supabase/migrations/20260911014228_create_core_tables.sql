/*
# Create Core Tables for GovFlow AI

## Purpose
Establishes the foundational database schema for the GovFlow AI compliance platform.
This is a multi-user app with sign-in, so all tables are owner-scoped with user_id
and authenticated-only RLS policies.

## New Tables

### businesses
- `id` (uuid, PK) — unique business identifier
- `user_id` (uuid, FK → auth.users) — owner of the business, defaults to auth.uid()
- `name` (text) — business name
- `sector` (text) — industry sector (e.g. Manufacturing)
- `type` (text) — organization type (e.g. Private Limited)
- `state` (text) — Indian state
- `district` (text) — district
- `city` (text) — city/town
- `area` (text) — industrial area/zone
- `investment` (text) — investment range
- `employees` (int) — number of employees
- `stage` (text) — business stage (Planning, Startup, Operational, etc.)
- `gstin` (text) — GST identification number
- `pan` (text) — PAN number
- `cin` (text) — Corporate Identity Number
- `compliance_health` (int) — compliance health score 0-100
- `risk_level` (text) — Low/Medium/High
- `created_at` (timestamptz)

### applications
- `id` (uuid, PK)
- `business_id` (uuid, FK → businesses) — which business this application belongs to
- `app_code` (text) — human-readable ID like GF-2026-1024
- `name` (text) — approval name (e.g. Fire Safety Approval)
- `department` (text) — issuing department
- `status` (text) — Draft, Submitted, Under Review, etc.
- `risk` (text) — Low/Medium/High
- `progress` (int) — 0-100 completion percentage
- `next_action` (text) — next required action
- `submitted_date` (date) — when submitted
- `due_date` (date) — deadline
- `officer_name` (text) — assigned officer
- `officer_email` (text) — officer contact
- `created_at` (timestamptz)

### documents
- `id` (uuid, PK)
- `business_id` (uuid, FK → businesses)
- `application_id` (uuid, FK → applications, nullable) — linked application if any
- `name` (text) — document name
- `category` (text) — Business, Tax, Environment, etc.
- `status` (text) — Verified, Missing, Needs Review, Expired
- `file_size` (text) — file size display string
- `uploaded_date` (date, nullable)
- `expiry_date` (date, nullable)
- `created_at` (timestamptz)

### departments
- `id` (uuid, PK)
- `name` (text) — department name
- `code` (text) — short code (e.g. TNPCB)
- `avg_processing_days` (int) — average processing time
- `status` (text) — Operational, Overloaded
- `created_at` (timestamptz)

## Security
- RLS enabled on all tables.
- businesses: owner-scoped (auth.uid() = user_id)
- applications, documents: scoped through business ownership
- departments: read-only for authenticated users (reference data)
- user_id defaults to auth.uid() on businesses for insert convenience
*/

-- Businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  sector text NOT NULL DEFAULT 'Manufacturing',
  type text NOT NULL DEFAULT 'Private Limited',
  state text NOT NULL,
  district text,
  city text,
  area text,
  investment text,
  employees integer DEFAULT 0,
  stage text DEFAULT 'Operational',
  gstin text,
  pan text,
  cin text,
  compliance_health integer DEFAULT 0,
  risk_level text DEFAULT 'Low',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_businesses" ON businesses;
CREATE POLICY "select_own_businesses" ON businesses FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_businesses" ON businesses;
CREATE POLICY "insert_own_businesses" ON businesses FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_businesses" ON businesses;
CREATE POLICY "update_own_businesses" ON businesses FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_businesses" ON businesses;
CREATE POLICY "delete_own_businesses" ON businesses FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  app_code text NOT NULL,
  name text NOT NULL,
  department text NOT NULL,
  status text NOT NULL DEFAULT 'Draft',
  risk text NOT NULL DEFAULT 'Low',
  progress integer NOT NULL DEFAULT 0,
  next_action text,
  submitted_date date,
  due_date date,
  officer_name text,
  officer_email text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_applications" ON applications;
CREATE POLICY "select_own_applications" ON applications FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = applications.business_id AND businesses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_applications" ON applications;
CREATE POLICY "insert_own_applications" ON applications FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = applications.business_id AND businesses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "update_own_applications" ON applications;
CREATE POLICY "update_own_applications" ON applications FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = applications.business_id AND businesses.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = applications.business_id AND businesses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_applications" ON applications;
CREATE POLICY "delete_own_applications" ON applications FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = applications.business_id AND businesses.user_id = auth.uid())
  );

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  application_id uuid REFERENCES applications(id) ON DELETE SET NULL,
  name text NOT NULL,
  category text NOT NULL,
  status text NOT NULL DEFAULT 'Missing',
  file_size text,
  uploaded_date date,
  expiry_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_documents" ON documents;
CREATE POLICY "select_own_documents" ON documents FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = documents.business_id AND businesses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_documents" ON documents;
CREATE POLICY "insert_own_documents" ON documents FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = documents.business_id AND businesses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "update_own_documents" ON documents;
CREATE POLICY "update_own_documents" ON documents FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = documents.business_id AND businesses.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = documents.business_id AND businesses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_documents" ON documents;
CREATE POLICY "delete_own_documents" ON documents FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = documents.business_id AND businesses.user_id = auth.uid())
  );

-- Departments table (reference data — read-only to authenticated)
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  avg_processing_days integer DEFAULT 0,
  status text NOT NULL DEFAULT 'Operational',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_departments" ON departments;
CREATE POLICY "select_departments" ON departments FOR SELECT
  TO authenticated USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_applications_business_id ON applications(business_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_documents_business_id ON documents(business_id);
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON businesses(user_id);
