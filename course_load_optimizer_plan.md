
# Course Load Optimizer — Project Plan

## Project Overview

**Project name:** Course Load Optimizer

**One-line pitch:**  
A planning tool that helps students compare possible semester schedules, detect overload risk, and choose the most realistic plan before registration.

**Core idea:**  
Instead of relying only on course times, students can compare multiple schedule options based on workload, stress, time conflicts, and outside commitments. The app acts as a planning layer that helps users choose a schedule that is realistic for their actual life.

---

## Why This Project Is Strong for the Codex Creator Challenge

This idea is a strong fit for the challenge because it is:

- easy to understand quickly
- clearly useful to students
- feasible to build in a polished, reliable way
- easy to demo in a short pitch
- memorable when paired with a comparison feature and stress score

### Relevant judging criteria
The contest evaluates projects using:

- **Clarity (15%)**
- **Usefulness / Value (25%)**
- **Creativity (20%)**
- **Execution (25%)**
- **Polish & Thoughtfulness (15%)**

This project is designed to score well by focusing on:
- a very clear problem
- obvious practical value
- strong end-to-end execution
- thoughtful UX
- one standout feature: **comparing multiple schedule plans**

---

## Product Goal

Help students answer:

> “Which semester schedule is actually best for me, not just which one fits on a timetable?”

The app should let users compare multiple possible schedules and understand:
- time conflicts
- weekly class load
- study-hour burden
- overload risk
- bad clustering of exams or major deadlines
- whether a schedule matches their actual availability and energy

---

## Target User

Primary user:
- college students planning their semester before registration

Secondary use cases:
- students balancing classes with work or clubs
- students who want to avoid burnout
- students comparing several possible course combinations

---

## MVP Scope

### Must-have features

#### 1. Course input
Users can manually add courses with:
- course name
- days
- start time
- end time
- estimated weekly workload
- difficulty level
- exam dates or major deadlines
- required vs elective toggle

#### 2. Commitment input
Users can add non-class commitments such as:
- part-time job hours
- clubs
- commute blocks
- exercise / personal time
- preferred sleep window
- max study hours per day
- max classes per day

#### 3. Multiple candidate plans
Users can create and compare:
- Plan A
- Plan B
- Plan C

Each plan contains a different combination of courses.

#### 4. Conflict detection
For each schedule, the app should detect:
- overlapping class times
- overlaps with commitments
- too many back-to-back classes
- long inefficient gaps between classes

#### 5. Workload scoring
For each plan, the app calculates:
- total weekly class hours
- total estimated study hours
- busiest day
- number of heavy days
- exam clustering risk
- overall stress / balance score

#### 6. Recommendation engine
The app explains:
- why a plan is strong or weak
- where overload happens
- what makes one plan better than another
- what could be changed

#### 7. Visual dashboard
The app should display:
- weekly timetable
- workload chart by weekday
- score cards
- warnings
- side-by-side comparison between plans

---

## Nice-to-Have Features

These are useful if there is extra time, but not required for the MVP:

- sample preloaded semester
- export or share summary
- study block suggestions
- deadline / exam heatmap
- “why this score?” explanation drawer

---

## Features to Avoid

To maximize execution quality, avoid adding:

- university login
- real registrar integration
- scraping school websites
- authentication
- database-heavy user accounts
- mobile app
- generic chat assistant
- large multi-agent architecture
- real-time API dependencies

These features increase risk without meaningfully improving contest ranking.

---

## Core Product Structure

### Main value proposition
The product is not just a timetable builder. It is a **decision tool**.

### Key difference from a normal schedule viewer
A normal schedule viewer answers:
- “What does my schedule look like?”

This product answers:
- “Which of my possible schedules is actually best for my life and workload?”

---

## Recommended Standout Feature

### Compare Plans
This is the most important differentiator.

Users should be able to compare Plan A, Plan B, and Plan C across:
- stress score
- study hours
- busiest day
- exam clustering
- conflict count
- recommendation summary

This gives the project a clear and memorable hook.

### Optional secondary standout feature
**Burnout / Stress Score**

A score from 0 to 100 that estimates how intense a schedule feels based on class load, study load, commitments, and deadline concentration.

