// Copyright (c) 2026 OceanBase.
// SPDX-License-Identifier: Apache-2.0

import assert from 'node:assert/strict';
import test from 'node:test';
import {
  avatarLayout,
  cameraAt,
  corners,
  countAt,
  fitCamera,
  formatCompactCount,
  project,
  waveOffset,
  type Camera,
} from './motion';

const page = { width: 1184, height: 740 };
const stage = { width: 1920, height: 1080 };
const inset = { x: 120, y: 72 };
const base: Camera = { x: 960, y: 540, rx: 0, ry: 0, rz: 0, scale: 1, z: 0, perspective: 2400 };

test('identity and quarter-turn projections keep the expected points', () => {
  assert.deepEqual(project({ x: 592, y: 370 }, page, base), { x: 960, y: 540 });
  assert.deepEqual(project({ x: 0, y: 0 }, page, base), { x: 368, y: 170 });
  const point = project({ x: 692, y: 370 }, page, { ...base, rz: 90 });
  assert(Math.hypot(point.x - 960, point.y - 640) < 1e-8);
});

test('moving cameras preserve the look-at point and all safe corners', () => {
  const keys = [
    { frame: 0, camera: { ...base, rx: 18, ry: -22, rz: -6, scale: 1.3 } },
    { frame: 90, camera: { ...base, rx: 6, ry: -8, rz: -2, scale: 1.6 } },
    { frame: 180, camera: { ...base, rx: 3, ry: -2, rz: 0, scale: 1.1 } },
  ];
  const focus = { x: 1043, y: 152 };
  const target = { x: 1280, y: 360 };
  for (let frame = 0; frame <= 180; frame++) {
    const camera = fitCamera({ camera: cameraAt(frame, keys), page, stage, focus, target, inset });
    const point = project(focus, page, camera);
    assert(Math.hypot(point.x - target.x, point.y - target.y) < 1e-8);
    for (const corner of corners(page, camera)) {
      assert(corner.x >= 120 && corner.x <= 1800 && corner.y >= 72 && corner.y <= 1008);
    }
  }
  assert.throws(() => fitCamera({ camera: base, page, stage, focus, target: { x: 0, y: 0 }, inset }));
});

test('counts clamp at their endpoints and show the milestone threshold', () => {
  const values = Array.from({ length: 201 }, (_, frame) => countAt(frame, 20, 152, 995, 1003));
  assert.equal(values[0], 995);
  assert.equal(values.at(-1), 1003);
  assert(values.every((value, index) => index === 0 || value >= values[index - 1]));
  for (const expected of ['995', '996', '997', '998', '999', '1k'])
    assert(values.map(formatCompactCount).includes(expected));
});

test('waves start and stop at rest and do not exceed their amplitude', () => {
  const parameters = { fps: 60, start: 20, end: 200, amplitude: 8, phase: 0.8, fadeFrames: 12 };
  for (let frame = 0; frame <= 220; frame++) {
    const value = waveOffset({ ...parameters, frame });
    assert(Math.abs(value) <= 8);
    if (frame <= 20 || frame >= 200) assert(Math.abs(value) < 1e-8);
  }
  const sixty = waveOffset({ ...parameters, frame: 100 });
  const thirty = waveOffset({ ...parameters, fps: 30, start: 10, end: 100, frame: 50, fadeFrames: 6 });
  assert(Math.abs(sixty - thirty) < 1e-8);
});

test('avatar rows remain centered and safe at both wave extremes', () => {
  const area = { x: 160, y: 320, width: 1600, height: 620 };
  const tiles = avatarLayout(56, 12, area, 64, 8);
  assert.equal(tiles.length, 56);
  for (const tile of tiles) {
    assert(tile.x >= area.x && tile.x + tile.width <= area.x + area.width + 1e-8);
    assert(tile.y - 8 >= area.y && tile.y + tile.height + 8 <= area.y + area.height);
  }
  const last = tiles.slice(48);
  assert(Math.abs((last[0].x + last.at(-1)!.x + last[0].width) / 2 - (area.x + area.width / 2)) < 1e-8);
  assert.throws(() => avatarLayout(120, 12, area, 64, 8));
});
