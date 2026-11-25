export interface Meetup {
  status: 'draft' | 'published';
  title: string;
  description: string;
  startsAt: string;
  endsAt?: string;
  location: string;
  timeZone: string;
  registrationUrl?: string;
  sponsor?: { name: string; url: string; image?: string };
}

function validDate(value: string) {
  return typeof value === 'string' && /(Z|[+-]\d\d:\d\d)$/.test(value) && Number.isFinite(Date.parse(value));
}

export function schedule(rows: unknown[], now = Date.now()) {
  const visible: Meetup[] = [];
  for (const row of rows) {
    const e = row as Meetup;
    if (!e || !['draft','published'].includes(e.status)) throw Error('Expected draft or published status');
    if (e.status === 'draft') continue;
    for (const field of [e.title,e.description,e.location,e.timeZone]) {
      if (typeof field !== 'string' || !field.trim()) throw Error('Missing event details');
    }
    if (!validDate(e.startsAt) || (e.endsAt !== undefined && (!validDate(e.endsAt) || Date.parse(e.endsAt) < Date.parse(e.startsAt)))) throw Error('Invalid event dates');
    new Intl.DateTimeFormat('en', {timeZone:e.timeZone});
    if (e.sponsor && (!e.sponsor.name || !e.sponsor.url)) throw Error('Missing sponsor details');
    for (const url of [e.registrationUrl,e.sponsor?.url]) {
      if (url !== undefined && new URL(url).protocol !== 'https:') throw Error('Expected HTTPS link');
    }
    visible.push(e);
  }
  visible.sort((a,b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  const upcoming = (e: Meetup) => Date.parse(e.endsAt ?? e.startsAt) >= now;
  return { upcoming: visible.filter(upcoming), past: visible.filter(e => !upcoming(e)).reverse() };
}
