import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const EditListPage = ({ lists, onUpdateList }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [list, setList] = useState(null);
    const [listName, setListName] = useState('');
    const [selectedCodes, setSelectedCodes] = useState([]);
    const [availableCodes, setAvailableCodes] = useState([]);

    const responseCodes = [
        100, 101, 102, 103, 200, 201, 202, 203, 204, 205, 206, 207, 208, 226,
        300, 301, 302, 303, 304, 305, 306, 307, 308, 400, 401, 402, 403, 404,
        405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418,
        421, 422, 423, 424, 425, 426, 428, 429, 431, 451, 500, 501, 502, 503,
        504, 505, 506, 507, 508, 510, 511
    ];

    useEffect(() => {
        const listAvailable = lists.find(l => l.id === id);
        if (!listAvailable) return navigate('/lists');

        setList(listAvailable);
        setListName(listAvailable.name);
        setSelectedCodes(listAvailable.responseCodes);
        setAvailableCodes(responseCodes
            .map(code => code.toString())
            .filter(code => !listAvailable.responseCodes.includes(code))
        );
    }, [id, lists, navigate]);

    if(!list) return <div className="container mx-auto p-4">Loading...</div>;

    const handleSave = () => {
        if (!listName.trim()) return alert('Please enter a list name');
        if (selectedCodes.length === 0) return alert('Please select at least one response code');

        onUpdateList({
            ...list,
            name: listName,
            responseCodes: selectedCodes,
            imageUrls: selectedCodes.map(code => `https://http.dog/${code}.jpg`),
            updatedAt: new Date().toISOString()
        });

        alert('List updated successfully!');
        navigate(`/list/${id}`);
    };

    const toggleCodeSelection = (code) => {
        if (selectedCodes.includes(code)) {
            setSelectedCodes(selectedCodes.filter(c => c !== code));
            setAvailableCodes([...availableCodes, code].sort());
        } else {
            setSelectedCodes([...selectedCodes, code].sort());
            setAvailableCodes(availableCodes.filter(c => c !== code));
        }
    };

    const groupCodesByPrefix = (codes) =>
        codes.reduce((groups, code) => {
            const prefix = code.charAt(0);
            if (!groups[prefix]) groups[prefix] = [];
            groups[prefix].push(code);
            return groups;
        }, {});

    return (
        <div className="container mx-auto p-4 pt-20">

            <h1 className="text-2xl font-bold mb-4">Edit List</h1>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">List Name</label>
                <input
                    type="text"
                    className="border p-2 rounded w-full"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    placeholder="Enter list name"
                />
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Selected Response Codes ({selectedCodes.length})</h2>
                <div className="flex flex-wrap gap-2">
                    {selectedCodes.length === 0 ? (
                        <p className="text-gray-500">No codes selected</p>
                    ) : (
                        selectedCodes.map(code => (
                            <div key={code} className="bg-blue-100 text-blue-800 px-3 py-2 rounded flex items-center gap-2">
                                <span>{code}</span>
                                <button onClick={() => toggleCodeSelection(code)} className="text-blue-600 hover:text-blue-800">
                                    ×
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Available Response Codes</h2>
                {Object.entries(groupCodesByPrefix(availableCodes)).map(([prefix, codes]) => (
                    <div key={prefix} className="mb-4">
                        <h3 className="font-medium text-gray-700 mb-2">{prefix}xx</h3>
                        <div className="flex flex-wrap gap-2">
                            {codes.map(code => (
                                <button key={code} onClick={() => toggleCodeSelection(code)}
                                    className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded">
                                    {code}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between pt-4 border-t">
                <Link to={`/list/${id}`} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</Link>
                <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">Save Changes</button>
            </div>
        </div>
    );
};

export default EditListPage;
