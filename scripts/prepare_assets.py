"""Turn Weiss's own uploads into web-sized assets for the preview."""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "source-assets"
OUT = ROOT / "src" / "assets" / "img"
OUT.mkdir(parents=True, exist_ok=True)

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
