import type { FAQ } from "./types";

export const membershipFaqs: FAQ[] = [
  {
    question: "When does Hive Membership launch?",
    answer:
      "We're finalising membership details with our founding community. Waitlist members will be the first to know.",
  },
  {
    question: "How much will it cost?",
    answer: "Pricing hasn't been confirmed yet. It will be shared with waitlist members before public launch.",
  },
  {
    question: "Do I need to be a member to book gatherings?",
    answer:
      "No. Every woman can discover, join circles and book gatherings for free — membership adds priority and curation on top.",
  },
  {
    question: "What are founding member benefits?",
    answer: "Early waitlist members will receive early access and preferred pricing once membership tiers are finalised.",
  },
];

export const membershipComparisonRows: { label: string; community: boolean; membership: boolean }[] = [
  { label: "Discover experiences", community: true, membership: true },
  { label: "Join community circles", community: true, membership: true },
  { label: "Save activities", community: true, membership: true },
  { label: "Booking access", community: true, membership: true },
  { label: "Early access", community: false, membership: true },
  { label: "Member-only gatherings", community: false, membership: true },
  { label: "Priority booking", community: false, membership: true },
  { label: "Partner benefits", community: false, membership: true },
  { label: "Exclusive invitations", community: false, membership: true },
];
