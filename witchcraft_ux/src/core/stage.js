// The stage: a fixed reference resolution in Slate units, scaled to fit the
// browser window. The UI root inside it is laid out at (stage ÷ HUD scale) and
// scaled back up — the same way Unreal applies its DPI / application scale.

export const REF_HEIGHT = 1080; // Slate DPI scale is 1.0 at 1080 on the short side

export const ASPECTS = {
  '16:9': 16 / 9,
  '16:10': 16 / 10,
  '21:9': 64 / 27, // 2520 × 1080
  '32:9': 32 / 9,
  '4:3': 4 / 3,
};

export function createStage({ viewport, stage, uiRoot, backdrop, safeRect }) {
  let opts = { aspect: '16:9', scale: 1, safe: 0, margin: 16 };
  let stageSize = { w: 1920, h: 1080 };
  let uiSize = { w: 1920, h: 1080 };
  const listeners = new Set();

  function layout() {
    const w = Math.round(REF_HEIGHT * (ASPECTS[opts.aspect] ?? ASPECTS['16:9']));
    const h = REF_HEIGHT;
    stageSize = { w, h };
    stage.style.width = `${w}px`;
    stage.style.height = `${h}px`;

    const m = opts.margin;
    const fit = Math.min((viewport.clientWidth - m) / w, (viewport.clientHeight - m) / h);
    stage.style.transform = `translate(-50%, -50%) scale(${Math.max(fit, 0.05)})`;

    const s = opts.scale;
    uiSize = { w: w / s, h: h / s };
    uiRoot.style.width = `${uiSize.w}px`;
    uiRoot.style.height = `${uiSize.h}px`;
    uiRoot.style.transform = `scale(${s})`;

    // Safe zone: a fraction of the screen on each side, expressed in UI units.
    const sx = (w * opts.safe) / s;
    const sy = (h * opts.safe) / s;
    uiRoot.style.setProperty('--safe-l', `${sx}px`);
    uiRoot.style.setProperty('--safe-r', `${sx}px`);
    uiRoot.style.setProperty('--safe-t', `${sy}px`);
    uiRoot.style.setProperty('--safe-b', `${sy}px`);
    Object.assign(safeRect.style, {
      left: `${w * opts.safe}px`, right: `${w * opts.safe}px`,
      top: `${h * opts.safe}px`, bottom: `${h * opts.safe}px`,
    });

    listeners.forEach((fn) => fn(uiSize));
  }

  new ResizeObserver(layout).observe(viewport);

  return {
    configure(next) {
      opts = { ...opts, ...next };
      layout();
    },
    setBackdrop(bd) {
      backdrop.style.backgroundImage = bd?.src ? `url("${bd.src}")` : 'none';
      backdrop.style.backgroundColor = bd?.color ?? '#000';
    },
    get stageSize() { return stageSize; },
    get uiSize() { return uiSize; },
    onResize(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}
