
import FiveStars from '../ui/FiveStars';

function ReviewCard({ name, text, value }) {
  return (
    <div className="group relative bg-accent2-light/90 dark:bg-white/5 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-2xl shadow-lg border border-accent2-dark/60 dark:border-white/10 transition-all duration-300 flex flex-col w-full h-full hover:scale-105">
      {/* Top (Stars + Name) */}
      <div className="flex flex-col gap-2 mb-3">
        <FiveStars value={value} />
        <p className="font-semibold tracking-wide text-text-light dark:text-text-dark text-sm sm:text-base md:text-lg">{name}</p>
      </div>

      {/* Review Text (auto height) */}
      <div className="flex-1">
        <p className="text-text-light/80 dark:text-text-dark/80 italic leading-relaxed text-sm md:text-base">
          "{text}"
        </p>
      </div>
    </div>
  );
}

export default ReviewCard;
