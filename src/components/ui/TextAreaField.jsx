const TestAreaField = ({ label, error, ...props }) => {
    return (
        <div className="onboard-business-search-teaxtarea-container">
            {label && <p className="text-[#40444C] font-medium text-sm mb-2.5!">{label}</p>}

            <textarea
                {...props} // includes value, onChange, name
                className={`h-20 w-full ${error ? "border-red-500!" : ""}`}
                rows={4}
            />

            {error && <p className="text-[#D92D20] font-medium text-sm mt-1">{error}</p>}
        </div>
    );
};

export default TestAreaField;
