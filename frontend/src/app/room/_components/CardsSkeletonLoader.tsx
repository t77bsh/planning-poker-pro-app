const CardsValues = new Array(13).fill("");

function CardsSkeletonLoader() {
  return (
    <div className="flex flex-wrap gap-x-24 gap-y-14 md:gap-x-7  md:gap-y-11 sm:gap-x-12 sm:gap-y-7 justify-center">
      {CardsValues.map((value, index) => (
        <div key={index}>
          <div
            className="h-[120px] w-[86px] bg-gray-300 animate-pulse md:w-[90px] sm:h-[60px] sm:w-[42px] rounded-2xl md:rounded-xl sm:rounded-lg  shadow-md flex items-center justify-center text-2xl md:text-xl sm:text-lg"
            style={{ animationDuration: "0.25s" }}
          ></div>
        </div>
      ))}
    </div>
  );
}

// Export the Cards component for use in other files
export default CardsSkeletonLoader;
