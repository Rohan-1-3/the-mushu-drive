
import FiveStars from '../ui/FiveStars';

function ReviewCard({
  name,
  text,
  value
}) {

  return (
    <div
      className="bg-white dark:bg-gray-800 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-gray-500/20 transition-all duration-300 h-full flex flex-col justify-between min-h-[250px] md:min-h-[280px] w-full"
    >
      <div>
        <FiveStars value={value} />
        <p className="font-semibold mt-3 text-gray-800 dark:text-gray-200 text-base md:text-lg">{name}</p>
      </div>

      {/* Review container */}
      <div
        className="mt-4 flex-1 flex items-center"
      >
        <div
          className="text-gray-600 dark:text-gray-300 italic leading-relaxed text-sm md:text-base"
        >
          "{text}"
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;
