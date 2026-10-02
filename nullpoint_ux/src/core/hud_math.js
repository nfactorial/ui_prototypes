// Pure HUD maths. No DOM — ports to C++ alongside the HUD widget.

// Place a contact on screen, or clamp it to the screen edge as an off-screen pip.
//   u, v    normalised screen position (0..1 is on screen), i.e. the result of
//           ProjectWorldLocationToScreen divided by the viewport size
//   behind  dot(cameraForward, toTarget) < 0 — the projection is flipped, so the
//           direction must be mirrored (space/18 §4: "the bug in every first
//           implementation")
//   w, h    the canvas size in Slate units
//   inset   distance of the pip from the screen edge
// Returns { x, y, onScreen, angle } where angle (radians) points from screen
// centre towards the target, for rotating the pip's arrow.
export function placeContact(u, v, behind, w, h, inset) {
  const onScreen = !behind && u >= 0 && u <= 1 && v >= 0 && v <= 1;
  if (onScreen) return { x: u * w, y: v * h, onScreen: true, angle: 0 };

  let dx = u * w - w / 2;
  let dy = v * h - h / 2;
  if (behind) { dx = -dx; dy = -dy; }
  if (dx === 0 && dy === 0) dy = 1; // dead astern: point down

  const hw = w / 2 - inset;
  const hh = h / 2 - inset;
  const s = Math.min(hw / Math.abs(dx || 1e-6), hh / Math.abs(dy || 1e-6));
  return { x: w / 2 + dx * s, y: h / 2 + dy * s, onScreen: false, angle: Math.atan2(dy, dx) };
}
