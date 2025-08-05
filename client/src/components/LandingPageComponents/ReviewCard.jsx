
import FiveStars from '../ui/FiveStars';

function ReviewCard({
  name,
  text,
  value
}) {

  return (
    <div
      className="bg-accent2-light dark:bg-bg-dark backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg border border-accent2-dark dark:border-accent1 hover:scale-105 hover:shadow-xl dark:hover:shadow-accent1/20 transition-all duration-300 h-full flex flex-col justify-between min-h-[250px] md:min-h-[280px] w-full"
    >
      <div>
        <FiveStars value={value} />
        <p className="font-semibold mt-3 text-text-light dark:text-text-dark text-base md:text-lg">{name}</p>
      </div>

      {/* Review container */}
      <div
        className="flex-1 flex items-center"
      >
        <div
          className="text-text-light/80 dark:text-text-dark/80 italic leading-relaxed text-sm md:text-base"
        >
          "{text}"
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;
