# GhostMedia Vision

## Canonical application surfaces

The root route redirects to `/dashboard/`, the visual Gateway. The Gateway enters
`/dashboard/headquarters.html`, the working Dashboard. Interior rooms return to
the working Dashboard.

The Gateway behavior lives in `assets/headquarters/gateway.js`. The working
Dashboard behavior lives in `assets/js/dashboard.js`. The older
`assets/headquarters/headquarters.js` file is non-canonical legacy code.

Canonical production routes are the files under `dashboard/`, plus `/public/scout/`,
`/carousel/`, and `/image-generator/`. The copies under `/public/carousel/` and
`/public/image-generator/` are compatibility copies and are not linked by the app.

Discover, Winner Lab, and Planner are inactive legacy rooms. Their archived scripts
are reference material only and they must not appear in active navigation.

`assets/js/storage.js` is the canonical persistence and schema boundary. Active
screens must use its helpers rather than defining their own storage keys or helpers.

### Creative review record compatibility schema

Creative modes use the existing `ghost-queue` collection through `gmGetQueue()`
and `gmSaveQueue()`. They do not introduce another persistent storage key.

Shared queue records contain `id`, `title`, `type`, `format`, `status`, `source`,
`product`, `page`, `topic`, `caption`, `payload`, and `createdAt`. The payload may
also contain `sourceId`, `sourceType`, `category`, `hook`, `angle`, `emotion`,
`cta`, `platform`, `image`, `prompt`, `style`, `aspectRatio`, `file`, `slides`,
`sourceVideo`, `sourceFile`, `startTime`, `endTime`, and `moment`.

Image data is compressed before entering browser storage. Small video files may
be stored inline; larger videos retain a device-file reference and clip metadata
only. Both are compatibility measures until durable SourceAsset storage exists.

## Purpose

GhostMedia exists to turn observations into content, content into assets, assets into published media, and published media into intelligence.

The goal is not simply to create content.

The goal is to build a self-improving media engine.

---

# Core Loop

Scout
→ Discover
→ Ideas
→ Content
→ Factory
→ Carousel
→ Queue
→ Posted
→ Winners
→ Patterns
→ Opportunities
→ Scout

Every stage has one job.

---

# Discovery

### Scout

Capture signals.

Sources:

* competitors
* trends
* comments
* creators
* news
* audience behavior

Scout answers:

"What is happening?"

---

### Discover

Interpret signals.

Discover transforms observations into:

Discover transforms observations into:

• patterns
• emotions
• tensions
• lessons
• hooks
• angles
• opportunities

Discover answers:

"What could this become?"

---

### Ideas

Select opportunities.

Ideas is the decision point.

Not every idea moves forward.

Ideas answers:

"What is worth creating?"

---

# Production

### Content

Create the message.

Content turns ideas into:

* hooks
* captions
* scripts
* outlines
* storytelling

Content answers:

"What are we saying?"

---

### Factory

Create production-ready variations.

Factory produces:

* versions
* angles
* formats
* structures

Factory answers:

"How many ways can we package this?"

---

### Carousel

Package the asset.

Carousel transforms content into:

* slides
* visual sequences
* posting assets

Carousel answers:

"What will people see?"

---

### Queue

Stage content.

Queue holds content waiting for publication.

Queue answers:

"What is ready to post?"

---

### Posted

Publish.

Posted represents completed execution.

Posted answers:

"What was shipped?"

---

# Intelligence

### Winners

Track performance.

Winners identifies successful content.

Winners answers:

"What worked?"

---

### Winner Lab

Study successful content.

Winner Lab breaks down:

* hooks
* structure
* pacing
* visuals
* engagement

Winner Lab answers:

"Why did it work?"

---

### Patterns

Store repeatable success.

Patterns become reusable systems.

Patterns answers:

"What repeats?"

---

### Opportunities

Identify future leverage.

Opportunities converts patterns into future direction.

Opportunities answers:

"What should we do next?"

---

# Operations

### Planner

Schedule work.

### Briefs

Provide instructions.

### Images

Manage visual assets.

### Dashboard

Command center.

---

# AI Role

AI assists Discovery and Production.

AI Scout:

* collects signals
* identifies patterns
* suggests opportunities

AI Discover:

* generates concepts
* expands angles
* creates variations

AI Production:

* drafts content
* builds structures
* generates assets

Humans remain responsible for:

* selection
* approval
* publishing
* direction

---

# Guiding Principle

Capture.
Interpret.
Choose.
Create.
Package.
Publish.
Learn.
Repeat.

GhostMedia is not a collection of pages.

GhostMedia is a media operating system.

## Core Content Model

GhostMedia does not optimize for topics.

GhostMedia optimizes for attention.

Every content opportunity is evaluated through four lenses:

### Pattern

What happened?

Examples:

* Comeback
* Rivalry
* Underdog
* Mistake
* Controversy
* Breakthrough

### Emotion

How did it feel?

Examples:

* Redemption
* Frustration
* Excitement
* Respect
* Shock
* Curiosity

### Tension

Why did people keep watching?

Examples:

* Everyone thought it was over.
* Nobody believed him.
* One mistake changed everything.
* The crowd went silent.
* The answer was not what people expected.

### Lesson

What do people take away?

Examples:

* Never count someone out.
* Small details matter.
* Discipline beats motivation.
* Pressure reveals preparation.

Pattern creates structure.

Emotion creates connection.

Tension creates attention.

Lesson creates retention.
