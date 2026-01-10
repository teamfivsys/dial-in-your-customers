export interface CategoryData {
  slug: string;
  name: string;
  malayalam: string;
  description: string;
  icon: string;
  keywords: string[];
  subcategories: string[];
}

export const businessCategories: CategoryData[] = [
  {
    slug: "doctors",
    name: "Doctors & Healthcare",
    malayalam: "ഡോക്ടർമാർ",
    description: "Find verified doctors, hospitals, clinics, and healthcare services. From general physicians to specialists – cardiologists, dermatologists, pediatricians, dentists, and more.",
    icon: "Stethoscope",
    keywords: ["doctors", "hospital", "clinic", "healthcare", "medical", "physician", "specialist"],
    subcategories: ["General Physicians", "Dentists", "Cardiologists", "Dermatologists", "Pediatricians", "Gynecologists", "Orthopedic", "ENT Specialists", "Eye Specialists", "Ayurveda Doctors"]
  },
  {
    slug: "restaurants",
    name: "Restaurants & Food",
    malayalam: "റെസ്റ്റോറന്റുകൾ",
    description: "Discover the best restaurants, cafes, bakeries, and food delivery services. From traditional Kerala Sadhya to continental cuisine, find your perfect dining spot.",
    icon: "UtensilsCrossed",
    keywords: ["restaurant", "food", "cafe", "bakery", "dining", "biryani", "kerala food"],
    subcategories: ["Kerala Restaurants", "North Indian", "Chinese", "Biryani", "Cafes", "Bakeries", "Fast Food", "Fine Dining", "Home Delivery", "Catering"]
  },
  {
    slug: "lawyers",
    name: "Lawyers & Legal Services",
    malayalam: "അഭിഭാഷകർ",
    description: "Connect with experienced lawyers and legal professionals. Property disputes, family law, criminal defense, corporate law, and more – verified legal experts at your service.",
    icon: "Scale",
    keywords: ["lawyer", "advocate", "legal", "attorney", "court", "law firm", "legal services"],
    subcategories: ["Civil Lawyers", "Criminal Lawyers", "Family Court Advocates", "Property Lawyers", "Corporate Lawyers", "Tax Consultants", "Notary Services", "Legal Advisors"]
  },
  {
    slug: "home-services",
    name: "Home Services",
    malayalam: "ഹോം സർവീസസ്",
    description: "Book trusted home service professionals – electricians, plumbers, carpenters, AC repair, pest control, cleaning services, and more. Verified experts for all your home needs.",
    icon: "Home",
    keywords: ["home services", "plumber", "electrician", "carpenter", "repair", "maintenance", "cleaning"],
    subcategories: ["Plumbers", "Electricians", "Carpenters", "AC Repair", "Pest Control", "House Cleaning", "Painting", "Appliance Repair", "Interior Work", "Gardening"]
  },
  {
    slug: "real-estate",
    name: "Real Estate & Property",
    malayalam: "റിയൽ എസ്റ്റേറ്റ്",
    description: "Find trusted real estate agents, property dealers, builders, and rental services. Buy, sell, or rent properties with verified real estate professionals.",
    icon: "Building",
    keywords: ["real estate", "property", "house", "apartment", "flat", "land", "builder", "rent"],
    subcategories: ["Property Dealers", "Builders", "Rental Agents", "Commercial Property", "Land Dealers", "Property Management", "Home Loans", "Interior Designers"]
  },
  {
    slug: "salons",
    name: "Salons & Beauty",
    malayalam: "സലൂണുകൾ",
    description: "Book appointments at the best salons, spas, and beauty parlors. Haircuts, skincare, bridal makeup, spa treatments – pamper yourself with verified beauty professionals.",
    icon: "Scissors",
    keywords: ["salon", "beauty", "spa", "haircut", "makeup", "bridal", "parlour"],
    subcategories: ["Hair Salons", "Beauty Parlours", "Spas", "Bridal Makeup", "Men's Grooming", "Nail Art", "Skincare", "Tattoo Studios"]
  },
  {
    slug: "gyms",
    name: "Gyms & Fitness",
    malayalam: "ജിമ്മുകൾ",
    description: "Find the best gyms, fitness centers, yoga studios, and personal trainers. Start your fitness journey with verified fitness professionals and well-equipped facilities.",
    icon: "Dumbbell",
    keywords: ["gym", "fitness", "yoga", "workout", "trainer", "health club", "crossfit"],
    subcategories: ["Gyms", "Yoga Studios", "CrossFit", "Zumba Classes", "Personal Trainers", "Swimming Pools", "Martial Arts", "Sports Academies"]
  },
  {
    slug: "education",
    name: "Education & Tutoring",
    malayalam: "വിദ്യാഭ്യാസം",
    description: "Connect with the best tutors, coaching centers, and educational institutions. School subjects, competitive exams, language classes, skill development – verified educators.",
    icon: "GraduationCap",
    keywords: ["tutor", "coaching", "school", "college", "education", "classes", "training"],
    subcategories: ["Home Tutors", "Coaching Centers", "Schools", "Colleges", "Computer Training", "Language Classes", "Music Classes", "Dance Classes"]
  },
  {
    slug: "automobile",
    name: "Automobile Services",
    malayalam: "ഓട്ടോമൊബൈൽ",
    description: "Find trusted automobile services – car repair, bike service, car wash, spare parts, driving schools, and more. Keep your vehicles in top condition.",
    icon: "Car",
    keywords: ["car", "bike", "automobile", "repair", "service center", "spare parts", "workshop"],
    subcategories: ["Car Service Centers", "Bike Mechanics", "Car Wash", "Spare Parts", "Driving Schools", "Car Dealers", "Used Car Sales", "Tyre Shops"]
  },
  {
    slug: "wedding",
    name: "Wedding & Events",
    malayalam: "വിവാഹം",
    description: "Plan your perfect wedding with verified vendors – wedding planners, caterers, photographers, decorators, venues, and more. Make your special day memorable.",
    icon: "Heart",
    keywords: ["wedding", "marriage", "event", "catering", "photographer", "venue", "decorator"],
    subcategories: ["Wedding Planners", "Caterers", "Photographers", "Videographers", "Venues", "Decorators", "DJ Services", "Mehendi Artists"]
  },
  {
    slug: "travel",
    name: "Travel & Tourism",
    malayalam: "ടൂറിസം",
    description: "Book trusted travel services – tour packages, travel agents, cab services, hotels, homestays, and local guides. Explore Kerala with verified travel professionals.",
    icon: "Plane",
    keywords: ["travel", "tourism", "tour", "cab", "taxi", "hotel", "homestay", "trip"],
    subcategories: ["Travel Agents", "Tour Packages", "Cab Services", "Hotels", "Homestays", "Houseboats", "Car Rentals", "Travel Insurance"]
  },
  {
    slug: "shopping",
    name: "Shopping & Retail",
    malayalam: "ഷോപ്പിംഗ്",
    description: "Discover the best shops and retail stores – clothing, jewelry, electronics, grocery, furniture, and more. Shop from verified local businesses.",
    icon: "ShoppingBag",
    keywords: ["shop", "store", "retail", "clothing", "jewelry", "electronics", "grocery"],
    subcategories: ["Clothing Stores", "Jewelry Shops", "Electronics", "Grocery Stores", "Furniture", "Mobile Shops", "Book Stores", "Gift Shops"]
  }
];

export const getCategoryBySlug = (slug: string): CategoryData | undefined => {
  return businessCategories.find(cat => cat.slug === slug.toLowerCase());
};

export const getAllCategorySlugs = (): string[] => {
  return businessCategories.map(cat => cat.slug);
};
