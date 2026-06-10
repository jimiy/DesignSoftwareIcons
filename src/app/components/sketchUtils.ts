/**
 * Sketch Drawing Utilities
 * Provides point smoothing, SVG path generation, and canvas rendering helpers
 * for the sketch-to-icon conversion feature.
 */

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  points: Point[];
  color: string;
  width: number;
}

/**
 * Smooth a set of raw points using Chaikin's corner-cutting algorithm.
 * Produces a softer, more natural curve from hand-drawn input.
 */
export function smoothPoints(points: Point[], iterations = 2): Point[] {
  if (points.length < 3) return points;

  let result = [...points];
  for (let iter = 0; iter < iterations; iter++) {
    const smoothed: Point[] = [result[0]];
    for (let i = 0; i < result.length - 1; i++) {
      const p0 = result[i];
      const p1 = result[i + 1];
      smoothed.push({
        x: 0.75 * p0.x + 0.25 * p1.x,
        y: 0.75 * p0.y + 0.25 * p1.y,
      });
      smoothed.push({
        x: 0.25 * p0.x + 0.75 * p1.x,
        y: 0.25 * p0.y + 0.75 * p1.y,
      });
    }
    smoothed.push(result[result.length - 1]);
    result = smoothed;
  }
  return result;
}

/**
 * Convert an array of points into an SVG path string using
 * quadratic Bezier curves for smooth, natural-looking strokes.
 */
export function pointsToSvgPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y} L ${points[0].x} ${points[0].y}`;
  }
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length - 1; i++) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;
    path += ` Q ${points[i].x} ${points[i].y} ${midX} ${midY}`;
  }

  const last = points[points.length - 1];
  path += ` L ${last.x} ${last.y}`;

  return path;
}

/**
 * Normalize strokes to fit within a square viewBox (0..size).
 * Centers the drawing and scales it to fill the area with some padding.
 */
export function normalizeStrokes(
  strokes: Stroke[],
  targetSize: number,
  padding = 0.12
): Stroke[] {
  if (strokes.length === 0) return [];

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const s of strokes) {
    for (const p of s.points) {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    }
  }

  const drawW = maxX - minX || 1;
  const drawH = maxY - minY || 1;
  const pad = targetSize * padding;
  const usable = targetSize - pad * 2;
  const scale = Math.min(usable / drawW, usable / drawH);

  const cx = (maxX + minX) / 2;
  const cy = (maxY + minY) / 2;
  const halfTarget = targetSize / 2;

  return strokes.map((s) => ({
    ...s,
    points: s.points.map((p) => ({
      x: (p.x - cx) * scale + halfTarget,
      y: (p.y - cy) * scale + halfTarget,
    })),
  }));
}

/**
 * Generate complete SVG inner content from strokes.
 * This produces <path> elements suitable for embedding inside an icon <svg>.
 */
export function strokesToSvgContent(
  strokes: Stroke[],
  viewBoxSize = 52
): string {
  const normalized = normalizeStrokes(strokes, viewBoxSize, 0.1);
  return normalized
    .map((stroke) => {
      const smoothed = smoothPoints(stroke.points, 2);
      const pathData = pointsToSvgPath(smoothed);
      return `<path d="${pathData}" stroke="white" stroke-width="${Math.max(1.5, stroke.width * (viewBoxSize / 300))}" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-opacity="0.9"/>`;
    })
    .join("\n");
}

/**
 * Generate a simple procedural geometric SVG icon from a seed string.
 * Used as fallback when no keyword match is found for the user's text input.
 */
export function generateProceduralIcon(seed: string): string {
  // Simple hash for deterministic but varied output
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  const abs = Math.abs(hash);

  const shapes: string[] = [];
  const shapeCount = 3 + (abs % 4); // 3-6 shapes

  for (let i = 0; i < shapeCount; i++) {
    const val = Math.abs(hash * (i + 1) * 7919) % 1000;
    const opacity = 0.3 + (val % 60) / 100;
    const cx = 10 + (val % 32);
    const cy = 10 + ((val * 3) % 32);

    const shapeType = val % 4;

    if (shapeType === 0) {
      // Circle
      const r = 3 + (val % 8);
      shapes.push(
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="white" fill-opacity="${opacity.toFixed(2)}"/>`
      );
    } else if (shapeType === 1) {
      // Rounded rect
      const w = 4 + (val % 12);
      const h = 4 + ((val * 2) % 10);
      const rx = 1 + (val % 3);
      shapes.push(
        `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${rx}" fill="white" fill-opacity="${opacity.toFixed(2)}"/>`
      );
    } else if (shapeType === 2) {
      // Line
      const x2 = cx + 5 + (val % 12);
      const y2 = cy + 3 + ((val * 5) % 10);
      shapes.push(
        `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-opacity="${opacity.toFixed(2)}"/>`
      );
    } else {
      // Diamond / polygon
      const s = 3 + (val % 6);
      const pts = `${cx},${cy - s} ${cx + s},${cy} ${cx},${cy + s} ${cx - s},${cy}`;
      shapes.push(
        `<polygon points="${pts}" fill="white" fill-opacity="${opacity.toFixed(2)}"/>`
      );
    }
  }

  return shapes.join("\n    ");
}
