import { useMemo } from "react";

const useFetchProperties = () => {
  const properties = useMemo(
    () => [
      {
        id: 1,
        price: 98500000,
        location: "Karen",
        type: "5 Bedroom Villa",
        description: "Private gated estate with manicured gardens and serene views.",
      },
      {
        id: 2,
        price: 42000000,
        location: "Westlands",
        type: "2 Bedroom Apartment",
        description: "Elevated city living with concierge access and skyline views.",
      },
      {
        id: 3,
        price: 67500000,
        location: "Kilimani",
        type: "3 Bedroom Penthouse",
        description: "Open-plan luxury with a private terrace and premium finishes.",
      },
      {
        id: 4,
        price: 120000000,
        location: "Runda",
        type: "6 Bedroom Estate",
        description: "Grand residence surrounded by mature trees and quiet streets.",
      },
    ],
    []
  );

  return { properties };
};

export default useFetchProperties;
