/*
# Create Secondary Tables for GovFlow AI

## Purpose
Completes the schema with compliance tracking, governance, and analytics tables.

## New Tables

### checklist_items
- `id` (uuid, PK)
- `business_id` (uuid, FK → businesses)
- `item` (text) — compliance requirement name
- `completed` (boolean) — whether it's done
- `required` (boolean) — is it mandatory
- `category` (text) — grouping category
- `created_at` (timestamptz)

### inspections
- `id` (uuid, PK)
- `business_id` (uuid, FK → businesses)
- `application_id` (uuid, FK → applications, nullable)
- `name` (text) — inspection name
- `department` (text) — conducting department
- `officer` (text) — inspector name
- `scheduled_date` (date)
- `scheduled_time` (text)
- `status` (text) — Scheduled, Pending Schedule, Completed, Cancelled
- `location` (text)
- `notes` (text)
- `created_at` (timestamptz)

### renewals
- `id` (uuid, PK)
- `business_id` (uuid, FK → businesses)
- `application_id` (uuid, FK → applications, nullable)
- `name` (text) — licence/permit name
- `due_date` (date)
- `days_left` (int)
- `status` (text) — urgent, upcoming, ok
- `created_at` (timestamptz)

### grievances
- `id` (uuid, PK)
- `business_id` (uuid, FK → businesses)
- `application_id` (uuid, FK → applications, nullable)
- `grievance_code` (text) — human-readable ID like GRV-2026-1008
- `department` (text)
- `type` (text) — issue type
- `description` (text)
- `status` (text) — Submitted, Assigned, Under Review, Response, Resolved
- `assigned_to` (text)
- `submitted_date` (date)
- `created_at` (timestamptz)

### notifications
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users) — recipient
- `type` (text) — critical, warning, success, info
- `title` (text)
- `message` (text)
- `read` (boolean, default false)
- `application_id` (uuid, FK → applications, nullable)
- `created_at` (timestamptz)

### government_schemes
- `id` (uuid, PK)
- `name` (text) — scheme name
- `authority` (text) — governing authority
- `match_score` (int) — AI match percentage 0-100
- `eligibility` (text) — High/Medium/Low
- `benefit` (text) — benefit description
- `deadline` (text)
- `tag` (text) — AI Recommended, Eligible, Explore
- `description` (text)
- `created_at` (timestamptz)

### risk_scores
- `id` (uuid, PK)
- `business_id` (uuid, FK → businesses)
- `application_id` (uuid, FK → applications, nullable)
- `score` (int) — 0-100 risk score
- `level` (text) — Low/Medium/High
- `factors` (jsonb) — array of risk factor strings
- `mitigation` (text) — AI mitigation recommendation
- `created_at` (timestamptz)

## Security
- RLS on all tables.
- checklist_items, inspections, renewals, grievances, risk_scores: scoped through business ownership.
- notifications: owner-scoped by user_id directly.
- government_schemes: read-only reference data for authenticated users.
*/

-- Checklist items
CREATE TABLE IF NOT EXISTS checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  item text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  required boolean NOT NULL DEFAULT true,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_checklist" ON checklist_items;
CREATE POLICY "select_own_checklist" ON checklist_items FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = checklist_items.business_id AND businesses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_checklist" ON checklist_items;
CREATE POLICY "insert_own_checklist" ON checklist_items FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = checklist_items.business_id AND businesses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "update_own_checklist" ON checklist_items;
CREATE POLICY "update_own_checklist" ON checklist_items FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = checklist_items.business_id AND businesses.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = checklist_items.business_id AND businesses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_checklist" ON checklist_items;
CREATE POLICY "delete_own_checklist" ON checklist_items FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = checklist_items.business_id AND businesses.user_id = auth.uid())
  );

-- Inspections
CREATE TABLE IF NOT EXISTS inspections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  application_id uuid REFERENCES applications(id) ON DELETE SET NULL,
  name text NOT NULL,
  department text NOT NULL,
  officer text,
  scheduled_date date,
  scheduled_time text,
  status text NOT NULL DEFAULT 'Pending Schedule',
  location text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_inspections" ON inspections;
