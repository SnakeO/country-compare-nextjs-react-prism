interface SearchResultProps {
  country: {
    country_id: string;
    name: string;
    iso_code: string;
    population: number;
    gdp: number | null;
    group: number;
  };
  onClick: (country_id: string) => void;
}

export const SearchResult: React.FC<SearchResultProps> = ({ country, onClick } : SearchResultProps) => {

  // Determine background color based on group
  const backgroundColor =
    country.group === 0
      ? "bg-gray-200"
      : country.group === 1
        ? "bg-blue-200"
        : country.group === 2
          ? "bg-red-200"
          : "bg-white"; // Default background

  return (
    <div className={`border rounded-md p-4 shadow-md flex-1 ${backgroundColor} hover:cursor-pointer select-none`}
         onClick={() => onClick(country.country_id)}>
      <h2 className="font-bold text-lg">{country.name}</h2>
      <p className="text-sm">Country ID: {country.country_id}</p>
      <p className="text-sm">ISO Code: {country.iso_code}</p>
      <p className="text-sm">Population: {country.population.toLocaleString()}</p>
      <p className="text-sm">GDP: {country.gdp !== null ? `$${country.gdp.toLocaleString()}` : "N/A"}</p>
      <p className="text-sm">Group: {country.group}</p>
    </div>
  );
};