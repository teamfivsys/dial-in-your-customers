const sectors = [
  "Shops & retail",
  "Clinics & healthcare",
  "Home services",
  "Restaurants & food",
  "Salons & wellness",
  "Professionals (lawyers, CAs, tutors)",
  "Wedding & events",
  "Travel & tourism",
  "Trades & repairs",
  "Automobile services",
  "Coaching & education",
  "Freelancers & studios",
];

const WhoCanJoin = () => (
  <section className="py-16 md:py-24 bg-[#0A1730] text-[#F5F1E8]">
    <div className="container mx-auto px-4 md:px-6">
      <div className="max-w-2xl mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF6B1A] mb-3">Who can join</p>
        <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
          If you serve customers in Kerala, KDial is for you.
        </h2>
        <p className="mt-4 text-[#F5F1E8]/70 text-base md:text-lg">
          Any legitimate Kerala-based business or professional. Applications are reviewed before
          the listing goes live.
        </p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {sectors.map((s) => (
          <li
            key={s}
            className="rounded-lg border border-[#F5F1E8]/15 bg-[#F5F1E8]/[0.03] px-4 py-3 text-sm md:text-base font-medium"
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default WhoCanJoin;