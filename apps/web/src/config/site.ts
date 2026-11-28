/**
 * The one place for the site name and fixed texts (AGENTS.md rule 3).
 * No other file types the site name.
 */
export const SITE = {
  name: "Ruftech Academy",
  description: "Learn software engineering by rebuilding a real system.",
  landing: {
    headline: "Learn software engineering by rebuilding a real system.",
    start: "Start learning",
    steps: [
      "Read a lesson",
      "Build it yourself",
      "Check it on your own computer",
      "Compare with the real GPIS",
    ],
    length: "9 modules · about 60 weeks",
    then: "Then: Python track · 8 weeks",
    courseMap: "See the course map",
    privacy: "Your code stays on your computer.",
  },
  checkLabels: { main: "Main check", debug: "Debugging lab", own: "Own build", docker: "Docker" },
  deployment: {
    title: "Deployed site review",
    loadError: "Could not load demo submissions. Please reload the page.",
    instructions: "Share the site address and what to try. Arrange practice account access privately with the owner.",
    empty: "No demo submitted yet.",
    confirmed: "Confirmed",
    declined: "Not confirmed",
    pending: "Awaiting review",
    decision: "Decision",
    choose: "Choose a decision",
    address: "HTTPS demo address",
    invalidAddress: "Use the HTTPS site address without sign-in details.",
    synthetic: "My demo uses synthetic data only.",
    reason: "Reason for your decision",
    note: "What should the reviewer try?",
    saveReview: "Save review",
    submit: "Submit demo",
    saved: "Saved.",
    invalidSubmission: "Enter the HTTPS demo address and a short note, and confirm it uses practice data.",
    submitError: "Your demo was not submitted. Please try again.",
    invalidReview: "Choose a decision and give a short reason.",
    missing: "This submission could not be found.",
    duplicate: "This demo already has a review.",
    reviewError: "Your review could not be saved.",
  },
  nav: [
    { href: "/map", label: "Map" },
    { href: "/progress", label: "Progress" },
    { href: "/me", label: "Me" },
  ],
} as const;
