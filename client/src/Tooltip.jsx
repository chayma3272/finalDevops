const Tooltip = ({ text, children, className = "left-1/2" }) => {
  return (
    <div className="relative flex items-center group">
      {children}
      
      <div
        className={`absolute bottom-full ${className} transform -translate-x-1/2 mb-2 hidden group-hover:flex items-center justify-center z-50`}
      >
        {/* Tooltip container */}
        <div className="bg-gray-900 text-white text-xs font-medium rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
          {text}
          
          {/* Arrow pointer */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;