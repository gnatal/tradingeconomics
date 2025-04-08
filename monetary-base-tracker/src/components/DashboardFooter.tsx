export const DashboardFooter = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-white text-lg font-semibold">
              Sweden Economic Dashboard
            </h2>
            <p className="mt-1 text-sm">
              Data last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="text-sm">
            <p>Data sources: Statistics Sweden, Sveriges Riksbank, EUROSTAT</p>
            <p className="mt-1">
              © {new Date().getFullYear()} Sweden Economic Data
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
