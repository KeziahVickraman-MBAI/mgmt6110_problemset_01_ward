# AIGH — AI-General Hospital · Am I Good for Handover?

**Student:** Keziah Sherlyn Vanessa Vickraman · **Course:** MGMT 6110 · **Problem Set 1**

**Live link:** https://mgmt6110problemset01ward.vercel.app/

---

A two-way name. *AI-General Hospital* is the setting; *Am I Good for Handover?* is the question the outgoing nurse is actually asking at 19:25 with her coat half on.

## Who it's for

Registered nurses on an eight-bay acute adult inpatient ward—roughly 25 rotating across a 07:00–19:30 day shift and a 19:30–07:30 night shift. **Internal tool**, no external users.

It has two, at opposite ends of the same twelve and a half hours:

- **The outgoing nurse**, who counts six consumables across eight bays and confirms what to flag. Screens 1 and 2.
- **The incoming nurse**, who reads what was flagged and never touches the other two screens. Screen 3, read-only.

## What it does

Ward-level consumable supply — gloves, gauze, saline flushes, cannulas, dressing packs, sharps bins — counted against a par level per bay.

Today, a shortage is discovered by reaching into a bay mid-procedure and finding it empty. If it gets mentioned at all, it's mentioned in a verbal handover where supplies compete with patient acuity for fifteen minutes and lose. AIGH moves that moment forward: a two-minute round before the shift ends, two flags set automatically from the counts, and both waiting on the incoming nurse's screen at 19:35 instead of being discovered at 02:00.

The flags are ranked by how soon each item runs out rather than by raw shortfall, using consumption across recent shifts. Restocks and inter-bay transfers are recorded as events and excluded from that calculation.

**Out of scope:** AIGH does not order, restock, or talk to pharmacy. It moves the moment of noticing, and nothing else.

## The three screens

1. **The Round** — count six consumables across eight bays using steppers. No keyboard, no free text.
2. **The Lowest** — the two items closest to running out, picked automatically. Confirm, or swap in one of the next three candidates if clinical judgement says otherwise.
3. **Handover** — read-only. What was flagged, by whom, and when.

## In this repo

| File | What it holds |
|---|---|
| [`PROMPTS.md`](PROMPTS.md) | The five prompts, what came back each time, and what I changed next |
| [`REFLECTIONS.md`](REFLECTIONS.md) | Answers to the five reflection questions |
| `src/` | The app — one component per screen, plus `utils/burnRate.ts` and `data/wardData.ts` |

Built in Google AI Studio, deployed on Vercel. All ward names, nurse names, counts and par levels are invented. Nothing here is confidential and no real institution is depicted.
