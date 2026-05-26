import { Player } from "@lottiefiles/react-lottie-player";
import { loaderIcon, shieldloaderIcon } from "../../../assets/assets";

const lottie = {
    loaderIcon,
    shieldloaderIcon,
};

const getAnimationDataKey = (key) => {
    return lottie[key] ?? null;
};

const LottieLoader = ({ lottieKey = "loaderIcon", wrapperClass = "", playerClass = "" }) => {
    const animationData = getAnimationDataKey(lottieKey);

    if (!animationData) return null;

    const isBlocking = lottieKey === "shieldloaderIcon";

    return (
        <div
            className={`
        fixed inset-0 z-50 flex items-center justify-center
        ${isBlocking ? "pointer-events-auto" : "pointer-events-none"}
        ${wrapperClass}
      `}
        >
            <Player autoplay loop src={animationData} className={playerClass || "w-[250px]"} />
        </div>
    );
};

export default LottieLoader;
