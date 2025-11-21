const ListItemSkeleton = () => {
  return (
    <>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="flex flex-row justify-between items-start gap-x-3 animate-pulse"
          >
            <div className="flex flex-row justify-start items-start gap-x-4">
              {/* Circle Placeholder */}
              <div className="h-5 w-6 bg-gray-300 rounded-[100%] border border-gray-400"></div>

              {/* Text Placeholder */}
              <div className="h-5 w-14 bg-gray-300 rounded"></div>
            </div>

            {/* Button Placeholders */}
            <div className="flex flex-row gap-3">
              <div className="h-5 w-5 bg-gray-300 rounded"></div>
              <div className="h-5 w-5 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
    </>
  );
};

export default ListItemSkeleton;
