import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SearchPage = ({ onSaveList, user }) => {
    const [images, setImages] = useState([]);
    const [query, setQuery] = useState("");
    const [listName, setListName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const responseCodes = [
        100, 101, 102, 103, 200, 201, 202, 203, 204, 205, 206, 207, 208, 226,
        300, 301, 302, 303, 304, 305, 306, 307, 308, 400, 401, 402, 403, 404,
        405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418,
        421, 422, 423, 424, 425, 426, 428, 429, 431, 451, 500, 501, 502, 503,
        504, 505, 506, 507, 508, 510, 511
    ];

    const fetchDogImages = (searchQuery) => {
        setIsLoading(true);
        if (!searchQuery) {
            setImages([]);
            setIsLoading(false);
            return;
        }

        let codeArray = [];

        if (/^\d{1,3}$/.test(searchQuery)) {
            const pattern = new RegExp(`^${searchQuery}`);
            codeArray = responseCodes.filter(code => pattern.test(code.toString()));
        } else if (/^\d+x{1,2}$/.test(searchQuery)) {
            const prefix = searchQuery.replace(/x/g, '');
            const wildcardCount = searchQuery.length - prefix.length;

            if (wildcardCount === 1) {
                codeArray = responseCodes.filter(code => code.toString().startsWith(prefix) && code.toString().length === prefix.length + 1);
            } else if (wildcardCount === 2) {
                codeArray = responseCodes.filter(code => code.toString().startsWith(prefix) && code.toString().length === prefix.length + 2);
            }
        }

        const imageObjects = codeArray.map(code => ({
            url: `https://http.dog/${code}.jpg`,
            code: code.toString()
        }));

        setTimeout(() => {
            setImages(imageObjects);
            setIsLoading(false);
        }, 700);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchDogImages(query);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    const saveList = async () => {
        if (!listName || images.length === 0) {
            alert("Please enter a list name and ensure you have filtered some images");
            return;
        }

        const newList = {
            id: Date.now().toString(),
            name: listName,
            createdAt: new Date().toISOString(),
            responseCodes: images.map(img => img.code),
            imageUrls: images.map(img => img.url),
            userId: user.email
        };

        onSaveList(newList);
        alert("List saved successfully!");
        setListName("");
        navigate("/lists");
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center text-white mb-6">Search HTTP Status Codes</h1>

            <div className="mb-6 p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg">
                <input
                    type="text"
                    className="w-full p-3 rounded bg-transparent border border-gray-300 text-black placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="Enter response code (e.g., 2, 20, 200, 2xx, 20x)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <p className="text-sm text-gray-400 mt-2">
                    Search formats: numeric code (2, 20, 200), pattern with wildcards (2x, 2xx, 20x)
                </p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="bg-white/10 backdrop-blur-md animate-pulse rounded-lg p-4 h-44"></div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-white mb-3">Results ({images.length})</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {images.map((img) => (
                                <div key={img.code} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 transform hover:scale-105 hover:shadow-purple-500/30">
                                    <img
                                        src={img.url}
                                        alt={`Response Code ${img.code}`}
                                        className="w-full object-cover transition-opacity duration-300"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://placehold.co/400x300?text=No+Image";
                                        }}
                                    />
                                    <div className="p-2 text-center bg-gray-800/50">
                                        <p className="font-semibold text-white">Code {img.code}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {images.length > 0 && (
                        <div className="mt-6 p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold text-white mb-3">Save This List</h2>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    className="flex-grow p-3 rounded bg-transparent border border-gray-300 text-black placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
                                    placeholder="Enter list name"
                                    value={listName}
                                    onChange={(e) => setListName(e.target.value)}
                                />
                                <button
                                    className="px-6 py-3 bg-purple-500 text-white rounded-md transition-transform duration-300 transform hover:scale-105 hover:bg-purple-600 shadow-lg"
                                    onClick={saveList}
                                >
                                    Save List
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SearchPage;
