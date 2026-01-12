export interface CityData {
  slug: string;
  name: string;
  malayalam: string;
  district: string;
  description: string;
  population?: string;
  highlights: string[];
  businessTypes: string[];
}

export const keralaCities: CityData[] = [
  {
    slug: "kochi",
    name: "Kochi",
    malayalam: "കൊച്ചി",
    district: "Ernakulam",
    description: "Kochi, the commercial capital of Kerala, is home to thousands of businesses ranging from traditional spice traders to modern IT companies. As the gateway to Kerala, Kochi businesses serve both local residents and the millions of tourists who visit each year.",
    population: "2.1 million",
    highlights: ["Commercial Capital", "Major Port City", "IT Hub", "Tourism Center"],
    businessTypes: ["Restaurants", "Hotels", "IT Services", "Spice Traders", "Medical Services", "Tourism"]
  },
  {
    slug: "calicut",
    name: "Calicut",
    malayalam: "കോഴിക്കോട്",
    district: "Kozhikode",
    description: "Calicut (Kozhikode), the city of spices, is the commercial hub of North Kerala. Known for its rich culinary heritage, especially the famous Calicut Biryani and Kozhikodan Halwa, the city has a thriving business ecosystem.",
    population: "2.0 million",
    highlights: ["Spice Trade Center", "Food Capital", "Healthcare Hub", "Education Center"],
    businessTypes: ["Restaurants", "Sweet Shops", "Hospitals", "Educational Institutions", "Textile Shops"]
  },
  {
    slug: "trivandrum",
    name: "Trivandrum",
    malayalam: "തിരുവനന്തപുരം",
    district: "Thiruvananthapuram",
    description: "Trivandrum (Thiruvananthapuram), the capital city of Kerala, houses the state's administrative center along with major IT parks, research institutions, and cultural landmarks. The city blends tradition with modernity.",
    population: "1.7 million",
    highlights: ["State Capital", "IT Corridor", "Cultural Hub", "Beach Tourism"],
    businessTypes: ["Government Services", "IT Companies", "Hospitals", "Tourism", "Traditional Arts"]
  },
  {
    slug: "thrissur",
    name: "Thrissur",
    malayalam: "തൃശ്ശൂർ",
    district: "Thrissur",
    description: "Thrissur, the cultural capital of Kerala, is famous for its temples, festivals, and gold jewelry industry. The city hosts the spectacular Thrissur Pooram and is a major center for traditional arts and crafts.",
    population: "1.5 million",
    highlights: ["Cultural Capital", "Gold Jewelry Hub", "Festival City", "Temple Town"],
    businessTypes: ["Jewelry Shops", "Temple Services", "Cultural Academies", "Textile Shops", "Catering"]
  },
  {
    slug: "malappuram",
    name: "Malappuram",
    malayalam: "മലപ്പുറം",
    district: "Malappuram",
    description: "Malappuram is one of Kerala's most populous districts with a vibrant commercial scene. Known for its entrepreneurial spirit, the district has numerous small and medium businesses serving a large consumer base.",
    population: "4.1 million",
    highlights: ["High Population", "Entrepreneurial Hub", "Gulf Remittances", "Retail Center"],
    businessTypes: ["Retail Shops", "Restaurants", "Real Estate", "Automobile Services", "Healthcare"]
  },
  {
    slug: "palakkad",
    name: "Palakkad",
    malayalam: "പാലക്കാട്",
    district: "Palakkad",
    description: "Palakkad, the gateway to Kerala through the Palakkad Gap, has a unique culture influenced by both Kerala and Tamil Nadu. The district is known for its rice production, historic forts, and traditional music.",
    population: "2.8 million",
    highlights: ["Rice Bowl of Kerala", "Historic Fort", "Music Tradition", "Agricultural Hub"],
    businessTypes: ["Rice Mills", "Agricultural Services", "Music Schools", "Restaurants", "Traditional Shops"]
  },
  {
    slug: "kannur",
    name: "Kannur",
    malayalam: "കണ്ണൂർ",
    district: "Kannur",
    description: "Kannur, known as the land of looms and lores, is famous for its handloom industry and Theyyam performances. The city has a growing business ecosystem with emerging opportunities in tourism and traditional crafts.",
    population: "1.6 million",
    highlights: ["Handloom Industry", "Theyyam Tourism", "Beach Destinations", "Spice Trade"],
    businessTypes: ["Handloom Shops", "Tourism Services", "Spice Exporters", "Restaurants", "Traditional Crafts"]
  },
  {
    slug: "kollam",
    name: "Kollam",
    malayalam: "കൊല്ലം",
    district: "Kollam",
    description: "Kollam (Quilon), one of the oldest ports in the Arabian Sea, has a rich trading history. Today, the city is known for its cashew industry, backwater tourism, and traditional industries.",
    population: "1.1 million",
    highlights: ["Ancient Port City", "Cashew Capital", "Backwater Tourism", "Traditional Industries"],
    businessTypes: ["Cashew Processing", "Tourism Services", "Fishing Industry", "Restaurants", "Traditional Crafts"]
  },
  {
    slug: "alappuzha",
    name: "Alappuzha",
    malayalam: "ആലപ്പുഴ",
    district: "Alappuzha",
    description: "Alappuzha (Alleppey), known as the Venice of the East, is famous for its backwaters, houseboats, and coir industry. The tourism-focused economy supports numerous local businesses.",
    population: "0.9 million",
    highlights: ["Venice of the East", "Backwater Tourism", "Coir Industry", "Houseboat Capital"],
    businessTypes: ["Houseboats", "Tourism Services", "Coir Products", "Restaurants", "Homestays"]
  },
  {
    slug: "kottayam",
    name: "Kottayam",
    malayalam: "കോട്ടയം",
    district: "Kottayam",
    description: "Kottayam is Kerala's first fully literate city and a major center for rubber production. The city has a strong educational infrastructure and is known for its contribution to Malayalam literature and journalism.",
    population: "1.3 million",
    highlights: ["100% Literacy", "Rubber Capital", "Publishing Hub", "Education Center"],
    businessTypes: ["Educational Institutions", "Publishing Houses", "Rubber Dealers", "Hospitals", "Tourism"]
  },
  {
    slug: "idukki",
    name: "Idukki",
    malayalam: "ഇടുക്കി",
    district: "Idukki",
    description: "Idukki, the spice garden of Kerala, is known for its hill stations, wildlife sanctuaries, and cardamom plantations. The district offers unique eco-tourism opportunities and is home to the famous Idukki Dam.",
    population: "1.1 million",
    highlights: ["Spice Garden", "Hill Stations", "Wildlife Tourism", "Cardamom Capital"],
    businessTypes: ["Spice Exporters", "Resorts", "Homestays", "Tea Estates", "Eco-Tourism"]
  },
  {
    slug: "wayanad",
    name: "Wayanad",
    malayalam: "വയനാട്",
    district: "Wayanad",
    description: "Wayanad, Kerala's hill station paradise, is famous for its lush forests, wildlife, and tribal heritage. The district is a top destination for eco-tourism and adventure activities.",
    population: "0.8 million",
    highlights: ["Hill Station Paradise", "Wildlife Sanctuary", "Tribal Heritage", "Adventure Tourism"],
    businessTypes: ["Resorts", "Homestays", "Plantation Tours", "Adventure Sports", "Organic Farming"]
  },
  {
    slug: "pathanamthitta",
    name: "Pathanamthitta",
    malayalam: "പത്തനംതിട്ട",
    district: "Pathanamthitta",
    description: "Pathanamthitta, home to the famous Sabarimala Temple, is a major pilgrimage destination. The district also offers beautiful river valleys, forests, and traditional Christian churches.",
    population: "1.2 million",
    highlights: ["Sabarimala Temple", "Pilgrimage Hub", "River Valleys", "Religious Tourism"],
    businessTypes: ["Pilgrimage Services", "Hotels", "Restaurants", "Religious Shops", "Tourism Services"]
  },
  {
    slug: "kasaragod",
    name: "Kasaragod",
    malayalam: "കാസർഗോഡ്",
    district: "Kasaragod",
    description: "Kasaragod, the land of gods and forts, is Kerala's northernmost district. Known for its diverse culture, ancient forts like Bekal, and beautiful beaches, the district has growing business potential.",
    population: "1.3 million",
    highlights: ["Bekal Fort", "Beach Tourism", "Multi-lingual Culture", "Coir Industry"],
    businessTypes: ["Tourism Services", "Coir Products", "Restaurants", "Hotels", "Traditional Crafts"]
  }
];

export const getCityBySlug = (slug: string): CityData | undefined => {
  return keralaCities.find(city => city.slug === slug.toLowerCase());
};

export const getAllCitySlugs = (): string[] => {
  return keralaCities.map(city => city.slug);
};
