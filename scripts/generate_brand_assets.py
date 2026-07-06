from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


PRIMARY_HEX = "#0F4C81"
SECONDARY_HEX = "#FF8C00"
WHITE_HEX = "#FFFFFF"

PRIMARY = (15, 76, 129, 255)
SECONDARY = (255, 140, 0, 255)
WHITE = (255, 255, 255, 255)
TRANSPARENT = (255, 255, 255, 0)

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
ASSETS.mkdir(parents=True, exist_ok=True)

PALATINO_BOLD = r"C:\Windows\Fonts\palab.ttf"
SEGOE_SEMIBOLD = r"C:\Windows\Fonts\seguisb.ttf"
SEGOE_BOLD = r"C:\Windows\Fonts\segoeuib.ttf"


def rgba_to_hex(color: tuple[int, int, int, int]) -> str:
    return "#{:02X}{:02X}{:02X}".format(*color[:3])


def draw_tracked_text(
    draw: ImageDraw.ImageDraw,
    origin: tuple[float, float],
    text: str,
    font: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int, int],
    tracking: float,
) -> None:
    x, y = origin
    for char in text:
        draw.text((x, y), char, fill=fill, font=font)
        if char != " ":
            left, top, right, bottom = font.getbbox(char)
            x += (right - left) + tracking
        else:
            x += tracking * 2.4


def draw_logo_mark(
    draw: ImageDraw.ImageDraw,
    origin: tuple[int, int],
    scale: float,
    line_color: tuple[int, int, int, int],
    accent_color: tuple[int, int, int, int],
    inner_color: tuple[int, int, int, int],
) -> None:
    ox, oy = origin

    def pt(x: float, y: float) -> tuple[float, float]:
        return (ox + x * scale, oy + y * scale)

    stroke = max(4, int(12 * scale))

    globe_bounds = [*pt(68, 66), *pt(224, 222)]
    draw.ellipse(globe_bounds, outline=line_color, width=stroke)

    draw.arc([*pt(98, 66), *pt(194, 222)], start=90, end=270, fill=line_color, width=stroke)
    draw.arc([*pt(98, 66), *pt(194, 222)], start=-90, end=90, fill=line_color, width=stroke)

    draw.arc([*pt(74, 102), *pt(218, 152)], start=180, end=360, fill=line_color, width=stroke)
    draw.arc([*pt(74, 136), *pt(218, 186)], start=0, end=180, fill=line_color, width=stroke)
    draw.arc([*pt(86, 86), *pt(206, 126)], start=180, end=360, fill=line_color, width=stroke)
    draw.arc([*pt(86, 168), *pt(206, 208)], start=0, end=180, fill=line_color, width=stroke)

    draw.line(
        [pt(38, 182), pt(94, 206), pt(126, 200), pt(152, 186)],
        fill=(accent_color[0], accent_color[1], accent_color[2], 102),
        width=max(3, int(8 * scale)),
        joint="curve",
    )

    plane_points = [
        pt(48, 190),
        pt(112, 176),
        pt(212, 96),
        pt(232, 114),
        pt(182, 188),
        pt(242, 200),
        pt(264, 224),
        pt(172, 214),
        pt(150, 278),
        pt(124, 286),
        pt(130, 218),
        pt(82, 222),
    ]
    draw.polygon(plane_points, fill=accent_color)

    pin_top = [*pt(188, 202), *pt(284, 298)]
    draw.ellipse(pin_top, fill=accent_color)
    draw.polygon([pt(236, 330), pt(192, 252), pt(280, 252)], fill=accent_color)
    draw.ellipse([*pt(214, 228), *pt(258, 272)], fill=inner_color)


def build_mark_svg(line_hex: str, accent_hex: str, inner_hex: str, title: str) -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 340" fill="none" role="img" aria-labelledby="markTitle">
  <title id="markTitle">{title}</title>
  <circle cx="146" cy="144" r="78" stroke="{line_hex}" stroke-width="12"/>
  <path d="M146 66C114 92 114 196 146 222" stroke="{line_hex}" stroke-width="12" stroke-linecap="round"/>
  <path d="M146 66C178 92 178 196 146 222" stroke="{line_hex}" stroke-width="12" stroke-linecap="round"/>
  <path d="M74 127C110 117 182 117 218 127" stroke="{line_hex}" stroke-width="12" stroke-linecap="round"/>
  <path d="M74 161C110 173 182 173 218 161" stroke="{line_hex}" stroke-width="12" stroke-linecap="round"/>
  <path d="M86 107C116 101 176 101 206 107" stroke="{line_hex}" stroke-width="12" stroke-linecap="round"/>
  <path d="M86 181C116 189 176 189 206 181" stroke="{line_hex}" stroke-width="12" stroke-linecap="round"/>
  <path d="M38 182C94 206 126 200 152 186" stroke="{accent_hex}" stroke-opacity=".35" stroke-width="10" stroke-linecap="round"/>
  <path d="M48 190L112 176L212 96L232 114L182 188L242 200L264 224L172 214L150 278L124 286L130 218L82 222Z" fill="{accent_hex}"/>
  <path d="M236 202C209 202 188 223 188 250C188 293 236 330 236 330C236 330 284 293 284 250C284 223 263 202 236 202Z" fill="{accent_hex}"/>
  <circle cx="236" cy="250" r="22" fill="{inner_hex}"/>
