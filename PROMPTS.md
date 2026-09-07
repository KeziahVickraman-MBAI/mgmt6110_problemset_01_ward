# PROMPTS.md - AIGH: AI-General Hospital · Am I Good for Handover?
*(I thought of the name for the application deeply)*

**Student:** Keziah Sherlyn Vanessa Vickraman · **Course:** MGMT 6110 · **Problem Set 1**

**User sentence:** A *ward nurse* opens this screen *to check supply levels per bay and flag the two lowest before the shift ends*, and knows it worked when the *flag shows on the handover screen*.

**Live link:** https://mgmt6110problemset01ward.vercel.app/

---

## Prompt 1 - The Master Prompt (RGOGC)
```
**ROLE:** You are a senior front-end developer building a React web app.

**GOAL:** Build the front end of AIGH—a name that reads two ways: "AI-GeneralHospital" and "Am I Good for Handover?"— a web app for ward nurses on a hospital inpatient ward— *around 8 bays, roughly 25 nurses* rotating across dayand night shifts, using it on a phone in a side room or standing in the bayitself. Their job on this product is: "before I go home, make sure the nextshift knows what we're short on."
   There is no login. The app assumes one named nurse is on shift and one shift is in progress; both are fixed values in the data file. Every consumable has a parlevel (the number the bay should hold), also in the data file.

**SCREENS:**
- 1. THE ROUND 
> Shows: a list of the ward's bays, each showing whether it's been counted this shift yet. Under each bay, a short fixed list of consumables (gloves,gauze, saline flushes, cannulas, dressing packs, sharps bins). 
> User does: taps a bay, taps a number for each item using large stepper buttons—no keyboard, no free text. Moves to the next bay. 
> Worked when: every bay shows as counted and the screen says the ward is done. Nothing is red or outstanding.
- 2. THE TWO LOWEST 
> Shows: the two lowest-stocked bay/item pairs across the whole ward, picked automatically from the counts just entered, ranked by how far each countfalls below that item's par level. Shows the count, the par, and the baynamed clearly. Below them, the next three candidates.
> User does: confirms the two, or swaps one out for a candidate below ifclinical judgement says otherwise. Can add one short note per flag. 
> Worked when: the screen confirms two flags are set for handover, and showswhich shift they'll appear on.
- 3. HANDOVER 
> Shows: read-only. The current flags — bay, item, count, optional note, who counted them and when. Empty state reads "nothing flagged this shift" rather than looking broken. 
> User does: reads it. Nothing else. This is the incoming nurse's screen. 
> Worked when: the incoming nurse can see the flag without asking anyone.

**OUTPUT:** 
> A running app. Keep every invented value in ONE data file of its own, with *at least 48 rows (8 bays x 6 consumables)*, so the screen looks real. 
> That file also holds the ward name, the current shift, the nurse on shift, and thepar level for each consumable. One component per screen or section. Move between screens without reloading the page. Readable on a phone at arm's length. When you are done, list the files you created and what each one holds.

**GUARDRAILS: **Screens and invented data only. Do NOT call the Gemini API or anyother model. Do NOT call any outside service or fetch from any URL. No database,no login, no user accounts, no analytics. No features I did not list. No real company's name, logo, or trademark. Invented names and numbers only, nothing confidential.

**CONTEXT: **Individual Problem Set 1 for MGMT 6110 Human-AI Collaboration at SMU. Built in Google AI Studio, shared as a link, and opened on a phone by classmatesin Week 3. I am not a programmer: when you make a choice I did not specify, say so in one line rather than burying it.
```
**What came back:** A running app, 14 files, preview loaded. It came back with 3 screens exactly how I asked for. No extra functionalities beyond the specified scope. 
> This was recorded on my intial commit: `e3e489ee6470194e4c363befb4d7dffb6cc350c5`

**But...**
   I asked for a placeholder on how many shift would be left and it came back with *"2.4 shifts left"* In this particular business case study, decimal point did not make sense to me. Hence, I decided to change it. (This will be reflected in prompt 3. More on the logic and rationale will be elaborated there, because it went beyond simply numerical changes)

**What I changed next and why:** Before I went to address the numerical discrepancy and elaborate more on this, I wanted to experiment with the quick edit function (with the tools first). I have never used it in the past.  
---

## Prompt 2 - attempt at using the edit button for a quick fix 
I wanted to experience making a quick edit using the annotation tools button you guided us towards. The change is quick and simple. It was just changing the green dot on screen 2 to a red dot. But one thing I realised was the important note you shared, that we had to click on it and type to describe the changes and add *change nothing else* for it to be fully recorded.
```
Change this to red color dot instead of green. Change nothing else. Apply style changes to the selected element(s).
```
**What came back:** When the change occured, there were no new files added. Just one existing file change on this file which made sense: src/components/WardHeader.tsx. --> where it clearer indicated in the dot change from green to red.
> This was recorded on my second commit: `e3a2ffe655a2f9b023be86be546c497d99199c36`

