import formatPrice from "../utils/formatPrice";

const PropertyCard = ({ property }) => {
  return (
    <div
      className="
        group overflow-hidden rounded-xl bg-white
        shadow-md
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-2xl
      "
    >
      {/* Image */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="space-y-3 p-5">
        {/* Price */}
        <p className="text-lg font-semibold text-[#012169]">
          {formatPrice(property.price)}
        </p>

        {/* Location */}
        <p className="text-sm text-[#6B7280]">
          {property.location}
        </p>

        {/* Title */}
        <h3 className="text-base font-semibold text-[#0B1220] leading-snug">
          {property.title}
        </h3>

        {/* Icons */}
        <div className="flex items-center gap-4 pt-3 text-sm text-[#4B5563]">
          {property.bedrooms && (
            <span className="flex items-center gap-1">🛏️ {property.bedrooms}</span>
          )}
          {property.bathrooms && (
            <span className="flex items-center gap-1">🛁 {property.bathrooms}</span>
          )}
          {property.parking && <span title="Parking">🅿️</span>}
          {property.gym && <span title="Gym">🏋️</span>}
          {property.lift && <span title="Lift">🛗</span>}
          {property.pool && <span title="Pool">🏊</span>}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
