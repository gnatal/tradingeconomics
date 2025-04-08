import { Search } from "lucide-react";

export const DashboardHeader = ({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}) => {
  return (
    <header className="h-60 bg-blue-600 py-6 px-4 sm:px-6 lg:px-8 shadow-lg">
      <div className="flex">
        <div className="w-4/5 h-12 bg-blue-600"></div>
        <div className="w-1/5 h-12 bg-yellow-400"></div>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Sweden Economic Dashboard
          </h1>
          <p className="text-blue-100 mt-1">
            Latest Economic Indicators and Statistics
          </p>
        </div>
        <div className="mt-4 md:mt-0 relative">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 py-2 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search indicators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
