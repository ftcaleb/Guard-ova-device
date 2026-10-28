"""
Build the exact static font files the Guard'Ova app needs.

WHY: The design uses DM Sans and Manrope at in-between weights (450/550/650/750).
React Native cannot use variable-font axes reliably, so we "freeze" every weight
the design uses into its own static .ttf file. Using these files is what makes
the native text match the reference screenshots.

DM Sans optical size (decision D11): the prototype loads DM Sans from Google
Fonts, which serves a file with NO opsz axis, pinned at opsz 14. So the reference
renders every DM Sans string at opsz 14, whatever its font size. We do the same.

USAGE (from the repo root):
    pip install fonttools
    python design/fonts/make-static-fonts.py

OUTPUT: assets/fonts/*.ttf  plus  assets/fonts/font-map.json

NAMING (use these as the fontFamily keys in expo-font):
    DMSans-<weight>           e.g. DMSans-550       (always opsz 14)
    Manrope-<weight>          e.g. Manrope-750
    Inter-400                 (map labels only)

The Text primitive must pick the family with:
    fontFamily = family === 'Manrope' ? `Manrope-${weight}` : `DMSans-${weight}`
and must NOT also set fontWeight (the weight is baked into the file; setting
fontWeight on Android makes it synthesise bold).
"""
import json
import os
import sys
import urllib.request

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "assets", "fonts")
CACHE = os.path.join(os.path.dirname(__file__), "_source")
USED = os.path.join(os.path.dirname(__file__), "..", "fonts-used.json")

SOURCES = {
    # Official variable fonts from the google/fonts repository (OFL licence).
    "DMSans": "https://github.com/google/fonts/raw/main/ofl/dmsans/DMSans%5Bopsz,wght%5D.ttf",
    "Manrope": "https://github.com/google/fonts/raw/main/ofl/manrope/Manrope%5Bwght%5D.ttf",
    "Inter": "https://github.com/google/fonts/raw/main/ofl/inter/Inter%5Bopsz,wght%5D.ttf",
}

# Weights the CSS loads (the full set, so nothing is missing if a screen changes).
DM_WEIGHTS = [400, 450, 500, 550, 600, 650, 700]
DM_OPSZ = 14  # what Google Fonts serves, i.e. what the reference renders (D11)
MANROPE_WEIGHTS = [400, 500, 600, 650, 700, 750, 800]


def fetch(name: str) -> str:
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, f"{name}-variable.ttf")
    if not os.path.exists(path):
        print(f"Downloading {name} ...")
        urllib.request.urlretrieve(SOURCES[name], path)
    return path


def rename(font: TTFont, family: str) -> None:
    """Give each instance a unique family + PostScript name (needed on iOS)."""
    name = font["name"]
    for rec in list(name.names):
        if rec.nameID in (1, 2, 3, 4, 6, 16, 17, 21, 22, 25):
            name.removeNames(nameID=rec.nameID)
    for nid, value in ((1, family), (2, "Regular"), (3, f"{family};guardova"), (4, family), (6, family)):
        name.setName(value, nid, 3, 1, 0x409)
        name.setName(value, nid, 1, 0, 0)
    font["OS/2"].usWeightClass = 400  # weight is baked in; keep RN from synthesising
    if "STAT" in font:
        del font["STAT"]


def make(src: str, family: str, axes: dict) -> None:
    out_path = os.path.join(OUT, f"{family}.ttf")
    font = TTFont(src)
    available = {a.axisTag: (a.minValue, a.maxValue) for a in font["fvar"].axes}
    pinned = {}
    for tag, val in axes.items():
        if tag in available:
            lo, hi = available[tag]
            pinned[tag] = max(lo, min(hi, val))
    # Pin any remaining axes to their defaults so the result is fully static.
    static = instancer.instantiateVariableFont(font, pinned, inplace=False, updateFontNames=False)
    if "fvar" in static:
        static = instancer.instantiateVariableFont(static, {a.axisTag: a.defaultValue for a in static["fvar"].axes})
    rename(static, family)
    static.save(out_path)
    print("  ", os.path.relpath(out_path, ROOT))


def main() -> None:
    os.makedirs(OUT, exist_ok=True)
    used = json.load(open(USED, encoding="utf-8"))

    dm_src, mr_src, inter_src = fetch("DMSans"), fetch("Manrope"), fetch("Inter")
    print("DM Sans axes:", [(a.axisTag, a.minValue, a.maxValue) for a in TTFont(dm_src)["fvar"].axes])

    font_map = {}

    # DM Sans: the full weight set, all at opsz 14 (D11).
    missing = {(r["family"], r["weight"]) for r in used
               if (r["family"] == "DM Sans" and r["weight"] not in DM_WEIGHTS)
               or (r["family"] == "Manrope" and r["weight"] not in MANROPE_WEIGHTS)}
    if missing:
        raise RuntimeError(f"fonts-used.json needs weights not built here: {sorted(missing)}")
    print(f"Building {len(DM_WEIGHTS)} DM Sans instances (opsz {DM_OPSZ})")
    for w in DM_WEIGHTS:
        fam = f"DMSans-{w}"
        make(dm_src, fam, {"wght": w, "opsz": DM_OPSZ})
        font_map[fam] = f"./{fam}.ttf"

    print(f"Building {len(MANROPE_WEIGHTS)} Manrope instances")
    for w in MANROPE_WEIGHTS:
        fam = f"Manrope-{w}"
        make(mr_src, fam, {"wght": w})
        font_map[fam] = f"./{fam}.ttf"

    # Map labels: the prototype declares Inter 400 (opsz auto at 9-11 viewBox units).
    make(inter_src, "Inter-400", {"wght": 400, "opsz": 14})
    font_map["Inter-400"] = "./Inter-400.ttf"

    with open(os.path.join(OUT, "font-map.json"), "w", encoding="utf-8") as f:
        json.dump(font_map, f, indent=2)
    print(f"Done: {len(font_map)} files in assets/fonts (see font-map.json)")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:  # make failures obvious, never silently fall back
        print("FONT BUILD FAILED:", exc, file=sys.stderr)
        sys.exit(1)
