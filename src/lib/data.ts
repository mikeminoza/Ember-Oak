export const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600`

export const cafe = {
  name: 'Ember & Oak',
  street: '214 Alder Street',
  city: 'Portland, OR 97204',
  phone: '(503) 555-0142',
  phoneHref: 'tel:+15035550142',
  email: 'hello@emberandoak.coffee',
  mapsHref: 'https://www.openstreetmap.org/?mlat=45.5189&mlon=-122.6765#map=17/45.5189/-122.6765',
  timeZone: 'America/Los_Angeles',
}

// the page is one day at the café; the sky only shifts between two warm whites as the hours pass
export const skies = {
  dawn: '#fffcf7',
  morning: '#f5eee3',
  noon: '#fffcf7',
  afternoon: '#fffcf7',
  golden: '#f5eee3',
  dusk: '#fffcf7',
} as const

// day index follows Date#getDay(): 0 = Sunday
export const hours = [
  { day: 'Sunday', open: 8, close: 16 },
  { day: 'Monday', open: 7, close: 18 },
  { day: 'Tuesday', open: 7, close: 18 },
  { day: 'Wednesday', open: 7, close: 18 },
  { day: 'Thursday', open: 7, close: 18 },
  { day: 'Friday', open: 7, close: 18 },
  { day: 'Saturday', open: 8, close: 16 },
]

export const formatHour = (h: number) => {
  const suffix = h >= 12 && h < 24 ? 'pm' : 'am'
  const whole = Math.floor(h)
  const hour = whole % 12 === 0 ? 12 : whole % 12
  const minutes = Math.round((h - whole) * 60)
  return `${hour}${minutes ? `:${String(minutes).padStart(2, '0')}` : ''}${suffix}`
}

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// the café's own clock: what time it is in Portland, wherever the visitor is
export function cafeTime(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: cafe.timeZone,
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(now)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  const hour = Number(get('hour'))
  const minute = Number(get('minute'))
  return { day: weekdays.indexOf(get('weekday')), hour, minute, time: hour + minute / 60 }
}

export function formatClock({ hour, minute }: { hour: number; minute: number }) {
  return `${hour % 12 === 0 ? 12 : hour % 12}:${String(minute).padStart(2, '0')}${hour >= 12 ? 'pm' : 'am'}`
}

export function openStatus(now = new Date()) {
  const { day: d, time } = cafeTime(now)
  const today = hours[d]
  if (time >= today.open && time < today.close) {
    return { open: true, label: `Open now until ${formatHour(today.close)}` }
  }
  const next = time < today.open ? today : hours[(d + 1) % 7]
  const when = next === today ? 'today' : 'tomorrow'
  return { open: false, label: `Closed, opens ${formatHour(next.open)} ${when}` }
}

// the moments a regular would recognize, in order
export const day = [
  { time: 6.5, title: 'Croissants come out', text: 'Our baker has been here since four. The first tray is out before we unlock.', image: '1623334044303-241021148842' },
  { time: 7, title: 'Doors open', text: 'The first espresso of the day goes to whoever is waiting at the door. Usually it’s Frank.', image: '1541167760496-1628856ab772' },
  { time: 9, title: 'The case is full', text: 'Cardamom buns, galettes and morning buns. The buns rarely last until noon.', image: '1517433670267-08bbd4be890f' },
  { time: 12, title: 'Brunch', text: 'Avocado toast, the breakfast sandwich and a quiche that changes every day. Served until two.', image: '1600093463592-8e36ae95ef56' },
  { time: 15, title: 'Slow pour-overs', text: 'The quiet hour. A good time to ask us which beans to take home.', image: '1442512595331-e89e73853f31' },
  { time: 17.5, title: 'Last call', text: 'We stop pouring at 5:30 and turn the sign off at six. Come back tomorrow.', image: '1501339847302-ac426a4a7cbb' },
]

export type MenuItem = { name: string; description: string; price: string; image?: string }

export const menu: Record<string, MenuItem[]> = {
  Coffee: [
    { name: 'Espresso', description: 'This week’s single origin, pulled short', price: '3.50', image: '1511920170033-f8396924c348' },
    { name: 'Cortado', description: 'Equal parts espresso and warm milk', price: '4.25', image: '1495474472287-4d71bcdd2085' },
    { name: 'Flat white', description: 'Double ristretto, thin silky milk', price: '4.75', image: '1509042239860-f550ce710b93' },
    { name: 'Oak-smoked latte', description: 'Our own smoked maple syrup', price: '5.75', image: '1541167760496-1628856ab772' },
    { name: 'Pour over', description: 'Any bean on the shelf, brewed to order', price: '5.00', image: '1442512595331-e89e73853f31' },
    { name: 'Cold brew', description: 'Steeped 18 hours, one big ice cube', price: '4.50', image: '1461023058943-07fcbe16d735' },
  ],
  'Not coffee': [
    { name: 'Chai', description: 'House-spiced, steamed oat milk', price: '5.00' },
    { name: 'Matcha', description: 'Whisked to order, hot or iced', price: '5.50' },
    { name: 'Honey lavender fog', description: 'Earl grey, lavender, local honey', price: '5.25' },
    { name: 'Hot chocolate', description: '70% dark, whipped cream if you like', price: '4.50' },
  ],
  Bakery: [
    { name: 'Butter croissant', description: 'Laminated over three days', price: '4.00', image: '1623334044303-241021148842' },
    { name: 'Cardamom bun', description: 'Swedish knot, pearl sugar', price: '4.75', image: '1517433670267-08bbd4be890f' },
    { name: 'Brown butter cookie', description: 'Dark chocolate, flaky salt', price: '3.50', image: '1558961363-fa8fdf82db35' },
    { name: 'Sourdough loaf', description: 'Whole, to take home', price: '9.00', image: '1509440159596-0249088772ff' },
  ],
  Brunch: [
    { name: 'Avocado toast', description: 'Sourdough, chili crisp, soft egg', price: '12.00' },
    { name: 'Breakfast sandwich', description: 'Egg, aged cheddar, bacon, brioche', price: '11.50' },
    { name: 'Granola bowl', description: 'House granola, yogurt, berries', price: '9.50' },
    { name: 'Quiche of the day', description: 'With a small green salad', price: '10.50' },
  ],
}

export const farms = [
  'El Mirador, Colombia',
  'Hambela, Ethiopia',
  'La Esperanza, Guatemala',
  'Gedeb, Ethiopia',
  'Los Naranjos, Colombia',
  'Santa Felisa, Guatemala',
]

export const story = [
  { year: '2014', title: 'A cart on Alder Street', text: 'We started with a two-group espresso machine bolted to a cart outside the Saturday market.' },
  { year: '2017', title: 'A counter and a roaster', text: 'We moved indoors and put a 5-kilo roaster where everyone could watch the beans turn.' },
  { year: 'Today', title: 'Six farms, one drum', text: 'We buy directly from six farms and print who grew the beans, and the day we roasted them, on every bag.' },
]

export const reviews = [
  { quote: 'The cardamom bun alone is worth crossing the river for. They remembered my order on my second visit.', name: 'Priya S.', source: 'Google' },
  { quote: 'Good light, outlets at every table, and the flat white is exactly right. My office now.', name: 'Marcus T.', source: 'Yelp' },
  { quote: 'Our book club has met here every month for three years. Nobody rushes you out.', name: 'Hannah L.', source: 'Google' },
  { quote: 'I came for the croissants at 6:30 and stayed for a second pour over. Best morning of my trip.', name: 'Jonas W.', source: 'Google' },
  { quote: 'They let my kid watch the roaster for twenty minutes and answered every single question.', name: 'Alicia R.', source: 'Yelp' },
]
