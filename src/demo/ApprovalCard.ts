import type { ApprovalCardProps } from "../primitives/ApprovalCard";

export const approvalCardDemo = {
  questions: [
    { q: "How many flavors should we launch?", type: "radio", options: ["Three (core line)", "Five (full case)", "Just one hero"] },
    { q: "Which mix-ins should we stock?", type: "check", options: ["Chocolate chips", "Waffle bits", "Sprinkles"] },
    { q: "Which market do we enter first?", type: "radio", options: ["Food trucks", "Grocery freezers", "Scoop shops"] },
  ],
} satisfies ApprovalCardProps;
