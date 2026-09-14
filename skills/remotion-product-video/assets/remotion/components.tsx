// Copyright (c) 2026 OceanBase.
// SPDX-License-Identifier: Apache-2.0

import React, { type CSSProperties, type ReactNode } from 'react';
import { AbsoluteFill, Img, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  avatarLayout,
  cameraTransform,
  countAt,
  ease,
  envelope,
  waveOffset,
  type Camera,
  type Point,
  type Rect,
  type Size,
} from './motion';

export function dockStyle(
  frame: number,
  fps: number,
  order: number,
  { delayFrames = 6, distance = 46, damping = 15, stiffness = 155, mass = 0.85 } = {},
): CSSProperties {
  const value = spring({ frame: frame - order * delayFrames, fps, config: { damping, stiffness, mass } });
  return { opacity: Math.max(0, Math.min(1, value)), transform: `translateY(${(value - 1) * distance}px)` };
}

export type BrowserChrome = {
  height: number;
  radius: number;
  background: string;
  borderColor: string;
  textColor: string;
  shadow: string;
};

export function BrowserWindow({
  size,
  url,
  children,
  toolbar,
  chrome,
  background = '#fff',
}: {
  size: Size;
  url: string;
  children: ReactNode;
  toolbar?: ReactNode;
  chrome?: Partial<BrowserChrome>;
  background?: string;
}) {
  const appearance = {
    height: 44,
    radius: 16,
    background: '#ededed',
    borderColor: '#d4d4d4',
    textColor: '#555',
    shadow: '0 24px 70px #0003',
    ...chrome,
  };
  if (appearance.height <= 0 || appearance.height >= size.height)
    throw new Error('Browser chrome must fit inside the window.');
  return (
    <div
      style={{ ...size, borderRadius: appearance.radius, overflow: 'hidden', background, boxShadow: appearance.shadow }}
    >
      <div
        style={{
          height: appearance.height,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: '0 20px',
          background: appearance.background,
          borderBottom: `1px solid ${appearance.borderColor}`,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((color) => (
            <span key={color} style={{ width: 11, height: 11, borderRadius: '50%', background: color }} />
          ))}
        </div>
        {toolbar ?? (
          <div
            style={{
              flex: 1,
              marginRight: 53,
              textAlign: 'center',
              color: appearance.textColor,
              fontSize: 14,
              whiteSpace: 'nowrap',
            }}
          >
            {url}
          </div>
        )}
      </div>
      <div style={{ position: 'relative', height: size.height - appearance.height }}>{children}</div>
    </div>
  );
}

export function CameraPlane({
  size,
  camera,
  children,
  focus,
}: {
  size: Size;
  camera: Camera;
  children: ReactNode;
  focus?: {
    point: Point;
    radiusX: number;
    radiusY: number;
    baseBlur?: number;
    middleBlur?: number;
    featherScale?: number;
  };
}) {
  const mask = (factor: number) =>
    focus &&
    `radial-gradient(ellipse ${focus.radiusX * factor}px ${focus.radiusY * factor}px at ${focus.point.x}px ${focus.point.y}px, black 6%, rgba(0,0,0,.97) 50%, rgba(0,0,0,.65) 76%, transparent 100%)`;
  const layers = focus
    ? [
        { blur: focus.baseBlur ?? 4 },
        { blur: focus.middleBlur ?? 1.3, mask: mask(focus.featherScale ?? 1.5) },
        { blur: 0, mask: mask(1) },
      ]
    : [{ blur: 0 }];
  return (
    <AbsoluteFill>
      {layers.map((layer, index) => (
        <AbsoluteFill
          key={index}
          aria-hidden={index > 0 || undefined}
          style={{
            filter: layer.blur ? `blur(${layer.blur}px)` : undefined,
            maskImage: layer.mask,
            WebkitMaskImage: layer.mask,
          }}
        >
          <div
            style={{
              position: 'absolute',
              ...size,
              left: camera.x - size.width / 2,
              top: camera.y - size.height / 2,
              transform: cameraTransform(camera),
              transformOrigin: 'center center',
            }}
          >
            {children}
          </div>
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
}

export function AnimatedCounter({
  from,
  to,
  startFrame,
  endFrame,
  format = String,
  easing,
  minWidth = '5ch',
}: {
  from: number;
  to: number;
  startFrame: number;
  endFrame: number;
  format?: (value: number) => string;
  easing?: (progress: number) => number;
  minWidth?: CSSProperties['minWidth'];
}) {
  const count = countAt(useCurrentFrame(), startFrame, endFrame, from, to, easing);
  return (
    <span
      title={count.toLocaleString('en-US')}
      aria-label={String(count)}
      style={{ display: 'inline-block', minWidth, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}
    >
      {format(count)}
    </span>
  );
}

export type Person = { id: string | number; name: string; src: string };

export function AvatarWave({
  people,
  area,
  columns,
  startFrame,
  endFrame,
  textColor,
  avatarSize = 64,
  amplitude = 8,
  hz = 0.45,
  fontSize = 13,
  labelLines = 2,
  gap = 6,
  fadeSeconds = 0.2,
  rowDelaySeconds = 1 / 30,
  phaseX = 0.5,
  phaseY = 0.4,
}: {
  people: readonly Person[];
  area: Rect;
  columns: number;
  startFrame: number;
  endFrame: number;
  textColor: string;
  avatarSize?: number;
  amplitude?: number;
  hz?: number;
  fontSize?: number;
  labelLines?: number;
  gap?: number;
  fadeSeconds?: number;
  rowDelaySeconds?: number;
  phaseX?: number;
  phaseY?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lineHeight = fontSize * 1.25;
  const tiles = avatarLayout(people.length, columns, area, avatarSize, amplitude, {
    labelHeight: lineHeight * labelLines,
    gap,
    phaseX,
    phaseY,
  });
  if (new Set(people.map((person) => person.id)).size !== people.length)
    throw new Error('Contributor IDs must be unique.');
  if (fontSize <= 0 || labelLines < 1 || gap < 0 || fadeSeconds <= 0 || rowDelaySeconds < 0)
    throw new Error('Avatar typography and timing must use positive sizes and nonnegative spacing.');
  const fadeFrames = Math.min(fadeSeconds * fps, (endFrame - startFrame) / 4);
  return (
    <AbsoluteFill style={{ opacity: envelope(frame, startFrame, endFrame, fadeFrames) }}>
      {people.map((person, index) => {
        const tile = tiles[index];
        const delay = Math.min(tile.row * rowDelaySeconds * fps, fadeFrames);
        const wave = waveOffset({
          frame,
          fps,
          start: startFrame,
          end: endFrame,
          amplitude,
          hz,
          phase: tile.phase,
          fadeFrames,
        });
        return (
          <div
            key={person.id}
            data-contributor={person.id}
            style={{
              position: 'absolute',
              left: tile.x,
              top: tile.y + wave,
              width: tile.width,
              height: tile.height,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap,
              color: textColor,
              opacity: ease(frame, startFrame + delay, startFrame + delay + fadeFrames),
            }}
          >
            <Img
              src={person.src}
              alt={person.name}
              style={{ width: avatarSize, height: avatarSize, objectFit: 'cover', borderRadius: '50%' }}
            />
            <span
              style={{
                width: tile.width - 12,
                fontSize,
                lineHeight: `${lineHeight}px`,
                textAlign: 'center',
                overflowWrap: 'anywhere',
              }}
            >
              {person.name}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}
