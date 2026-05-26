import { Skeleton } from "antd";

const SkeletonLoader = () => {
    return (
        <div className="grid grid-cols-12 gap-x-6">
            {[1, 2].map((i) => (
                <div key={i} className="col-span-10 md:col-span-6 mb-4">
                    <Skeleton active style={{ width: "100%" }} />
                </div>
            ))}
        </div>
    );
};

export default SkeletonLoader;
