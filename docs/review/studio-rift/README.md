# Studio / Atlas / Rift review evidence

These selected captures show the implementation prepared for GitHub review on 24 October 2026. They are visual evidence, not substitutes for the functional suite. Group/section labels are the default test profile.

| Surface | Capture | Viewport |
| --- | --- | --- |
| Studio after the opening | [Home desktop](home-desktop.png) | 1440 x 900 |
| Direct phone entry | [Home phone](home-phone.png) | 390 x 844 |
| Atlas source workspace | [Database Systems](course-desktop.png) | 1440 x 1000 |
| Rift sculpture | [Opening](rift-opening.png) | 1440 x 900 |
| Rift camera journey | [Tunnel](rift-tunnel.png) | 1440 x 900 |

The opening/tunnel captures are actual Three.js WebGL output. System reduced-motion/phone bypass, Canvas fallback, context-loss recovery and return to the site are exercised separately by the browser tests. A frame captures composition; it does not establish real-device frame rate.

Run and validation instructions are in [the current review guide](../../STUDIO-REVIEW.md). The final verification record is [verification.md](verification.md).