CREATE POLICY "select_own_inspections" ON inspections FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = inspections.business_id AND businesses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_inspections" ON inspections;
CREATE POLICY "insert_own_inspections" ON inspections FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = inspections.business_id AND businesses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "update_own_inspections" ON inspections;
CREATE POLICY "update_own_inspections" ON inspections FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = inspections.business_id AND businesses.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = inspections.business_id AND businesses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_inspections" ON inspections;
CREATE POLICY "delete_own_inspections" ON inspections FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = inspections.business_id AND businesses.user_id = auth.uid())
  );

-- Renewals
CREATE TABLE IF NOT EXISTS renewals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  application_id uuid REFERENCES applications(id) ON DELETE SET NULL,
  name text NOT NULL,
  due_date date NOT NULL,
  days_left integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'ok',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE renewals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_renewals" ON renewals;
CREATE POLICY "select_own_renewals" ON renewals FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = renewals.business_id AND businesses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_renewals" ON renewals;
CREATE POLICY "insert_own_renewals" ON renewals FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = renewals.business_id AND businesses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "update_own_renewals" ON renewals;
CREATE POLICY "update_own_renewals" ON renewals FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = renewals.business_id AND businesses.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = renewals.business_id AND businesses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_renewals" ON renewals;
CREATE POLICY "delete_own_renewals" ON renewals FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = renewals.business_id AND businesses.user_id = auth.uid())
  );

-- Grievances
CREATE TABLE IF NOT EXISTS grievances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  application_id uuid REFERENCES applications(id) ON DELETE SET NULL,
  grievance_code text NOT NULL,
  department text NOT NULL,
  type text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'Submitted',
  assigned_to text,
  submitted_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_grievances" ON grievances;
CREATE POLICY "select_own_grievances" ON grievances FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = grievances.business_id AND businesses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_grievances" ON grievances;
CREATE POLICY "insert_own_grievances" ON grievances FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = grievances.business_id AND businesses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "update_own_grievances" ON grievances;
CREATE POLICY "update_own_grievances" ON grievances FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = grievances.business_id AND businesses.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = grievances.business_id AND businesses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_grievances" ON grievances;
CREATE POLICY "delete_own_grievances" ON grievances FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = grievances.business_id AND businesses.user_id = auth.uid())
  );

-- Notifications (owner-scoped by user_id directly)
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'info',
  title text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  application_id uuid REFERENCES applications(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_notifications" ON notifications;
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_notifications" ON notifications;
CREATE POLICY "insert_own_notifications" ON notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_notifications" ON notifications;
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_notifications" ON notifications;
CREATE POLICY "delete_own_notifications" ON notifications FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Government schemes (reference data — read-only to authenticated)
CREATE TABLE IF NOT EXISTS government_schemes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  authority text NOT NULL,
  match_score integer NOT NULL DEFAULT 0,
  eligibility text NOT NULL DEFAULT 'Medium',
  benefit text NOT NULL,
  deadline text,
  tag text NOT NULL DEFAULT 'Eligible',
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE government_schemes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_schemes" ON government_schemes;
CREATE POLICY "select_schemes" ON government_schemes FOR SELECT
  TO authenticated USING (true);

-- Risk scores
CREATE TABLE IF NOT EXISTS risk_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  application_id uuid REFERENCES applications(id) ON DELETE SET NULL,
  score integer NOT NULL DEFAULT 0,
  level text NOT NULL DEFAULT 'Low',
  factors jsonb NOT NULL DEFAULT '[]'::jsonb,
  mitigation text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE risk_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_risk_scores" ON risk_scores;
CREATE POLICY "select_own_risk_scores" ON risk_scores FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = risk_scores.business_id AND businesses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_risk_scores" ON risk_scores;
CREATE POLICY "insert_own_risk_scores" ON risk_scores FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = risk_scores.business_id AND businesses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "update_own_risk_scores" ON risk_scores;
CREATE POLICY "update_own_risk_scores" ON risk_scores FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = risk_scores.business_id AND businesses.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = risk_scores.business_id AND businesses.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_risk_scores" ON risk_scores;
CREATE POLICY "delete_own_risk_scores" ON risk_scores FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM businesses WHERE businesses.id = risk_scores.business_id AND businesses.user_id = auth.uid())
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_checklist_business_id ON checklist_items(business_id);
CREATE INDEX IF NOT EXISTS idx_inspections_business_id ON inspections(business_id);
CREATE INDEX IF NOT EXISTS idx_renewals_business_id ON renewals(business_id);
CREATE INDEX IF NOT EXISTS idx_grievances_business_id ON grievances(business_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_scores_business_id ON risk_scores(business_id);
