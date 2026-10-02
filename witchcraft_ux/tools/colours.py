"""Print the Hedgewitch colours as UMG/Slate-ready markdown tables.

    python tools/colours.py > documents/colours_generated.md    (or paste into build_list.md)

Reads styles/themes/hedgewitch.css, styles/tokens.css and a few fixed widget colours,
so the numbers can't drift from what's on screen. For each colour:
  Hex sRGB   what to paste into the UMG colour picker's "Hex sRGB" field (RRGGBBAA)
  Linear     FLinearColor(R, G, B, A) for C++ style sets (sRGB -> linear, alpha unchanged)
"""
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(__file__).resolve().parent.parent


def parse(value):
    value = value.strip()
    m = re.fullmatch(r'#([0-9a-fA-F]{6})', value)
    if m:
        h = m.group(1)
        return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), 1.0
    m = re.fullmatch(r'rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)', value)
    if m:
        return int(m.group(1)), int(m.group(2)), int(m.group(3)), float(m.group(4) or 1)
    return None


def lin(c):
    c /= 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def row(name, use, value):
    rgba = parse(value)
    if not rgba:
        return None
    r, g, b, a = rgba
    hexa = f'{r:02X}{g:02X}{b:02X}{round(a * 255):02X}'
    fl = f'FLinearColor({lin(r):.4f}, {lin(g):.4f}, {lin(b):.4f}, {a:.2f})'
    return f'| `{name}` | {use} | `{hexa}` | {a:.2f} | `{fl}` |'


def css_vars(path, selector_hint=''):
    text = (ROOT / path).read_text(encoding='utf-8')
    out = {}
    for name, val, comment in re.findall(r'(--[\w-]+):\s*([^;]+);[ \t]*(?:/\*\s*(.*?)\s*\*/)?', text):
        out[name] = (val.strip(), comment)
    return out


USES = {
    '--th-panel': 'Panels (over the world)', '--th-panel-solid': 'Opaque panels, tooltips, book pages',
    '--th-raise': 'Buttons, cards, slots', '--th-raise-hi': 'Focused / hovered button or card',
    '--th-line': 'Borders', '--th-line-hi': 'Strong borders, placeholders',
    '--th-backing': 'Book backing (over the blurred world)', '--th-backing-solid': 'Book backing, full-screen spread',
    '--th-scrim': 'Behind pause and modals', '--th-text': 'Text', '--th-dim': 'Secondary text',
    '--th-faint': 'Disabled / placeholder text', '--th-accent': 'Selection, focus, active tab (hat-brim gold)',
    '--th-primary-bg': 'Primary button fill', '--th-primary-text': 'Primary button text',
    '--th-good': 'Good / collected / caught (moss)', '--th-warn': 'Warnings, reagent costs', '--th-power': 'Milestone banner',
    '--th-speech': 'Dialogue box (approved 2026-09-29)', '--th-speech-hi': 'Hovered reply',
}
HEADER = '| Name | Use | Hex sRGB (RRGGBBAA) | Alpha | Linear (C++) |\n|---|---|---|---|---|'

print('#### Hedgewitch style set (`styles/themes/hedgewitch.css`)\n')
print(HEADER)
for name, (val, comment) in css_vars('styles/themes/hedgewitch.css').items():
    r = row(name, USES.get(name, comment or ''), val)
    if r:
        print(r)
print(row('label', 'Small-caps labels (decoration rule)', '#cdb47c'))

print('\n#### Game data colours (`styles/tokens.css`): the same in every look\n')
print(HEADER)
for name, (val, comment) in css_vars('styles/tokens.css').items():
    r = row(name, comment or ('Colour affinity' if 'aff' in name else 'Fish rarity' if 'rar' in name else ''), val)
    if r:
        print(r)

print('\n#### Fixed widget colours\n')
print(HEADER)
for name, use, val in [
    ('world-text', 'Text on the 3D view (prompt, zone banner)', '#fffaf0'),
    ('world-text-shadow', 'Its shadow (offset 0,1; the soft glow is a material)', 'rgba(0, 0, 0, 0.75)'),
    ('key-cap', 'Keyboard glyph fill', 'rgba(255, 250, 240, 0.92)'),
    ('key-cap-text', 'Keyboard glyph text', '#2a1f18'),
    ('pad-cap', 'Gamepad glyph fill', 'rgba(40, 34, 28, 0.9)'),
    ('pad-a', 'Gamepad A', '#7fd06a'), ('pad-b', 'Gamepad B', '#f07060'),
    ('pad-x', 'Gamepad X', '#6ab0f0'), ('pad-y', 'Gamepad Y', '#f0c850'),
    ('villager-hazel', 'Hazel: name tag, highlighted words', '#d98a4e'),
    ('frame-polaroid', 'Photo frame: polaroid', '#f7f3ea'), ('frame-postcard', 'Photo frame: postcard', '#efe4c8'),
    ('frame-pressed', 'Photo frame: pressed flowers mount', '#3b2c20'), ('caption-ink', 'Handwritten caption', '#3a2c1e'),
]:
    print(row(name, use, val))
