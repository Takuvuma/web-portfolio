/* ------------------------------------------------------------------
   IAM learning log — the only file you edit day to day.

   Add one entry per study/work session. Newest anywhere in the list;
   order does not matter, the dashboard sorts for you.

     date     "YYYY-MM-DD"  (required)
     minutes  number        (required)
     category one of the keys in IAM_CATEGORIES below
     title    short summary shown in the activity feed
     link     optional URL (repo, write-up, cert page)

   Example:
     { date: "2026-09-09", minutes: 90, category: "entra",
       title: "Built dynamic groups + conditional access policy in lab",
       link: "https://github.com/Takuvuma/..." },
------------------------------------------------------------------- */

window.IAM_LOG = [
  // ← your entries go here
];

/* Categories: label + color. Add or rename freely. */
window.IAM_CATEGORIES = {
  entra:   { label: "Entra ID / Azure AD", color: "#a9765a" },
  ad:      { label: "Active Directory",    color: "#c08b62" },
  okta:    { label: "Okta",                color: "#8a5c43" },
  cloud:   { label: "Azure / AWS IAM",     color: "#b98f6f" },
  script:  { label: "Scripting & automation", color: "#7d6a54" },
  govern:  { label: "Governance & access reviews", color: "#96745c" },
  cert:    { label: "Certification study", color: "#6f8f7a" },
  read:    { label: "Reading & research",  color: "#9a9280" },
};

/* Longer-horizon goals shown as progress bars. */
window.IAM_GOALS = [
  { label: "SC-300: Identity and Access Administrator", target: 100, current: 0, unit: "%" },
  { label: "AZ-104 fundamentals",                       target: 100, current: 0, unit: "%" },
  { label: "Hands-on lab hours",                        target: 100, current: 0, unit: "h", auto: "hours" },
];
