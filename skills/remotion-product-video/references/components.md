# Component Interfaces and Integration

Copy only the needed files from `assets/remotion/` into the target project. `motion.ts` has no runtime dependencies. `components.tsx` uses React and Remotion; keep the target project's compatible versions and lockfile. Preserve the included Apache-2.0 license when redistributing the source.

## Coordinate and time contract

- Dimensions and translations are pixels in the composition coordinate space. Camera rotations are degrees; wave phases are radians; wave frequency is cycles per second.
- Frame arguments use the same local timeline as `useCurrentFrame()`. Inside a Remotion `Sequence`, account for its offset rather than mixing local and absolute frame numbers.
- A page point is relative to the window's top-left corner, including browser chrome. A stage point is relative to the composition's top-left corner.
- Mount `CameraPlane` inside a positioned container with the exact `stage` dimensions used by `fitCamera`. Extra parent transforms must also be included in projection or final DOM verification.
- Derive frame counts from the composition fps. Avatar fade and row stagger accept seconds; camera keys and counter endpoints accept frames.

## Public interfaces

| Export | Required inputs | Optional controls and defaults |
| --- | --- | --- |
| `BrowserWindow` | `size`, `url`, `children` | `background`; `toolbar` replaces the address area; `chrome` overrides height 44px, radius 16px, background, border/text colors, and shadow |
| `CameraPlane` | `size`, `camera`, `children` | Omit `focus` for one sharp layer. With focus, provide stage `point`, `radiusX`, `radiusY`; adjust `baseBlur` 4px, `middleBlur` 1.3px, `featherScale` 1.5 |
| `AnimatedCounter` | `from`, `to`, `startFrame`, `endFrame` | `format` defaults to exact digits, `easing` to cubic ease-in-out, `minWidth` to 5ch; color and typography inherit |
| `AvatarWave` | `people`, `area`, `columns`, `startFrame`, `endFrame`, `textColor` | Avatar size 64px, amplitude 8px, frequency 0.45Hz, font size 13px, label budget 2 lines, gap 6px, fade 0.2s, row delay 1/30s, column/row phases 0.5/0.4 radians |
| `cameraAt` | `frame`, ordered `{frame, camera}` keys | Interpolates each segment; clamps outside the supplied timeline |
| `fitCamera` | `camera`, `page`, `stage`, `focus`, `target`, `inset` | Preserves look-at while reducing scale; throws if safe fitting is impossible |
| `project`, `corners` | Page geometry and camera | Use the exact same perspective/rotation convention as `CameraPlane` |
| `dockStyle` | `frame`, `fps`, `order` | Options: `delayFrames` 6, `distance` 46px, spring `damping` 15, `stiffness` 155, `mass` 0.85 |
| `waveOffset` | `frame`, `fps`, `start`, `end`, `amplitude` | `phase`, `hz`, and `fadeFrames`; zero offset outside the active interval |
| `countAt`, `formatCompactCount` | Numeric timing or value | Separate numeric endpoints from formatting; compact helper uses English suffixes |

`Camera` supplies `x`, `y`, `rx`, `ry`, `rz`, `scale`, `z`, and `perspective`. Keep perspective positive and the page in front of the near plane. `fitCamera` only reduces scale: select a sensible establishing size before fitting rather than expecting it to enlarge the subject.

Counter endpoints should be integers. A custom easing maps progress from 0 to 1; verify monotonicity and important displayed steps for the chosen interval. The component clamps exact endpoints independently of the easing callback. Verify the target platform's compact formatting before choosing `formatCompactCount`.

`AvatarWave.people` accepts `{id, name, src}` with stable unique IDs and locally resolved `src` values, typically from `staticFile()`. Its area excludes titles and logos. `labelLines` reserves space; it does not silently clip names or guarantee that every name fits. Inspect actual name boxes and wrapping. Enlarge the area, adjust columns/type size, or group contributors if they exceed the budget. Grid capacity checks include maximum wave displacement.

## Integrating a camera and counter

This is an integration fragment. The current task supplies `brand`, `repository`, `timeline`, `cameraKeys`, `actionPoint`, `cursorPoint`, and the page/cursor components; it is not a fictional product scene.

```tsx
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {AnimatedCounter, BrowserWindow, CameraPlane, dockStyle} from './components';
import {cameraAt, fitCamera, formatCompactCount, project} from './motion';

const frame = useCurrentFrame();
const {width, height, fps} = useVideoConfig();
const stage = {width, height};
const page = {width: 1184, height: 740};
const camera = fitCamera({
  camera: cameraAt(frame, cameraKeys),
  page,
  stage,
  focus: actionPoint,
  target: {x: width * 2 / 3, y: height / 3},
  inset: {x: width / 16, y: height / 15},
});

return (
  <AbsoluteFill style={{backgroundColor: brand.background}}>
    <CameraPlane
      size={page}
      camera={camera}
      focus={{point: project(actionPoint, page, camera), radiusX: width * 0.47, radiusY: height * 0.46}}
    >
      <BrowserWindow size={page} url={repository.url} chrome={{height: 44}}>
        <RepositoryPage style={dockStyle(frame, fps, 0, {delayFrames: Math.round(fps * 0.1)})}>
          <AnimatedCounter
            from={timeline.countFrom}
            to={repository.stars}
            startFrame={timeline.click}
            endFrame={timeline.countEnd}
            format={formatCompactCount}
          />
        </RepositoryPage>
      </BrowserWindow>
      <Cursor style={{position: 'absolute', left: cursorPoint.x, top: cursorPoint.y}} />
    </CameraPlane>
  </AbsoluteFill>
);
```

An establishing shot normally points the page center at the stage center. Interpolate `focus` and `target` when moving into look-at framing to avoid a jump. Include later transition scale/translation in bounds checks, or measure the final transformed DOM corners.

`CameraPlane` repeats its children for depth layers. Keep those children declarative, use locally cached assets, and avoid duplicated DOM IDs or side effects. Use data attributes for alignment audits and scope queries to one layer.

## Integrating a contributor wall

```tsx
<AvatarWave
  people={contributors}
  area={{x: 160, y: 320, width: 1600, height: 620}}
  columns={12}
  startFrame={timeline.wallStart}
  endFrame={timeline.wallEnd}
  avatarSize={64}
  amplitude={8}
  hz={0.45}
  fadeSeconds={0.2}
  rowDelaySeconds={0.04}
  fontSize={13}
  labelLines={2}
  textColor={brand.foreground}
/>
```

These dimensions are an example at 1080p, not a fixed 56-person layout. Recompute the region and density from the composition and actual number of contributors.

## Validation

The accompanying behavioral tests cover projection, safe look-at fitting through a camera move, numeric thresholds, wave envelopes, and grid capacity. Run them in a project with TypeScript execution support:

```bash
npx tsx --test path/to/motion.test.ts
```

Also typecheck the copied components against the target dependencies and inspect a small render with both default and changed parameters. Pixel geometry tests do not replace checking real text, cursor anchors, brand contrast, or the final encoded output.
