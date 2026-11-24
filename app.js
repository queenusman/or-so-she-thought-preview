let activeEra = 'crowned';
let activeChapterIndex = null;
let activeWorldIndex = null;
let activePersonKey = null;
let baseFontSize = 18;
let isIvoryMode = false;
let chapterTransitionTimer = null;

const READ_STORAGE_KEY = 'or_so_she_thought_read_chapters_v1';

function getReadChaptersSet() {
  try {
    const raw = localStorage.getItem(READ_STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch (e) {
    return new Set();
  }
}

function markChapterAsRead(era, index) {
  try {
    const set = getReadChaptersSet();
    set.add(`${era}:${index}`);
    localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {}
}

function escapeHtmlText(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripHtmlToPlainText(raw) {
  const tmp = document.createElement('div');
  tmp.innerHTML = String(raw || '');
  return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
}

function formatChapterParagraphHtml(rawPara) {
  const trimmed = String(rawPara || '').trim();
  const hasMarkup = /<\/?[a-z][\s\S]*>/i.test(trimmed);
  if (hasMarkup) {
    return `<div class="chapter-paragraph text-theme-text">${trimmed}</div>`;
  }
  return `<p class="chapter-paragraph text-theme-text">${escapeHtmlText(trimmed)}</p>`;
}

const WORLD_SECTIONS = [
  {
    label: 'Part I',
    title: 'THE ISLAND',
    paragraphs: [
      'Mountains rise over the northern forests. Rivers cross the countryside towards the inland Capital, while the southern coast opens onto harbours, fishing towns and distant kingdoms. Between them lie farms, villages, industrial settlements and roads that connect one part of the island to another.',
      'Norwyn is a land of varied landscapes, though its seasons are fewer than one might expect.',
      'There is spring, autumn and winter.',
      'No summer.',
      'The year moves from the easing cold of spring into the return of rain and colder days in autumn, before winter settles over the island once more. The weather is often damp. Stone buildings hold the chill, rivers run through grey skies, and fires remain a familiar part of domestic life even where electric lights have long since replaced candles.',
      'The seasons shape more than the landscape. They determine what grows, what travels, what people wear and how the days are spent. The countryside has its own rhythms, as do the towns and the Capital. Life changes with the weather, but never quite stops for it.',
      'And beyond the southern waters lie other kingdoms, with their own histories, ambitions and lives.'
    ]
  },
  {
    label: 'Part II',
    title: 'THE CROWN',
    paragraphs: [
      'Norwyn is ruled by a Queen.',
      'The monarchy is absolute, and the Crown is passed through the female line. The eldest daughter of the reigning Queen is heir to the throne. Royal children inherit their mother\'s family name, and the Queen\'s husband holds the title of Prince rather than King.',
      'The royal family is not merely a symbol of the kingdom. It stands at the centre of its political, administrative and public life, with responsibilities extending far beyond the palace.',
      'Royal history is preserved in portraits, official records, family names and institutions that have outlasted generations. The past is never entirely separate from the present. It remains in the titles people carry, the traditions they observe and the expectations that accompany certain positions.',
      'In Norwyn, the Crown is inherited.',
      'So, too, are many of the things that come with it.'
    ]
  },
  {
    label: 'Part III',
    title: 'A KINGDOM OF MANY LIVES',
    paragraphs: [
      'Norwyn formally distinguishes between royals and non-royals. Beyond that distinction, however, the lives of its people vary enormously.',
      'Merchants conduct business in busy streets. Students spend their days in lecture rooms and libraries. Joiners work with timber, dressmakers with fabric, and labourers take on work that often begins before the rest of the town is awake. Families run shops, maintain farms, manage workshops and make a living in ways that have changed little or considerably over the years.',
      'Some live comfortably. Others have very little to spare.',
      'There are grand residences with several rooms kept ready for guests, and modest homes where the day\'s work is never quite finished. There are people whose names open doors and others who spend their lives making certain those doors are ready to open for someone else.',
      'The kingdom may share a common history, but its people do not share identical lives.',
      'And no palace, however large, contains all of Norwyn.'
    ]
  },
  {
    label: 'Part IV',
    title: 'THE CAPITAL',
    paragraphs: [
      'Inland, at the heart of the kingdom, lies the Capital.',
      'It is a city of government offices, old residences, commercial streets, railway sidings and river works. Its architecture carries the weight of its history, though its streets are not untouched by modern life. Motor cars move alongside older buildings. Telegraphs and telephones connect offices and homes. Trains carry goods towards the city, while the river remains part of the movement of the kingdom.',
      'The Capital is where Norwyn\'s institutions gather, where decisions are made and where the royal family resides.',
      'But the city has a life beyond its official purpose. There are shops to visit, streets to cross, appointments to keep, rooms to rent, lessons to attend and places where people gather long after the day\'s business has ended.',
      'Its character is found as much in the quiet streets and ordinary routines as in its grand buildings.'
    ]
  },
  {
    label: 'Part V',
    title: 'THE PALACE',
    paragraphs: [
      'The Royal Palace stands among the old buildings of the Capital, its galleries, courtyards, gardens and rooms maintained with a care that is rarely visible to those who enter.',
      'It is a residence of polished oak, fine fabrics, painted ceilings, silver candle stands and rooms designed for different purposes. Some are reserved for formal occasions. Others are familiar spaces in which the royal family spends its days. There are libraries, drawing rooms, galleries, a conservatory and long corridors that seem to belong to another age.',
      'The palace has its own rhythms.',
      'Fires are prepared. Tea is carried. Rooms are aired and arranged. Clothing is maintained, meals planned, correspondence sorted and appointments recorded. A residence of this size requires an extraordinary amount of work, much of it completed before the people who live there have begun their day.',
      'The palace is home to the royal family, but it is also the workplace of the people who maintain it.',
      'Behind its quiet rooms are kitchens, offices, storerooms, workshops and servants\' quarters. Behind its carefully arranged appearances are countless ordinary tasks, repeated every day by people whose names may never appear in the kingdom\'s history.',
      'There is always more to a house than the rooms its guests are permitted to see.'
    ]
  },
  {
    label: 'Part VI',
    title: 'THE NORWYNIAN WAY',
    paragraphs: [
      'Norwyn has been shaped by a variety of historical and cultural influences, among them French, Spanish, wider European and Cambodian traditions. Over generations, these influences have become part of a culture that belongs to Norwyn alone.',
      'Elegance is appreciated, but extravagance is not always the measure of it. Fine materials, thoughtful workmanship and a sense of proportion are valued in clothing, architecture, furnishings and everyday objects. A well-made garment, a properly maintained room or a beautifully prepared table can be admired without needing to make a spectacle of itself.',
      'Public life is more formal than private life. Introductions, titles, seating arrangements and official occasions follow established conventions. Certain words are used in particular circumstances. Certain gestures are expected. Much of what people know about behaving properly is learned so early that it rarely requires explanation.',
      'The kingdom\'s customs are not all grand ceremonies. Many are smaller, carried through ordinary days and familiar habits, preserved simply because generations have continued to observe them.',
      'Some traditions are easy to understand.',
      'Others are simply the way things are done.'
    ]
  },
  {
    label: 'Part VII',
    title: 'LEARNING AND IDEAS',
    paragraphs: [
      'Norwyn has long placed importance on education, particularly in the study of government, administration and the responsibilities of public life.',
      'In the Capital stands the Royal Academy of Governance, where students study the principles on which the kingdom\'s institutions are built. Its halls, lecture rooms, libraries and examination panels form part of a wider educational tradition in which learning is expected to prepare people for the responsibilities they may one day carry.',
      'Among the ideas taught in Norwyn is a philosophy of order, one that considers the relationship between individual roles and the stability of the whole. It has influenced the kingdom\'s institutions and the way its people are taught to understand responsibility, organisation and their place within a larger structure.',
      'Ideas, like customs, have histories.',
      'And in Norwyn, some have been passed down for so long that it is difficult to tell where an established principle ends and an unquestioned belief begins.'
    ]
  },
  {
    label: 'Part VIII',
    title: 'WORK, TRADE AND THE EVERYDAY',
    paragraphs: [
      'Much of Norwyn depends upon what its people produce.',
      'The island\'s forests supply timber. Its agricultural communities produce food and flour. Its workshops turn fabric into clothing, wood into furniture and raw materials into goods that travel far beyond the places in which they are made.',
      'Trade moves along roads, rivers and railways. Ships leave the southern ports for other kingdoms. Businesses depend on the movement of goods, on agreements made between institutions, and on the many people involved in transporting, producing, inspecting and selling what the country needs.',
      'Fabric and flour are among Norwyn\'s principal trades, though neither is the whole of its economy. Timber, fishing, construction, transport, domestic service and countless smaller businesses contribute to the life of the kingdom.',
      'Work is not always visible where its results are.',
      'A meal arrives at a table. A coat hangs ready. A fire burns in a room before its occupants wake. Goods appear in shops, documents reach offices and buildings remain in order.',
      'Someone, somewhere, has spent time making each of these things possible.'
    ]
  },
  {
    label: 'Part IX',
    title: 'THE COMFORTS OF HOME',
    paragraphs: [
      'The ordinary Norwynian table is built around familiar food. Rice, beans and potatoes are common, accompanied by fish, soup, bread and whatever else a household can afford or prepare.',
      'The differences between households are often reflected in small things. The variety of food, the quality of the fabric, the warmth of a room, the number of people available to help with daily work. Butter, for instance, is associated with greater comfort and prosperity.',
      'Homes vary just as much as their tables.',
      'Some are large residences with staff and rooms for every occasion. Others are modest, their occupants managing the work of the household alongside everything else they do. Across the kingdom, people make their homes according to their means, their occupations, their families and the circumstances in which they live.',
      'There is a familiar warmth to domestic life in Norwyn, though comfort means different things to different people.',
      'A quiet afternoon, a warm room, a cup of tea, a meal shared without hurry. These things are common enough to be unremarkable.',
      'And yet, much of a person\'s life is made up of precisely such things.'
    ]
  },
  {
    label: 'Part X',
    title: 'OLD WORLD, MODERN LIFE',
    paragraphs: [
      'Norwyn belongs to a world in which the old and the new have learned to live alongside one another.',
      'Electricity, telephones, motor vehicles, railways, newspapers, cameras and cassette players are part of everyday life. Offices have typewriters and photocopiers. People travel by road and rail. News moves between cities, across ports and beyond the kingdom\'s borders.',
      'But progress has not replaced everything that came before.',
      'Candles are still used. Fires are still laid. Handwritten correspondence is still exchanged. Records are kept on paper, and traditions continue to shape the way people conduct themselves even when the technology around them has changed.',
      'Norwyn is modern enough to be familiar, yet old enough in its habits to feel distinctly its own.',
      'It is a place where a telephone may ring in a house whose rooms have stood for generations, where a motor car waits outside an old stone residence, and where a new decision may still depend on a document passed from one desk to another.'
    ]
  },
  {
    label: 'Part XI',
    title: 'BEYOND NORWYN',
    paragraphs: [
      'Norwyn does not stand alone.',
      'Across the water lies Valenne, a neighbouring kingdom with its own royal family, institutions, commercial interests and history. The two kingdoms share connections that extend beyond geography, linking their royal households, their trade and the people whose lives are influenced by what happens on either side of the water.',
      'There are other places beyond them, too.',
      'Other shores. Other cities. Other lives.',
      'But Norwyn has its own character, and it is not easily mistaken for somewhere else.',
      'Its history belongs to its people. Its customs belong to its generations. Its institutions, however old or ordinary they may appear, form part of a world that has been built, maintained and lived in long before the beginning of this story.'
    ]
  },
  {
    label: 'Part XII',
    title: 'BEYOND THE PAGES',
    paragraphs: [
      'There is more to Norwyn than its Crown, its Capital or its grandest buildings.',
      'There are towns whose streets are busy long before noon, villages surrounded by farmland, ports that never quite sleep, forests where timber is cut and carried away, and homes in which the day\'s work is still waiting to be done.',
      'There are people with plans for the future, people trying to hold on to what they have, people who are perfectly content with their lives and people who wish they could change almost everything about them.',
      'Each belongs to the kingdom in their own way.',
      'Norwyn is not merely the setting of a story. It is a world in which lives continue beyond the moments we are permitted to witness, where every place has its history and every person has something that occupies their thoughts.',
      'You may come to Norwyn through the palace, but there is an entire kingdom beyond its doors.',
      'Some of it is grand. Some of it is ordinary. Some of it may be more familiar than you expect.',
      'And there is always more to discover.',
      'Welcome to Norwyn.'
    ]
  }
];

const PEOPLE_GROUPS = [
  {
    threshold: 'THE ROYAL FAMILY',
    members: [
      {
        key: 'elisabeta',
        name: 'Princess Elisabeta',
        epithet: 'The Heiress',
        registry: { belonging: 'Royal Family', role: 'Age 22 · Heir to the Crown of Norwyn', noted: 'Keeps small observations long after others move on' },
        glimpse: 'The eldest daughter of Queen Ecaterina and betrothed to Alexandru of Valenne, Elisabeta has been shaped by years of lessons, palace life and a future others find easy to picture. Composed, articulate and attentive to small details, she likes reading, a good argument, and occasionally getting away with something she ought not to have done—though there is more to her than the kingdom knows how to recognise.'
      },
      {
        key: 'ecaterina',
        name: 'Queen Ecaterina',
        epithet: 'The Sovereign',
        registry: { belonging: 'Royal Family', role: 'Reigning Queen of Norwyn', noted: 'Listens without interruption; makes small, settled corrections' },
        glimpse: 'Thoughtful, warm and exacting in equal measure, Ecaterina rarely seems hurried. Years of carrying the Crown have left her attentive to appearances, decisions and details left unguarded, yet she is also a mother to Elisabeta and Ileana—two roles that have never sat entirely apart.'
      },
      {
        key: 'ileana',
        name: 'Princess Ileana',
        epithet: 'The Second Daughter',
        registry: { belonging: 'Royal Family', role: 'Second Daughter of the Queen', noted: 'Draws to papers, records, figures and what outlasts an argument' },
        glimpse: 'Quiet, practical and dry in a humour easy to miss, Ileana notices what others forget to check. She knows the palace well, though often through records and details that leave her looking at the same rooms differently than everyone else.'
      },
      {
        key: 'dara',
        name: 'Prince Dara',
        epithet: "The Queen's Husband",
        registry: { belonging: 'Royal Family', role: 'Consort to Queen Ecaterina · Father', noted: 'Southern harbours, fishing boats and lighthouses' },
        glimpse: 'Warm, easy to please and hard to make solemn for long, Dara carries an enduring affection for the southern coast where he came from. Fond of his daughters and quick to find humour where others stay stiff, he has never made much effort to hide where he feels most at home.'
      },
      {
        key: 'safira',
        name: 'Safira',
        epithet: 'The Palace Cat',
        registry: { belonging: 'Royal Family', role: 'Uninvited Resident', noted: 'Notch in left ear; sleeps beneath Elisabeta\'s table' },
        glimpse: 'Small, grey and indifferent to rank, Safira slips into rooms she was never invited into and moves between the sisters\' quarters as if arranging the palace herself.'
      }
    ]
  },
  {
    threshold: 'FROM VALENNE',
    members: [
      {
        key: 'alexandru',
        name: 'Alexandru',
        epithet: 'The Intended',
        registry: { belonging: 'Valenne', role: 'Heir to Valenne · Betrothed', noted: 'Grey horse Marrow refuses to cross water' },
        glimpse: 'Tall, fair and seldom as formal as court occasions expect, Alexandru puts people at ease quickly and enjoys conversation, even when his memory for small details is slightly off. Easy company and easy to know are not always the same thing.'
      },
      {
        key: 'duvall',
        name: 'Ambassador Duvall',
        epithet: 'The Diplomat',
        registry: { belonging: 'Valenne', role: 'Ambassador to Norwyn', noted: 'Silver-haired; reads what is not asked directly' },
        glimpse: 'Spare and measured in manner, Duvall knows that court talk often circles around its real question, and he represents Valenne without letting much of himself into the room.'
      },
      {
        key: 'aubrac',
        name: 'Madame Aubrac',
        epithet: 'The Observer',
        registry: { belonging: 'Valenne', role: 'Member of Alexandru\'s Household', noted: 'Polite, attentive and rarely without her notebook' },
        glimpse: 'With an eye for arrangements, people, photographs and the small touches that shape how an occasion is remembered, Madame Aubrac seems less like someone merely attending than someone taking note.'
      }
    ]
  },
  {
    threshold: 'THE HOUSEHOLD',
    members: [
      {
        key: 'corrow',
        name: 'Mr. Corrow',
        epithet: 'The Tutor',
        registry: { belonging: 'The Household', role: 'Private Tutor (Four Years)', noted: 'Trims his own nibs; teaches Structural Ideology' },
        glimpse: 'Courteous, precise and fond of order, Mr. Corrow values a pupil who can explain not only what she believes, but why—and his lessons rarely give way just because other things crowd her mind.'
      },
      {
        key: 'anselm',
        name: 'Anselm',
        epithet: 'The Attendant',
        registry: { belonging: 'The Household', role: 'Attendant to Princess Elisabeta', noted: 'Keeps a log; reads paperbacks in corridors' },
        glimpse: 'Tall, slightly stooped and dry in his sense of duty, Anselm goes where the Princess goes. Because his presence is so constant, it is easy to overlook how much passes in front of him.'
      },
      {
        key: 'hale',
        name: 'Mrs. Hale',
        epithet: 'The Dresser',
        registry: { belonging: 'The Household', role: 'Royal Dresser (Nearly Thirty Years)', noted: 'Measurements, fabrics and an inconvenient pin' },
        glimpse: 'Direct and observant, Mrs. Hale knows what it takes to get a gown right under tight pressure—and thirty years of tending to appearances leaves very little unnoticed.'
      },
      {
        key: 'steward',
        name: 'The Steward',
        epithet: 'The Keeper of the Household',
        registry: { belonging: 'The Household', role: 'Senior Household Officer', noted: 'Schedules, correspondence and quiet palace order' },
        glimpse: 'Restrained and methodical, the steward oversees the daily machinery of schedules, notices and domestic arrangements that keep the palace running as expected.'
      },
      {
        key: 'staff',
        name: 'The Household Staff',
        epithet: 'The People Behind the Palace',
        registry: { belonging: 'The Household', role: 'Attendants, Maids, Cooks, Gardeners & Clerks', noted: 'Fires, rooms, papers, meals and repairs' },
        glimpse: 'Before the household wakes, fires are lit, rooms are aired, meals are planned and halls are set in order. The quiet of the palace is built out of work that rarely draws attention to itself.'
      }
    ]
  },
  {
    threshold: 'THE ACADEMY',
    members: [
      {
        key: 'calloway',
        name: 'Professor Calloway',
        epithet: 'The Lecturer',
        registry: { belonging: 'The Academy', role: 'Royal Academy of Governance', noted: 'Teaches Alignment; carries a folder to the lectern' },
        glimpse: 'Formal and composed, Professor Calloway uses everyday illustrations to draw out Structural Ideology—often leaving a plain example echoing longer than expected.'
      },
      {
        key: 'lucian',
        name: 'Lucian Fletcher',
        epithet: "The Joiner's Son",
        registry: { belonging: 'The Academy', role: 'Academy Student · Son of Tobias Fletcher', noted: 'Mended grey jumper, scar along jaw, pencil by ear' },
        glimpse: 'Broad-shouldered, slightly stooped and plain-spoken, Lucian knows wood from the yard side before it ever reaches a lecture room—and he is comfortable saying plainly when he does not know something.'
      },
      {
        key: 'tobias',
        name: 'Tobias Fletcher',
        epithet: 'The Joiner',
        registry: { belonging: 'The Academy & River Trade', role: 'Joiner · Timber Yard by River Siding', noted: 'Palace woodwork; knows what is truly finished' },
        glimpse: 'Broad, grey-haired and unhurried, Tobias works a timber yard beside the river siding and has done woodwork for the palace itself, where a joint either holds or it does not.'
      },
      {
        key: 'seminar',
        name: 'The Thursday Seminar',
        epithet: 'The Students',
        registry: { belonging: 'The Academy', role: 'Sokha Vann, Sabine Roque & Teodor Vasc', noted: 'Shared room, separate habits and opinions' },
        glimpse: 'Around the Thursday table sit Sokha Vann, Sabine Roque and Teodor Vasc—each bringing different habits, sharpness and amusement to the same room without becoming alike.'
      }
    ]
  },
  {
    threshold: 'GOVERNMENT AND PUBLIC LIFE',
    members: [
      {
        key: 'brask',
        name: 'Minister Brask',
        epithet: 'The Minister of Transport',
        registry: { belonging: 'Government', role: 'Transport, Carriage & Wharf', noted: 'Three daughters; busy office; warm moments' },
        glimpse: 'A substantial man with a busy office and three daughters, Brask deals with transport and wharf affairs that rarely grow simpler simply by being talked through.'
      },
      {
        key: 'fenn-vireak',
        name: 'Mr. Fenn and Vireak',
        epithet: 'The Photographers',
        registry: { belonging: 'Public Life', role: 'Royal Portrait Photographer & Assistant', noted: 'Light, stillness and quiet words not in Norwynian' },
        glimpse: 'While Fenn guides royal portraits, Vireak watches the light and murmurs softly in another tongue—working where people must hold still and trust the frame.'
      },
      {
        key: 'ives',
        name: 'Mrs. Ives',
        epithet: 'The Matron',
        registry: { belonging: 'Public Life', role: 'Almshouse Near the River Works', noted: 'A list, a ring of keys and steady oversight' },
        glimpse: 'Far from royal portraits, Mrs. Ives keeps a list, a ring of keys and a close watch over those in an almshouse beside the river works.'
      }
    ]
  }
];

const FLAT_PEOPLE = PEOPLE_GROUPS.reduce((acc, grp) => acc.concat(grp.members), []);

function setMobileMenuOpen(open) {
  const drawer = document.getElementById('mobileNav');
  const menuBtn = document.getElementById('mobileMenuBtn');
  const header = document.getElementById('siteHeader');
  if (!drawer) return;
  if (open) {
    drawer.classList.remove('hidden');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    if (header) header.classList.remove('-translate-y-full');
  } else {
    drawer.classList.add('hidden');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
  }
}

function toggleMobileNav() {
  const drawer = document.getElementById('mobileNav');
  if (!drawer) return;
  const willOpen = drawer.classList.contains('hidden');
  setMobileMenuOpen(willOpen);
}

function scrollToTopClean() {
  const prevBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  requestAnimationFrame(() => {
    document.documentElement.style.scrollBehavior = prevBehavior || '';
  });
}

function navigateTo(viewId, options) {
  const opts = options || {};
  const views = ['home', 'prologue', 'world', 'characters', 'reader', 'archive', 'author-note', 'disclaimer'];

  setMobileMenuOpen(false);

  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) {
      if (v === viewId) {
        el.classList.remove('view-hidden');
        el.classList.add('view-visible');
      } else {
        el.classList.add('view-hidden');
        el.classList.remove('view-visible');
      }
    }
  });

  if (viewId === 'reader') {
    activeEra = 'crowned';
    if (opts.resetIndex !== false) activeChapterIndex = null;
    renderReaderView();
  } else if (viewId === 'world') {
    if (opts.resetIndex !== false) activeWorldIndex = null;
    renderWorldView();
    const galleryMount = document.getElementById('norwynWorldGalleryMount');
    if (window.NorwynVisualArchive && typeof window.NorwynVisualArchive.mount === 'function' && galleryMount) {
      window.NorwynVisualArchive.mount(galleryMount);
    }
    if (window.NorwynWorldGallery && galleryMount) {
      window.NorwynWorldGallery.mount(galleryMount);
    }
  } else if (viewId === 'characters') {
    if (opts.resetIndex !== false) activePersonKey = null;
    renderPeopleView();
  } else if (viewId === 'archive' && window.ScriptoriumArchive) {
    window.ScriptoriumArchive.showShelf();
  }

  if (opts.scrollTargetId) {
    const target = document.getElementById(opts.scrollTargetId);
    if (target) {
      const headerH = (document.getElementById('siteHeader')?.offsetHeight || 80) + 16;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerH;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      return;
    }
  }

  scrollToTopClean();
}

function centerHybridPillOnce(strip, activePill) {
  if (!strip || !activePill) return;
  const targetLeft = activePill.offsetLeft - (strip.clientWidth - activePill.offsetWidth) / 2;
  strip.scrollLeft = Math.max(0, targetLeft);
}

function buildWorldArticleHtml(sec) {
  const btnStyle = "background-color: var(--primary-btn-bg); color: var(--primary-btn-text); border-color: var(--primary-btn-border);";
  const bodyHtml = sec.paragraphs.map(p => `<p class="entry-paragraph text-theme-text">${escapeHtmlText(p)}</p>`).join('\n');
  return `
    <div class="text-center mb-10 space-y-2">
      <p class="font-sans text-[10px] tracking-[0.3em] uppercase text-theme-secondary font-bold">${escapeHtmlText(sec.label)}</p>
      <h3 class="font-display text-2xl sm:text-3xl text-theme-text tracking-wide font-semibold">${escapeHtmlText(sec.title)}</h3>
      <div class="flex items-center justify-center gap-3 pt-3">
        <span class="w-8 h-px bg-theme-border"></span>
        <span class="text-theme-secondary text-[10px]">✦</span>
        <span class="w-8 h-px bg-theme-border"></span>
      </div>
    </div>
    <div class="space-y-5">
      ${bodyHtml}
    </div>
    <div class="mt-10 pt-7 border-t border-theme-border flex items-center justify-center">
      <button type="button" onclick="openWorldIndex()" style="${btnStyle}" class="py-2 px-4 border rounded-lg text-[10px] font-sans uppercase tracking-[0.18em] font-medium hover:border-theme-accent hover:text-theme-text transition-all shadow-sm cursor-pointer">
        Norwyn Index
      </button>
    </div>
  `;
}

function selectWorldSection(idx) {
  activeWorldIndex = idx;
  const existingStrip = document.getElementById('worldHybridStrip');
  const existingArticle = document.getElementById('worldReadingArticle');

  if (existingStrip && existingArticle) {
    const pills = existingStrip.querySelectorAll('[data-world-pill]');
    pills.forEach(pill => {
      const isMatch = parseInt(pill.getAttribute('data-world-pill'), 10) === idx;
      pill.classList.toggle('is-active', isMatch);
      if (isMatch) centerHybridPillOnce(existingStrip, pill);
    });
    existingArticle.innerHTML = buildWorldArticleHtml(WORLD_SECTIONS[idx]);
    return;
  }

  renderWorldView();
  const strip = document.getElementById('worldHybridStrip');
  const activePill = strip ? strip.querySelector(`[data-world-pill="${idx}"]`) : null;
  centerHybridPillOnce(strip, activePill);
}

function openWorldIndex() {
  activeWorldIndex = null;
  renderWorldView();
  scrollToTopClean();
}

function renderWorldView() {
  const container = document.getElementById('worldMainContainer');
  if (!container) return;

  const btnStyle = "background-color: var(--primary-btn-bg); color: var(--primary-btn-text); border-color: var(--primary-btn-border);";

  if (activeWorldIndex === null) {
    const listHtml = WORLD_SECTIONS.map((sec, idx) => `
      <button type="button" onclick="selectWorldSection(${idx})" style="${btnStyle}" class="w-full text-left p-4 md:p-5 border rounded-lg hover:border-theme-accent hover:text-theme-text transition-all shadow-sm cursor-pointer flex items-center justify-between gap-4">
        <div>
          <span class="font-sans text-[9px] tracking-[0.25em] uppercase opacity-80 block mb-1">${escapeHtmlText(sec.label)}</span>
          <h3 class="font-display text-sm md:text-base font-semibold tracking-wider">${escapeHtmlText(sec.title)}</h3>
        </div>
        <span class="font-sans text-[9px] uppercase tracking-[0.2em] text-theme-accent shrink-0">Read</span>
      </button>
    `).join('');

    container.innerHTML = `
      <div class="book-card p-7 md:p-9 rounded-sm space-y-4 font-serif prose-body text-theme-text text-justify mb-8">
        <p>Across the water, beyond the reach of familiar maps, lies an island kingdom of mountains, forests, winding rivers and old stone cities.</p>
        <p>Norwyn.</p>
        <p>A kingdom with a history of its own, an ancient royal lineage, customs carried across generations and a way of life shaped by the land, the weather and the people who call it home. Its Crown has passed from mother to daughter for centuries. Its capital stands far from the sea. Its grandest residences are warmed against the cold, its institutions have long histories, and even the smallest details of everyday life seem to belong to a world that has existed long before any of its present inhabitants.</p>
        <p>Yet Norwyn is not a kingdom frozen in time.</p>
        <p>Its railways carry goods across the island. Motor cars pass through old streets. Telephone calls interrupt quiet afternoons. Newspapers arrive with news from beyond its shores. In its towns, shops open, students attend their lessons, businesses change hands and families make their way through the ordinary complications of living.</p>
        <p class="font-serif italic text-theme-text-muted pt-2 text-center">
          There is much to discover here. But perhaps the most interesting things about Norwyn are not always the ones that announce themselves.
        </p>
      </div>

      <div class="space-y-2.5">
        ${listHtml}
      </div>
    `;
    return;
  }

  const sec = WORLD_SECTIONS[activeWorldIndex];
  const stripHtml = WORLD_SECTIONS.map((item, idx) => {
    const isCurrent = idx === activeWorldIndex;
    return `
      <button type="button" data-world-pill="${idx}" onclick="selectWorldSection(${idx})" class="nw-hybrid-pill ${isCurrent ? 'is-active' : ''}">
        <span class="font-sans text-[8px] tracking-[0.2em] uppercase opacity-75 block mb-0.5">${escapeHtmlText(item.label)}</span>
        <span class="font-display text-[11px] font-semibold tracking-wider block truncate">${escapeHtmlText(item.title)}</span>
      </button>
    `;
  }).join('');

  container.innerHTML = `
    <div class="mb-5">
      <div id="worldHybridStrip" class="nw-hybrid-strip" role="group" aria-label="Norwyn section selector">
        ${stripHtml}
      </div>
    </div>

    <article id="worldReadingArticle" class="book-card p-7 md:p-11 rounded-sm font-serif prose-body">
      ${buildWorldArticleHtml(sec)}
    </article>
  `;
}

function buildPersonArticleHtml(person) {
  const btnStyle = "background-color: var(--primary-btn-bg); color: var(--primary-btn-text); border-color: var(--primary-btn-border);";
  return `
    <div class="text-center mb-8 space-y-1.5">
      <p class="font-sans text-[10px] tracking-[0.3em] uppercase text-theme-secondary font-bold">${escapeHtmlText(person.epithet)}</p>
      <h3 class="font-display text-2xl sm:text-3xl text-theme-text tracking-wide font-semibold">${escapeHtmlText(person.name)}</h3>
    </div>

    <div class="border-t border-b border-theme-border-subtle py-3.5 px-4 mb-7 bg-theme-bg-subtle/50 space-y-1.5 text-sm font-sans">
      <div class="flex flex-wrap gap-2">
        <span class="text-[9px] uppercase tracking-[0.2em] text-theme-secondary font-bold w-24 shrink-0">Belonging</span>
        <span class="text-theme-text-muted">${escapeHtmlText(person.registry.belonging)}</span>
      </div>
      <div class="flex flex-wrap gap-2">
        <span class="text-[9px] uppercase tracking-[0.2em] text-theme-secondary font-bold w-24 shrink-0">Role</span>
        <span class="text-theme-text-muted">${escapeHtmlText(person.registry.role)}</span>
      </div>
      <div class="flex flex-wrap gap-2">
        <span class="text-[9px] uppercase tracking-[0.2em] text-theme-secondary font-bold w-24 shrink-0">Noted Detail</span>
        <span class="text-theme-text-muted">${escapeHtmlText(person.registry.noted)}</span>
      </div>
    </div>

    <p class="entry-paragraph text-theme-text">${escapeHtmlText(person.glimpse)}</p>

    <div class="mt-10 pt-7 border-t border-theme-border flex items-center justify-center">
      <button type="button" onclick="openPeopleIndex()" style="${btnStyle}" class="py-2 px-4 border rounded-lg text-[10px] font-sans uppercase tracking-[0.18em] font-medium hover:border-theme-accent hover:text-theme-text transition-all shadow-sm cursor-pointer">
        Character Index
      </button>
    </div>
  `;
}

function selectPerson(key) {
  activePersonKey = key;
  const existingStrip = document.getElementById('peopleHybridStrip');
  const existingArticle = document.getElementById('peopleReadingArticle');
  const person = FLAT_PEOPLE.find(m => m.key === key) || FLAT_PEOPLE[0];

  if (existingStrip && existingArticle) {
    const pills = existingStrip.querySelectorAll('[data-person-pill]');
    pills.forEach(pill => {
      const isMatch = pill.getAttribute('data-person-pill') === key;
      pill.classList.toggle('is-active', isMatch);
      if (isMatch) centerHybridPillOnce(existingStrip, pill);
    });
    existingArticle.innerHTML = buildPersonArticleHtml(person);
    return;
  }

  renderPeopleView();
  const strip = document.getElementById('peopleHybridStrip');
  const activePill = strip ? strip.querySelector(`[data-person-pill="${key}"]`) : null;
  centerHybridPillOnce(strip, activePill);
}

function openPeopleIndex() {
  activePersonKey = null;
  renderPeopleView();
  scrollToTopClean();
}

function renderPeopleView() {
  const container = document.getElementById('peopleMainContainer');
  if (!container) return;

  const btnStyle = "background-color: var(--primary-btn-bg); color: var(--primary-btn-text); border-color: var(--primary-btn-border);";

  if (activePersonKey === null) {
    const groupsHtml = PEOPLE_GROUPS.map(grp => {
      const rows = grp.members.map(m => `
        <button type="button" onclick="selectPerson('${m.key}')" style="${btnStyle}" class="w-full text-left p-4 border rounded-lg hover:border-theme-accent hover:text-theme-text transition-all shadow-sm cursor-pointer flex items-center justify-between gap-4">
          <div>
            <h4 class="font-display text-sm md:text-base font-semibold tracking-wide">${escapeHtmlText(m.name)}</h4>
            <span class="font-sans text-[9px] tracking-[0.22em] uppercase text-theme-secondary font-bold block mt-0.5">${escapeHtmlText(m.epithet)}</span>
          </div>
          <span class="font-sans text-[9px] uppercase tracking-[0.2em] text-theme-accent shrink-0">Glimpse</span>
        </button>
      `).join('');

      return `
        <div class="space-y-2.5">
          <h3 class="font-sans text-[10px] tracking-[0.28em] uppercase text-theme-secondary font-bold pb-1.5 border-b border-theme-border-subtle">
            ${escapeHtmlText(grp.threshold)}
          </h3>
          <div class="space-y-2">
            ${rows}
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="book-card p-7 md:p-9 rounded-sm space-y-4 font-serif prose-body text-theme-text text-justify mb-8">
        <p>The kingdom of Norwyn is home to all sorts of characters, each with a history, a place in the world, and a life that extends far beyond what others see of them. Some live within the Royal Palace. Others belong to the institutions that keep the kingdom running, work along its river, study in its academies, or return each evening to homes far removed from royal life.</p>
        <p>Their paths cross in ways both ordinary and unexpected. They carry their own habits, loyalties, ambitions, opinions and private understandings of the world. Some are accustomed to being noticed. Others prefer it when they are not.</p>
        <p class="font-serif italic text-theme-text-muted pt-2 text-center">
          These are a few of the characters you will meet in <em>Or So She Thought</em>.
        </p>
      </div>

      <div class="space-y-7 mb-8">
        ${groupsHtml}
      </div>

      <div class="book-card p-7 md:p-9 rounded-sm space-y-4 font-serif prose-body text-theme-text text-justify">
        <span class="font-sans text-[10px] tracking-[0.28em] uppercase text-theme-secondary font-bold block text-center">BEYOND THE TITLES</span>
        <p>In Norwyn, characters are often introduced by what they are, where they belong, whom they serve, or what they are expected to do.</p>
        <p>A Princess. A tutor. A joiner. A lecturer. A minister. A matron.</p>
        <p>But a title is only the beginning of knowing someone.</p>
        <p>The characters in <em>Or So She Thought</em> have their own ways of seeing the world, their own private habits, and their own understandings of what matters. Some are certain of their place. Some are still working it out. Others have never thought to question it.</p>
        <p>You will meet them in the palace, in the Academy, at formal gatherings, in offices, in workshops and in the ordinary moments between one thing and the next.</p>
        <p>You may think you know them quite quickly.</p>
        <p class="font-serif italic text-theme-text-muted pt-2 text-center">
          Norwyn has a way of making that less certain.
        </p>
      </div>
    `;
    return;
  }

  const person = FLAT_PEOPLE.find(m => m.key === activePersonKey) || FLAT_PEOPLE[0];

  const stripHtml = FLAT_PEOPLE.map(m => {
    const isCurrent = m.key === person.key;
    return `
      <button type="button" data-person-pill="${m.key}" onclick="selectPerson('${m.key}')" class="nw-hybrid-pill ${isCurrent ? 'is-active' : ''}">
        <span class="font-sans text-[8px] tracking-[0.2em] uppercase opacity-75 block mb-0.5">${escapeHtmlText(m.epithet)}</span>
        <span class="font-display text-[11px] font-semibold tracking-wider block truncate">${escapeHtmlText(m.name)}</span>
      </button>
    `;
  }).join('');

  container.innerHTML = `
    <div class="mb-5">
      <div id="peopleHybridStrip" class="nw-hybrid-strip" role="group" aria-label="Character selector">
        ${stripHtml}
      </div>
    </div>

    <article id="peopleReadingArticle" class="book-card p-7 md:p-11 rounded-sm font-serif prose-body">
      ${buildPersonArticleHtml(person)}
    </article>
  `;
}

function getChapterStripLabels(chapter) {
  const rawNum = stripHtmlToPlainText(chapter.number);
  const rawTitle = stripHtmlToPlainText(chapter.title);
  const numMatch = rawNum.match(/^(?:Chapter\s+)?([A-Za-z0-9]+)$/i);
  const shortNum = numMatch ? `Ch. ${numMatch[1]}` : rawNum;

  if (rawTitle && rawTitle.toLowerCase() !== rawNum.toLowerCase()) {
    return {
      eyebrow: shortNum,
      label: rawTitle
    };
  }
  return {
    eyebrow: 'Chapter',
    label: rawNum || 'Chapter'
  };
}

function transitionReaderContent(commitFn) {
  const sheet = document.getElementById('readerMainContainer');
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!sheet || prefersReduced) {
    commitFn();
    scrollToTopClean();
    return;
  }

  if (chapterTransitionTimer) {
    clearTimeout(chapterTransitionTimer);
    chapterTransitionTimer = null;
  }

  sheet.classList.add('is-fading-out');
  chapterTransitionTimer = setTimeout(() => {
    commitFn();
    scrollToTopClean();
    requestAnimationFrame(() => {
      sheet.classList.remove('is-fading-out');
    });
  }, 210);
}

function openReaderIndex(useCrossFade) {
  const commit = () => {
    activeEra = 'crowned';
    activeChapterIndex = null;
    renderReaderView();
  };
  if (useCrossFade) {
    transitionReaderContent(commit);
  } else {
    commit();
    scrollToTopClean();
  }
}

function buildOpenedChapterHtml(eraChapters, idx) {
  const chapter = eraChapters[idx];
  const hasPrev = idx > 0;
  const hasNext = idx + 1 < eraChapters.length;
  const btnStyle = "background-color: var(--primary-btn-bg); color: var(--primary-btn-text); border-color: var(--primary-btn-border);";

  let cleanContent = chapter.content.trim();
  if (chapter.title) {
    const plainTitle = stripHtmlToPlainText(chapter.title);
    const plainNum = stripHtmlToPlainText(chapter.number);
    const titlePatternRegex = new RegExp(`^(?:Chapter\\s+[A-Za-z]+\\s*:\\s*${plainTitle}|${plainNum}\\s*:\\s*${plainTitle}|${plainTitle})\\s*`, 'i');
    cleanContent = cleanContent.replace(titlePatternRegex, '').trim();
  }

  const paragraphs = cleanContent
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);

  const formattedParagraphs = paragraphs.map(formatChapterParagraphHtml).join('\n');

  const nextChapter = hasNext ? eraChapters[idx + 1] : null;
  const nextNumText = nextChapter ? stripHtmlToPlainText(nextChapter.number) : '';
  const nextTitleText = nextChapter && nextChapter.title ? stripHtmlToPlainText(nextChapter.title) : '';

  const nextPlateHtml = nextChapter
    ? `
      <button type="button" onclick="selectChapter('${activeEra}', ${idx + 1}, true)" class="book-card w-full p-6 md:p-8 rounded-sm space-y-2 text-center hover:border-theme-accent transition-all cursor-pointer block">
        <span class="font-sans text-[9px] tracking-[0.28em] uppercase text-theme-secondary font-bold block">
          Next in the Story
        </span>
        <h3 class="font-display text-lg md:text-xl text-theme-text font-semibold tracking-wide">
          ${escapeHtmlText(nextNumText)}
        </h3>
        ${nextTitleText ? `<p class="font-serif italic text-theme-text-muted text-base">${escapeHtmlText(nextTitleText)}</p>` : ''}
      </button>
    `
    : `
      <div class="book-card w-full p-6 md:p-8 rounded-sm space-y-2 text-center">
        <span class="font-sans text-[9px] tracking-[0.28em] uppercase text-theme-secondary font-bold block">
          End of Available Chapters
        </span>
        <p class="font-serif italic text-theme-text-muted text-base">
          You have reached the end of the chapters currently available here.
        </p>
      </div>
    `;

  return `
    <article id="readingBody" class="text-lg leading-relaxed font-serif transition-all duration-200">
      <div class="text-center mb-12 space-y-2.5">
        <p class="font-sans text-[11px] tracking-[0.3em] uppercase text-theme-secondary font-bold">${escapeHtmlText(stripHtmlToPlainText(chapter.number))}</p>
        ${chapter.title ? `<h2 class="font-display text-2xl sm:text-3xl text-theme-text tracking-wide font-semibold">${escapeHtmlText(stripHtmlToPlainText(chapter.title))}</h2>` : ''}
        <div class="flex items-center justify-center gap-3 pt-4">
          <span class="w-8 h-px bg-theme-border"></span>
          <span class="text-theme-secondary text-[10px]">✦</span>
          <span class="w-8 h-px bg-theme-border"></span>
        </div>
      </div>

      <div class="space-y-6">
        ${formattedParagraphs}
      </div>

      <div class="flex items-center justify-center gap-3 my-12">
        <span class="w-10 h-px bg-theme-border"></span>
        <span class="text-theme-accent text-xs">✦</span>
        <span class="w-10 h-px bg-theme-border"></span>
      </div>

      <div class="space-y-5">
        ${nextPlateHtml}
        ${hasPrev ? `
          <div class="flex items-center justify-start pt-1">
            <button type="button" onclick="selectChapter('${activeEra}', ${idx - 1}, true)" style="${btnStyle}" class="py-2 px-4 border rounded-lg text-[10px] font-sans uppercase tracking-[0.18em] font-medium hover:border-theme-accent hover:text-theme-text transition-all shadow-sm cursor-pointer">
              Previous Chapter
            </button>
          </div>
        ` : ''}
      </div>
    </article>
  `;
}

function selectChapter(era, index, useCrossFade) {
  activeEra = 'crowned';
  activeChapterIndex = index;
  markChapterAsRead(activeEra, index);

  const eraChapters = (typeof NOVEL_CHAPTERS !== 'undefined' && NOVEL_CHAPTERS[activeEra]) ? NOVEL_CHAPTERS[activeEra] : null;
  const existingStrip = document.getElementById('chapterHybridStrip');
  const existingArticleHost = document.getElementById('chapterReadingHost');

  if (eraChapters && existingStrip && existingArticleHost) {
    const pills = existingStrip.querySelectorAll('[data-chapter-pill]');
    pills.forEach(pill => {
      const isMatch = parseInt(pill.getAttribute('data-chapter-pill'), 10) === index;
      pill.classList.toggle('is-active', isMatch);
      if (isMatch) centerHybridPillOnce(existingStrip, pill);
    });

    const swapArticle = () => {
      existingArticleHost.innerHTML = buildOpenedChapterHtml(eraChapters, index);
      const readingBody = document.getElementById('readingBody');
      if (readingBody) {
        readingBody.style.fontSize = `${baseFontSize}px`;
        readingBody.style.lineHeight = `${baseFontSize * 1.75}px`;
      }
    };

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!useCrossFade || prefersReduced) {
      swapArticle();
      scrollToTopClean();
      return;
    }

    if (chapterTransitionTimer) {
      clearTimeout(chapterTransitionTimer);
      chapterTransitionTimer = null;
    }
    existingArticleHost.classList.add('is-fading-out');
    chapterTransitionTimer = setTimeout(() => {
      swapArticle();
      scrollToTopClean();
      requestAnimationFrame(() => {
        existingArticleHost.classList.remove('is-fading-out');
      });
    }, 210);
    return;
  }

  const commit = () => {
    renderReaderView();
    const readingBody = document.getElementById('readingBody');
    if (readingBody) {
      readingBody.style.fontSize = `${baseFontSize}px`;
      readingBody.style.lineHeight = `${baseFontSize * 1.75}px`;
    }
  };

  if (useCrossFade) {
    transitionReaderContent(commit);
  } else {
    commit();
    scrollToTopClean();
  }
}

