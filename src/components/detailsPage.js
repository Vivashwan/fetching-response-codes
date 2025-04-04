import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const ListDetailsPage = ({ lists }) => {
    const { id } = useParams();
    const list = lists.find((list) => list.id === id);

    if (!list) {
        return (
            <div className="container mx-auto p-4 text-center">
                <div className="py-8">
                    <h2 className="text-xl font-bold mb-4">List not found</h2>
                    <p className="text-gray-600 mb-4">The list you're looking for doesn't exist or has been deleted.</p>
                    <Link to="/lists" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Back to Lists
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto bg-offwhite min-h-screen p-4 pt-20">

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">{list.name}</h2>
                    <p className="text-gray-600">Created: {new Date(list.createdAt).toLocaleString()}</p>
                </div>
                <div className="space-x-2">
                    <Link to={`/edit/${id}`} className="bg-green-500 text-white px-4 py-2 rounded">
                        Edit List
                    </Link>
                    <Link to="/lists" className="bg-gray-500 text-white px-4 py-2 rounded">
                        Back to Lists
                    </Link>
                </div>
            </div>

            <div className="bg-gray-100 p-4 rounded mb-6">
                <h3 className="font-semibold mb-2">Response Codes</h3>
                <div className="flex flex-wrap gap-2">
                    {list.responseCodes.map((code) => (
                        <span key={code} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {code}
                        </span>
                    ))}
                </div>
            </div>

            <h3 className="font-semibold mb-4">Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {list.responseCodes.map((code, index) => (
                    <div key={code} className="border rounded overflow-hidden shadow-sm">
                        <img 
                            src={`https://http.dog/${code}.jpg`}
                            alt={`Response Code ${code}`} 
                            className="w-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/400x300?text=No+Image";
                            }}
                        />
                        <div className="p-2 bg-gray-100">
                            <p className="font-semibold text-center">Code {code}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListDetailsPage;