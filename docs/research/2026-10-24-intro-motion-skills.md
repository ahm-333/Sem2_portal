# Intro motion skill review — 2026-10-24

Recommendation: install the three narrowly scoped folders below. They support a vanilla JavaScript, browser ESM, WebGL implementation without introducing React or a build system. This review downloaded and inspected source text and repository trees; it did not install skills or change application files.

## Verified skill sources

| Skill folder in source repository | Ownership and purpose | Static portal fit |
| --- | --- | --- |
| `greensock/gsap-skills`: `skills/gsap-scrolltrigger/` | Official GreenSock skill for scrubbed timelines, pinning, refresh and cleanup. | Uses ordinary JavaScript and GSAP globals; register `ScrollTrigger` once. Suitable for driving camera positions, scene transforms and shader uniform values from a pinned intro timeline. |
| `CloudAI-X/threejs-skills`: `skills/threejs-fundamentals/` | Community-authored Three.js skill, not an official Three.js team repository. Covers renderer, camera, resize, animation loop and disposal. | Explicitly includes browser import maps and CDN ES modules without a bundler. |
| `CloudAI-X/threejs-skills`: `skills/threejs-shaders/` | Community skill for `ShaderMaterial`, GLSL uniforms, displacement, Fresnel, instancing and shader debugging. | Its main examples use vanilla Three.js and `WebGLRenderer`. Well suited to an asset-light procedural intro. Keep its separate WebGPU/TSL examples out of a GLSL/WebGL implementation. |

Exact reviewed files:

- [Official ScrollTrigger SKILL.md](https://github.com/greensock/gsap-skills/blob/aed9cfd3277740755f6bfc1155c7aa645403b760/skills/gsap-scrolltrigger/SKILL.md)
- [Three.js fundamentals SKILL.md](https://github.com/CloudAI-X/threejs-skills/blob/0e181866f095b5f06d005133876e926515390d95/skills/threejs-fundamentals/SKILL.md)
- [Three.js shaders SKILL.md](https://github.com/CloudAI-X/threejs-skills/blob/0e181866f095b5f06d005133876e926515390d95/skills/threejs-shaders/SKILL.md)

The official GSAP documentation links to the [GreenSock skill repository](https://github.com/greensock/gsap-skills) through its AI Skills navigation. Both repositories contain MIT licenses: [GreenSock license](https://github.com/greensock/gsap-skills/blob/aed9cfd3277740755f6bfc1155c7aa645403b760/LICENSE), [CloudAI-X license](https://github.com/CloudAI-X/threejs-skills/blob/0e181866f095b5f06d005133876e926515390d95/LICENSE). Preserve those notices when copying the skills. The skill license does not substitute for the runtime libraries' own licenses.

## Inspection and limits

- Each recommended folder contains exactly one `SKILL.md` at the reviewed commit. No scripts, hooks, executable installer or supporting files are present inside these three folders. Related skills are informational cross-references; all named sibling skill folders exist in the corresponding repository trees. References from the GSAP file point to official GSAP documentation. No credential collection, telemetry, destructive shell commands or instruction-hierarchy overrides were found in the reviewed skill text. This is a scoped source review, not a security audit of the entire repositories or runtime dependencies.
- The Three.js skills target r186. The repository README says its verification used `three@0.186.1`, while the fundamentals import-map example pins `0.186.0`. Choose one available version and use it consistently for core and addons; do not silently combine this guidance with an older renderer. Source: [repository verification statement](https://github.com/CloudAI-X/threejs-skills/blob/0e181866f095b5f06d005133876e926515390d95/README.md), [fundamentals import maps](https://github.com/CloudAI-X/threejs-skills/blob/0e181866f095b5f06d005133876e926515390d95/skills/threejs-fundamentals/SKILL.md).
- The official GSAP skill still has implementation errors: its horizontal demo uses nonexistent `Max.max`, and its `refreshPriority` explanation reverses the actual order. Official docs specify that priority `1` refreshes before priority `0`. Prefer a single intro timeline created in document order, and consult runtime documentation when an example conflicts. Sources: [reviewed skill](https://github.com/greensock/gsap-skills/blob/aed9cfd3277740755f6bfc1155c7aa645403b760/skills/gsap-scrolltrigger/SKILL.md), [official refreshPriority documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/#refreshPriority).
- Bloom is optional. If implementation actually needs a composer, selectively review `CloudAI-X/threejs-skills/skills/threejs-postprocessing/SKILL.md` before installing it. That path exists in the reviewed repository tree, but its full contents were not audited here. The three recommended skills already cover scroll choreography and a procedural shader scene.

## Implementation implication

Use one scrubbed GSAP timeline to update a small scene-state object or uniform values, then render from a single Three.js animation loop. Treat reduced-motion behavior, skip controls, WebGL failure fallback, mobile pixel-ratio/particle budgets, and release of GPU resources as application requirements that still need implementation and browser verification. Installing a skill alone does not establish visual quality or device performance.
