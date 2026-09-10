/* ------------------------------------------------------------------
   Note folders. Each entry becomes a folder tile on the home page and
   maps to notes/<slug>.html.

     slug     file name under notes/ without .html
     label    folder name
     summary  one line shown under the folder
     count    number of notes inside (./new-note.sh keeps this current)

   Add a folder:  ./new-note.sh <slug> "Note title"
   — it creates the page and the entry here if they don't exist yet.
------------------------------------------------------------------- */

window.IAM_NOTES = [
  { slug: "entra-id",   label: "Entra ID",             summary: "Conditional access, dynamic groups, PIM", count: 0 },
  { slug: "active-directory", label: "Active Directory", summary: "Domain services, GPO, hybrid join",     count: 0 },
  { slug: "okta",       label: "Okta",                 summary: "SSO, SCIM provisioning, policies",        count: 0 },
  { slug: "cloud-iam",  label: "Azure & AWS IAM",      summary: "RBAC, policies, permission boundaries",   count: 0 },
  { slug: "genai-security", label: "Generative AI Security", summary: "Model access, prompt injection, agent identity", count: 0 },
  { slug: "cloud-security", label: "Cloud Security",   summary: "Posture, hardening, logging",             count: 0 },
  { slug: "scripting",  label: "Scripting",            summary: "PowerShell, Graph API, Python",           count: 0 },
  { slug: "certs",      label: "Certification",        summary: "SC-300, AZ-104 study notes",              count: 0 },
];
