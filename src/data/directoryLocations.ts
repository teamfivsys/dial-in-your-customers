/**
 * SEO landing pages served at /business-directory-{slug}.
 * Each entry carries genuinely different local content — never reuse paragraphs.
 */

export interface DirectoryFaq {
  q: string;
  a: string;
}

export interface DirectoryLocation {
  /** URL segment after "business-directory-" */
  slug: string;
  /** Display name */
  name: string;
  /** Matching city slug in src/data/cities.ts (null for the state page) */
  citySlug: string | null;
  scope: "state" | "district" | "city";
  title: string;
  description: string;
  h1: string;
  intro: string[];
  /** Local context bullets — specific to this place */
  localContext: { label: string; text: string }[];
  /** Category slugs most searched in this place */
  topCategorySlugs: string[];
  /** Nearby / related landing page slugs (internal linking) */
  nearby: string[];
  faqs: DirectoryFaq[];
}

export const directoryLocations: DirectoryLocation[] = [
  {
    slug: "kerala",
    name: "Kerala",
    citySlug: null,
    scope: "state",
    title: "Kerala Business Directory — Verified Local Business Listings | KDial",
    description:
      "KDial is a verified Kerala business directory covering all 14 districts. Browse businesses by category and city, then call or WhatsApp them directly — no middlemen.",
    h1: "Kerala Business Directory",
    intro: [
      "KDial is a verified business directory for Kerala, built around one idea: when someone searches for a service, they should reach the business itself — not a call centre selling that enquiry to five competitors. Every listing on KDial is checked before it goes live, and every contact detail belongs to the business owner.",
      "Kerala's economy is unusually spread out. Instead of one dominant metro, commerce is distributed across Kochi's ports and IT parks, Kozhikode's trade and food culture, Thrissur's jewellery market, Thiruvananthapuram's government and technology corridor, and dozens of fast-growing towns in between. A single statewide list is useless in that context, so KDial is organised district by district, city by city and category by category.",
      "Start with your district, narrow to the service you need, and contact the listed business directly by phone or WhatsApp. Business owners can claim a verified listing and appear in the same searches their customers are already running.",
    ],
    localContext: [
      { label: "14 districts", text: "Separate directory pages for every district, from Kasaragod in the north to Thiruvananthapuram in the south." },
      { label: "Malayalam + English", text: "Category names carry Malayalam equivalents so local search terms map to the right page." },
      { label: "WhatsApp-first", text: "Kerala has one of India's highest WhatsApp adoption rates, so enquiries go straight to chat." },
      { label: "Verified only", text: "No scraped listings, no expired phone numbers, no paid ads placed on top of a rival's page." },
    ],
    topCategorySlugs: ["restaurants", "dentists", "electrician", "plumber", "advocates", "car-service", "interior-designers", "wedding-planners", "gyms", "travel-agencies"],
    nearby: ["kochi", "ernakulam", "thiruvananthapuram", "kozhikode", "thrissur"],
    faqs: [
      { q: "Is KDial a free business directory?", a: "Browsing and contacting businesses is free for customers. Listing a business is paid — that is deliberate, because paid verification is what keeps spam and dead listings out of the directory." },
      { q: "Which areas of Kerala does KDial cover?", a: "All 14 districts, with dedicated pages for major cities such as Kochi, Thiruvananthapuram, Kozhikode and Thrissur, and category pages that span the whole state." },
      { q: "How do I contact a business listed on KDial?", a: "Each listing shows the owner's own phone number and WhatsApp link. Your enquiry goes directly to that business and is never resold as a lead." },
      { q: "How do I add my business to the Kerala directory?", a: "Send a WhatsApp message to the KDial team with your business name, category and city. Details are verified before the listing is published." },
    ],
  },
  {
    slug: "kochi",
    name: "Kochi",
    citySlug: "kochi",
    scope: "city",
    title: "Kochi Business Directory — Verified Businesses in Kochi | KDial",
    description:
      "Find verified businesses in Kochi on KDial. Browse restaurants, clinics, home services, professionals and shops by area, and contact owners directly by phone or WhatsApp.",
    h1: "Kochi Business Directory",
    intro: [
      "Kochi is Kerala's commercial engine, and its business landscape reflects that: spice exporters in Mattancherry, IT companies in Kakkanad, hospitals along MG Road, restaurants in Panampilly Nagar and Fort Kochi, and a constant stream of visitors passing through the port and airport.",
      "That density makes searching harder, not easier. Ten results for \"electrician in Kochi\" mean nothing if half the numbers are dead. KDial's Kochi directory lists verified businesses only, grouped by category so you can go straight from a need to a working phone number.",
      "Because Kochi sits inside Ernakulam district, many searches overlap — a business in Kakkanad or Aluva serves both. Use the Ernakulam district page for the wider area and this page for the city itself.",
    ],
    localContext: [
      { label: "Kakkanad & Infopark", text: "IT workforce demand: cafés, gyms, cab services, co-living and quick home repairs." },
      { label: "Fort Kochi & Mattancherry", text: "Tourism-facing hospitality, homestays, art spaces and heritage retail." },
      { label: "MG Road & Marine Drive", text: "Clinics, dental and skin practices, professional services and retail showrooms." },
      { label: "Edappally & Palarivattom", text: "Furniture, interiors, automobile service and large-format retail corridors." },
    ],
    topCategorySlugs: ["restaurants", "dentists", "interior-designers", "car-service", "electrician", "plumber", "gyms", "advocates", "photography", "spa-wellness"],
    nearby: ["ernakulam", "thrissur", "thiruvananthapuram", "kozhikode", "kerala"],
    faqs: [
      { q: "What kinds of businesses are listed in the Kochi directory?", a: "Everything a resident or visitor searches for locally: restaurants and cafés, dental and skin clinics, electricians and plumbers, interior designers, car service centres, gyms, advocates and chartered accountants, photographers and event teams." },
      { q: "Is Kochi the same as Ernakulam on KDial?", a: "They overlap but are not identical. Kochi is the city; Ernakulam is the district around it. Businesses in Aluva, Perumbavoor or Muvattupuzha appear under Ernakulam." },
      { q: "Can I contact a Kochi business on WhatsApp?", a: "Yes. Listings include a direct WhatsApp link where the owner has provided one, which is usually the fastest way to get a quote in Kochi." },
      { q: "How do I list my Kochi business?", a: "Message the KDial team on WhatsApp with your business name, category and area. Once verified, your listing appears on this page and its category page." },
    ],
  },
  {
    slug: "ernakulam",
    name: "Ernakulam",
    citySlug: "kochi",
    scope: "district",
    title: "Ernakulam Business Directory — Verified Business Listings | KDial",
    description:
      "Browse verified businesses across Ernakulam district on KDial — Kochi, Aluva, Kakkanad, Perumbavoor and Muvattupuzha. Contact owners directly, with no lead reselling.",
    h1: "Ernakulam Business Directory",
    intro: [
      "Ernakulam is the district that contains Kochi, and it is far larger than the city centre most directories stop at. Aluva, Kalamassery, Perumbavoor, Kothamangalam, Muvattupuzha and North Paravur each have their own trade clusters — plywood, rubber, automobile workshops, hardware, construction supply.",
      "This page covers the district as a whole. If a business serves customers across Ernakulam rather than one neighbourhood, this is where it belongs; if you specifically want the city, use the Kochi directory.",
      "Listings here are verified before publication, and enquiries reach the business owner directly rather than a shared lead pool.",
    ],
    localContext: [
      { label: "Perumbavoor", text: "Plywood and timber industry with a large ecosystem of transport and labour contractors." },
      { label: "Aluva & Kalamassery", text: "Industrial estates, engineering workshops and education institutions." },
      { label: "Muvattupuzha & Kothamangalam", text: "Regional retail, agri-supply and healthcare serving the eastern taluks." },
      { label: "Airport corridor", text: "Nedumbassery drives travel agencies, taxi operators and hospitality demand." },
    ],
    topCategorySlugs: ["building-contractors", "hardware-stores", "car-service", "restaurants", "travel-agencies", "electrical-contractors", "furniture-shops", "tuition-centres", "real-estate-agents", "ca"],
    nearby: ["kochi", "thrissur", "kerala", "thiruvananthapuram", "kozhikode"],
    faqs: [
      { q: "Does Ernakulam include Kochi?", a: "Yes. Kochi is the main city inside Ernakulam district, and KDial keeps separate pages so city-level and district-level searches both land somewhere useful." },
      { q: "Which towns in Ernakulam are covered?", a: "Kochi, Aluva, Kalamassery, Kakkanad, Perumbavoor, Kothamangalam, Muvattupuzha, Angamaly and North Paravur among others." },
      { q: "Are contractors and industrial suppliers listed?", a: "Yes — Ernakulam has strong construction, plywood and engineering clusters, and those categories are part of the directory." },
      { q: "How is a listing verified?", a: "The KDial team confirms the business name, ownership contact and location before publishing, and listings are re-checked when details change." },
    ],
  },
  {
    slug: "thiruvananthapuram",
    name: "Thiruvananthapuram",
    citySlug: "trivandrum",
    scope: "city",
    title: "Thiruvananthapuram Business Directory — Verified Listings | KDial",
    description:
      "Verified business listings across Thiruvananthapuram on KDial. Find clinics, professionals, home services, IT-corridor businesses and shops, and contact them directly.",
    h1: "Thiruvananthapuram Business Directory",
    intro: [
      "Thiruvananthapuram runs on three overlapping economies: government and administration around the Secretariat, technology at Technopark and Kazhakkoottam, and long-established medical and education institutions across the city. Each generates very different local searches.",
      "KDial's Thiruvananthapuram directory groups verified businesses by category so a Technopark resident looking for a weekend car service and a family looking for a paediatric clinic in Pattom both land on something specific rather than a generic city listing.",
      "The capital is also the entry point for southern Kerala travel — Kovalam, Varkala and Ponmudi — which keeps hospitality, taxi and tour operators busy year-round.",
    ],
    localContext: [
      { label: "Technopark & Kazhakkoottam", text: "IT workforce services: food, fitness, cabs, rentals and quick home maintenance." },
      { label: "Pattom, Kowdiar, Vazhuthacaud", text: "Residential demand for clinics, tuition centres and household services." },
      { label: "Medical College & Thycaud", text: "Dense healthcare cluster including specialist clinics and diagnostics." },
      { label: "Kovalam & Varkala route", text: "Hospitality, homestays, taxi services and tour operators." },
    ],
    topCategorySlugs: ["dentists", "physiotherapy", "restaurants", "tuition-centres", "taxi-services", "gyms", "website-designers", "advocates", "cleaning-service", "ac-repair"],
    nearby: ["kollam", "kochi", "kerala", "thrissur", "kozhikode"],
    faqs: [
      { q: "Is Thiruvananthapuram the same as Trivandrum?", a: "Yes — Trivandrum is the older anglicised name for the same city, and both spellings lead to this directory." },
      { q: "Which areas of the city are covered?", a: "City-wide, including Technopark and Kazhakkoottam, Pattom, Kowdiar, Vazhuthacaud, Thampanoor, Sreekaryam and the Kovalam road." },
      { q: "Are healthcare businesses listed?", a: "Yes. Clinics, dental practices, physiotherapy centres and diagnostics are among the most searched categories in the capital." },
      { q: "How much does a Thiruvananthapuram listing cost?", a: "Listings are paid and priced per year. Message the KDial team on WhatsApp for the current founder pricing and what the package includes." },
    ],
  },
  {
    slug: "kozhikode",
    name: "Kozhikode",
    citySlug: "calicut",
    scope: "city",
    title: "Kozhikode Business Directory — Verified Businesses in Calicut | KDial",
    description:
      "Find verified businesses in Kozhikode (Calicut) on KDial. Browse food, healthcare, retail, education and home services by category and contact owners directly.",
    h1: "Kozhikode Business Directory",
    intro: [
      "Kozhikode — Calicut — is the commercial centre of north Kerala and arguably its food capital. The city's trade history in spices and timber still shapes its markets, while Mithai Theruvu, Beach Road and Palayam remain some of the busiest retail stretches in the state.",
      "This directory lists verified Kozhikode businesses by category, from biryani kitchens and halwa shops to hospitals, coaching centres and textile showrooms. Contact details belong to the owners, so an enquiry about a catering order or a clinic appointment reaches the right person immediately.",
      "Kozhikode also serves a wide catchment: customers travel in from Malappuram, Wayanad and Kannur for healthcare, education and wholesale purchases, so many listings here serve the whole northern region.",
    ],
    localContext: [
      { label: "Mithai Theruvu (SM Street)", text: "Sweets, halwa, textiles and dense small-shop retail." },
      { label: "Beach Road & Kallai", text: "Food culture, cafés and the historic timber trade belt." },
      { label: "Medical College & Chevayur", text: "Regional healthcare hub drawing patients from across north Kerala." },
      { label: "Palayam & Mavoor Road", text: "Wholesale markets, coaching institutes and commercial offices." },
    ],
    topCategorySlugs: ["restaurants", "bakeries", "catering-services", "entrance-coaching", "eye-hospital", "furniture-shops", "mobile-shops", "photography", "car-service", "ielts-coaching"],
    nearby: ["kerala", "thrissur", "kochi", "thiruvananthapuram", "ernakulam"],
    faqs: [
      { q: "Is Kozhikode the same as Calicut?", a: "Yes. Calicut is the older name for Kozhikode; both terms refer to the same city and lead to this directory." },
      { q: "What is Kozhikode best known for commercially?", a: "Food — biryani, halwa and bakery culture — alongside textiles, timber, healthcare and a large coaching-institute sector." },
      { q: "Do Kozhikode listings serve nearby districts?", a: "Often yes. Many hospitals, coaching centres and wholesalers here serve customers from Malappuram, Wayanad and Kannur." },
      { q: "Can I search Kozhikode businesses by category?", a: "Yes — every category page links to its Kozhikode listings, and this page shows the categories searched most often in the city." },
    ],
  },
  {
    slug: "thrissur",
    name: "Thrissur",
    citySlug: "thrissur",
    scope: "city",
    title: "Thrissur Business Directory — Verified Business Listings | KDial",
    description:
      "Browse verified Thrissur businesses on KDial — jewellery, catering, event services, clinics and home services. Contact owners directly by phone or WhatsApp.",
    h1: "Thrissur Business Directory",
    intro: [
      "Thrissur is Kerala's cultural capital and its gold capital at the same time. The area around Swaraj Round holds one of India's densest concentrations of jewellery retail, and the city's festival calendar — anchored by Thrissur Pooram — supports a whole economy of caterers, decorators, percussion troupes and event crews.",
      "KDial's Thrissur directory reflects that mix. Alongside jewellery and event services, you'll find clinics, textile showrooms, tuition centres and household service providers, each verified before listing.",
      "The district also covers Chalakudy, Irinjalakuda, Guruvayur and Kunnamkulam, all with their own trade clusters, so a Thrissur search often means the wider district rather than just the Round.",
    ],
    localContext: [
      { label: "Swaraj Round", text: "Jewellery and textile retail core, plus banks and professional offices." },
      { label: "Pooram season", text: "Peak demand for catering, decoration, sound and light, and event management." },
      { label: "Guruvayur", text: "Temple-driven hospitality, wedding services and religious retail." },
      { label: "Chalakudy & Irinjalakuda", text: "Automobile workshops, hardware supply and regional retail." },
    ],
    topCategorySlugs: ["wedding-planners", "catering-services", "decoration", "sound-light", "makeup-artists", "restaurants", "dentists", "furniture-shops", "tuition-centres", "photography"],
    nearby: ["kochi", "ernakulam", "kozhikode", "kerala", "palakkad"],
    faqs: [
      { q: "What is Thrissur's main business sector?", a: "Gold and jewellery retail around Swaraj Round is the best known, followed by textiles, catering and event services tied to the district's festival calendar." },
      { q: "Are wedding and event vendors listed for Thrissur?", a: "Yes — planners, caterers, decorators, makeup artists, photographers and sound-and-light teams are core categories here." },
      { q: "Which towns does the Thrissur directory include?", a: "Thrissur city plus Guruvayur, Chalakudy, Irinjalakuda, Kunnamkulam and Wadakkanchery." },
      { q: "How do I get my Thrissur business verified on KDial?", a: "Send your business details to the KDial team on WhatsApp; verification covers ownership contact and location before the listing goes live." },
    ],
  },
];

export const getDirectoryLocation = (slug?: string): DirectoryLocation | undefined =>
  slug ? directoryLocations.find((l) => l.slug === slug.toLowerCase()) : undefined;

export const directoryLocationSlugs = directoryLocations.map((l) => l.slug);