function renderReaderView() {
  const mainContainer = document.getElementById('readerMainContainer');
  const topBar = document.getElementById('readerTopNavBar');

  if (typeof NOVEL_CHAPTERS === 'undefined' || !NOVEL_CHAPTERS[activeEra]) {
    if (topBar) topBar.innerHTML = '';
    mainContainer.innerHTML = `<p class="text-center text-theme-text-muted py-12">Chapter files (chapters.js) not loaded properly.</p>`;
    return;
  }

  const eraChapters = NOVEL_CHAPTERS[activeEra];
  const readSet = getReadChaptersSet();
  const btnStyle = "background-color: var(--primary-btn-bg); color: var(--primary-btn-text); border-color: var(--primary-btn-border);";

  if (activeChapterIndex === null) {
    if (topBar) topBar.innerHTML = '';

    const chapterButtonsHtml = eraChapters.map((ch, idx) => {
      const isRead = readSet.has(`${activeEra}:${idx}`);
      const statusText = isRead ? 'Read' : 'Unread';
      const statusClass = isRead ? 'text-theme-accent' : 'text-theme-text-faint';

      return `
        <button type="button" onclick="selectChapter('${activeEra}', ${idx}, true)" style="${btnStyle}" class="w-full text-left p-4 md:p-5 border rounded-lg hover:border-theme-accent hover:text-theme-text transition-all shadow-sm cursor-pointer flex items-center justify-between gap-4">
          <div>
            <span class="font-sans text-[9px] tracking-[0.25em] uppercase opacity-80 block mb-1">${escapeHtmlText(stripHtmlToPlainText(ch.number))}</span>
            ${ch.title ? `<h3 class="font-display text-base md:text-lg font-semibold text-theme-text">${escapeHtmlText(stripHtmlToPlainText(ch.title))}</h3>` : ''}
          </div>
          <span class="font-sans text-[9px] uppercase tracking-[0.2em] ${statusClass} shrink-0">${statusText}</span>
        </button>
      `;
    }).join('');

    mainContainer.innerHTML = `
      <div class="text-center mb-9 space-y-1.5">
        <h2 class="font-display text-2xl md:text-3xl text-theme-text tracking-wide font-semibold">Chapter Index</h2>
        <p class="font-sans text-[10px] tracking-[0.24em] uppercase text-theme-secondary">
          ${readSet.size} of ${eraChapters.length} Read
        </p>
      </div>

      <div class="space-y-3">
        ${chapterButtonsHtml}
      </div>
    `;
    return;
  }

  const hasPrev = activeChapterIndex > 0;

  if (topBar) {
    topBar.innerHTML = `
      <div class="flex items-center gap-2">
        <button type="button" onclick="openReaderIndex(true)" style="${btnStyle}" class="py-1.5 px-3 border rounded-lg text-[10px] font-sans uppercase tracking-[0.18em] font-medium hover:border-theme-accent hover:text-theme-text transition-all shadow-sm cursor-pointer">
          Chapter Index
        </button>
        ${hasPrev ? `
          <button type="button" onclick="selectChapter('${activeEra}', ${activeChapterIndex - 1}, true)" style="${btnStyle}" class="py-1.5 px-3 border rounded-lg text-[10px] font-sans uppercase tracking-[0.18em] font-medium hover:border-theme-accent hover:text-theme-text transition-all shadow-sm cursor-pointer">
            Previous
          </button>
        ` : ''}
      </div>
    `;
  }

  const chapterStripHtml = eraChapters.map((ch, idx) => {
    const isCurrent = idx === activeChapterIndex;
    const pillParts = getChapterStripLabels(ch);
    return `
      <button type="button" data-chapter-pill="${idx}" onclick="selectChapter('${activeEra}', ${idx}, true)" class="nw-hybrid-pill ${isCurrent ? 'is-active' : ''}">
        <span class="font-sans text-[8px] tracking-[0.2em] uppercase opacity-75 block mb-0.5">${escapeHtmlText(pillParts.eyebrow)}</span>
        <span class="font-display text-[11px] font-semibold tracking-wider block truncate">${escapeHtmlText(pillParts.label)}</span>
      </button>
    `;
  }).join('');

  mainContainer.innerHTML = `
    <div class="mb-6">
      <div id="chapterHybridStrip" class="nw-hybrid-strip" role="group" aria-label="Chapter selector">
        ${chapterStripHtml}
      </div>
    </div>
    <div id="chapterReadingHost" class="leaf-sheet">
      ${buildOpenedChapterHtml(eraChapters, activeChapterIndex)}
    </div>
  `;

  const strip = document.getElementById('chapterHybridStrip');
  const activePill = strip ? strip.querySelector(`[data-chapter-pill="${activeChapterIndex}"]`) : null;
  centerHybridPillOnce(strip, activePill);
}

