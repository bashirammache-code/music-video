# ilayya — Instagram launch campaign

Brand: **ilayya** · "ALREADY YOURS" · Beirut 2026 · deep red `#8B0A0A` on cream `#F6F4F0`, gold jewelry, warm editorial photography.

**Launch date: TBD** (aiming for ~next week). Everything below is relative to launch day **L**.
When the date is set, put it in `src/instagram/config.ts` (`LAUNCH_DATE = "YYYY-MM-DD"`) and the countdown Story updates itself.

## Assets in this repo

| What | Where |
| --- | --- |
| Logo (red script on cream) | `public/ilayya/logo.png` |
| Hero photo (hoops, ear cuffs) | `public/ilayya/hero.png` |
| Remotion: logo reveal (5s, 9:16) | composition `IlayyaLogoReveal` |
| Remotion: countdown Story (4s, 9:16) | composition `IlayyaCountdown` |

```bash
npm start                                              # preview in Remotion Studio
npx remotion render IlayyaLogoReveal out/logo.mp4
npx remotion render IlayyaCountdown out/countdown-3.mp4 --props='{"daysLeft":3}'
```

## Phases

1. **Tease (L-7 → L-4)**: build curiosity, no product reveal. Logo, close-up crops, "Beirut 2026".
2. **Countdown (L-3 → L-1)**: daily Stories with the countdown, pieces shown up close, a notify/follow push.
3. **Launch (L)**: full reveal, link in bio, shop live.
4. **Sustain (L+1 → L+7)**: social proof, styling content, restock/"selling fast" messages.

## Calendar

| Day | Format | Content | Goal |
| --- | --- | --- | --- |
| L-7 | Feed post | Logo on cream + "Already yours. Beirut 2026." | Announce the account |
| L-6 | Story | Macro of the gold hoop, no text | Curiosity |
| L-5 | Reel | `IlayyaLogoReveal` over the hero photo, soft audio | Reach |
| L-4 | Story | Poll: "gold or silver?" | Engagement, learn taste |
| L-3 | Story | `IlayyaCountdown` (3 days) | Countdown starts |
| L-2 | Reel | Close-up detail shots (ear cuffs, hand chain, heart pendant) | Product desire |
| L-1 | Story + Post | `IlayyaCountdown` (1 day) + "Tomorrow." | Urgency |
| **L** | Reel + Post + Stories | Full reveal, link in bio, "Now live" | Conversion |
| L+1 | Stories | Reshare early buyers and reactions | Social proof |
| L+3 | Reel | How to style: stack bracelets, mix hoops | Retention |
| L+7 | Post | Thank-you + what's next | Community |

## Caption starters

- Tease: `Already yours. ilayya, Beirut 2026.`
- Countdown: `3 days. Already yours.`
- Launch: `It's here. ilayya is live, link in bio.`
- Sustain: `Wear them every day. Stack them your way.`

## Hashtags (rotate 5–8 per post)

`#ilayya` `#alreadyyours` `#beirutjewelry` `#goldjewelry` `#everydayjewelry` `#jewelrylaunch` `#beirutbrand` `#hoopearrings`

## To decide

- [ ] Launch date
- [ ] Is the shop live at launch (link in bio), or waitlist first?
- [ ] More photos or video for Reels?
- [ ] Music/audio for Reels
- [ ] Posting times (set once the date and audience timezone are known)
