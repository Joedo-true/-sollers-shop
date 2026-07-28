---
name: no-ai-slop
description: Enforces distinctive, non-templated visual design for any UI, frontend component, landing page, dashboard, or mockup work. Use whenever creating, styling, redesigning, or reviewing frontend code (React, HTML/CSS, Vue, Figma-to-code, component libraries) — including something as simple as build a landing page or make this component — regardless of whether the user ever says the phrase AI slop. Also applies when picking a color palette, choosing animations, or writing UI copy.
---

# No AI Slop

Left to its own defaults, an AI coding agent reaches for the same handful of safe-looking interfaces every time: the same gradients, the same card shadows, the same fade-in-on-scroll, the same "unlock your potential" copy. None of these are wrong in isolation. They're wrong when they show up because they're the first thing that came to mind, not because the product actually called for them. This skill is a checklist for catching that before it ships — when generating new UI, and when reviewing someone else's.

## The three defaults to watch for

When a brief doesn't pin down color and type, generated UI collapses into one of three looks almost every time:

1. **Cream and terracotta serif** — an off-white background (roughly `#F4F1EA`), a high-contrast serif headline, and a warm clay or terracotta accent (roughly `#D97757`). It shows up regardless of the actual subject, which is the giveaway.
2. **Near-black with a neon accent** — a dark background carrying a single saturated accent color (acid green, vermillion) that does all the work on its own.
3. **Broadsheet minimalism** — hairline rules, zero border-radius, dense newspaper-style columns, no real color palette at all.

None of these are bans. Editorial products can genuinely call for broadsheet minimalism; a warm consumer brand can genuinely call for cream-and-serif. The test is whether the choice was made *for this subject*, or whether the same brief run twice would land somewhere else entirely and this was just the path of least resistance.

## Other common tells

- Purple-to-blue or teal-to-pink gradients on buttons and backgrounds, reached for because they read as "modern," not because the brand calls for them
- Glassmorphism panels and heavy drop-shadows stacked onto every card
- A single typeface (usually a default system sans) doing every job — headline, body, and captions — with no real type scale or pairing
- Numbered markers (01 / 02 / 03) or a matching icon badge on every item in a features list, when the items aren't actually a sequence and don't need an icon to be understood
- A hero section built from the same template: centered headline, muted subheadline, two pill-shaped buttons, an abstract gradient blob behind it
- Every element fading or sliding in on scroll with no distinction between what's worth revealing and what's just there
- Spring or bounce easing applied to utility controls — toggles, checkboxes, form fields — that don't need personality
- Hover-scale on every card and button, whether or not hover conveys anything at all
- Copy that could paste into a competitor's landing page unchanged: "unlock your potential," "seamless experience," "empower your team," "revolutionize the way you—"
- Shipping a component library's out-of-the-box theme (default shadcn or Tailwind blue, default radius, default spacing scale) with zero customization

Treat this list the same way as the three defaults above: none of it is forbidden, but each one needs a reason beyond "it was the obvious choice."

## Before writing any code, define a token system

Don't start from a layout. Start by pinning down, in this order:

- **Subject** — what is this actually for, who is it for, and what's the one job this screen does? If the brief doesn't say, decide and state the assumption before moving on.
- **Type** — a display face and a body face chosen as a deliberate pair for this subject, not the default reach for any other brief. Add a third, utility face only if captions or data actually need one.
- **Layout** — one paragraph describing the layout's intent, plus a rough ASCII wireframe, before any real code exists.
- **Signature** — the one element this design should be remembered by. Spend the boldness here, and keep everything else around it quiet and disciplined.

Then check the plan itself: would this same answer show up for a different product in the same category? If yes, that part is a default, not a decision — revise it before writing a line of CSS or JSX, and note what changed and why.

## Self-critique before shipping

- **Remove one thing.** Before calling it done, cut one decoration, one animation, or one accent color and see if the design survives. If it does, that element was extra.
- **Justify every animation.** Motion should serve orientation or a specific moment of delight, not run on every element because a library made it easy. If you can't say what one particular animation communicates, cut it.
- **Read the copy out loud.** If a line could paste into any competitor's page unchanged, rewrite it to say something only true of this product, in plain, active language ("Save changes," not "Submit").
- **Check the floor, not just the ceiling.** Visible keyboard focus, contrast that holds up at a glance, a layout that survives mobile widths, motion that respects `prefers-reduced-motion`. Taking one real risk in the signature element doesn't excuse skipping this.

## Using this during review, not just when building

When reviewing someone else's frontend code or a pull request:

- Name the specific tell from the lists above rather than just saying something feels generic
- Don't push for the opposite extreme (maximalism for its own sake) — ask whether the current choice was deliberate for this product, and suggest one concrete alternative tied to the actual subject if it wasn't
- If the brief or an existing design system already specifies a direction — including one of the three defaults above — that instruction wins. This skill fills the gaps a brief leaves open; it doesn't override an explicit choice already made.
