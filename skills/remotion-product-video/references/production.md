# Data, Sound, and Rendering

## Current interfaces and facts

Keep source URLs, capture times, brand asset paths, statistics, and the content actually shown. If a field is refreshed separately, give it its own verification time rather than relabeling an older full snapshot. Use the current page and its loaded styles when the interface changes, rather than reconstructing it from memory.

For GitHub, relevant sections usually include the repository row, Star/Fork controls, navigation, files, and About. Read filenames, commits, branch, and description from the repository. Pin per-path commit lookups to one HEAD where possible. Treat exact API counts and visible labels as separate values: inspect the page text, title, and accessibility label. The bundled compact formatter is a starting point for English abbreviated counts, not a universal implementation of every platform, locale, or magnitude.

Collect network assets before rendering. Render with local images, fonts, and data so different frames cannot observe different facts. Use Remotion's loading mechanisms for fonts and asynchronous preparation. Do not drive motion from wall-clock time, unseeded randomness, or independently running CSS animations.

## Contributor walls

Collect stable IDs, usernames, and avatar URLs from official lists or paginated APIs. Follow the user's inclusion policy for bots; do not infer account identity. Cache real avatars and preserve their source URLs rather than generating replacement portraits.

Choose columns, avatar size, and grouping based on the available area. Center incomplete rows and leave room for names. If the wall becomes too dense, split it or extend the shot instead of cropping people, omitting accounts, or making them unreadable. Label group scope when relevant and verify totals and uniqueness.

Use a time phase, row/column phase offsets, and an attack/release envelope. Prefer small translations over large scale changes. Expose amplitude and frequency separately and check motion extremes. The component rejects an obviously overfull grid; review real names for wrapping and legibility as well.

## Sound

Choose a key and rhythm, then tie clicks, count accents, and transitions to the same frame cues as the visuals. A tonal pad, pentatonic riser, and short noise/sine click can work; the key need not be A major.

Use original synthesis or music with a suitable license and preserve attribution. Seed synthesized noise, fade both ends, avoid clipping, and emphasize action cues without overwhelming the sequence. Do not add narration by default. A 48kHz stereo track is a useful starting point; inspect encoded duration and the final decay.

## Rendering and color

Pin compatible React, Remotion, and renderer versions in the target project, preserving its toolchain. When changing API usage, inspect installed types and implementation first, and consult official documentation as needed.

For common social delivery, start with H.264, yuv420p, BT.709, CRF 16-20, and AAC stereo. Follow the requested platform constraints for dimensions, frame rate, and bitrate.

```ts
const encoding = {
  codec: 'h264',
  crf: 18,
  pixelFormat: 'yuv420p',
  colorSpace: 'bt709',
  imageFormat: 'png',
  audioCodec: 'aac',
  sampleRate: 48000,
} as const;
```

PNG intermediates avoid an extra lossy stage but render more slowly than JPEG. Decide from encoded-frame inspection and brand-color comparison. Do not fix a color mismatch by changing metadata alone while ignoring the actual matrix and range, or turn a machine-specific transcode workaround into a universal step.

Layered blur can dominate render time. Review a small set of stills before rendering the whole video. Broaden checks only when new changes, failures, or unresolved issues justify them. Choose browser graphics backends and concurrency from a small benchmark in the actual environment rather than prescribing one software backend.

Verify output with the available renderer and ffprobe/ffmpeg capabilities. Adapt process management, logging, waiting, and paths to the host. Deliver result parameters, provenance, usage, and material limitations rather than a command-by-command history.
