export interface CategoryData {
  slug: string;
  name: string;
  malayalam: string;
  description: string;
  icon: string;
  keywords: string[];
  subcategories: string[];
  sector: string;
}

export const businessCategories: CategoryData[] = [
  // ==================== MEDICAL (10) ====================
  {
    slug: "dentists",
    name: "Dentists",
    malayalam: "ദന്തഡോക്ടർമാർ",
    description: "Find verified dental clinics and dentists offering teeth cleaning, root canal, braces, dental implants, and cosmetic dentistry services.",
    icon: "Stethoscope",
    keywords: ["dentist", "dental clinic", "teeth", "root canal", "braces", "dental implants", "tooth extraction"],
    subcategories: ["General Dentists", "Orthodontists", "Pediatric Dentists", "Cosmetic Dentistry", "Root Canal Specialists", "Dental Implants", "Teeth Whitening", "Dental Surgery"],
    sector: "Medical"
  },
  {
    slug: "skin-clinic",
    name: "Skin Clinic",
    malayalam: "ചർമ ക്ലിനിക്",
    description: "Top dermatologists and skin specialists for acne treatment, skin allergies, laser treatments, and cosmetic procedures.",
    icon: "Sparkles",
    keywords: ["dermatologist", "skin clinic", "acne", "skin treatment", "laser", "cosmetic dermatology"],
    subcategories: ["Dermatologists", "Acne Treatment", "Laser Treatment", "Skin Allergy", "Cosmetic Procedures", "Anti-aging Treatment", "Scar Removal", "Skin Surgery"],
    sector: "Medical"
  },
  {
    slug: "hair-transplant",
    name: "Hair Transplant",
    malayalam: "ഹെയർ ട്രാൻസ്പ്ലാന്റ്",
    description: "Expert hair transplant clinics offering FUE, FUT procedures, PRP therapy, and advanced hair restoration treatments.",
    icon: "Scissors",
    keywords: ["hair transplant", "hair restoration", "fue", "fut", "prp", "hair loss treatment", "baldness"],
    subcategories: ["FUE Transplant", "FUT Transplant", "PRP Therapy", "Hair Loss Treatment", "Beard Transplant", "Eyebrow Transplant", "Scalp Micropigmentation", "Hair Regrowth"],
    sector: "Medical"
  },
  {
    slug: "homeopathy",
    name: "Homeopathy",
    malayalam: "ഹോമിയോപ്പതി",
    description: "Experienced homeopathic doctors and clinics for natural healing, chronic disease management, and holistic healthcare.",
    icon: "Leaf",
    keywords: ["homeopathy", "homeopathic doctor", "natural medicine", "alternative medicine", "holistic treatment"],
    subcategories: ["General Homeopathy", "Pediatric Homeopathy", "Chronic Disease", "Skin Disorders", "Allergies", "Mental Health", "Women's Health", "Digestive Issues"],
    sector: "Medical"
  },
  {
    slug: "ayurvedic-clinic",
    name: "Ayurvedic Clinic",
    malayalam: "ആയുർവേദ ക്ലിനിക്",
    description: "Traditional Ayurvedic treatment centers offering Panchakarma, rejuvenation therapies, and authentic Kerala Ayurveda.",
    icon: "Leaf",
    keywords: ["ayurveda", "ayurvedic clinic", "panchakarma", "kerala ayurveda", "traditional medicine", "rejuvenation"],
    subcategories: ["Panchakarma", "Rejuvenation Therapy", "Arthritis Treatment", "Spine Care", "Skin Treatment", "Weight Management", "Stress Relief", "Detox Programs"],
    sector: "Medical"
  },
  {
    slug: "eye-hospital",
    name: "Eye Hospital",
    malayalam: "നേത്ര ആശുപത്രി",
    description: "Leading eye hospitals and ophthalmologists for cataract surgery, LASIK, glaucoma treatment, and comprehensive eye care.",
    icon: "Eye",
    keywords: ["eye hospital", "ophthalmologist", "cataract", "lasik", "eye surgery", "glaucoma", "retina"],
    subcategories: ["Cataract Surgery", "LASIK", "Glaucoma Treatment", "Retina Specialists", "Pediatric Ophthalmology", "Contact Lenses", "Eye Checkup", "Cornea Treatment"],
    sector: "Medical"
  },
  {
    slug: "ent-clinic",
    name: "ENT Clinic",
    malayalam: "ഇഎൻടി ക്ലിനിക്",
    description: "Specialized ENT doctors for ear, nose, and throat problems including hearing loss, sinusitis, and throat infections.",
    icon: "Ear",
    keywords: ["ent", "ear nose throat", "ent doctor", "hearing", "sinusitis", "throat specialist"],
    subcategories: ["Ear Specialists", "Nose Specialists", "Throat Specialists", "Hearing Aids", "Sinus Treatment", "Tonsil Surgery", "Voice Disorders", "Sleep Apnea"],
    sector: "Medical"
  },
  {
    slug: "orthopedic",
    name: "Orthopedic",
    malayalam: "ഓർത്തോപീഡിക്",
    description: "Expert orthopedic doctors for bone and joint problems, sports injuries, joint replacement, and spine care.",
    icon: "Bone",
    keywords: ["orthopedic", "bone doctor", "joint replacement", "sports injury", "spine", "fracture"],
    subcategories: ["Joint Replacement", "Sports Medicine", "Spine Surgery", "Fracture Care", "Arthroscopy", "Pediatric Orthopedics", "Hand Surgery", "Foot & Ankle"],
    sector: "Medical"
  },
  {
    slug: "physiotherapy",
    name: "Physiotherapy",
    malayalam: "ഫിസിയോതെറാപ്പി",
    description: "Professional physiotherapy centers for rehabilitation, pain management, sports injury recovery, and mobility improvement.",
    icon: "Activity",
    keywords: ["physiotherapy", "physical therapy", "rehabilitation", "pain management", "sports physio"],
    subcategories: ["Sports Physiotherapy", "Neuro Physiotherapy", "Orthopedic Physio", "Geriatric Physio", "Pediatric Physio", "Post-Surgery Rehab", "Back Pain Treatment", "Home Physiotherapy"],
    sector: "Medical"
  },
  {
    slug: "ivf-centre",
    name: "IVF Centre",
    malayalam: "ഐവിഎഫ് സെന്റർ",
    description: "Advanced fertility centers offering IVF, IUI, ICSI treatments, and comprehensive reproductive healthcare.",
    icon: "Baby",
    keywords: ["ivf", "fertility", "infertility", "iui", "icsi", "test tube baby", "fertility treatment"],
    subcategories: ["IVF Treatment", "IUI Treatment", "ICSI", "Egg Freezing", "Sperm Banking", "Fertility Testing", "Surrogacy", "Reproductive Surgery"],
    sector: "Medical"
  },

  // ==================== HOME SERVICES (10) ====================
  {
    slug: "plumber",
    name: "Plumber",
    malayalam: "പ്ലംബർ",
    description: "Verified plumbers for pipe repairs, bathroom fittings, water tank installation, and all plumbing emergencies.",
    icon: "Wrench",
    keywords: ["plumber", "plumbing", "pipe repair", "bathroom fitting", "water leak", "drainage"],
    subcategories: ["Pipe Repair", "Bathroom Fittings", "Water Tank", "Drainage Cleaning", "Leak Repair", "Tap Installation", "Toilet Repair", "Water Heater"],
    sector: "Home Services"
  },
  {
    slug: "electrician",
    name: "Electrician",
    malayalam: "ഇലക്ട്രീഷ്യൻ",
    description: "Licensed electricians for wiring, electrical repairs, switch installation, and electrical safety inspections.",
    icon: "Zap",
    keywords: ["electrician", "electrical", "wiring", "switch", "electrical repair", "house wiring"],
    subcategories: ["House Wiring", "Switch Installation", "Electrical Repair", "MCB Installation", "Lighting", "Fan Installation", "Generator Repair", "Inverter Setup"],
    sector: "Home Services"
  },
  {
    slug: "ac-repair",
    name: "AC Repair",
    malayalam: "എസി റിപ്പയർ",
    description: "Expert AC repair and service technicians for all brands including installation, gas filling, and maintenance.",
    icon: "Wind",
    keywords: ["ac repair", "air conditioner", "ac service", "ac installation", "ac gas filling", "split ac"],
    subcategories: ["AC Installation", "AC Service", "Gas Filling", "Compressor Repair", "Split AC", "Window AC", "Duct AC", "AC AMC"],
    sector: "Home Services"
  },
  {
    slug: "refrigerator-repair",
    name: "Refrigerator Repair",
    malayalam: "ഫ്രിഡ്ജ് റിപ്പയർ",
    description: "Professional refrigerator and freezer repair services for all major brands with genuine spare parts.",
    icon: "Refrigerator",
    keywords: ["refrigerator repair", "fridge repair", "freezer", "cooling issue", "compressor", "fridge service"],
    subcategories: ["Compressor Repair", "Thermostat Repair", "Gas Filling", "Door Seal", "Cooling Issue", "Ice Maker Repair", "Deep Freezer", "Commercial Fridge"],
    sector: "Home Services"
  },
  {
    slug: "washing-machine-repair",
    name: "Washing Machine Repair",
    malayalam: "വാഷിംഗ് മെഷീൻ റിപ്പയർ",
    description: "Washing machine repair specialists for top load, front load, and semi-automatic machines of all brands.",
    icon: "Loader",
    keywords: ["washing machine repair", "washer repair", "front load", "top load", "washing machine service"],
    subcategories: ["Motor Repair", "Drum Repair", "Water Inlet Issue", "Drainage Problem", "Control Panel", "Front Load", "Top Load", "Semi-Automatic"],
    sector: "Home Services"
  },
  {
    slug: "cctv-installation",
    name: "CCTV Installation",
    malayalam: "സിസിടിവി ഇൻസ്റ്റാളേഷൻ",
    description: "Professional CCTV camera installation services with remote monitoring setup and maintenance support.",
    icon: "Camera",
    keywords: ["cctv", "security camera", "surveillance", "cctv installation", "ip camera", "dvr"],
    subcategories: ["Home CCTV", "Office CCTV", "IP Cameras", "DVR Setup", "Remote Monitoring", "Night Vision", "Wireless CCTV", "CCTV Repair"],
    sector: "Home Services"
  },
  {
    slug: "inverter-repair",
    name: "Inverter Repair",
    malayalam: "ഇൻവെർട്ടർ റിപ്പയർ",
    description: "Inverter and UPS repair services including battery replacement, installation, and maintenance.",
    icon: "Battery",
    keywords: ["inverter repair", "ups repair", "battery", "power backup", "inverter service", "inverter installation"],
    subcategories: ["Inverter Repair", "UPS Repair", "Battery Replacement", "New Installation", "Solar Inverter", "Industrial UPS", "Home Inverter", "AMC Services"],
    sector: "Home Services"
  },
  {
    slug: "ro-water-purifier",
    name: "RO Water Purifier",
    malayalam: "ആർഒ വാട്ടർ പ്യൂരിഫയർ",
    description: "RO water purifier installation, repair, and AMC services. Filter replacement and water quality testing.",
    icon: "Droplets",
    keywords: ["ro", "water purifier", "water filter", "ro service", "water purifier repair", "aquaguard"],
    subcategories: ["RO Installation", "Filter Replacement", "RO Service", "AMC", "UV Purifier", "Water Testing", "Commercial RO", "RO Repair"],
    sector: "Home Services"
  },
  {
    slug: "pest-control",
    name: "Pest Control",
    malayalam: "പെസ്റ്റ് കൺട്രോൾ",
    description: "Professional pest control services for termites, cockroaches, rodents, bed bugs, and all household pests.",
    icon: "Bug",
    keywords: ["pest control", "termite", "cockroach", "rodent", "bed bugs", "fumigation"],
    subcategories: ["Termite Control", "Cockroach Control", "Rodent Control", "Bed Bug Treatment", "Mosquito Control", "Wood Borer", "Commercial Pest Control", "Pre-Construction Treatment"],
    sector: "Home Services"
  },
  {
    slug: "cleaning-service",
    name: "Cleaning Service",
    malayalam: "ക്ലീനിംഗ് സർവീസ്",
    description: "Professional home and office cleaning services including deep cleaning, sofa cleaning, and move-in cleaning.",
    icon: "Sparkles",
    keywords: ["cleaning", "house cleaning", "deep cleaning", "sofa cleaning", "office cleaning", "maid service"],
    subcategories: ["Deep Cleaning", "Sofa Cleaning", "Carpet Cleaning", "Kitchen Cleaning", "Bathroom Cleaning", "Office Cleaning", "Move-in Cleaning", "Post-Construction"],
    sector: "Home Services"
  },

  // ==================== AUTOMOBILE (10) ====================
  {
    slug: "car-service",
    name: "Car Service",
    malayalam: "കാർ സർവീസ്",
    description: "Authorized and multi-brand car service centers for periodic maintenance, repairs, and genuine spare parts.",
    icon: "Car",
    keywords: ["car service", "car repair", "car maintenance", "car workshop", "mechanic", "auto service"],
    subcategories: ["Periodic Service", "Engine Repair", "Brake Service", "Clutch Repair", "AC Service", "Electrical Repair", "Suspension", "Multi-brand Service"],
    sector: "Automobile"
  },
  {
    slug: "bike-service",
    name: "Bike Service",
    malayalam: "ബൈക്ക് സർവീസ്",
    description: "Expert bike mechanics and service centers for all two-wheeler brands including scooters and motorcycles.",
    icon: "Bike",
    keywords: ["bike service", "bike repair", "two wheeler", "motorcycle", "scooter", "bike mechanic"],
    subcategories: ["General Service", "Engine Repair", "Oil Change", "Brake Service", "Battery Replacement", "Electrical Repair", "Scooter Service", "Sports Bike Service"],
    sector: "Automobile"
  },
  {
    slug: "car-washing",
    name: "Car Washing",
    malayalam: "കാർ വാഷിംഗ്",
    description: "Professional car wash services including exterior wash, interior cleaning, and eco-friendly waterless wash.",
    icon: "Droplets",
    keywords: ["car wash", "car washing", "car cleaning", "auto wash", "vehicle cleaning"],
    subcategories: ["Exterior Wash", "Interior Cleaning", "Full Wash", "Waterless Wash", "Steam Wash", "Foam Wash", "Express Wash", "Premium Wash"],
    sector: "Automobile"
  },
  {
    slug: "car-detailing",
    name: "Car Detailing",
    malayalam: "കാർ ഡീറ്റെയിലിംഗ്",
    description: "Premium car detailing services including ceramic coating, paint protection, and professional interior detailing.",
    icon: "Sparkles",
    keywords: ["car detailing", "ceramic coating", "paint protection", "ppf", "auto detailing", "car polish"],
    subcategories: ["Ceramic Coating", "Paint Protection Film", "Interior Detailing", "Paint Correction", "Headlight Restoration", "Engine Detailing", "Leather Treatment", "Glass Coating"],
    sector: "Automobile"
  },
  {
    slug: "tyre-shop",
    name: "Tyre Shop",
    malayalam: "ടയർ ഷോപ്പ്",
    description: "Authorized tyre dealers and shops for all vehicle types with wheel alignment and balancing services.",
    icon: "Circle",
    keywords: ["tyre", "tire", "wheel alignment", "balancing", "tyre dealer", "puncture repair"],
    subcategories: ["Car Tyres", "Bike Tyres", "Truck Tyres", "Wheel Alignment", "Wheel Balancing", "Puncture Repair", "Alloy Wheels", "Tyre Replacement"],
    sector: "Automobile"
  },
  {
    slug: "battery-dealer",
    name: "Battery Dealer",
    malayalam: "ബാറ്ററി ഡീലർ",
    description: "Authorized battery dealers for cars, bikes, inverters, and commercial vehicles with installation support.",
    icon: "Battery",
    keywords: ["battery", "car battery", "bike battery", "inverter battery", "battery dealer", "amaron", "exide"],
    subcategories: ["Car Battery", "Bike Battery", "Inverter Battery", "Truck Battery", "Battery Installation", "Battery Exchange", "Emergency Service", "Battery Testing"],
    sector: "Automobile"
  },
  {
    slug: "towing-service",
    name: "Towing Service",
    malayalam: "ടോവിംഗ് സർവീസ്",
    description: "24/7 emergency towing and roadside assistance for cars, bikes, and commercial vehicles.",
    icon: "Truck",
    keywords: ["towing", "tow truck", "roadside assistance", "breakdown", "vehicle recovery", "emergency towing"],
    subcategories: ["Car Towing", "Bike Towing", "Flatbed Towing", "Roadside Assistance", "Accident Recovery", "Long Distance", "24/7 Service", "Jump Start"],
    sector: "Automobile"
  },
  {
    slug: "car-insurance-agent",
    name: "Car Insurance Agent",
    malayalam: "കാർ ഇൻഷുറൻസ് ഏജന്റ്",
    description: "Trusted car and vehicle insurance agents for new policies, renewals, and claim assistance.",
    icon: "Shield",
    keywords: ["car insurance", "vehicle insurance", "motor insurance", "insurance agent", "policy renewal", "claim"],
    subcategories: ["New Insurance", "Policy Renewal", "Claim Assistance", "Comprehensive Cover", "Third Party", "Bike Insurance", "Commercial Vehicle", "Add-on Covers"],
    sector: "Automobile"
  },
  {
    slug: "driving-school",
    name: "Driving School",
    malayalam: "ഡ്രൈവിംഗ് സ്കൂൾ",
    description: "Licensed driving schools for car, bike, and commercial vehicle training with license assistance.",
    icon: "GraduationCap",
    keywords: ["driving school", "driving class", "driving license", "learn driving", "driving training"],
    subcategories: ["Car Driving", "Bike Driving", "Commercial License", "Refresher Course", "Lady Instructor", "Home Pickup", "License Assistance", "Automatic Car"],
    sector: "Automobile"
  },
  {
    slug: "used-car-dealer",
    name: "Used Car Dealer",
    malayalam: "യൂസ്ഡ് കാർ ഡീലർ",
    description: "Verified used car dealers with certified pre-owned vehicles, warranty options, and financing support.",
    icon: "Car",
    keywords: ["used car", "second hand car", "pre-owned", "used car dealer", "car exchange", "certified used"],
    subcategories: ["Certified Pre-owned", "Car Exchange", "Finance Options", "Warranty Cars", "Inspection Report", "SUV", "Hatchback", "Sedan"],
    sector: "Automobile"
  },

  // ==================== BUSINESS SERVICES (10) ====================
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    malayalam: "ഡിജിറ്റൽ മാർക്കറ്റിംഗ്",
    description: "Expert digital marketing agencies for SEO, social media marketing, Google Ads, and online branding.",
    icon: "TrendingUp",
    keywords: ["digital marketing", "seo", "social media", "google ads", "online marketing", "facebook ads"],
    subcategories: ["SEO Services", "Social Media Marketing", "Google Ads", "Facebook Ads", "Content Marketing", "Email Marketing", "Influencer Marketing", "Lead Generation"],
    sector: "Business Services"
  },
  {
    slug: "website-designers",
    name: "Website Designers",
    malayalam: "വെബ്സൈറ്റ് ഡിസൈനേഴ്സ്",
    description: "Professional website design and development agencies for business websites, e-commerce, and web applications.",
    icon: "Monitor",
    keywords: ["website design", "web development", "website designer", "ecommerce website", "web agency"],
    subcategories: ["Business Websites", "E-commerce", "WordPress", "Custom Development", "Mobile Apps", "UI/UX Design", "Website Redesign", "Web Hosting"],
    sector: "Business Services"
  },
  {
    slug: "seo-services",
    name: "SEO Services",
    malayalam: "എസ്ഇഒ സർവീസസ്",
    description: "Specialized SEO agencies for search engine optimization, local SEO, and improving Google rankings.",
    icon: "Search",
    keywords: ["seo", "search engine optimization", "google ranking", "local seo", "seo agency", "seo consultant"],
    subcategories: ["Local SEO", "Technical SEO", "On-page SEO", "Off-page SEO", "E-commerce SEO", "SEO Audit", "Keyword Research", "Link Building"],
    sector: "Business Services"
  },
  {
    slug: "gst-consultant",
    name: "GST Consultant",
    malayalam: "ജിഎസ്ടി കൺസൾട്ടന്റ്",
    description: "Expert GST consultants for registration, return filing, refunds, and GST compliance management.",
    icon: "FileText",
    keywords: ["gst", "gst consultant", "gst registration", "gst return", "tax consultant", "gst filing"],
    subcategories: ["GST Registration", "Return Filing", "GST Refund", "GST Audit", "E-way Bill", "Input Tax Credit", "Compliance", "GST Consultation"],
    sector: "Business Services"
  },
  {
    slug: "ca",
    name: "CA",
    malayalam: "സിഎ",
    description: "Chartered Accountants for income tax, company audit, financial planning, and business advisory services.",
    icon: "Calculator",
    keywords: ["ca", "chartered accountant", "tax consultant", "audit", "accounting", "income tax"],
    subcategories: ["Income Tax", "Company Audit", "Tax Planning", "Financial Advisory", "ITR Filing", "Business Valuation", "Due Diligence", "Startup Advisory"],
    sector: "Business Services"
  },
  {
    slug: "company-registration",
    name: "Company Registration",
    malayalam: "കമ്പനി രജിസ്ട്രേഷൻ",
    description: "Complete company registration services including private limited, LLP, OPC, and startup incorporation.",
    icon: "Building",
    keywords: ["company registration", "startup registration", "llp", "private limited", "incorporation", "business registration"],
    subcategories: ["Private Limited", "LLP Registration", "OPC", "Partnership Firm", "Startup India", "MSME Registration", "Import Export Code", "Business License"],
    sector: "Business Services"
  },
  {
    slug: "legal-services",
    name: "Legal Services",
    malayalam: "ലീഗൽ സർവീസസ്",
    description: "Comprehensive legal services including documentation, agreements, contracts, and legal consultation.",
    icon: "Scale",
    keywords: ["legal services", "legal consultant", "documentation", "agreement", "contract", "legal advice"],
    subcategories: ["Legal Documentation", "Contract Drafting", "Legal Consultation", "Compliance", "Dispute Resolution", "Corporate Law", "Property Law", "Employment Law"],
    sector: "Business Services"
  },
  {
    slug: "advocates",
    name: "Advocates",
    malayalam: "അഭിഭാഷകർ",
    description: "Experienced advocates and lawyers for civil, criminal, family, property, and corporate legal matters.",
    icon: "Gavel",
    keywords: ["advocate", "lawyer", "attorney", "legal", "court", "litigation"],
    subcategories: ["Civil Lawyers", "Criminal Lawyers", "Family Court", "Property Disputes", "Corporate Lawyers", "Consumer Court", "Labour Law", "Cyber Law"],
    sector: "Business Services"
  },
  {
    slug: "trademark-registration",
    name: "Trademark Registration",
    malayalam: "ട്രേഡ്മാർക്ക് രജിസ്ട്രേഷൻ",
    description: "Complete trademark and intellectual property services including registration, search, and protection.",
    icon: "Award",
    keywords: ["trademark", "trademark registration", "brand registration", "ip", "copyright", "patent"],
    subcategories: ["Trademark Search", "Trademark Filing", "Copyright", "Patent Filing", "IP Protection", "Brand Protection", "Trademark Renewal", "Opposition Filing"],
    sector: "Business Services"
  },
  {
    slug: "accounting-firms",
    name: "Accounting Firms",
    malayalam: "അക്കൗണ്ടിംഗ് ഫേംസ്",
    description: "Professional accounting firms for bookkeeping, payroll, financial statements, and business accounting.",
    icon: "BookOpen",
    keywords: ["accounting", "bookkeeping", "payroll", "accounting firm", "financial statements", "accounts"],
    subcategories: ["Bookkeeping", "Payroll Services", "Financial Statements", "Accounts Receivable", "Accounts Payable", "Virtual CFO", "Bank Reconciliation", "MIS Reporting"],
    sector: "Business Services"
  },

  // ==================== CONSTRUCTION & REAL ESTATE (10) ====================
  {
    slug: "building-contractors",
    name: "Building Contractors",
    malayalam: "ബിൽഡിംഗ് കോൺട്രാക്ടർമാർ",
    description: "Verified building contractors for residential, commercial construction, renovations, and project management.",
    icon: "HardHat",
    keywords: ["building contractor", "construction", "house construction", "civil contractor", "builder"],
    subcategories: ["Residential Construction", "Commercial Construction", "Renovation", "Project Management", "Civil Works", "Steel Structure", "Prefab Construction", "Green Building"],
    sector: "Construction & Real Estate"
  },
  {
    slug: "interior-designers",
    name: "Interior Designers",
    malayalam: "ഇന്റീരിയർ ഡിസൈനേഴ്സ്",
    description: "Creative interior designers for homes, offices, and commercial spaces with 3D visualization.",
    icon: "Palette",
    keywords: ["interior designer", "interior design", "home interior", "office interior", "modular interior"],
    subcategories: ["Home Interior", "Office Interior", "Commercial Interior", "3D Design", "Furniture Design", "Kitchen Design", "Bedroom Design", "Living Room"],
    sector: "Construction & Real Estate"
  },
  {
    slug: "architects",
    name: "Architects",
    malayalam: "ആർക്കിടെക്റ്റുകൾ",
    description: "Licensed architects for building design, planning, structural design, and construction drawings.",
    icon: "Compass",
    keywords: ["architect", "building design", "house plan", "architectural design", "structural design"],
    subcategories: ["Residential Design", "Commercial Design", "Building Plans", "3D Elevation", "Structural Design", "Green Architecture", "Landscape Design", "Permit Drawings"],
    sector: "Construction & Real Estate"
  },
  {
    slug: "real-estate-agents",
    name: "Real Estate Agents",
    malayalam: "റിയൽ എസ്റ്റേറ്റ് ഏജന്റ്സ്",
    description: "Trusted real estate agents for buying, selling, and renting residential and commercial properties.",
    icon: "Home",
    keywords: ["real estate", "property agent", "house sale", "flat rent", "property dealer", "broker"],
    subcategories: ["Residential Sale", "Residential Rent", "Commercial Property", "Land Sale", "Flat Sale", "Villa Sale", "Property Valuation", "Investment Advisory"],
    sector: "Construction & Real Estate"
  },
  {
    slug: "property-developers",
    name: "Property Developers",
    malayalam: "പ്രോപ്പർട്ടി ഡെവലപ്പേഴ്സ്",
    description: "Reputed property developers and builders for apartments, villas, commercial complexes, and townships.",
    icon: "Building2",
    keywords: ["property developer", "builder", "apartments", "villa projects", "township", "real estate developer"],
    subcategories: ["Apartments", "Villas", "Commercial Complex", "Township", "Affordable Housing", "Luxury Projects", "Ready to Move", "Under Construction"],
    sector: "Construction & Real Estate"
  },
  {
    slug: "modular-kitchen",
    name: "Modular Kitchen",
    malayalam: "മോഡുലാർ കിച്ചൻ",
    description: "Premium modular kitchen designers and manufacturers with customized designs and quality fittings.",
    icon: "ChefHat",
    keywords: ["modular kitchen", "kitchen design", "kitchen cabinets", "kitchen interior", "chimney"],
    subcategories: ["L-shaped Kitchen", "U-shaped Kitchen", "Parallel Kitchen", "Island Kitchen", "Kitchen Cabinets", "Kitchen Accessories", "Chimney Installation", "Kitchen Renovation"],
    sector: "Construction & Real Estate"
  },
  {
    slug: "waterproofing",
    name: "Waterproofing",
    malayalam: "വാട്ടർപ്രൂഫിംഗ്",
    description: "Professional waterproofing solutions for terrace, bathroom, basement, and building exteriors.",
    icon: "Umbrella",
    keywords: ["waterproofing", "terrace waterproofing", "bathroom waterproofing", "leak repair", "seepage"],
    subcategories: ["Terrace Waterproofing", "Bathroom Waterproofing", "Basement Waterproofing", "Wall Seepage", "Tank Waterproofing", "Expansion Joint", "Injection Grouting", "Membrane Coating"],
    sector: "Construction & Real Estate"
  },
  {
    slug: "electrical-contractors",
    name: "Electrical Contractors",
    malayalam: "ഇലക്ട്രിക്കൽ കോൺട്രാക്ടർസ്",
    description: "Licensed electrical contractors for new construction, industrial wiring, and electrical installations.",
    icon: "Zap",
    keywords: ["electrical contractor", "house wiring", "industrial wiring", "electrical installation", "panel board"],
    subcategories: ["House Wiring", "Industrial Wiring", "Panel Board", "Earthing", "Generator Installation", "Solar Installation", "Transformer", "HT/LT Installation"],
    sector: "Construction & Real Estate"
  },
  {
    slug: "plumbing-contractors",
    name: "Plumbing Contractors",
    malayalam: "പ്ലംബിംഗ് കോൺട്രാക്ടർസ്",
    description: "Professional plumbing contractors for new construction, renovations, and industrial plumbing.",
    icon: "Wrench",
    keywords: ["plumbing contractor", "pipeline", "sanitary work", "drainage system", "water supply"],
    subcategories: ["New Construction", "Pipeline Installation", "Drainage System", "Sanitary Work", "Swimming Pool", "STP Plant", "Fire Fighting", "Industrial Plumbing"],
    sector: "Construction & Real Estate"
  },
  {
    slug: "land-surveyors",
    name: "Land Surveyors",
    malayalam: "ലാൻഡ് സർവേയർമാർ",
    description: "Licensed land surveyors for property surveys, boundary marking, and topographic surveys.",
    icon: "MapPin",
    keywords: ["land surveyor", "property survey", "boundary survey", "topographic survey", "surveyor"],
    subcategories: ["Boundary Survey", "Topographic Survey", "Construction Survey", "Property Division", "Contour Survey", "GPS Survey", "Legal Survey", "Drone Survey"],
    sector: "Construction & Real Estate"
  },

  // ==================== RETAIL (10) ====================
  {
    slug: "furniture-shops",
    name: "Furniture Shops",
    malayalam: "ഫർണിച്ചർ ഷോപ്പുകൾ",
    description: "Quality furniture shops for home and office furniture including beds, sofas, tables, and custom designs.",
    icon: "Armchair",
    keywords: ["furniture", "furniture shop", "sofa", "bed", "dining table", "office furniture"],
    subcategories: ["Living Room", "Bedroom", "Dining", "Office Furniture", "Outdoor Furniture", "Kids Furniture", "Custom Furniture", "Wooden Furniture"],
    sector: "Retail"
  },
  {
    slug: "mobile-shops",
    name: "Mobile Shops",
    malayalam: "മൊബൈൽ ഷോപ്പുകൾ",
    description: "Authorized mobile phone dealers for smartphones, accessories, repairs, and mobile services.",
    icon: "Smartphone",
    keywords: ["mobile shop", "smartphone", "mobile phone", "accessories", "mobile repair"],
    subcategories: ["Smartphones", "Feature Phones", "Mobile Accessories", "Screen Guards", "Mobile Repair", "Second Hand Mobiles", "SIM Cards", "Earphones"],
    sector: "Retail"
  },
  {
    slug: "computer-stores",
    name: "Computer Stores",
    malayalam: "കമ്പ്യൂട്ടർ സ്റ്റോറുകൾ",
    description: "Computer shops for laptops, desktops, components, peripherals, and computer services.",
    icon: "Laptop",
    keywords: ["computer store", "laptop", "desktop", "computer accessories", "pc components"],
    subcategories: ["Laptops", "Desktops", "Monitors", "Printers", "PC Components", "Networking", "Storage Devices", "Computer Repair"],
    sector: "Retail"
  },
  {
    slug: "cctv-shops",
    name: "CCTV Shops",
    malayalam: "സിസിടിവി ഷോപ്പുകൾ",
    description: "CCTV dealers and security equipment shops with installation and maintenance services.",
    icon: "Camera",
    keywords: ["cctv shop", "security camera", "surveillance", "dvr", "nvr", "ip camera"],
    subcategories: ["Dome Cameras", "Bullet Cameras", "PTZ Cameras", "DVR/NVR", "Video Intercom", "Access Control", "Biometric", "Alarm Systems"],
    sector: "Retail"
  },
  {
    slug: "hardware-stores",
    name: "Hardware Stores",
    malayalam: "ഹാർഡ്‌വെയർ സ്റ്റോറുകൾ",
    description: "Complete hardware stores for tools, building materials, fasteners, and construction supplies.",
    icon: "Hammer",
    keywords: ["hardware store", "tools", "building materials", "fasteners", "construction supplies"],
    subcategories: ["Power Tools", "Hand Tools", "Fasteners", "Locks & Hardware", "Plumbing Materials", "Electrical Supplies", "Welding Equipment", "Safety Equipment"],
    sector: "Retail"
  },
  {
    slug: "electrical-shops",
    name: "Electrical Shops",
    malayalam: "ഇലക്ട്രിക്കൽ ഷോപ്പുകൾ",
    description: "Electrical goods shops for switches, wires, lighting, fans, and home appliances.",
    icon: "Lightbulb",
    keywords: ["electrical shop", "switches", "wires", "lighting", "fans", "home appliances"],
    subcategories: ["Switches & Sockets", "Wires & Cables", "LED Lighting", "Fans", "MCB & Distribution", "Home Appliances", "Solar Products", "Smart Home"],
    sector: "Retail"
  },
  {
    slug: "mattress-stores",
    name: "Mattress Stores",
    malayalam: "മെത്ത സ്റ്റോറുകൾ",
    description: "Quality mattress stores with memory foam, spring, and orthopedic mattresses for healthy sleep.",
    icon: "Bed",
    keywords: ["mattress", "mattress store", "memory foam", "spring mattress", "orthopedic mattress"],
    subcategories: ["Memory Foam", "Spring Mattress", "Orthopedic", "Coir Mattress", "Latex Mattress", "Pillows", "Bed Accessories", "Custom Size"],
    sector: "Retail"
  },
  {
    slug: "tile-dealers",
    name: "Tile Dealers",
    malayalam: "ടൈൽ ഡീലർമാർ",
    description: "Premium tile showrooms for floor tiles, wall tiles, bathroom tiles, and imported tiles.",
    icon: "LayoutGrid",
    keywords: ["tiles", "tile dealer", "floor tiles", "wall tiles", "bathroom tiles", "vitrified tiles"],
    subcategories: ["Floor Tiles", "Wall Tiles", "Bathroom Tiles", "Vitrified Tiles", "Wooden Tiles", "Marble", "Granite", "Imported Tiles"],
    sector: "Retail"
  },
  {
    slug: "paint-dealers",
    name: "Paint Dealers",
    malayalam: "പെയിന്റ് ഡീലർമാർ",
    description: "Authorized paint dealers for interior, exterior, wood, and metal paints with color consultation.",
    icon: "Paintbrush",
    keywords: ["paint", "paint dealer", "asian paints", "berger", "interior paint", "exterior paint"],
    subcategories: ["Interior Paints", "Exterior Paints", "Wood Finish", "Metal Paint", "Waterproofing", "Texture Paint", "Enamel", "Wall Putty"],
    sector: "Retail"
  },
  {
    slug: "glass-shops",
    name: "Glass Shops",
    malayalam: "ഗ്ലാസ് ഷോപ്പുകൾ",
    description: "Glass dealers for windows, doors, partitions, mirrors, and decorative glass solutions.",
    icon: "Square",
    keywords: ["glass shop", "glass dealer", "window glass", "mirror", "toughened glass", "glass partition"],
    subcategories: ["Window Glass", "Door Glass", "Toughened Glass", "Mirrors", "Glass Partition", "Glass Railing", "Shower Enclosure", "Decorative Glass"],
    sector: "Retail"
  },

  // ==================== EDUCATION (10) ====================
  {
    slug: "tuition-centres",
    name: "Tuition Centres",
    malayalam: "ട്യൂഷൻ സെന്ററുകൾ",
    description: "Quality tuition centres for school subjects, board exams, and academic excellence.",
    icon: "BookOpen",
    keywords: ["tuition", "tuition centre", "coaching", "school tuition", "home tuition", "maths tuition"],
    subcategories: ["Primary Classes", "High School", "CBSE Coaching", "State Board", "Maths Tuition", "Science Tuition", "Home Tuition", "Online Tuition"],
    sector: "Education"
  },
  {
    slug: "entrance-coaching",
    name: "Entrance Coaching",
    malayalam: "എൻട്രൻസ് കോച്ചിംഗ്",
    description: "Expert entrance coaching for medical, engineering, law, and competitive exam preparation.",
    icon: "Target",
    keywords: ["entrance coaching", "neet", "jee", "medical entrance", "engineering entrance", "competitive exams"],
    subcategories: ["NEET Coaching", "JEE Coaching", "KEAM", "Law Entrance", "CA Foundation", "Bank Exams", "PSC Coaching", "UPSC"],
    sector: "Education"
  },
  {
    slug: "ielts-coaching",
    name: "IELTS Coaching",
    malayalam: "ഐഇഎൽറ്റിഎസ് കോച്ചിംഗ്",
    description: "Professional IELTS, PTE, OET coaching with speaking practice and test preparation.",
    icon: "Globe",
    keywords: ["ielts", "ielts coaching", "pte", "oet", "english coaching", "spoken english"],
    subcategories: ["IELTS Academic", "IELTS General", "PTE Coaching", "OET Coaching", "TOEFL", "Spoken English", "Grammar Classes", "Writing Skills"],
    sector: "Education"
  },
  {
    slug: "driving-schools",
    name: "Driving Schools",
    malayalam: "ഡ്രൈവിംഗ് സ്കൂളുകൾ",
    description: "Licensed driving schools for learning car, bike, and heavy vehicle driving with license assistance.",
    icon: "Car",
    keywords: ["driving school", "learn driving", "driving class", "driving license", "motor training"],
    subcategories: ["Car Driving", "Bike Driving", "Heavy Vehicle", "Automatic Car", "Lady Instructor", "License Assistance", "Refresher Course", "Corporate Training"],
    sector: "Education"
  },
  {
    slug: "computer-institutes",
    name: "Computer Institutes",
    malayalam: "കമ്പ്യൂട്ടർ ഇൻസ്റ്റിറ്റ്യൂട്ടുകൾ",
    description: "Computer training institutes for software, hardware, programming, and IT certifications.",
    icon: "Monitor",
    keywords: ["computer institute", "computer training", "software course", "programming", "it training"],
    subcategories: ["Basic Computer", "MS Office", "Programming", "Web Development", "Graphic Design", "Hardware Training", "Networking", "Tally"],
    sector: "Education"
  },
  {
    slug: "skill-training",
    name: "Skill Training",
    malayalam: "സ്കിൽ ട്രെയിനിംഗ്",
    description: "Vocational skill training centres for job-oriented courses and professional development.",
    icon: "Wrench",
    keywords: ["skill training", "vocational training", "job training", "skill development", "professional course"],
    subcategories: ["Beautician Course", "Tailoring", "Cooking Classes", "Mobile Repair", "AC Technician", "Electrician Course", "Plumbing Course", "Welding"],
    sector: "Education"
  },
  {
    slug: "music-classes",
    name: "Music Classes",
    malayalam: "മ്യൂസിക് ക്ലാസുകൾ",
    description: "Music schools and teachers for vocal, instrumental, and classical music training.",
    icon: "Music",
    keywords: ["music class", "music school", "keyboard class", "guitar class", "carnatic music", "hindustani"],
    subcategories: ["Carnatic Vocal", "Hindustani Vocal", "Keyboard", "Guitar", "Violin", "Drums", "Flute", "Music Theory"],
    sector: "Education"
  },
  {
    slug: "dance-classes",
    name: "Dance Classes",
    malayalam: "ഡാൻസ് ക്ലാസുകൾ",
    description: "Dance schools and choreographers for classical, western, and contemporary dance forms.",
    icon: "Users",
    keywords: ["dance class", "dance school", "bharatanatyam", "kathakali", "hip hop", "choreography"],
    subcategories: ["Bharatanatyam", "Kathakali", "Mohiniyattam", "Contemporary", "Hip Hop", "Salsa", "Western Dance", "Kids Dance"],
    sector: "Education"
  },
  {
    slug: "online-coaching",
    name: "Online Coaching",
    malayalam: "ഓൺലൈൻ കോച്ചിംഗ്",
    description: "Online learning platforms and virtual coaching for academics, competitive exams, and skills.",
    icon: "Video",
    keywords: ["online coaching", "online classes", "virtual learning", "e-learning", "online tuition"],
    subcategories: ["Academic Courses", "Entrance Exams", "Skill Courses", "Language Learning", "Professional Courses", "Live Classes", "Recorded Courses", "Doubt Clearing"],
    sector: "Education"
  },
  {
    slug: "study-abroad-consultants",
    name: "Study Abroad Consultants",
    malayalam: "സ്റ്റഡി എബ്രോഡ് കൺസൾട്ടന്റ്സ്",
    description: "Expert study abroad consultants for university admissions, visa assistance, and overseas education.",
    icon: "Plane",
    keywords: ["study abroad", "overseas education", "university admission", "visa consultant", "education consultant"],
    subcategories: ["University Selection", "Admission Assistance", "Visa Processing", "Scholarship Guidance", "SOP Writing", "Test Preparation", "UK Universities", "USA Universities"],
    sector: "Education"
  },

  // ==================== TRAVEL & LIFESTYLE (10) ====================
  {
    slug: "travel-agencies",
    name: "Travel Agencies",
    malayalam: "ട്രാവൽ ഏജൻസികൾ",
    description: "Trusted travel agencies for flight bookings, holiday packages, and complete travel planning.",
    icon: "Plane",
    keywords: ["travel agency", "flight booking", "holiday package", "tour package", "travel agent"],
    subcategories: ["Flight Booking", "Holiday Packages", "Hotel Booking", "Visa Services", "Travel Insurance", "Passport Services", "Cruise Booking", "Corporate Travel"],
    sector: "Travel & Lifestyle"
  },
  {
    slug: "tour-operators",
    name: "Tour Operators",
    malayalam: "ടൂർ ഓപ്പറേറ്റേഴ്സ്",
    description: "Professional tour operators for Kerala tours, honeymoon packages, and customized itineraries.",
    icon: "Map",
    keywords: ["tour operator", "kerala tour", "honeymoon package", "pilgrimage tour", "adventure tour"],
    subcategories: ["Kerala Tours", "Honeymoon Packages", "Pilgrimage Tours", "Adventure Tours", "Wildlife Tours", "Beach Holidays", "Hill Station Tours", "Customized Tours"],
    sector: "Travel & Lifestyle"
  },
  {
    slug: "taxi-services",
    name: "Taxi Services",
    malayalam: "ടാക്സി സർവീസസ്",
    description: "Reliable taxi services for local travel, airport transfers, and outstation trips.",
    icon: "Car",
    keywords: ["taxi", "cab", "taxi service", "airport taxi", "outstation taxi", "car hire"],
    subcategories: ["Local Taxi", "Airport Transfer", "Outstation", "One Way Taxi", "Round Trip", "Tempo Traveller", "Luxury Cars", "Corporate Cab"],
    sector: "Travel & Lifestyle"
  },
  {
    slug: "car-rentals",
    name: "Car Rentals",
    malayalam: "കാർ റെന്റൽസ്",
    description: "Self-drive and chauffeur-driven car rentals for daily, weekly, and monthly requirements.",
    icon: "Key",
    keywords: ["car rental", "self drive", "rent a car", "car hire", "vehicle rental"],
    subcategories: ["Self Drive", "With Driver", "Daily Rental", "Weekly Rental", "Monthly Rental", "SUV Rental", "Luxury Car Rental", "Corporate Rental"],
    sector: "Travel & Lifestyle"
  },
  {
    slug: "resorts",
    name: "Resorts",
    malayalam: "റിസോർട്ടുകൾ",
    description: "Premium resorts for holidays, honeymoons, and relaxation with world-class amenities.",
    icon: "Palmtree",
    keywords: ["resort", "beach resort", "hill station resort", "backwater resort", "ayurveda resort"],
    subcategories: ["Beach Resorts", "Hill Resorts", "Backwater Resorts", "Ayurveda Resorts", "Eco Resorts", "Luxury Resorts", "Family Resorts", "Honeymoon Resorts"],
    sector: "Travel & Lifestyle"
  },
  {
    slug: "hotels",
    name: "Hotels",
    malayalam: "ഹോട്ടലുകൾ",
    description: "Hotels and accommodations from budget to luxury for business and leisure travelers.",
    icon: "Building",
    keywords: ["hotel", "accommodation", "lodging", "budget hotel", "luxury hotel", "business hotel"],
    subcategories: ["Budget Hotels", "Business Hotels", "Luxury Hotels", "Boutique Hotels", "Heritage Hotels", "Airport Hotels", "Serviced Apartments", "Guest Houses"],
    sector: "Travel & Lifestyle"
  },
  {
    slug: "homestays",
    name: "Homestays",
    malayalam: "ഹോംസ്റ്റേകൾ",
    description: "Authentic Kerala homestays for experiencing local culture, cuisine, and hospitality.",
    icon: "Home",
    keywords: ["homestay", "farmstay", "village stay", "local experience", "authentic stay"],
    subcategories: ["Village Homestays", "Farm Stays", "Plantation Stays", "Backwater Homestays", "Hill Homestays", "Heritage Homes", "Eco Homestays", "Family Homestays"],
    sector: "Travel & Lifestyle"
  },
  {
    slug: "yoga-centres",
    name: "Yoga Centres",
    malayalam: "യോഗ സെന്ററുകൾ",
    description: "Yoga studios and wellness centres for yoga classes, meditation, and holistic wellness.",
    icon: "Heart",
    keywords: ["yoga", "yoga centre", "meditation", "wellness", "yoga classes", "pranayama"],
    subcategories: ["Hatha Yoga", "Ashtanga Yoga", "Power Yoga", "Prenatal Yoga", "Kids Yoga", "Meditation", "Yoga Therapy", "Teacher Training"],
    sector: "Travel & Lifestyle"
  },
  {
    slug: "gyms",
    name: "Gyms",
    malayalam: "ജിമ്മുകൾ",
    description: "Modern gyms and fitness centres with professional trainers and advanced equipment.",
    icon: "Dumbbell",
    keywords: ["gym", "fitness centre", "workout", "gym near me", "fitness training", "health club"],
    subcategories: ["Fitness Gym", "CrossFit", "Functional Training", "Women Only Gym", "24/7 Gym", "Personal Training", "Group Classes", "Strength Training"],
    sector: "Travel & Lifestyle"
  },
  {
    slug: "spa-wellness",
    name: "Spa & Wellness",
    malayalam: "സ്പാ & വെൽനസ്",
    description: "Relaxing spa and wellness centres for massages, therapies, and rejuvenation treatments.",
    icon: "Sparkles",
    keywords: ["spa", "wellness", "massage", "ayurveda spa", "relaxation", "body treatment"],
    subcategories: ["Ayurveda Spa", "Thai Massage", "Body Massage", "Facial Treatment", "Couple Spa", "Detox Programs", "Beauty Spa", "Medical Spa"],
    sector: "Travel & Lifestyle"
  },

  // ==================== FOOD & EVENTS (10) ====================
  {
    slug: "restaurants",
    name: "Restaurants",
    malayalam: "റെസ്റ്റോറന്റുകൾ",
    description: "Top restaurants serving Kerala cuisine, North Indian, Chinese, and multi-cuisine options.",
    icon: "UtensilsCrossed",
    keywords: ["restaurant", "food", "dining", "kerala food", "biryani", "fine dining"],
    subcategories: ["Kerala Cuisine", "North Indian", "Chinese", "Biryani", "Seafood", "Vegetarian", "Fine Dining", "Family Restaurant"],
    sector: "Food & Events"
  },
  {
    slug: "catering-services",
    name: "Catering Services",
    malayalam: "കാറ്ററിംഗ് സർവീസസ്",
    description: "Professional caterers for weddings, parties, corporate events, and all occasions.",
    icon: "ChefHat",
    keywords: ["catering", "caterer", "wedding catering", "party catering", "food service"],
    subcategories: ["Wedding Catering", "Party Catering", "Corporate Catering", "Outdoor Catering", "Vegetarian Catering", "Non-veg Catering", "Buffet Service", "Live Cooking"],
    sector: "Food & Events"
  },
  {
    slug: "bakeries",
    name: "Bakeries",
    malayalam: "ബേക്കറികൾ",
    description: "Popular bakeries for cakes, pastries, breads, and custom celebration cakes.",
    icon: "Cake",
    keywords: ["bakery", "cake", "pastry", "bread", "custom cake", "birthday cake"],
    subcategories: ["Birthday Cakes", "Wedding Cakes", "Pastries", "Fresh Breads", "Cookies", "Snacks", "Custom Cakes", "Eggless Options"],
    sector: "Food & Events"
  },
  {
    slug: "cloud-kitchens",
    name: "Cloud Kitchens",
    malayalam: "ക്ലൗഡ് കിച്ചൻ",
    description: "Delivery-only cloud kitchens serving diverse cuisines through food delivery apps.",
    icon: "Package",
    keywords: ["cloud kitchen", "food delivery", "online food", "delivery kitchen", "ghost kitchen"],
    subcategories: ["Multi-cuisine", "Biryani", "Chinese", "Continental", "Healthy Food", "Diet Food", "Desserts", "Home Style"],
    sector: "Food & Events"
  },
  {
    slug: "juice-bars",
    name: "Juice Bars",
    malayalam: "ജ്യൂസ് ബാറുകൾ",
    description: "Fresh juice bars and smoothie shops for healthy drinks and natural refreshments.",
    icon: "GlassWater",
    keywords: ["juice bar", "fresh juice", "smoothie", "fruit juice", "healthy drinks"],
    subcategories: ["Fresh Juices", "Smoothies", "Milkshakes", "Detox Drinks", "Coconut Water", "Fruit Salad", "Energy Drinks", "Organic Juices"],
    sector: "Food & Events"
  },
  {
    slug: "cafes",
    name: "Cafes",
    malayalam: "കഫേകൾ",
    description: "Cozy cafes for coffee, tea, snacks, and casual dining with great ambiance.",
    icon: "Coffee",
    keywords: ["cafe", "coffee shop", "tea cafe", "coffee house", "snack bar"],
    subcategories: ["Coffee Specialty", "Tea House", "Breakfast Cafe", "Dessert Cafe", "Study Cafe", "Pet Friendly", "Rooftop Cafe", "Theme Cafe"],
    sector: "Food & Events"
  },
  {
    slug: "ice-cream-parlours",
    name: "Ice Cream Parlours",
    malayalam: "ഐസ്ക്രീം പാർലറുകൾ",
    description: "Popular ice cream parlours with wide flavour selections and dessert options.",
    icon: "IceCream",
    keywords: ["ice cream", "ice cream parlour", "gelato", "frozen dessert", "sundae"],
    subcategories: ["Natural Ice Cream", "Gelato", "Sundaes", "Shakes", "Frozen Yogurt", "Kulfi", "Ice Cream Cakes", "Sugar Free"],
    sector: "Food & Events"
  },
  {
    slug: "food-trucks",
    name: "Food Trucks",
    malayalam: "ഫുഡ് ട്രക്കുകൾ",
    description: "Mobile food trucks serving street food, quick bites, and specialty cuisines.",
    icon: "Truck",
    keywords: ["food truck", "street food", "mobile food", "quick bites", "outdoor food"],
    subcategories: ["Street Food", "Burgers", "Shawarma", "Tacos", "BBQ", "Asian Street Food", "Dessert Truck", "Breakfast Truck"],
    sector: "Food & Events"
  },
  {
    slug: "wedding-caterers",
    name: "Wedding Caterers",
    malayalam: "വെഡ്ഡിംഗ് കാറ്ററേഴ്സ്",
    description: "Specialized wedding caterers for Sadhya, North Indian, and multi-cuisine wedding feasts.",
    icon: "Heart",
    keywords: ["wedding catering", "sadhya", "wedding food", "marriage catering", "feast"],
    subcategories: ["Kerala Sadhya", "North Indian Wedding", "Muslim Wedding", "Christian Wedding", "Cocktail Catering", "Live Counters", "Destination Wedding", "Royal Feast"],
    sector: "Food & Events"
  },
  {
    slug: "event-caterers",
    name: "Event Caterers",
    malayalam: "ഇവന്റ് കാറ്ററേഴ്സ്",
    description: "Event catering services for corporate events, birthdays, and special occasions.",
    icon: "PartyPopper",
    keywords: ["event catering", "party catering", "corporate catering", "birthday catering", "occasion catering"],
    subcategories: ["Corporate Events", "Birthday Parties", "Anniversary", "House Warming", "Engagement", "Baby Shower", "Theme Parties", "Cocktail Events"],
    sector: "Food & Events"
  },

  // ==================== WEDDING (10) ====================
  {
    slug: "wedding-planners",
    name: "Wedding Planners",
    malayalam: "വെഡ്ഡിംഗ് പ്ലാനേഴ്സ്",
    description: "Professional wedding planners for complete wedding management and destination weddings.",
    icon: "Heart",
    keywords: ["wedding planner", "wedding organizer", "destination wedding", "marriage planner"],
    subcategories: ["Full Planning", "Day Coordination", "Destination Wedding", "Budget Wedding", "Luxury Wedding", "Theme Wedding", "Vendor Management", "Guest Management"],
    sector: "Wedding"
  },
  {
    slug: "photography",
    name: "Photography",
    malayalam: "ഫോട്ടോഗ്രഫി",
    description: "Professional photographers for weddings, pre-wedding shoots, and all occasions.",
    icon: "Camera",
    keywords: ["photography", "wedding photography", "photographer", "pre-wedding", "candid photography"],
    subcategories: ["Wedding Photography", "Pre-wedding Shoot", "Candid Photography", "Traditional Photography", "Drone Photography", "Album Design", "Photo Editing", "Same Day Edit"],
    sector: "Wedding"
  },
  {
    slug: "videography",
    name: "Videography",
    malayalam: "വീഡിയോഗ്രഫി",
    description: "Expert videographers for cinematic wedding films, live streaming, and video editing.",
    icon: "Video",
    keywords: ["videography", "wedding video", "cinematography", "live streaming", "video editing"],
    subcategories: ["Cinematic Video", "Traditional Video", "Drone Video", "Live Streaming", "Teaser", "Highlight Film", "Full Documentary", "Same Day Edit"],
    sector: "Wedding"
  },
  {
    slug: "makeup-artists",
    name: "Makeup Artists",
    malayalam: "മേക്കപ്പ് ആർട്ടിസ്റ്റുകൾ",
    description: "Professional makeup artists for bridal makeup, engagement, and special occasions.",
    icon: "Sparkles",
    keywords: ["makeup artist", "bridal makeup", "party makeup", "engagement makeup", "mehendi"],
    subcategories: ["Bridal Makeup", "Engagement Makeup", "Reception Makeup", "Party Makeup", "Mehendi Artist", "Hair Styling", "Saree Draping", "Pre-bridal Packages"],
    sector: "Wedding"
  },
  {
    slug: "bridal-studios",
    name: "Bridal Studios",
    malayalam: "ബ്രൈഡൽ സ്റ്റുഡിയോസ്",
    description: "Complete bridal studios for makeup, hair, saree draping, and bridal accessories.",
    icon: "Crown",
    keywords: ["bridal studio", "bridal salon", "bridal makeover", "wedding makeup", "bridal wear"],
    subcategories: ["Bridal Makeover", "Hair Styling", "Saree Draping", "Jewelry Styling", "Bridal Packages", "Groom Makeover", "Family Makeup", "Rental Jewelry"],
    sector: "Wedding"
  },
  {
    slug: "decoration",
    name: "Decoration",
    malayalam: "ഡെക്കറേഷൻ",
    description: "Wedding and event decorators for mandap, stage, floral, and theme decorations.",
    icon: "Flower",
    keywords: ["decoration", "wedding decoration", "stage decoration", "mandap", "floral decoration"],
    subcategories: ["Stage Decoration", "Mandap Decoration", "Floral Decoration", "Theme Decoration", "Lighting", "Entrance Decoration", "Balloon Decoration", "Venue Decoration"],
    sector: "Wedding"
  },
  {
    slug: "flower-shops",
    name: "Flower Shops",
    malayalam: "ഫ്ലവർ ഷോപ്പുകൾ",
    description: "Fresh flower shops for wedding bouquets, event decorations, and special occasions.",
    icon: "Flower2",
    keywords: ["flower shop", "florist", "wedding flowers", "bouquet", "floral arrangement"],
    subcategories: ["Wedding Flowers", "Bouquets", "Stage Flowers", "Car Decoration", "Gift Flowers", "Artificial Flowers", "Floral Design", "Event Flowers"],
    sector: "Wedding"
  },
  {
    slug: "event-management",
    name: "Event Management",
    malayalam: "ഇവന്റ് മാനേജ്മെന്റ്",
    description: "Complete event management for weddings, corporate events, and private celebrations.",
    icon: "Calendar",
    keywords: ["event management", "event organizer", "wedding management", "corporate events", "party organizer"],
    subcategories: ["Wedding Events", "Corporate Events", "Birthday Parties", "Anniversary", "Product Launch", "Conferences", "Cultural Events", "Private Parties"],
    sector: "Wedding"
  },
  {
    slug: "dj-services",
    name: "DJ Services",
    malayalam: "ഡിജെ സർവീസസ്",
    description: "Professional DJs for weddings, parties, and events with quality sound systems.",
    icon: "Music",
    keywords: ["dj", "dj services", "wedding dj", "party dj", "music entertainment"],
    subcategories: ["Wedding DJ", "Party DJ", "Corporate DJ", "Club DJ", "Sound System", "LED Dance Floor", "Fog Machine", "Lighting Effects"],
    sector: "Wedding"
  },
  {
    slug: "sound-light",
    name: "Sound & Light",
    malayalam: "സൗണ്ട് & ലൈറ്റ്",
    description: "Professional sound and lighting services for weddings, events, and stage shows.",
    icon: "Lightbulb",
    keywords: ["sound system", "lighting", "stage lighting", "event sound", "led lights"],
    subcategories: ["Sound System Rental", "Stage Lighting", "LED Walls", "Event Lighting", "DJ Equipment", "Microphone Rental", "Projection", "Truss & Rigging"],
    sector: "Wedding"
  }
];

export const getCategoryBySlug = (slug: string): CategoryData | undefined => {
  return businessCategories.find(cat => cat.slug === slug.toLowerCase());
};

export const getAllCategorySlugs = (): string[] => {
  return businessCategories.map(cat => cat.slug);
};

export const getCategoriesBySector = (sector: string): CategoryData[] => {
  return businessCategories.filter(cat => cat.sector === sector);
};

export const getAllSectors = (): string[] => {
  return [...new Set(businessCategories.map(cat => cat.sector))];
};
