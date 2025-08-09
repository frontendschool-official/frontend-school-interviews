import React from "react";

// Loading and Error Components

export const Loader = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-15 px-5 text-center">
      <div className="w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin mb-5"></div>
      <p className="text-neutral text-lg m-0">{text}</p>
    </div>
  );
};

