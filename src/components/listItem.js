import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ListItem = ({ list, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete "${list.name}"?`)) {
            setIsDeleting(true); 
            setTimeout(() => onDelete(list.id), 500); 
        }
    };

    const newDate = new Date(list.createdAt).toLocaleDateString();

    return (
        <div
            className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-md p-5 transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 opacity-0 animate-fadeIn ${isDeleting ? 'opacity-0 scale-95 transition-opacity duration-500' : 'opacity-100'
                }`}
        >
            <h3 className="text-xl font-semibold mb-1 text-black">{list.name}</h3>
            <p className="text-sm text-gray-500 mb-2">Created: {newDate}</p>
            <p className="text-sm mb-3 text-gray-400">{list.responseCodes.length} response codes</p>

            <div className="flex space-x-3">
                <Link
                    to={`/list/${list.id}`}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm transition-all hover:bg-blue-600 hover:scale-105 shadow-md"
                >
                    View
                </Link>
                <Link
                    to={`/edit/${list.id}`}
                    className="px-4 py-2 bg-green-500 text-white rounded-md text-sm transition-all hover:bg-green-600 hover:scale-105 shadow-md"
                >
                    Edit
                </Link>
                <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-md text-sm transition-all hover:bg-red-600 hover:scale-105 shadow-md"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default ListItem;