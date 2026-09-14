---
name: remotion-product-video
description: Create code-rendered product videos, repository milestones, and contributor showcases with Remotion. Use for DOM reconstruction, verified branding and data, safe camera moves, and frame-based motion; not for live-action editing or generative video.
---

# Remotion Product Video

Treat each frame as a React tree at a specific time. Drive the page, camera, counters, and sound from one timeline. Compose the shot before adding motion. Adapt the method to the current product rather than copying a particular repository, palette, headcount, or milestone.

## Establish the frame and facts

- Use the requested aspect ratio, duration, frame rate, and delivery format. If unspecified, 16:9, 1920x1080, 60fps, and roughly 13 seconds are useful starting points, not requirements.
- Give the subject a different aspect ratio from the output. A browser around 1180x740 can float within a widescreen brand stage; do not fill the frame just to make it larger.
- Verify the product name, URL, description, colors, wordmark, and statistics from current official sources. Preserve source URLs and capture times. Keep data separate from animation and render from a local snapshot.
- Rebuild visible page sections with DOM elements. Screenshots may inform the reconstruction but should not be the animated page surface. Original wordmarks and real contributor avatars may remain raster assets.
- Select an official color or reverse wordmark for the background contrast. Preserve its geometry and colors. The brand stage, third-party interface, and avatars each retain their own color sources; do not recolor GitHub controls to match the product palette.

## Organize the timeline by shot purpose

Define each shot's purpose, interval, required visible content, and focal point before writing effects:

| Shot | Framing requirement |
| --- | --- |
| Establish | Show the full window, address bar, and product or repository name; start around 20-35% projected frame area |
| Push | Reduce tilt and increase scale moderately while preserving the complete window |
| Action | Bring the control into focus; align the cursor and keep both identity and result readable |
| Community, when useful | Show real avatars and names, complete or explicitly grouped; motion must preserve legibility |
| Brand lockup | Separate the wordmark, milestone, one sentence, and complete URL; allow enough reading time |

Allocate duration by information density. Adding a contributor shot calls for a revised time budget, not mechanically compressing every shot. For a narrow revision, retain approved visual choices and adjust only the affected parameters and checks.

## Preserve spatial and motion invariants

- At 1080p landscape, start with window safe insets of 120px horizontally and 72px vertically, and 80px for lockup content. Scale and reassess these values for other formats.
- Interpolate establish, push, and action camera keys. Put the page, cursor, and click feedback under the same transform parent. Project any external overlay with the same matrix.
- For look-at framing, place a page point at a stage target, then inspect all projected corners. Reduce scale or move the target when necessary; do not crop the address bar to simulate a push. Untransformed element dimensions do not prove a rotated window is safe.
- Stagger block entrances with springs. Multiply breathing and avatar waves by attack/release envelopes so they enter and leave at rest rather than stopping abruptly.
- When depth of field helps, layer broad heavy blur, feathered light blur, and a soft sharp core. Move the focal region with the action and keep all simultaneously important text inside it. Avoid hard-edged clear cutouts.
- Separate numeric motion from display formatting. Ease integer counts to the exact target and use tabular numerals with stable width. Verify the target interface's current compact-number behavior and preserve narratively important threshold steps. A promotional `1K+` and a repository control's `1k` belong to different presentation layers.
- Record the animation start separately from the verified endpoint. Do not imply that a compressed growth sequence represents several real stars caused by one click. If a milestone is not reached, clearly designate a preproduced use; verify the threshold before a release render. Respect an already agreed treatment without asking again.

## Reuse only what the task needs

- When implementing, read [Component interfaces and integration](references/components.md). Copy needed files from `assets/remotion/` into the target project and adapt them to its dependencies; no full template application is required.
- For data collection, contributors, sound, or delivery, read [Data, sound, and rendering](references/production.md). These are decision criteria, not a session transcript or mandatory command sequence.

The component set contains a browser shell, a shared camera plane, an animated counter, and an avatar wave. Geometry, camera keys, safe look-at fitting, staggered springs, and envelopes are reusable helpers. The caller supplies branding, page content, titles, URLs, and factual data.

## Review before delivery

Inspect representative frames for establishment, push, click, count thresholds, community content, and lockup. Also inspect shot handoffs. For a roughly 13-second video, 0.5s / 2s / 4.2s / 7.2s / 12s are initial samples, not a substitute for sampling the actual timeline.

Check computable invariants: safe bounds throughout motion, DOM cursor/button alignment, count endpoints and key displayed values, unique contributors, and layout capacity. Do not replace visual review with tests that merely repeat the implementation.

After rendering, verify dimensions, frame rate, frame count, duration, color metadata, and audio. Extract frames from the encoded video and compare brand colors when needed. Deliver playable media, requested stills, reproducible code, and data provenance; do not deliver the entire debugging history as the methodology.
