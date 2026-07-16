# Design QA — AI Ads case study

## Evidence

- Source visual truth: `output/source-ai-ads/source-slide-01-desktop.png` and `output/source-ai-ads/source-slide-04-desktop.png`
- Browser-rendered implementation: `output/qa/ai-ads-hero-desktop.png` and `output/qa/ai-ads-grid-desktop.png`
- Responsive implementation: `output/qa/ai-ads-hero-mobile.png` and `output/qa/ai-ads-grid-mobile.png`
- Route: `http://127.0.0.1:4173/ai-ads.html`
- Desktop viewport: 1440 × 1000
- Mobile viewport: 390 × 844
- State: hero, e-commerce gallery, video idle, and video playing

## Full-view comparison evidence

The source deck and implementation were compared together at 1440 × 1000. The implementation intentionally adapts the slide deck into a scrolling case-study page while preserving its high-contrast black, off-white, and electric-blue art direction; oversized editorial typography; bilingual copy; original campaign imagery; and five-industry structure.

The hero maintains the source hierarchy: campaign creative, AI-ads value proposition, 48-hour promise, bilingual description, and supported platforms. The implementation adds the existing Trifid portfolio navigation and grid system so the new collection feels native to the rest of the site.

## Focused region comparison evidence

The e-commerce creative row was compared directly with source slide 04. All five source assets are present at appropriate square and vertical ratios, video cards use the source poster frames, and the information order remains immediately understandable. A focused comparison was necessary because the mixed media ratios and play affordances were too small to judge from the hero view alone.

## Required fidelity surfaces

- Fonts and typography: Inter Tight and DM Mono retain the portfolio system while matching the source's bold sans-serif and technical label hierarchy. Wrapping, line height, and optical weight are clear at desktop and mobile sizes.
- Spacing and layout rhythm: Hero proportions, section spacing, card gaps, mixed-ratio media grid, and mobile two-column layout remain balanced with no horizontal overflow.
- Colors and visual tokens: Off-white, ink black, and electric blue map directly to both the source deck and the existing Trifid site tokens.
- Image quality and asset fidelity: Original AVIF stills, WebP posters, and MP4 videos from the supplied source are used without substitutes or placeholder drawings. Crops preserve the campaign subjects and copy.
- Copy and content: The five industries, 48-hour promise, English and Arabic positioning, three-stills/two-videos structure, and platform references are preserved and rewritten only for simpler customer comprehension.

## Findings

- No actionable P0, P1, or P2 issues found.
- The page is an intentional responsive adaptation rather than a pixel-for-pixel slide viewer; this is appropriate for the user's request for a simple, easy-to-understand web case study.

## Interaction and runtime checks

- Tested the e-commerce video play/pause control.
- Confirmed 10 videos are present and only nearby videos hydrate; six remained unfetched during the first gallery interaction.
- Confirmed source videos are progressively optimized and use lightweight poster images before playback.
- Confirmed navigation links to Ads, Websites, and AI Ads.
- Confirmed no browser console warnings or errors.

## Comparison history

- Pass 1: No P0/P1/P2 visual mismatches. No visual fixes were required after the comparison.

## Follow-up polish

- None required for handoff.

final result: passed