</svg>
"""


def build_logo_svg(theme_name: str, text_hex: str, line_hex: str, accent_hex: str) -> str:
    mark = build_mark_svg(line_hex, accent_hex, WHITE_HEX, f"Rehan Travel Agency {theme_name} mark")
    mark_group = mark.split(">", 1)[1].rsplit("</svg>", 1)[0]
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 420" fill="none" role="img" aria-labelledby="logoTitle">
  <title id="logoTitle">Rehan Travel Agency {theme_name} logo</title>
  <g transform="translate(18 22) scale(0.94)">
    {mark_group}
  </g>
  <text x="350" y="178" fill="{text_hex}" font-family="Palatino Linotype, Georgia, serif" font-size="96" font-weight="700" letter-spacing=".5">Rehan</text>
  <rect x="352" y="198" width="88" height="8" rx="4" fill="{accent_hex}"/>
  <text x="352" y="270" fill="{text_hex}" font-family="Segoe UI, Arial, sans-serif" font-size="52" font-weight="700" letter-spacing="8">TRAVEL AGENCY</text>
</svg>
"""


def build_favicon_svg() -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none" role="img" aria-labelledby="faviconTitle">
  <title id="faviconTitle">Rehan Travel Agency favicon</title>
  <rect width="512" height="512" rx="116" fill="{PRIMARY_HEX}"/>
  <path d="M104 164C154 206 208 214 260 196" stroke="rgba(255,255,255,.3)" stroke-width="18" stroke-linecap="round"/>
  <path d="M266 128L366 98L444 154L358 180L430 244L404 270L324 216L276 316L238 324L258 226L184 234L156 206L258 194Z" fill="{SECONDARY_HEX}"/>
  <text x="86" y="370" fill="{WHITE_HEX}" font-family="Segoe UI, Arial, sans-serif" font-size="136" font-weight="700" letter-spacing="8">RTA</text>
</svg>
"""


def save_logo_png(theme_name: str, text_color: tuple[int, int, int, int], line_color: tuple[int, int, int, int]) -> None:
    image = Image.new("RGBA", (1600, 480), TRANSPARENT)
    draw = ImageDraw.Draw(image)

    title_font = ImageFont.truetype(PALATINO_BOLD, 118)
    subtitle_font = ImageFont.truetype(SEGOE_SEMIBOLD, 54)

    draw_logo_mark(draw, (30, 40), 1.05, line_color, SECONDARY, WHITE)

    draw.text((390, 120), "Rehan", fill=text_color, font=title_font)
    draw.rounded_rectangle((393, 226, 492, 236), radius=5, fill=SECONDARY)
    draw_tracked_text(draw, (394, 266), "TRAVEL AGENCY", subtitle_font, text_color, 8)

    image.save(ASSETS / f"logo-{theme_name}.png")


def save_mark_png() -> None:
    image = Image.new("RGBA", (512, 512), TRANSPARENT)
    draw = ImageDraw.Draw(image)
    draw_logo_mark(draw, (34, 28), 1.6, PRIMARY, SECONDARY, WHITE)
    image.save(ASSETS / "logo-mark.png")


def save_favicon_rasters() -> None:
    canvas = Image.new("RGBA", (512, 512), TRANSPARENT)
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((0, 0, 512, 512), radius=116, fill=PRIMARY)
    draw.line((104, 164, 154, 206, 208, 214, 260, 196), fill=(255, 255, 255, 84), width=18, joint="curve")

    plane = [
        (266, 128),
        (366, 98),
        (444, 154),
        (358, 180),
        (430, 244),
        (404, 270),
        (324, 216),
        (276, 316),
        (238, 324),
        (258, 226),
        (184, 234),
        (156, 206),
        (258, 194),
    ]
    draw.polygon(plane, fill=SECONDARY)

    text_font = ImageFont.truetype(SEGOE_BOLD, 136)
    draw_tracked_text(draw, (88, 250), "RTA", text_font, WHITE, 8)

    canvas.save(ASSETS / "apple-touch-icon.png")
    canvas.resize((32, 32), Image.Resampling.LANCZOS).save(ASSETS / "favicon-32x32.png")
    canvas.resize((16, 16), Image.Resampling.LANCZOS).save(ASSETS / "favicon-16x16.png")
    canvas.save(ASSETS / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])


def main() -> None:
    (ASSETS / "logo-mark.svg").write_text(
        build_mark_svg(PRIMARY_HEX, SECONDARY_HEX, WHITE_HEX, "Rehan Travel Agency logo mark"),
        encoding="utf-8",
    )
    (ASSETS / "logo-light.svg").write_text(
        build_logo_svg("light", PRIMARY_HEX, PRIMARY_HEX, SECONDARY_HEX),
        encoding="utf-8",
    )
    (ASSETS / "logo-dark.svg").write_text(
        build_logo_svg("dark", WHITE_HEX, WHITE_HEX, SECONDARY_HEX),
        encoding="utf-8",
    )
    (ASSETS / "favicon.svg").write_text(build_favicon_svg(), encoding="utf-8")

    save_logo_png("light", PRIMARY, PRIMARY)
    save_logo_png("dark", WHITE, WHITE)
    save_mark_png()
    save_favicon_rasters()


if __name__ == "__main__":
    main()
