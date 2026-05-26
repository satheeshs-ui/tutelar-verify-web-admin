import { useState } from "react";

const SearchableDropdown = ({ onSelect }) => {
    const options = [
        { label: "Email", value: "email" },
        { label: "Phone Number", value: "phone" },
        { label: "Agent ID", value: "agentId" },
    ];

    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (opt) => {
        setSelected(opt);
        setOpen(false);
        setSearch("");
        onSelect && onSelect(opt.value);
    };

    return (
        <div className="relative w-64">
            {/* Dropdown Box */}
            <div
                className="border rounded-md p-3 bg-white cursor-pointer flex justify-between items-center"
                onClick={() => setOpen(!open)}
            >
                <span>{selected ? selected.label : "Select Filter"}</span>
                <span>▼</span>
            </div>

            {/* Dropdown Menu */}
            {open && (
                <div className="absolute z-20 w-full bg-white border rounded-md mt-1 shadow-lg">
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full p-2 border-b outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {/* Options */}
                    <div className="max-h-40 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleSelect(opt)}
                                >
                                    {opt.label}
                                </div>
                            ))
                        ) : (
                            <div className="p-2 text-gray-500 text-sm">No results found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableDropdown;
