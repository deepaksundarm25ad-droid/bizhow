/*
# Seed Reference Data — Departments and Government Schemes

## Purpose
Populates the departments and government_schemes tables with reference data
that matches the demo data used in the GovFlow AI application.

## Changes
1. Inserts 6 government departments with processing times and status.
2. Inserts 6 government schemes with match scores and eligibility data.

## Notes
- These are reference/shared tables — readable by all authenticated users.
- Uses INSERT ... ON CONFLICT DO NOTHING for idempotency.
- No user-specific data is seeded (user data requires an authenticated session).
*/

-- Seed departments
INSERT INTO departments (name, code, avg_processing_days, status) VALUES
  ('Tamil Nadu Fire & Rescue', 'TNFRD', 3, 'Operational'),
  ('Tamil Nadu Pollution Control Board', 'TNPCB', 8, 'Overloaded'),
  ('Dept. of Labour', 'LABOUR', 12, 'Overloaded'),
  ('Ministry of Corporate Affairs', 'MCA', 2, 'Operational'),
  ('MSME Ministry', 'MSME', 5, 'Operational'),
  ('Local Authority', 'LOCAL', 4, 'Operational')
ON CONFLICT (code) DO NOTHING;

-- Seed government schemes
INSERT INTO government_schemes (name, authority, match_score, eligibility, benefit, deadline, tag, description) VALUES
  ('MSME Credit Guarantee Scheme', 'Ministry of MSME / CGTMSE', 94, 'High', 'Collateral-free credit up to ₹2 Crore', 'Ongoing', 'AI Recommended', 'Provides collateral-free credit to MSME units for term loans and working capital.'),
  ('Tamil Nadu Industrial Promotion', 'TIDCO / Govt. of Tamil Nadu', 89, 'High', 'Capital subsidy up to 25% of fixed assets', '2026-12-31', 'AI Recommended', 'Capital investment subsidy for new manufacturing units in Tamil Nadu.'),
  ('SIPCOT Infrastructure Support', 'SIPCOT', 86, 'High', 'Subsidized industrial plots and common facilities', 'Ongoing', 'AI Recommended', 'Infrastructure support and developed plots for manufacturing units in SIPCOT parks.'),
  ('National Manufacturing Competitiveness Programme', 'Ministry of MSME', 78, 'Medium', 'Technology upgradation and skill development grants', '2026-11-30', 'Eligible', 'Supports MSMEs to enhance their manufacturing competitiveness through technology and process upgrades.'),
  ('PLI Scheme for Manufacturing', 'Ministry of Commerce & Industry', 65, 'Medium', 'Production-linked incentive of 4-6% on incremental sales', 'Application closed; next round expected', 'Explore', 'Performance-linked incentives for eligible manufacturing sectors to boost domestic production.'),
  ('Green Manufacturing Initiative', 'Ministry of Environment', 60, 'Medium', 'Grant up to ₹50 Lakh for clean technology adoption', '2027-01-31', 'Explore', 'Financial support for manufacturing units adopting cleaner production processes.')
ON CONFLICT DO NOTHING;