---

## User Flow

### Demo flow
1. Open the app
2. Click **Try Sample Semester**
3. View 3 plans already loaded
4. Compare their summary cards
5. Click into Plan A
6. See timetable, warnings, and stress score
7. Switch to Plan B
8. See why it is more balanced
9. View recommendation panel and comparison chart

### Real usage flow
1. Add courses
2. Add commitments
3. Create multiple plans
4. Compare plans
5. Read warnings and recommendations
6. Choose best option
7. Export or save summary

---

## Page / Section Design

### 1. Landing + quick start
Contains:
- title
- one-line explanation
- “Try Sample Semester” button
- “Build Your Own Plan” button

Suggested copy:
> Plan smarter, not just faster. Compare course schedules, estimate workload, and spot overload before registration.

### 2. Builder
Left panel:
- course input form
- commitment input form
- personal preferences

Center:
- plan tabs (A / B / C)
- selected course list

Right panel:
- warnings
- quick score preview

### 3. Analysis dashboard
Top:
- selected plan summary

Middle:
- weekly timetable
- workload chart

Right:
- recommendation panel
- risk cards

Bottom:
- comparison across all plans

---

## Scoring System

The app should compute an overall **Stress Score** from 0 to 100, where a higher score means more overload risk.

### Suggested components
- class load score
- study load score
- heavy-day score
- back-to-back score
- gap inefficiency score
- commitment pressure score
- exam cluster score

### Example formula
Stress Score =
- 20% class load
- 25% study load
- 15% heavy-day pressure
- 10% back-to-back class pressure
- 10% gap inefficiency
- 10% commitment pressure
- 10% exam clustering

### Interpretation
- **0–30:** light
- **31–60:** balanced
- **61–80:** intense
- **81–100:** overload risk

The exact numbers can be tuned later, but the scoring should stay easy to explain.

---

## Recommendation Logic

The recommendation engine can be rule-based.

### Example rules

If weekly load is too high:
- “This plan may be difficult to sustain because your combined class and study hours are unusually high.”

If there are 3 heavy days in a row:
- “This plan concentrates too much work early in the week.”

If exams cluster too closely:
- “Two major assessments fall in the same 72-hour window.”

If there are too many back-to-back classes:
- “You may have limited recovery time between classes.”

If one plan is clearly better:
- “Plan B is more balanced because it spreads workload more evenly across the week.”

---

## Sample Data Strategy

The app should ship with a sample semester so judges can understand it immediately.

### Suggested mock sample semester
Possible mock courses:
- CS 210 Algorithms
- MA 225 Linear Algebra
- WR 150 Writing Seminar
- PH 100 Intro Philosophy
- EC 101 Intro Economics

Each sample course should include:
- realistic days and times
- estimated workload
- difficulty
- exam dates

Also include:
- a part-time job
- a club
- a gym block or personal routine

The sample data should intentionally create:
- one overloaded plan
- one balanced plan
- one risky plan with deadline clustering

---

## UI / UX Principles

### Design goals
The interface should feel:
- clean
- calm
- intentional
- modern
- easy to read

### Visual style suggestions
- light neutral background
- rounded cards
- one accent color
- clear typography
- minimal clutter
- clear spacing
- readable charts

### Helpful polish details
- sample data button
- validation messages
- hover tooltips
- empty-state guidance
- clear warning badges
- “why this score?” explanation

---

## Tech Recommendation

Best stack for speed and polish:

- **Frontend:** Next.js / React
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **State management:** local state or Zustand
- **Persistence:** browser localStorage

### Why no backend
A backend is not necessary for the MVP. Keeping it frontend-first:
- reduces failure risk
- speeds up development
- makes demoing easier
- improves reliability

---

## Suggested Project Architecture

```text
src/
  app/
    page.tsx
    builder/
    dashboard/
  components/
    CourseForm.tsx
    CommitmentForm.tsx
    PlanTabs.tsx
    Timetable.tsx
    ScoreCard.tsx
    WarningList.tsx
    ComparisonChart.tsx
    RecommendationPanel.tsx
  lib/
    scoring.ts
    validation.ts
    schedule.ts
    recommendations.ts
    sampleData.ts
    types.ts
  hooks/
    usePlannerState.ts
```