function changeFontSize(delta) {
  baseFontSize = Math.min(26, Math.max(16, baseFontSize + (delta * 1.5)));
  const readingBody = document.getElementById('readingBody');
  if (readingBody) {
    readingBody.style.fontSize = `${baseFontSize}px`;
    readingBody.style.lineHeight = `${baseFontSize * 1.75}px`;
  }
}

function applyTheme(ivory) {
  const rootHtml = document.getElementById('rootHtml');
  const themeText = document.getElementById('themeToggleText');
  const iconSun = document.getElementById('themeIconSun');
  const iconMoon = document.getElementById('themeIconMoon');

  if (ivory) {
    rootHtml.classList.remove('theme-dark');
    rootHtml.classList.add('theme-ivory');
    if (themeText) themeText.textContent = "Night Mode";
    if (iconSun) iconSun.classList.add('hidden');
    if (iconMoon) iconMoon.classList.remove('hidden');
  } else {
    rootHtml.classList.remove('theme-ivory');
    rootHtml.classList.add('theme-dark');
    if (themeText) themeText.textContent = "Ivory Mode";
    if (iconSun) iconSun.classList.remove('hidden');
    if (iconMoon) iconMoon.classList.add('hidden');
  }

  isIvoryMode = ivory;
  localStorage.setItem('novel_theme_mode', ivory ? 'ivory' : 'dark');
  if (window.ScriptoriumArchive) {
    window.ScriptoriumArchive.reflow();
  }
}

function toggleGlobalTheme() {
  applyTheme(!isIvoryMode);
}

let lastScrollY = window.pageYOffset;
window.addEventListener('scroll', () => {
  const header = document.getElementById('siteHeader');
  const drawer = document.getElementById('mobileNav');
  if (!header) return;
  if (drawer && !drawer.classList.contains('hidden')) {
    header.classList.remove('-translate-y-full');
    lastScrollY = window.pageYOffset;
    return;
  }
  const currentScrollY = window.pageYOffset;
  (currentScrollY <= 20) ? header.classList.remove('-translate-y-full') : (currentScrollY > lastScrollY && currentScrollY > 80) ? header.classList.add('-translate-y-full') : header.classList.remove('-translate-y-full');
  lastScrollY = currentScrollY;
}, { passive: true });

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('novel_theme_mode');
  if (savedTheme === 'ivory') {
    applyTheme(true);
  } else {
    applyTheme(false);
  }
  navigateTo('home');
});
