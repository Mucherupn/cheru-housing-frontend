import formatPrice from "../utils/formatPrice";

const PropertyCard = ({ property }) => {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111418] shadow-lg">
      <div className="flex h-48 items-center justify-center bg-black/60 text-sm text-white/60">
        Image placeholder
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="text-lg font-semibold text-[#012169]">
          {formatPrice(property.price)}
        </p>
        <div>
          <h3 className="text-lg font-semibold text-white">
            {property.location}
          </h3>
          <p className="text-sm text-[#4B5563]">{property.type}</p>
        </div>
        <p className="text-sm text-[#4B5563]">{property.description}</p>
        <button className="mt-auto w-fit rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white">
          View details
        </button>
      </div>
    </article>
  );
};

export default PropertyCard;
