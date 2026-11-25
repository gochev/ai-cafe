# AI Café

AI Café is a static Astro site. For the first deployment and domain setup, follow [Publish AI Café on GitHub Pages](DEPLOYMENT.md).

## Add a meetup, step by step

1. **Start the local preview.** Install Node.js 24 and pnpm 11.25.0 (with Node installed, run `npm install --global pnpm@11.25.0`). In the folder containing `package.json`, run `pnpm install --frozen-lockfile`, then `pnpm dev`. Open the address Astro prints and select **Meetups**. The development calendar shows draft cards.
2. **Copy the sample.** The active calendar starts as an empty array in `src/data/events.json`. Copy the sample below into that file for your first meetup. For later meetups, append one object inside the existing array, with a comma between objects. A reusable copy lives in `src/data/events.example.json`, outside the active calendar.
3. **Describe your meetup.** In the new object enter the title attendees should see, a short description of what they will do, and the venue name and address in `location`. This text becomes a Google Maps search link, so include the city or street address to narrow the results. Keep the new entry as a draft while editing.
4. **Set the date and time.** Enter the local start time and UTC offset in `startsAt`, for example `2030-06-15T18:30:00+03:00`. Set `timeZone` to the venue’s IANA zone, such as `Europe/Sofia`. Check the offset for that particular date. Add `endsAt` in the same format if known, or remove that field. An ongoing meetup stays under Upcoming until its end.
5. **Add optional links.** Set `registrationUrl` to the real HTTPS registration page, or delete that field. For a confirmed sponsor, enter its name and HTTPS website in `sponsor`. To show a logo, save it at e.g. `public/sponsors/partner.png` and set `image` to `/sponsors/partner.png`. Remove `image` for a text link, or remove the whole `sponsor` object if there is no sponsor.
6. **Inspect the card.** Save the JSON and look under Meetups in the local preview. Check the date, venue, logo and links. The bundled sample links to example.org. Replace or remove both sample links before publishing your own entry.
7. **Publish the confirmed entry.** Change only its status to `"published"`. Stop the local server with Ctrl+C, then run `pnpm test`, `pnpm build` and `pnpm preview`. Open the printed URL to check the production calendar. Drafts are hidden there. Upcoming entries appear earliest first and past entries newest first.
8. **Send the update to GitHub.** Stage `src/data/events.json` and any new logo, commit, then push to `main`. Under **Actions → Deploy AI Café**, wait for a successful deployment and check the live calendar. The workflow also rebuilds daily at 00:17 UTC to update upcoming and past groups.

## Inactive meetup example

```json
[{
  "status": "draft",
  "title": "Pair programming over espresso",
  "description": "Bring a small coding task and compare two ways of asking an assistant for help.",
  "startsAt": "2030-06-15T18:30:00+03:00",
  "endsAt": "2030-06-15T20:00:00+03:00",
  "timeZone": "Europe/Sofia",
  "location": "Demo Café, Sofia",
  "registrationUrl": "https://example.org/",
  "sponsor": {"name":"Example sponsor","url":"https://example.org","image":"/draft-logo.svg"}
}]
```
