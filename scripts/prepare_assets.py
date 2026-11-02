"""Turn Weiss's own uploads into web-sized assets for the preview."""

from pathlib import Path

from PIL import Image, ImageChops, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "source-assets"
OUT = ROOT / "src" / "assets" / "img"
PUBLIC = ROOT / "public"
OUT.mkdir(parents=True, exist_ok=True)
PUBLIC.mkdir(exist_ok=True)

LOGO_BLUE = (0, 63, 204)

FILES = {
    "corvette": "f7a515_c483c270a41741a38efbf90cc913772d_mv2.jpg",
    "f150": "f7a515_f3c8e445324f466881b557e07c3f86a5_mv2.jpg",
    "wheel": "f7a515_a4fb4d259a1641838d7583856e1171f1_mv2.jpg",
    "silverado": "f7a515_be11affd505445a18f129cee8da5471d_mv2.jpg",
    "highlander-interior": "f7a515_045fc1e3bd4048b586c959bdf1185572_mv2.jpg",
    "cadillac-interior": "f7a515_b362e36549a74aa9a0203a58b33d4b3c_mv2.jpg",
    "f150-interior": "f7a515_711619625f34445a939e74bd45bda46f_mv2.jpg",
    "headlight": "f7a515_f1c57b9fad9a48369ca3a3d8526a14dd_mv2.jpg",
    "logo": "f7a515_a4b29576760340e7934698bfe7e7439b_mv2.png",
}


def save_jpg(image: Image.Image, name: str, longest: int, quality: int = 80) -> None:
    image = image.convert("RGB")
    image.thumbnail((longest, longest), Image.Resampling.LANCZOS)
    image.save(OUT / f"{name}.jpg", "JPEG", quality=quality, optimize=True, progressive=True)
    print(f"{name}.jpg {image.size}")


def open_src(key: str) -> Image.Image:
    return Image.open(SRC / FILES[key])


def render_icon(mark: Image.Image, size: int, mark_width: float, rounded: bool) -> Image.Image:
    canvas = 1024
    icon = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    draw = ImageDraw.Draw(icon)
    if rounded:
        draw.rounded_rectangle((0, 0, canvas - 1, canvas - 1), radius=canvas * 0.22, fill=LOGO_BLUE)
    else:
        draw.rectangle((0, 0, canvas, canvas), fill=LOGO_BLUE)
    width = round(canvas * mark_width)
    height = round(mark.height * width / mark.width)
    glyph = Image.new("RGBA", (width, height), (255, 255, 255, 0))
    glyph.putalpha(mark.resize((width, height), Image.Resampling.LANCZOS))
    icon.alpha_composite(glyph, ((canvas - width) // 2, (canvas - height) // 2))
    return icon.resize((size, size), Image.Resampling.LANCZOS)


corvette = open_src("corvette")
save_jpg(corvette, "corvette", 1920, quality=74)
save_jpg(corvette.crop((420, 0, 1500, 1536)), "corvette-portrait", 1300, quality=74)

save_jpg(open_src("f150"), "f150", 1600, quality=74)
save_jpg(open_src("wheel"), "wheel", 1500, quality=74)
save_jpg(Image.open(SRC / "silverado-enhanced.jpg"), "silverado", 1024, quality=78)
save_jpg(open_src("highlander-interior"), "highlander-interior", 1400, quality=74)
save_jpg(open_src("cadillac-interior"), "cadillac-interior", 1400, quality=74)
save_jpg(Image.open(SRC / "f150-interior-enhanced.jpg"), "f150-interior", 1024, quality=78)

headlight = open_src("headlight")
save_jpg(headlight, "headlight", 1400, quality=76)
save_jpg(Image.open(SRC / "wix-stock-home.jpg"), "coating-home", 1600, quality=74)

seam = headlight.width // 2
save_jpg(headlight.crop((0, 0, seam, headlight.height)), "headlight-before", 1400)
save_jpg(headlight.crop((seam, 0, headlight.width, headlight.height)), "headlight-after", 1400)

logo = open_src("logo").convert("RGBA")
logo = logo.crop(logo.getbbox())
logo.save(OUT / "logo-blue.png", optimize=True)
alpha = logo.getchannel("A")
white = Image.new("RGBA", logo.size, (255, 255, 255, 0))
white.putalpha(alpha)
white.save(OUT / "logo-white.png", optimize=True)
print("logo", logo.size)

# The car outline and AUTO DETAIL are white; the checkered W is the first blue shape.
red, _, _, _ = logo.split()
blue = ImageChops.multiply(alpha, red.point(lambda v: 255 if v < 128 else 0))
inked = [blue.crop((x, 0, x + 1, blue.height)).getbbox() is not None for x in range(blue.width)]
start = inked.index(True)
w_mark = blue.crop((start, 0, inked.index(False, start), blue.height))
w_mark = w_mark.crop(w_mark.getbbox())

favicons = [render_icon(w_mark, size, 0.88, rounded=True) for size in (16, 32, 48)]
favicons[-1].save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)], append_images=favicons[:-1])
render_icon(w_mark, 180, 0.72, rounded=False).convert("RGB").save(PUBLIC / "apple-touch-icon.png", optimize=True)
print("icons from W", w_mark.size)