### Logic separation
- `schedule.ts` → overlap detection and calendar logic
- `scoring.ts` → stress score computation
- `recommendations.ts` → recommendation rules
- `validation.ts` → input checks
- `sampleData.ts` → demo semester data

This keeps the project modular and easier to explain.

---

## Validation and Edge Cases

### Input validation
The app should handle:
- missing course names
- invalid time ranges
- end time before start time
- unreasonable workload values
- duplicate course entries
- invalid exam dates

### Edge cases
The app should not break on:
- empty plan
- single-course plan
- no commitments
- all classes on one day
- multiple identical time blocks
- very light or very heavy semesters

Thoughtful handling of edge cases helps the polish score.

---

## Demo Strategy

If this becomes a finalist, the pitch video should clearly show:

1. the problem
2. the product
3. a working demo
4. why the app stands out

### 3-minute demo outline

#### 0:00–0:20
Introduce the problem:
> Students often choose schedules based only on class times, without understanding workload and stress tradeoffs.

#### 0:20–0:45
Introduce the app:
> Course Load Optimizer helps students compare possible schedules before registration.

#### 0:45–1:15
Load sample semester and show Plan A:
- timetable
- high stress score
- warnings

#### 1:15–1:45
Show Plan B:
- lower score
- more balanced workload
- fewer warnings

#### 1:45–2:15
Show comparison chart:
- stress score
- weekly hours
- exam clustering

#### 2:15–2:40
Show recommendation panel:
- explain why one plan is better

#### 2:40–3:00
Close with:
> This helps students choose schedules based on actual sustainability, not just time slots.

---

## Submission Framing

The contest requires:
- project title
- short description
- what the project is
- why it was built
- how it was built
- project link / URL

### Suggested title
**Course Load Optimizer**

### Draft submission description
A web app that helps students compare possible semester schedules before registration. Users can add courses, commitments, and preferences, then generate multiple plans, detect conflicts, estimate workload, and see overload risk with clear visual comparisons. I built it because students often choose schedules by time slots alone without understanding stress and workload tradeoffs. Built with React, Tailwind, and custom scoring logic.

---

## 7-Day Build Plan

### Day 1
- project setup
- define types
- build course input form

### Day 2
- build commitment input form
- build plan tabs
- build selected course list

### Day 3
- build timetable grid
- implement time overlap logic
- implement validation

### Day 4
- implement stress scoring
- create score cards
- add warning states

### Day 5
- implement recommendation rules
- build comparison chart
- connect all major flows

### Day 6
- add sample data
- improve UI polish
- add local storage

### Day 7
- bug fixes
- refine demo flow
- record demo
- finalize submission text

---

## Prioritization If Time Gets Tight

### Keep at all costs
- sample data
- plan comparison
- conflict detection
- stress score
- recommendation panel
- clean visual dashboard

### Cut first
- export
- fancy animations
- advanced charts
- study block suggestions
- secondary features

---

## Main Strategic Advice

To rank highly, the project should feel:
- complete
- useful
- polished
- real
- easy to understand

It should **not** feel:
- overbuilt
- fragile
- dependent on school systems
- bloated with extra features

The best version is **small but complete**, with one strong differentiator: helping students compare multiple schedule plans and understand the real workload tradeoffs.

---

## Final Summary

### Best positioning
Course Load Optimizer is a student planning tool that helps users compare semester schedules, estimate workload, detect conflicts, and avoid overload before registration.

### Best hook
> “This app does not just show your schedule. It helps you choose the best one.”

### Best differentiators
- compare Plan A / B / C
- stress score
- workload visualization
- recommendation engine
- thoughtful sample semester demo

### Best development strategy
- frontend only
- no school integrations
- prioritize polish and reliability
- build one narrow product extremely well

---

## Reference Notes

The planning above was based on the Codex Creator Challenge overview and official rules you shared, including:
- challenge timeline
- eligibility notes
- submission requirements
- judging criteria and weights
- finalist pitch expectations
