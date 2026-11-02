# Asset register

Every image comes from Weiss Auto Detail's own website, https://www.weissautodetail.com/, downloaded November 1, 2026. The showcase uses the same photo their site shows beside each package. Originals are kept in `source-assets/` (not committed). `scripts/prepare_assets.py` makes the web copies in `src/assets/img/` and the icons in `public/`.

Usage approval from Weiss is still needed for every file before the site goes live.

| Web file | Original | Package on their site | Also used for | Notes |
| --- | --- | --- | --- | --- |
| `corvette.jpg` | `f7a515_c483…_mv2.jpg` | Silver Exterior | Hero (desktop) | Full frame |
| `corvette-portrait.jpg` | same | | Hero (phone) | Crop x 420 to 1500, full height |
| `f150.jpg` | `f7a515_f3c8…_mv2.jpg` | Gold Exterior | | Full frame |
| `headlight.jpg` | `f7a515_f1c5…_mv2.jpg` | Headlight Restoration | | Their before and after composite, unchanged |
| `headlight-before.jpg`, `headlight-after.jpg` | same | | Before-and-after slider | Split at the centre seam, x = 1024 |
| `highlander-interior.jpg` | `f7a515_045f…_mv2.jpg` | Bronze Interior | | Full frame |
| `f150-interior.jpg` | `f7a515_7116…_mv2.jpg` | Silver Interior | | AI upscaled from 352 × 480. Checked against the original: same vehicle, framing and detail |
| `cadillac-interior.jpg` | `f7a515_b362…_mv2.jpg` | Gold Interior | | Full frame |
| `silverado.jpg` | `f7a515_be11…_mv2.jpg` | Ceramic Coating Auto | | AI upscaled from 444 × 378. Checked against the original: same vehicle, framing and detail |
| `wheel.jpg` | `f7a515_a4fb…_mv2.jpg` | Ceramic Wheel Coating | | Full frame; an Owner's Pride bottle is in shot |
| `coating-home.jpg` | `11062b_3188…_mv2_d_4288_2848_s_4_2.jpg` | Ceramic Coating Home | | Wix stock photo, not Weiss's work. Captioned "Illustrative photo". Wix media is licensed for Wix sites, so replace it before this leaves Wix |
| `logo-blue.png` | `f7a515_a4b2…_mv2.png` | | Light backgrounds | Trimmed to the mark, colour unchanged |
| `logo-white.png` | same | | Dark navigation and footer | Same shape, filled white. Needs Weiss approval |
| `public/favicon.ico` (16, 32, 48 px), `public/apple-touch-icon.png` (180 px) | same | | Browser tab, bookmarks, phone home screen | The checkered W from the logo, white on the logo blue (#003FCC). Their live site uses the Wix default icon. Needs Weiss approval |

Not used: Owner's Pride logo and product image (supplier marketing), and Wix stock icons.

## Facts used, and where they came from

- Packages, inclusions, prices, and grouping: weissautodetail.com, checked November 1, 2026. The site lists them as starting prices. Reconfirm before launch.
- 7 year ceramic coating warranty, "gloss that wax and sprays can't beat", and certified Owner's Pride installer: weissautodetail.com.
- Phone 780-803-9865, weissautodetailing@gmail.com, 8047 181 Street NW, Edmonton, "Serving Edmonton & surrounding area": weissautodetail.com.
- Facebook (facebook.com/WeissAutoDetail) and Instagram (instagram.com/weissautodetail): linked from weissautodetail.com.
- Postal code T5T 0T4: public business listings only. Confirm with Weiss.
- Reviews: public Google reviews, quoted word for word with month and year. No names, ratings, or counts are shown.
- Owner's name, Austin: named in those reviews. Confirm Weiss is happy to be named.
