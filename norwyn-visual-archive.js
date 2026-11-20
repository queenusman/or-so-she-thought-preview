(function () {
  'use strict';

  const NORWYN_IMAGES = [
    {
      id: "NW-001",
      title: "Approach to the Inland Capital",
      imagePath: "images/kingdom/the-capital-01.jpg",
      category: "The Kingdom",
      location: "The Capital",
      season: "Autumn",
      collections: ["The Kingdom", "The Capital", "Autumn"],
      caption: "The inland seat of the Crown viewed across the autumn approach.",
      description: "Plate prepared for the inland capital of Norwyn, seat of the monarch and heart of royal administration.",
      displayOrder: 1,
      featured: true
    },
    {
      id: "NW-002",
      title: "The Royal Palace Facade",
      imagePath: "images/kingdom/royal-palace-01.jpg",
      category: "The Kingdom",
      location: "The Royal Palace",
      season: "Winter",
      collections: ["The Kingdom", "The Royal Palace", "Architecture", "Royal Architecture", "Palaces", "Royal Life", "Royal Residences", "Winter"],
      caption: "Principal elevation of the Royal Palace during the winter months.",
      description: "Primary residence of the reigning Queen, Prince consort, and royal household in the inland capital.",
      displayOrder: 2,
      featured: true
    },
    {
      id: "NW-003",
      title: "Terraces of the Royal Gardens",
      imagePath: "images/kingdom/royal-gardens-01.jpg",
      category: "The Kingdom",
      location: "Royal Gardens",
      season: "Spring",
      collections: ["The Kingdom", "Royal Gardens", "Royal Life", "Royal Residences", "Spring"],
      caption: "Early spring growth along the sheltered walks of the Royal Gardens.",
      description: "Enclosed palace grounds cultivated for the seasonal transition into Norwynian spring.",
      displayOrder: 3,
      featured: true
    },
    {
      id: "NW-004",
      title: "Seat of an Aristocratic Estate",
      imagePath: "images/kingdom/aristocratic-estate-01.jpg",
      category: "The Kingdom",
      location: "Aristocratic Estates",
      season: "Autumn",
      collections: ["The Kingdom", "Aristocratic Estates", "Architecture", "Estates", "Autumn"],
      caption: "A noble country seat set within surrounding parkland.",
      description: "Visual record of a hereditary estate held under the matrilineal houses of the realm.",
      displayOrder: 4,
      featured: false
    },
    {
      id: "NW-005",
      title: "Harbourfront of a Coastal Town",
      imagePath: "images/kingdom/coastal-town-01.jpg",
      category: "The Kingdom",
      location: "Coastal Towns",
      season: "Spring",
      collections: ["The Kingdom", "Coastal Towns", "Daily Life", "Transportation", "Spring"],
      caption: "Maritime quays and stone seawalls along Norwyn's island coast.",
      description: "Coastal settlement connecting sea routes with the inland roads leading toward the capital.",
      displayOrder: 5,
      featured: true
    },
    {
      id: "NW-006",
      title: "Inland Village Lane",
      imagePath: "images/kingdom/village-01.jpg",
      category: "The Kingdom",
      location: "Villages",
      season: "Autumn",
      collections: ["The Kingdom", "Villages", "Architecture", "Residential Architecture", "Autumn"],
      caption: "Dwellings and stone walls along a quiet village thoroughfare.",
      description: "Domestic scale and vernacular construction in an inland Norwynian settlement.",
      displayOrder: 6,
      featured: false
    },
    {
      id: "NW-007",
      title: "Open Countryside Under Winter Sky",
      imagePath: "images/kingdom/countryside-01.jpg",
      category: "The Kingdom",
      location: "Countryside",
      season: "Winter",
      collections: ["The Kingdom", "Countryside", "Winter"],
      caption: "Pastures, hedgerows, and distant hills in winter stillness.",
      description: "The rural expanse separating the island's coastal towns from its inland capital.",
      displayOrder: 7,
      featured: false
    },
    {
      id: "NW-008",
      title: "Capital Streets and Morning Market",
      imagePath: "images/kingdom/streets-markets-01.jpg",
      category: "The Kingdom",
      location: "Streets and Markets",
      season: "Spring",
      collections: ["The Kingdom", "Streets and Markets", "Daily Life", "Markets", "Public Spaces", "Spring"],
      caption: "Merchants and townspeople gathering in a paved market square.",
      description: "Commercial life unfolding across the public streets and open markets of the city.",
      displayOrder: 8,
      featured: false
    },
    {
      id: "NW-009",
      title: "Civic Hall and Public Building",
      imagePath: "images/architecture/public-building-01.jpg",
      category: "Architecture",
      location: "The Capital",
      season: "Autumn",
      collections: ["Architecture", "Public Buildings", "Daily Life", "Public Spaces", "Autumn"],
      caption: "Masonry facade of an administrative hall in the capital.",
      description: "Civic architecture built to house royal registries and municipal offices.",
      displayOrder: 9,
      featured: false
    },
    {
      id: "NW-010",
      title: "Carved Stonework and Window Mullions",
      imagePath: "images/architecture/architectural-details-01.jpg",
      category: "Architecture",
      location: "The Royal Palace",
      season: "Winter",
      collections: ["Architecture", "Architectural Details", "Royal Architecture", "Winter"],
      caption: "Close study of dressed stone, lintels, and ironwork.",
      description: "Detail plate documenting Norwynian masonry craft and window proportions.",
      displayOrder: 10,
      featured: false
    },
    {
      id: "NW-011",
      title: "The Sovereign's Chamber",
      imagePath: "images/interiors/royal-chambers-01.jpg",
      category: "Interiors",
      location: "The Royal Palace",
      season: "Winter",
      collections: ["Interiors", "Royal Chambers", "Royal Life", "Royal Residences", "Winter"],
      caption: "Private apartments reserved for the reigning monarch.",
      description: "Interior study of the royal chambers within the inner wing of the palace.",
      displayOrder: 11,
      featured: true
    },
    {
      id: "NW-012",
      title: "Drawing Room overlooking the Gardens",
      imagePath: "images/interiors/drawing-room-01.jpg",
      category: "Interiors",
      location: "Aristocratic Estates",
      season: "Spring",
      collections: ["Interiors", "Drawing Rooms", "Spring"],
      caption: "Afternoon light entering a formal reception and drawing room.",
      description: "Furnishings, wall panelling, and tall casements arranged for daytime gatherings.",
      displayOrder: 12,
      featured: false
    },
    {
      id: "NW-013",
      title: "The Grand Ballroom",
      imagePath: "images/interiors/ballroom-01.jpg",
      category: "Interiors",
      location: "The Royal Palace",
      season: "Winter",
      collections: ["Interiors", "Ballrooms", "Royal Life", "Ceremonial Occasions", "Winter"],
      caption: "Ceremonial hall prepared for court assemblies and evening receptions.",
      description: "Expansive palace interior proportioned for state occasions during the winter court season.",
      displayOrder: 13,
      featured: false
    },
    {
      id: "NW-014",
      title: "State Dining Room",
      imagePath: "images/interiors/dining-room-01.jpg",
      category: "Interiors",
      location: "The Royal Palace",
      season: "Autumn",
      collections: ["Interiors", "Dining Rooms", "Daily Life", "Food", "Autumn"],
      caption: "Long table laid for formal court dining.",
      description: "Architectural dining room appointed with tableware, linens, and candlelight.",
      displayOrder: 14,
      featured: false
    },
    {
      id: "NW-015",
      title: "The Royal Archive Library",
      imagePath: "images/interiors/library-01.jpg",
      category: "Interiors",
      location: "The Royal Palace",
      season: "Autumn",
      collections: ["Interiors", "Libraries", "Autumn"],
      caption: "Floor-to-ceiling shelving housing bound chronicles and genealogies.",
      description: "Repository of royal records documenting female-line succession across generations.",
      displayOrder: 15,
      featured: true
    },
    {
      id: "NW-016",
      title: "Private Study and Writing Desk",
      imagePath: "images/interiors/private-study-01.jpg",
      category: "Interiors",
      location: "The Royal Palace",
      season: "Winter",
      collections: ["Interiors", "Private Studies", "Winter"],
      caption: "Quiet room arranged for correspondence and state papers.",
      description: "Intimate interior workspace furnished with timber desk, maps, and ledger volumes.",
      displayOrder: 16,
      featured: false
    },
    {
      id: "NW-017",
      title: "Vaulted Palace Corridor",
      imagePath: "images/interiors/corridor-01.jpg",
      category: "Interiors",
      location: "The Royal Palace",
      season: "Spring",
      collections: ["Interiors", "Corridors", "Architecture", "Architectural Details", "Spring"],
      caption: "Long gallery connecting the state rooms to the private wings.",
      description: "Perspective study of stone flooring, rhythmic arches, and tall side windows.",
      displayOrder: 17,
      featured: false
    },
    {
      id: "NW-018",
      title: "Court Procession and State Ceremony",
      imagePath: "images/royal/ceremonial-occasions-01.jpg",
      category: "Royal Life",
      location: "The Capital",
      season: "Spring",
      collections: ["Royal Life", "Ceremonial Occasions", "Spring"],
      caption: "Formal assembly marking an official royal observance.",
      description: "Visual documentation of court protocol and public ceremony in the capital.",
      displayOrder: 18,
      featured: false
    },
    {
      id: "NW-019",
      title: "Regalia, Brooches, and Royal Jewellery",
      imagePath: "images/royal/jewellery-accessories-01.jpg",
      category: "Royal Life",
      location: "The Royal Palace",
      season: "Winter",
      collections: ["Royal Life", "Jewellery and Accessories", "Royal Objects", "Royal Clothing", "Winter"],
      caption: "Heirloom metalwork and ceremonial ornaments of the Crown.",
      description: "Close study of royal adornments passed down through the female line of succession.",
      displayOrder: 19,
      featured: false
    },
    {
      id: "NW-020",
      title: "Formal Court Portraiture & Attire",
      imagePath: "images/royal/portraiture-01.jpg",
      category: "Royal Life",
      location: "The Royal Palace",
      season: "Autumn",
      collections: ["Royal Life", "Portraiture", "Royal Clothing", "Autumn"],
      caption: "Official study of royal dress, tailoring, and court portraiture.",
      description: "Record of sovereign and consort attire rendered in formal ceremonial posture.",
      displayOrder: 20,
      featured: false
    },
    {
      id: "NW-021",
      title: "Artisan Workshops, Shops, and Everyday Dress",
      imagePath: "images/daily/shops-crafts-01.jpg",
      category: "Daily Life",
      location: "Streets and Markets",
      season: "Spring",
      collections: ["Daily Life", "Shops", "Crafts", "Clothing", "Spring"],
      caption: "Storefronts, woven textiles, and regional craft traditions.",
      description: "Everyday garments, shopfronts, and handwork across Norwyn's towns.",
      displayOrder: 21,
      featured: false
    }
  ];

  const SECTIONS = {
    overview: {
      title: "NORWYN",
      subtitle: "A kingdom beyond the pages.",
      subcollections: []
    },
    kingdom: {
      title: "The Kingdom",
      subtitle: "Geography, settlements, and domains of the island realm.",
      subcollections: [
        "All", "The Capital", "The Royal Palace", "Royal Gardens",
        "Aristocratic Estates", "Coastal Towns", "Villages", "Countryside", "Streets and Markets"
      ]
    },
    architecture: {
      title: "Architecture",
      subtitle: "Built form from sovereign seats to domestic stonework.",
      subcollections: [
        "All", "Royal Architecture", "Palaces", "Estates",
        "Public Buildings", "Residential Architecture", "Architectural Details"
      ]
    },
    interiors: {
      title: "Interiors",
      subtitle: "Chambers, halls, libraries, and private quarters.",
      subcollections: [
        "All", "Royal Chambers", "Drawing Rooms", "Ballrooms",
        "Dining Rooms", "Libraries", "Private Studies", "Corridors"
      ]
    },
    seasons: {
      title: "Through the Seasons",
      subtitle: "The three seasons of Norwyn: Spring, Autumn, and Winter.",
      subcollections: ["Spring", "Autumn", "Winter"]
    },
    royal: {
      title: "Royal Life",
      subtitle: "The Crown, court ceremony, regalia, and portraiture.",
      subcollections: [
        "All", "Royal Residences", "Ceremonial Occasions", "Royal Clothing",
        "Jewellery and Accessories", "Royal Objects", "Portraiture"
      ]
    },
    daily: {
      title: "Daily Life",
      subtitle: "Commerce, nourishment, dress, transit, and handcraft.",
      subcollections: [
        "All", "Markets", "Shops", "Food",
        "Clothing", "Public Spaces", "Transportation", "Crafts"
      ]
    },
    archive: {
      title: "The Visual Archive",
      subtitle: "Complete searchable index across all categories, locations, and seasons.",
      subcollections: []
    }
  };

  const state = {
    container: null,
    activeSection: "overview",
    activeSubcollection: "All",
    activeSeason: "Spring",
    archiveFilters: {
      search: "",
      category: "All",
      location: "All",
      season: "All"
    },
    lightboxList: [],
    lightboxIndex: 0
  };

  function injectStyles() {
    if (document.getElementById("norwynVisualArchiveStyles")) return;
    const style = document.createElement("style");
    style.id = "norwynVisualArchiveStyles";
    style.textContent = `
      .nva-wrap { margin-top: 1.5rem; }
      .nva-toolbar {
        display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
        gap: 0.75rem; padding-bottom: 1rem; margin-bottom: 1.5rem;
        border-bottom: 1px solid var(--color-border-subtle);
      }
      .nva-tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; }
      .nva-tab {
        background: var(--primary-btn-bg); color: var(--primary-btn-text);
        border: 1px solid var(--primary-btn-border); border-radius: 8px;
        padding: 0.45rem 0.85rem; font-family: 'Inter', sans-serif;
        font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
        cursor: pointer; transition: all 0.2s ease;
      }
      .nva-tab:hover, .nva-tab.active {
        border-color: var(--color-accent); color: var(--color-text);
      }
      .nva-grid {
        display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 1.25rem;
      }
      .nva-card {
        background: var(--color-panel); border: 1px solid var(--color-border);
        border-radius: 4px; padding: 0.9rem; box-shadow: var(--card-shadow);
        cursor: pointer; display: flex; flex-direction: column; gap: 0.65rem;
        transition: border-color 0.2s ease, background-color 0.2s ease;
      }
      .nva-card:hover { border-color: var(--color-accent); background: var(--color-panel-hover); }
      .nva-frame {
        position: relative; aspect-ratio: 4 / 3; overflow: hidden;
        background: var(--color-bg-subtle); border: 1px solid var(--color-border-subtle);
      }
      .nva-ph {
        position: absolute; inset: 0.45rem; padding: 0.85rem;
        display: flex; flex-direction: column; justify-content: space-between;
        background: var(--color-callout-bg); border: 1px solid var(--color-border-subtle);
      }
      .nva-ph-top, .nva-ph-bot {
        display: flex; justify-content: space-between; gap: 0.5rem;
        font-family: 'Inter', sans-serif; font-size: 10px; letter-spacing: 0.14em;
        text-transform: uppercase; color: var(--color-text-muted);
      }
      .nva-ph-title {
        text-align: center; font-family: 'Cinzel', Georgia, serif;
        font-size: 1.05rem; color: var(--color-text);
      }
      .nva-img { width: 100%; height: 100%; object-fit: cover; }
      .nva-meta { font-family: 'Inter', sans-serif; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--color-secondary); }
      .nva-title { font-family: 'Cinzel', Georgia, serif; font-size: 1.1rem; font-weight: 600; color: var(--color-text); }
      .nva-cap { font-family: 'Newsreader', Georgia, serif; font-size: 1rem; color: var(--color-text-muted); line-height: 1.55; }
      .nva-filters {
        display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
        gap: 0.75rem; margin-bottom: 1.5rem;
      }
      .nva-input, .nva-select {
        width: 100%; background: var(--color-bg); border: 1px solid var(--color-border);
        border-radius: 6px; padding: 0.55rem 0.75rem; color: var(--color-text);
        font-family: 'Inter', sans-serif; font-size: 12px;
      }
      .nva-modal {
        position: fixed; inset: 0; z-index: 600; display: none;
        align-items: center; justify-content: center; padding: 1.25rem;
        background: rgba(24, 23, 27, 0.88); backdrop-filter: blur(6px);
      }
      .nva-modal.open { display: flex; }
      .nva-modal-box {
        max-width: 780px; width: 100%; max-height: 90vh; overflow-y: auto;
        background: var(--color-panel); color: var(--color-text);
        border: 1px solid var(--color-border); border-radius: 6px; padding: 1.5rem;
        box-shadow: var(--card-shadow);
      }
    `;
    document.head.appendChild(style);
  }

  function ensureModal() {
    if (document.getElementById("nvaLightboxModal")) return;
    const modal = document.createElement("div");
    modal.id = "nvaLightboxModal";
    modal.className = "nva-modal";
    modal.innerHTML = `
      <div class="nva-modal-box" role="dialog" aria-modal="true">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-bottom:1rem;padding-bottom:0.75rem;border-bottom:1px solid var(--color-border-subtle);">
          <span id="nvaLbCounter" style="font-family:'Inter',sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:var(--color-secondary);"></span>
          <button type="button" class="nva-tab" id="nvaLbClose">Close</button>
        </div>
        <div id="nvaLbBody"></div>
        <div style="display:flex;justify-content:space-between;gap:1rem;margin-top:1.25rem;padding-top:0.75rem;border-top:1px solid var(--color-border-subtle);">
          <button type="button" class="nva-tab" id="nvaLbPrev">&larr; Previous</button>
          <button type="button" class="nva-tab" id="nvaLbNext">Next &rarr;</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("nvaLbClose").addEventListener("click", closeLightbox);
    document.getElementById("nvaLbPrev").addEventListener("click", () => openLightbox(state.lightboxIndex - 1));
    document.getElementById("nvaLbNext").addEventListener("click", () => openLightbox(state.lightboxIndex + 1));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeLightbox();
    });
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function openLightbox(idx) {
    if (!state.lightboxList.length) return;
    state.lightboxIndex = (idx + state.lightboxList.length) % state.lightboxList.length;
    const item = state.lightboxList[state.lightboxIndex];
    const modal = document.getElementById("nvaLightboxModal");
    document.getElementById("nvaLbCounter").textContent =
      `Plate ${state.lightboxIndex + 1} of ${state.lightboxList.length} · ${item.id}`;
    document.getElementById("nvaLbBody").innerHTML = `
      <p style="font-family:'Inter',sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:var(--color-accent);margin-bottom:0.35rem;">${esc(item.category)} · ${esc(item.location)} · ${esc(item.season)}</p>
      <h4 style="font-family:'Cinzel',serif;font-size:1.5rem;margin-bottom:0.5rem;">${esc(item.title)}</h4>
      <p style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.2rem;color:var(--color-text-muted);margin-bottom:0.75rem;">${esc(item.caption)}</p>
      <p style="font-family:'Newsreader',serif;font-size:1.05rem;line-height:1.7;margin-bottom:0.75rem;">${esc(item.description)}</p>
      <p style="font-family:monospace;font-size:12px;color:var(--color-text-faint);">File: ${esc(item.imagePath)}</p>
    `;
    modal.classList.add("open");
  }

  function closeLightbox() {
    const modal = document.getElementById("nvaLightboxModal");
    if (modal) modal.classList.remove("open");
  }

  function cardHtml(item, idx) {
    return `
      <article class="nva-card" data-nva-idx="${idx}">
        <div class="nva-frame">
          <div class="nva-ph" id="nva-ph-${esc(item.id)}">
            <div class="nva-ph-top"><span>${esc(item.id)}</span><span>${esc(item.season)}</span></div>
            <div class="nva-ph-title">${esc(item.title)}</div>
            <div class="nva-ph-bot"><span>${esc(item.location)}</span><span>${esc(item.imagePath)}</span></div>
          </div>
          <img
            class="nva-img"
            src="${esc(item.imagePath)}"
            alt="${esc(item.title)}"
            loading="lazy"
            style="opacity:0;"
            onload="this.style.opacity='1';var p=document.getElementById('nva-ph-${esc(item.id)}');if(p)p.style.display='none';"
            onerror="this.style.display='none';"
          />
        </div>
        <div class="nva-meta">${esc(item.category)} · ${esc(item.location)} · ${esc(item.season)}</div>
        <div class="nva-title">${esc(item.title)}</div>
        <div class="nva-cap">${esc(item.caption)}</div>
      </article>
    `;
  }

  function render() {
    if (!state.container) return;
    injectStyles();
    ensureModal();

    const navKeys = ["overview", "kingdom", "architecture", "interiors", "seasons", "royal", "daily", "archive"];
    let list = [];

    if (state.activeSection === "overview") {
      list = NORWYN_IMAGES.filter(i => i.featured);
    } else if (state.activeSection === "seasons") {
      list = NORWYN_IMAGES.filter(i => i.season === state.activeSeason);
    } else if (state.activeSection === "archive") {
      const q = state.archiveFilters.search.trim().toLowerCase();
      list = NORWYN_IMAGES.filter(item => {
        const okCat = state.archiveFilters.category === "All" || item.category === state.archiveFilters.category;
        const okLoc = state.archiveFilters.location === "All" || item.location === state.archiveFilters.location;
        const okSea = state.archiveFilters.season === "All" || item.season === state.archiveFilters.season;
        const okQ = !q || [item.id, item.title, item.category, item.location, item.season, item.caption, item.description]
          .some(v => String(v).toLowerCase().includes(q));
        return okCat && okLoc && okSea && okQ;
      });
    } else {
      const sec = SECTIONS[state.activeSection];
      list = NORWYN_IMAGES.filter(item => {
        if (state.activeSubcollection === "All") {
          return item.category === sec.title || item.collections.includes(sec.title);
        }
        return item.collections.includes(state.activeSubcollection) || item.location === state.activeSubcollection;
      });
    }

    state.lightboxList = list;
    const secInfo = SECTIONS[state.activeSection];
    const cats = ["All", ...new Set(NORWYN_IMAGES.map(i => i.category))];
    const locs = ["All", ...new Set(NORWYN_IMAGES.map(i => i.location))];

    state.container.innerHTML = `
      <div class="nva-wrap">
        <div class="nva-toolbar">
          <div class="nva-tabs">
            ${navKeys.map(k => `<button type="button" class="nva-tab ${state.activeSection === k ? "active" : ""}" data-nva-sec="${k}">${esc(SECTIONS[k].title)}</button>`).join("")}
          </div>
          <span style="font-family:'Inter',sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--color-text-muted);">${list.length} Plates</span>
        </div>

        <p style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1.2rem;color:var(--color-text-muted);margin-bottom:1rem;">${esc(secInfo.subtitle)}</p>

        ${secInfo.subcollections && secInfo.subcollections.length ? `
          <div class="nva-tabs" style="margin-bottom:1.25rem;">
            ${secInfo.subcollections.map(sub => {
              const isSea = state.activeSection === "seasons";
              const isAct = isSea ? state.activeSeason === sub : state.activeSubcollection === sub;
              return `<button type="button" class="nva-tab ${isAct ? "active" : ""}" data-nva-sub="${esc(sub)}">${esc(sub)}</button>`;
            }).join("")}
          </div>
        ` : ""}

        ${state.activeSection === "archive" ? `
          <div class="nva-filters">
            <input id="nvaSearch" class="nva-input" type="search" placeholder="Search plates..." value="${esc(state.archiveFilters.search)}" />
            <select id="nvaCat" class="nva-select">${cats.map(c => `<option value="${esc(c)}" ${state.archiveFilters.category === c ? "selected" : ""}>${esc(c)}</option>`).join("")}</select>
            <select id="nvaLoc" class="nva-select">${locs.map(l => `<option value="${esc(l)}" ${state.archiveFilters.location === l ? "selected" : ""}>${esc(l)}</option>`).join("")}</select>
            <select id="nvaSea" class="nva-select">${["All", "Spring", "Autumn", "Winter"].map(s => `<option value="${s}" ${state.archiveFilters.season === s ? "selected" : ""}>${s}</option>`).join("")}</select>
          </div>
        ` : ""}

        <div class="nva-grid">
          ${list.length ? list.map((item, idx) => cardHtml(item, idx)).join("") : `<div class="nva-card"><div class="nva-title">No matching plates</div></div>`}
        </div>
      </div>
    `;

    state.container.querySelectorAll("[data-nva-sec]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.activeSection = btn.dataset.nvaSec;
        state.activeSubcollection = "All";
        render();
      });
    });

    state.container.querySelectorAll("[data-nva-sub]").forEach(btn => {
      btn.addEventListener("click", () => {
        if (state.activeSection === "seasons") {
          state.activeSeason = btn.dataset.nvaSub;
        } else {
          state.activeSubcollection = btn.dataset.nvaSub;
        }
        render();
      });
    });

    state.container.querySelectorAll("[data-nva-idx]").forEach(card => {
      card.addEventListener("click", () => openLightbox(Number(card.dataset.nvaIdx)));
    });

    const sEl = document.getElementById("nvaSearch");
    if (sEl) {
      sEl.addEventListener("input", (e) => {
        state.archiveFilters.search = e.target.value;
        const pos = e.target.selectionStart;
        render();
        const nextInput = document.getElementById("nvaSearch");
        if (nextInput) { nextInput.focus(); nextInput.setSelectionRange(pos, pos); }
      });
    }
    const cEl = document.getElementById("nvaCat");
    if (cEl) cEl.addEventListener("change", (e) => { state.archiveFilters.category = e.target.value; render(); });
    const lEl = document.getElementById("nvaLoc");
    if (lEl) lEl.addEventListener("change", (e) => { state.archiveFilters.location = e.target.value; render(); });
    const seaEl = document.getElementById("nvaSea");
    if (seaEl) seaEl.addEventListener("change", (e) => { state.archiveFilters.season = e.target.value; render(); });
  }

  window.NorwynVisualArchive = {
    mount: function (targetEl) {
      if (!targetEl) return;
      state.container = targetEl;
      render();
    }
  };
})();
