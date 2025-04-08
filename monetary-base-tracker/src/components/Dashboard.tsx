"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Briefcase,
  Home,
  ShoppingBag,
  Activity,
  BarChart2,
} from "lucide-react";
import { getSwedenData } from "@/serverActions/getSwedenData";
import { DashboardFooter } from "./DashboardFooter";
import { DashboardHeader } from "./DashboardHeader";

interface EconomicIndicator {
  Title: string;
  Category: string;
  CategoryGroup: string;
  LatestValue: number;
  LatestValueDate: string;
  PreviousValue: number | null;
  Unit: string;
  Source: string;
}

interface MainIndicator {
  name: string;
  item: EconomicIndicator | undefined;
}

interface CategoryIconMap {
  [key: string]: JSX.Element;
}

const SwedishEconomyDashboard: React.FC = () => {
  const [data, setData] = useState<EconomicIndicator[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const swedenData = await getSwedenData();
        setData(swedenData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categoryGroups: string[] =
    data.length > 0
      ? ["All", ...Array.from(new Set(data.map((item) => item.CategoryGroup)))]
      : ["All"];

  const filteredData: EconomicIndicator[] = data.filter((item) => {
    const matchesCategory: boolean =
      activeCategory === "All" || item.CategoryGroup === activeCategory;
    const matchesSearch: boolean =
      searchTerm === "" ||
      item.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const gdp: EconomicIndicator | undefined = data.find(
    (item) => item.Category === "GDP Annual Growth Rate"
  );
  const inflation: EconomicIndicator | undefined = data.find(
    (item) => item.Category === "Inflation Rate"
  );
  const unemployment: EconomicIndicator | undefined = data.find(
    (item) => item.Category === "Unemployment Rate"
  );
  const interestRate: EconomicIndicator | undefined = data.find(
    (item) => item.Category === "Interest Rate"
  );

  const formatValue = (item: EconomicIndicator): string => {
    const value = item.LatestValue;

    if (item.Unit === "percent" || item.Unit === "percent of GDP") {
      return `${value}%`;
    }

    if (item.Unit.includes("SEK") || item.Unit.includes("USD")) {
      return `${value} ${item.Unit}`;
    }

    return `${value} ${item.Unit}`;
  };

  const getValueTrend = (
    item: EconomicIndicator
  ): "up" | "down" | "neutral" => {
    if (item.PreviousValue === null) return "neutral";
    return item.LatestValue > item.PreviousValue ? "up" : "down";
  };

  const getItemsByCategory = (categoryGroup: string): EconomicIndicator[] => {
    return data
      .filter((item) => item.CategoryGroup === categoryGroup)
      .slice(0, 4);
  };

  const mainIndicators: MainIndicator[] = [
    { name: "GDP Growth", item: gdp },
    { name: "Inflation Rate", item: inflation },
    { name: "Unemployment", item: unemployment },
    { name: "Interest Rate", item: interestRate },
  ];

  const categoryIcons: CategoryIconMap = {
    GDP: <Activity className="h-5 w-5" />,
    Labour: <Briefcase className="h-5 w-5" />,
    Money: <DollarSign className="h-5 w-5" />,
    Housing: <Home className="h-5 w-5" />,
    Consumer: <ShoppingBag className="h-5 w-5" />,
    Business: <BarChart2 className="h-5 w-5" />,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <h2 className="text-xl font-semibold mt-4 text-gray-700">
            Loading Swedish Economic Data...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 pb-12 overflow-y-scroll">
      <main className="w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Key Economic Indicators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainIndicators.map((indicator, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-lg font-medium text-gray-600">
                  {indicator.name}
                </h3>
                <div className="flex items-center mt-2">
                  <span className="text-3xl font-bold text-gray-800">
                    {indicator.item ? formatValue(indicator.item) : "N/A"}
                  </span>
                  {indicator.item && indicator.item.PreviousValue && (
                    <span
                      className={`ml-2 flex items-center ${
                        getValueTrend(indicator.item) === "up"
                          ? "text-green-500"
                          : getValueTrend(indicator.item) === "down"
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {getValueTrend(indicator.item) === "up" ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {indicator.item
                    ? `Updated: ${new Date(
                        indicator.item.LatestValueDate
                      ).toLocaleDateString()}`
                    : ""}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categoryGroups.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.slice(0, 12).map((item) => (
              <div
                key={item.Title}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="px-6 py-4">
                  <div className="flex items-center mb-2">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 mr-3">
                      {categoryIcons[item.CategoryGroup] || (
                        <Activity className="h-4 w-4" />
                      )}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {item.Title}
                    </h3>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <span className="text-2xl font-bold text-gray-800">
                        {formatValue(item)}
                      </span>
                      {item.PreviousValue && (
                        <span
                          className={`ml-2 text-sm ${
                            getValueTrend(item) === "up"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {getValueTrend(item) === "up" ? "↑" : "↓"}
                          {item.PreviousValue}
                        </span>
                      )}
                    </div>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      {item.CategoryGroup}
                    </span>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Source: {item.Source}</p>
                    <p>
                      Last Updated:{" "}
                      {new Date(item.LatestValueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Key Categories
          </h2>
          <div className="space-y-12">
            {["Labour", "Housing", "Business", "Money"].map((category) => {
              const items = getItemsByCategory(category);
              if (items.length === 0) return null;

              return (
                <div
                  key={category}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    {categoryIcons[category]}
                    <span className="ml-2">{category} Indicators</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {items.map((item) => (
                      <div
                        key={item.Title}
                        className="border rounded-lg p-4 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <p className="text-sm text-gray-500">{item.Title}</p>
                        <p className="text-lg font-bold text-gray-800 mt-1">
                          {formatValue(item)}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(
                              item.LatestValueDate
                            ).toLocaleDateString()}
                          </span>
                          {item.PreviousValue && (
                            <span
                              className={`text-xs flex items-center ${
                                getValueTrend(item) === "up"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {getValueTrend(item) === "up" ? (
                                <span>
                                  ↑{" "}
                                  {(
                                    (item.LatestValue / item.PreviousValue -
                                      1) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </span>
                              ) : (
                                <span>
                                  ↓{" "}
                                  {(
                                    (1 -
                                      item.LatestValue / item.PreviousValue) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <DashboardFooter />
    </div>
  );
};

export default SwedishEconomyDashboard;