**What I changed next and why:** After doing this and seeing the code change, I realised, yes you were right. It’s better to learn how to code cause that change would have been way faster. 
One thing still lingered in my mind in terms of applicability to business problems, which is why you will see a third prompt below.
---
## Prompt 3 - Logic tweak to make it clinically relevant
- Now that I tried my hand with a quick aesthetic change, I went after a feature that did not hold up. The app was reporting "2.4 shifts left." In the context of nursing, it did not make sense to deal with decimal points for number of shifts left. It is simply not very useful for their gauge. Precision that turns out wrong twice gets the whole tool distrusted, and trust is the one thing an internal tool cannot buy back. So the output had to become coarse: "about a shift," "2–3 shifts," and nothing finer.

- Fixing the decimal then exposed a larger problem. If the app is estimating a rate at all, "the two lowest" is the wrong sort. A bay holding 6 units and burning 5 a shift is in more trouble than a bay holding 3 units and burning 1, but ranking by raw deficit puts them the other way round. 
- The number and the ranking are the same decision. So the change is not cosmetic — it alters which two items get flagged for handover.
- That reasoning is what turned a formatting fix into a capability: **BURN RATE**.
```
**CAPABILITY: Burn rate**
--> What: Use the stored count history to turn a flag from a status into a warning — "Bay 3, gauze, 6 left, about a shift's worth" instead of just "Bay 3, gauze, 6 left."
--> Where: One line of text appended to each flag on Screen 2 and Screen 3. No new screen, no new user input.
How: Difference between consecutive counts of the same bay/item, averaged across the last 5–6 shifts. Depends on: timestamped per-bay counts from v1. Nothing else.
Rules:
--> Stays off until 6 shifts of history exist. Before that, flags read as
they do in v1. Output is coarse — "about a shift," "2–3 shifts." Never a decimal. Bay consumption swings with patient acuity and false precision gets the tool distrusted. Any stock movement that isn't consumption (a restock, a transfer between bays) must be recorded as an event and excluded from the calculation, or the rate reads a drop as usage and goes wrong quietly. Also reorders Screen 2: the two lowest become the two closest to running out, which is not always the same thing.
*Change nothing else*
```
**What came back:** 6 files changed. No new screen — the warning line was appended inside the existing "2. THE LOWEST" pane rather than becoming a fourth destination, which is what I wanted. Decimals are gone; both top flags now read "about a shift's worth." The pane header changed to **RANKED BY RUNOUT RISK (BURN RATE).**
*Output by Gemini 3.8 Flash*
- Burn Rate Warning Calculation:
   - Implemented consecutive shift-to-shift consumption tracking averaged over historical counts.
   - Threshold Gate: The feature remains disabled until 6 shifts of history exist, falling back to standard v1 deficit formatting if fewer shifts are recorded.
   - Coarse Clinical Phrasing: Output strictly uses non-decimal, coarse clinical terms (e.g., "about a shift's worth", "1–2 shifts", "2–3 shifts") to account for patient acuity fluctuations without false precision.
   - Stock Movement Integrity: Recorded non-consumption events (pharmacy restocks, inter-bay emergency transfers) and excluded those shift intervals from the burn rate calculation to prevent artificial consumption spikes.
- Screen 2 & Screen 3 Warning Display:
   - Appended the warning line to flags on Screen 2 (The Lowest) and Screen 3 (Handover): for example, "Bay 3, gauze, 6 left, about a shift's worth".
   - Required no new screens and no additional nurse input.
- Runout Risk Candidate Reordering:
   - Screen 2's candidate ranking now orders items by *estimated* shifts until runout rather than raw numeric deficit alone. Items closest to exhaustion (such as Bay 4 cannulas and Bay 3 gauze) now surface at the top of the list for outgoing nurse confirmation.
> This was recorded on my third commit: `4c04fe4928682c51c4ed6005f284a65c190e6ca1`

**Verifying the re-rank actually happened.** 
- The model's summary claimed Bay 3 gauze "surfaced at the top," which is not what the screen shows — gauze is at rank #3. So I checked the ordering myself rather than trusting the summary. 
- The proof is at ranks #3 and #4: Bay 3 gauze is 6 below par and sits *above* Bay 2 gloves at 8 below par. Under a raw deficit sort that ordering is impossible. The warning lines explain it — gauze reads "about a shift's worth," gloves reads "1–2 shifts," so gauze runs out sooner despite holding more relative stock.

**The re-rank works, but it does not change the two flags.** 
- Cannulas (87% below par) and dressing packs (88% below par) come out on top under either method, and both sit about a shift from empty. 
- On this dataset the two rankings agree at the top and only diverge further down. Worth stating plainly: the feature is doing its job, but you cannot see it doing its job by looking at the flags — only by looking at the candidates beneath them.

