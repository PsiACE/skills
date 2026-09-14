// Copyright (c) 2026 OceanBase.
// SPDX-License-Identifier: Apache-2.0

export type Point = { x: number; y: number };
export type Size = { width: number; height: number };
export type Rect = Point & Size;
export type Camera = Point & {
  rx: number;
  ry: number;
  rz: number;
  scale: number;
  z: number;
  perspective: number;
};
export type CameraKey = { frame: number; camera: Camera };

export function progress(frame: number, start: number, end: number) {
  if (end <= start) throw new Error('The end frame must follow the start frame.');
  return Math.max(0, Math.min(1, (frame - start) / (end - start)));
}

export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
}

export const ease = (frame: number, start: number, end: number) => easeInOutCubic(progress(frame, start, end));

export function countAt(frame: number, start: number, end: number, from: number, to: number, curve = easeInOutCubic) {
  const t = progress(frame, start, end);
  if (t === 0) return from;
  if (t === 1) return to;
  return Math.round(from + (to - from) * Math.max(0, Math.min(1, curve(t))));
}

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
export const formatCompactCount = (count: number) => compact.format(count).toLowerCase();

export function cameraAt(frame: number, keys: readonly CameraKey[]): Camera {
  if (!keys.length) throw new Error('At least one camera key is required.');
  for (let index = 1; index < keys.length; index++) {
    if (keys[index].frame <= keys[index - 1].frame) throw new Error('Camera keys must be strictly ordered.');
  }
  if (frame <= keys[0].frame) return { ...keys[0].camera };
  for (let index = 1; index < keys.length; index++) {
    const a = keys[index - 1];
    const b = keys[index];
    if (frame <= b.frame) {
      const t = ease(frame, a.frame, b.frame);
      const result = { ...a.camera };
      for (const key of Object.keys(result) as (keyof Camera)[]) {
        result[key] += (b.camera[key] - a.camera[key]) * t;
      }
      return result;
    }
  }
  return { ...keys[keys.length - 1].camera };
}

export function project(point: Point, size: Size, camera: Camera): Point {
  const radians = Math.PI / 180;
  const a = camera.rx * radians;
  const b = camera.ry * radians;
  const c = camera.rz * radians;
  const x = point.x - size.width / 2;
  const y = point.y - size.height / 2;
  const y1 = y * Math.cos(a);
  const z1 = y * Math.sin(a);
  const x2 = x * Math.cos(b) + z1 * Math.sin(b);
  const z2 = -x * Math.sin(b) + z1 * Math.cos(b);
  const depth = camera.perspective - (z2 * camera.scale + camera.z);
  if (depth <= 0) throw new Error('The page crosses the camera near plane.');
  const factor = camera.perspective / depth;
  return {
    x: camera.x + (x2 * Math.cos(c) - y1 * Math.sin(c)) * camera.scale * factor,
    y: camera.y + (x2 * Math.sin(c) + y1 * Math.cos(c)) * camera.scale * factor,
  };
}

export const corners = (size: Size, camera: Camera) =>
  [
    { x: 0, y: 0 },
    { x: size.width, y: 0 },
    { x: size.width, y: size.height },
    { x: 0, y: size.height },
  ].map((point) => project(point, size, camera));

export function fitCamera({
  camera,
  page,
  stage,
  focus,
  target,
  inset,
}: {
  camera: Camera;
  page: Size;
  stage: Size;
  focus: Point;
  target: Point;
  inset: Point;
}): Camera {
  const inside = (point: Point) =>
    point.x >= inset.x && point.x <= stage.width - inset.x && point.y >= inset.y && point.y <= stage.height - inset.y;
  if (!inside(target) || camera.scale <= 0 || camera.perspective <= 0 || camera.z >= camera.perspective)
    throw new Error('The focal target and camera must allow a visible, safe page.');
  let candidate = { ...camera, x: 0, y: 0 };
  for (let attempt = 0; attempt < 160; attempt++) {
    try {
      const offset = project(focus, page, { ...candidate, x: 0, y: 0 });
      candidate = { ...candidate, x: target.x - offset.x, y: target.y - offset.y };
      if (corners(page, candidate).every(inside)) return candidate;
    } catch (error) {
      if (!(error instanceof Error) || !error.message.includes('near plane')) throw error;
    }
    candidate.scale *= 0.95;
  }
  throw new Error('Unable to fit the page. Move the target inward or change the camera.');
}

export const cameraTransform = (camera: Camera) =>
  `perspective(${camera.perspective}px) translateZ(${camera.z}px) rotateZ(${camera.rz}deg) rotateY(${camera.ry}deg) rotateX(${camera.rx}deg) scale(${camera.scale})`;

export function envelope(frame: number, start: number, end: number, fadeFrames: number) {
  if (fadeFrames <= 0) throw new Error('The fade duration must be positive.');
  const fade = Math.min(fadeFrames, (end - start) / 2);
  return ease(frame, start, start + fade) * (1 - ease(frame, end - fade, end));
}

export function waveOffset({
  frame,
  fps,
  start,
  end,
  amplitude,
  phase = 0,
  hz = 0.45,
  fadeFrames = 12,
}: {
  frame: number;
  fps: number;
  start: number;
  end: number;
  amplitude: number;
  phase?: number;
  hz?: number;
  fadeFrames?: number;
}) {
  return (
    Math.sin(((frame - start) / fps) * Math.PI * 2 * hz - phase) * amplitude * envelope(frame, start, end, fadeFrames)
  );
}

export function avatarLayout(
  count: number,
  columns: number,
  area: Rect,
  avatarSize: number,
  amplitude: number,
  { labelHeight = 34, gap = 6, phaseX = 0.5, phaseY = 0.4 } = {},
) {
  if (!Number.isInteger(count) || count < 0 || !Number.isInteger(columns) || columns < 1)
    throw new Error('Avatar count and columns must be nonnegative and positive integers respectively.');
  if (count === 0) return [];
  const cols = Math.min(columns, count);
  const rows = Math.ceil(count / cols);
  const pitchX = area.width / cols;
  const pitchY = area.height / rows;
  const tileHeight = avatarSize + gap + labelHeight;
  if (avatarSize <= 0 || amplitude < 0 || pitchX < avatarSize + 12 || pitchY < tileHeight + amplitude * 2)
    throw new Error('The avatar wall is too dense. Enlarge the area, reduce tile size, or split into groups.');
  return Array.from({ length: count }, (_, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const rowCount = Math.min(cols, count - row * cols);
    return {
      x: area.x + (area.width - rowCount * pitchX) / 2 + col * pitchX,
      y: area.y + row * pitchY + (pitchY - tileHeight) / 2,
      width: pitchX,
      height: tileHeight,
      phase: col * phaseX + row * phaseY,
      row,
    };
  });
}
