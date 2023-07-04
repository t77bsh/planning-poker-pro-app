"use client"


interface InsightProps {
    average: number | undefined;
    median: number | undefined;
    lowest: number | undefined;
    highest: number | undefined;
  }
  
  const Insights: React.FC<InsightProps> = ({
    average,
    median,
    lowest,
    highest,
  }) => {
    return (
      <div className="flex justify-center">
        <div className="inline-flex rounded-2xl flex-wrap items-baseline justify-center">
          {average !== undefined && (
            <div className="flex flex-col items-center bg-customPurple px-2 rounded-md m-2">
              <span role="img" aria-label="average" className="text-3xl">
                📊
              </span>
              <h2 className="text-sm font-semibold mb-1">Average</h2>
              <p className="text-lg font-bold">{isNaN(average) ? 0 : average}</p>
            </div>
          )}
          {median !== undefined && (
            <div className="flex flex-col items-center bg-customBlue px-2 rounded-md m-2">
              <span role="img" aria-label="median" className="text-3xl">
                📈
              </span>
              <h2 className="text-sm font-semibold mb-1">Median </h2>
              <p className="text-lg font-bold">{isNaN(median) ? 0 : median}</p>
            </div>
          )}
          {lowest !== undefined && (
            <div className="flex flex-col items-center bg-green-200  px-2 rounded-md m-2">
              <span role="img" aria-label="lowest" className="text-3xl">
                😌
              </span>
              <h2 className="text-sm font-semibold mb-1">Lowest</h2>
              <p className="text-lg font-bold">{isNaN(lowest) ? 0 : lowest}</p>
            </div>
          )}
          {highest !== undefined && (
            <div className="flex flex-col items-center bg-customRed px-2 rounded-md m-2">
              <span role="img" aria-label="highest" className="text-3xl">
                😱
              </span>
              <h2 className="text-sm font-semibold mb-1">Highest</h2>
              <p className="text-lg font-bold">{isNaN(highest) ? 0 : highest}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default Insights;