**What I changed next and why:** Two things stood out once I looked at the running app. 
1. The subtitle now contradicts the app.
   The line under "The Two Lowest" still reads "Automatically picked by deficit from round counts," while the pane directly below it says ranked by runout risk. The gloves-versus-gauze ordering proves the subtitle is false. 
   The model changed the logic and did not change the sentence describing the logic — a one-line fix, and the only place the app contradicts itself.

2. The transfer is still free text.
   Flag 2's note reads "2 boxes on transfer from Wa…" — a stock movement typed into a note field the calculation cannot read. The model's summary claims it recorded non-consumption events and excluded them, but the only visible evidence on screen says the opposite. I cannot verify this from the interface either way. If those boxes arrive and the count jumps, the rate reads the jump as negative consumption and goes wrong silently, with nothing on screen to indicate anything is off. 
   This is the exact failure mode I anticipated when writing the rule, and it is the one thing in the build I would not sign off on.
---
## Prompt 4 - Refining the app for consistency and coherence
Neither of these is a new feature. 
- The first is a sentence that stopped being true when Prompt 3 changed the logic underneath it. 
- The second is a rule I already wrote in Prompt 3 that the model claims to have followed but cannot show me. 
- Both are about the app describing its own behaviour accurately, which matters more here than anything I could add — a tool that misstates how it ranks, or silently miscalculates after a delivery, is worse than one that does less.
```
Two corrections. No new screens, no new features, no new nurse input.

1. THE SUBTITLE IS NOW FALSE.
   The line under "The Two Lowest" still reads "Automatically picked by
   deficit from round counts." That stopped being true when ranking moved
   to runout risk in the last change — Bay 3 gauze (6 below par) currently
   ranks above Bay 2 gloves (8 below par), which a deficit sort cannot
   produce. Rewrite the subtitle to describe what the app actually does.
   Keep it to one line and in plain ward language, not jargon.

2. THE TRANSFER IS STILL FREE TEXT.
   Flag 2's note reads "2 boxes on transfer from Wa..." — a stock movement
   sitting in a note field the burn rate calculation cannot read. My last
   change required non-consumption events to be recorded and excluded.
   Show me that this is true rather than asserting it:

   - Represent restocks and inter-bay transfers as their own records in
     the data file, each with a bay, an item, a quantity and a timestamp.
     Not as sentences inside a nurse's note.
   - Where an interval was excluded from a burn rate because of one of
     these records, say so on screen in a few words next to the warning
     line, for example "excludes restock 06:15". If nothing was excluded,
     show nothing.
   - Seed at least two such records into the data file so I can see the
     exclusion appear without waiting for a delivery.

   The nurse still types nothing new. This is a data-model correction,
   not an interface addition.

Change nothing else. Do not touch Screen 1. Do not add buttons, states or
screens. Tell me in one line if you changed anything I did not ask for.
```
**What came back:** 6 files edited. All in the source code which is expected in this change. Here is what was corrected:
1. Subtitle Rewritten in Plain Ward Language:
   - Replaced the outdated deficit description under "The Two Lowest" with a single plain-language line accurately describing the current behavior:
   --> "The two items closest to running out this shift, based on how fast each bay is using them."
2. Discrete Stock Movement Records & On-Screen Exclusion Labels:
   - Data Records: Represented non-consumption events (restocks and bay transfers) as discrete records in STOCK_MOVEMENT_EVENTS with structured bayId, consumableId, quantity, and timestamp fields, rather than free text in a nurse's note.
   - Seeded Records: Seeded records for the primary shortage items (a restock for Bay 3 gauze at 06:15 and an inter-bay transfer for Bay 4 cannulas at 14:30).
   - On-Screen Exclusion Notice: When a movement event causes an interval to be excluded from the burn rate average, the excluded event is displayed directly next to the warning line on Screen 2 and Screen 3 (e.g. excludes restock 06:15, excludes transfer 14:30). Items without excluded intervals display nothing extra.

**What I changed next and why:** Nothing further. This is where the scope ends.
- The requirement was that a ward nurse checks supply levels per bay, flags the two lowest before the shift ends, and knows it worked when the flag shows on the handover screen. 
- All three hold. The round covers all eight bays, two flags are set from the counts, and both appear on the incoming nurse's screen with the bay, the item, the count and the note attached. 
> This was recorded on my fourth commit: `f976d06fe6d044d67061cb1ac6f844cdb3ebc28f`

**Considered and not built.** 
- Working through the burn rate made me notice that nothing ever happens to a flag once the incoming nurse reads it. She walks away, the next shift's round overwrites the count, and the system never learns whether stock arrived or whether it ran out mid-procedure. 
- A "Restocked / Still low" tap on Screen 3 would close that loop, and two consecutive "still low" taps would turn a ward problem into a stores problem.
---
## Prompt 5 - Last minor miscellaneous change
I just wanted it to be easier for classmates to view my application both on mobile and web versions. So I added a quick toggle feature which is logged in my fifth commit: `a819afbb571026014b1123df36e619fcfac23209`. No other changes were made. 

`Looking forward to the subsequent lessons to further my journey in end-to-end building!`
---