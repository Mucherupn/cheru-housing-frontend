const SearchBar = () => {
  return (
    <form className="flex w-full flex-col gap-3 rounded-2xl bg-[#111418] p-4 sm:flex-row sm:items-center">
      <label htmlFor="location" className="sr-only">
        Search by location
      </label>
      <input
        id="location"
        name="location"
        placeholder="Search Nairobi estates: Karen, Westlands, Kilimani, Lavington, Runda"
        className="flex-1 rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white placeholder:text-[#4B5563] focus:border-[#012169] focus:outline-none focus:ring-2 focus:ring-[#012169]/40"
      />
      <button
        type="submit"
        className="rounded-xl bg-[#012169] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#012169]/90"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
