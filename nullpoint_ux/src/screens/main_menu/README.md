# Main menu (grey-box)

**Serves:** `flow.md` F1 (basic menu) and F10 (derelict background).

- Continue / New game go straight into the world (F2). Settings and Quit open their screens.
- The background stands in for a live 3D menu scene: two parallax star layers, the derelict slowly
  tumbling and drifting, and a rim of light sweeping over the hull now and then.
- **Variant `menubg`:** tumbling vs drifting without spin.

## Open
- The derelict itself: which ship, how close, how much light. The SVG is a placeholder silhouette.
- Title treatment, and what "Continue" shows (a save summary?).

## Port notes
- The background is a 3D level behind the UMG menu, not UI. The rim glint becomes real lighting.
- The vignette is a UI material (or part of the 3D scene's post-process).
