# REFLECTIONS.md - AIGH: AI-General Hospital · Am I Good for Handover?

**Student:** Keziah Sherlyn Vanessa Vickraman · **Course:** MGMT 6110 · **Problem Set 1**

## Q1: Who are your users, and what changes for them?
`Internal`. Registered nurses on an eight-bay acute adult inpatient ward — roughly 25 rotating across a 07:00–19:30 day shift and a 19:30–07:30 night shift. Two users at opposite ends of the same twelve and a half hours: the outgoing nurse who counts (Screens 1 and 2) and the incoming nurse who reads (Screen 3, read-only).

The function is **ward-level consumable supply**. Restocking is owned by central pharmacy. But *noticing a bay is short before it runs out* is owned by nobody — it falls to whichever nurse reaches into the bay first. 

**What happens today, without the product:**
Today: a nurse finds two cannulas where there should be fifteen, mid-procedure, gloved. She borrows from another bay; nothing is recorded and the ward is now more uneven than before. If she remembers, she mentions it at the 19:30 verbal handover, where supplies compete with acuity, medications and discharges for fifteen minutes and lose. The incoming nurse discovers the same shortage the same way, at 02:00.

AIGH removes the discovery-by-failure and the reliance on memory: a short round before the shift ends, two flags set from the counts, both waiting on the incoming nurse's screen at 19:35. It does not order, restock, or talk to pharmacy. It changes when you find out.

> This actually happened to my grandmother whom I was caregiving for—the bad night nightmare you would not hope for—which is an inspiration for this build. Nurses are really short on manpower in off-peak periods throughout the night and any amounts of premptive measure will be helpful for nurses and patients alike.

**What the three screens change:**
- The count moves from <mark>accidental to deliberate</mark>.
    --> For this case it's not about "saving XYZ minutes", but knowing about this **BEFORE** the fact, rather than **AFTER** the fact

**What does not change.** The product does not order anything, does not talk to pharmacy, and does not restock. It only moves the moment of noticing from after the shortage bites to before it does.
---
## Q2: Augmented capacity and constrained capacity
### Augmented capacity
A working three-screen app in under two hours having never written a line of React. The time which I had went into something I wanted to address from a first persons' perspective. This complexity alludes to granularity. 

Feeding in not just descriptive (how long would my supply last for) but predicive (what would my forecasted supply look like) alongside optimization considerations is a far deeper conversation—which I will briefly discuss in Q5. Stay tuned ~

### Constrained capacity
**I cannot judge what I cannot read.** 
Prompt 3 required non-consumption events — restocks, inter-bay transfers — to be excluded from the burn rate. The model said it had done this. In Prompt 4 I asked it to prove that rather than assert it, and got `excludes transfer 14:30` printed beside the warning line. I asked for **visible evidence** and received a **visible artefact**. That label reads identically whether the calculation drops the interval or the text is decoration.
 
Writing this, I finally opened `src/utils/burnRate.ts`. The exclusion was real — the loop hits `continue` before the consumption delta is computed. But I found a defect I had not thought to look for: `if (consumptionDelta > 0)` drops zero-consumption shifts from the average entirely, so a bay used on alternate shifts computes at double its true burn rate. 
```js
if (consumptionDelta > 0) {
  validDeltas.push(consumptionDelta);
}
```
Arithmetically, it renders beautifully and says nothing. I would like to learn how to build a sanity check for logic like this, and to understand how coding agents typically behave on these tasks, so my guardrails can anticipate it rather than react to it.
*This is a skill I am only part-way to having. I could read enough to find the bug and not enough to have found it without going looking. Building the second half is what I want out of the rest of MGMT 6110.* 
---
## Q3: In the loop, on the loop, out of the loop
**Where my judgment changed the outcome.** The app returned "2.4 shifts left." Nurses do not hand over in decimals, and precision that turns out wrong costs trust an internal tool cannot buy back. Fixing that exposed the real problem: if the app estimates a rate at all, "the two lowest" is the wrong sort —> a bay holding 6 and burning 5 is in more trouble than one holding 3 and burning 1. A formatting fix changed the ranking.

**Where I was nominally in the loop and added nothing.** Prompt 1 returned fourteen files. I checked the three screens against my Goal list and stopped. Nothing shipped without me clicking, and nothing I did would have caught a defect.
 
**Out of the loop: computing the burn rate.** Nobody should approve arithmetic 48 times a shift — volume alone destroys the review. I would sign that off once the coarse bands are calibrated against how often flagged items actually ran out, and once a drift tripwire holds the number back rather than displaying it.
 
**In the loop, however expensive: confirming the two flags.** The arithmetic knows six past shifts. The nurse knows tonight's line insertion and tonight's admission. Though I should admit my CONFIRM button is one orange tap while swapping requires reading five candidates — I built the rubber stamp myself. That is the difference between a human in the loop and a human on the loop.

---
## Q4: What did it build that you never sketched?
My Goal list named three screens, six consumables, par levels, 48 rows, one nurse, one shift. Everything below arrived without being asked for.

### It added what I never asked for
My guardrails forbade calling any model or fetching any URL. Sitting in my repo is `.env.example`, declaring `GEMINI_API_KEY` and a Cloud Run `APP_URL` for OAuth callbacks. Nothing fills them. But I asked for three screens and was handed the shape of a deployed service with a slot for a key.
 
Smaller and worse: Screen 3 reads **"Verified at: 18:45."** I specified *who counted them and when*. In a hospital, verification is a distinct auditable act — the same one governing controlled drug administration. My app asserts on a handover screen that it occurred. There is one nurse, one count, and no second pair of eyes anywhere in the data model.
 
I noticed while writing this. It was on screen in the first version and survived five commits and three screenshots. My acceptance criteria were the three "worked when" lines from Prompt 1 — a presence test. It could confirm the required things were there. It had no shape that could see an extra claim that was not true.

**What I would have had to do differently:** read the shipped screen back word by word and ask of every element — including the ones I did not put there — *who authorised this, and is it true?* A presence test cannot catch an unearned claim, because the claim is not a missing feature. It is an extra one, and my acceptance criteria had no shape that could see it.
---
## Q5: Learning pointers for the organisational context
This is where the augmented capacity of this build comes into play. Building a small-scale version of this had more depth than I anticipated, and where it sits now is mere description—no real forecasting model, no optimisation, nothing predictive driving it. No `A-a-a-S`. Now scale that. A hundred people, every week, on work that matters. Nobody reads the generated code. Garbage in, garbage out.

**1. Before anything generated goes live, someone reads the file tree — not the preview — and accounts for every file nobody asked for.**
*Traced to:* `.env.example` appeared with a Gemini key slot and a Cloud Run OAuth URL despite a guardrail forbidding both, and survived five commits because I only ever looked at the running app.
 
**2. Treat "verified and completed" as a claim requiring evidence, and make the evidence an artefact a human opened — file, line, what they checked.**
*Traced to:* my build reported zero errors and full verification while `if (consumptionDelta > 0)` was silently inflating every burn rate on the ward.
 
**3. Where output uses a word with a defined meaning in the receiving domain, a practitioner from that domain signs off the wording before a user sees it.**
*Traced to:* "Verified at: 18:45" on a clinical handover screen, describing an act my app does not perform.
---