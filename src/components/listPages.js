import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ListItem from './listItem';

const ListsPage = ({ lists, onDeleteList }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const search = (e) => setSearchQuery(e.target.value);

    const allLists = lists.filter((list) =>
        list.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto p-20">
            <h1 className="text-2xl font-bold mb-4">My Saved Lists</h1>

            <div className="mb-4">
                <input
                    type="text"
                    className="border p-2 rounded w-full"
                    placeholder="Search Lists"
                    value={searchQuery}
                    onChange={search}
                />
            </div>

            {allLists.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allLists.map((list) => (
                        <ListItem key={list.id} list={list} onDelete={onDeleteList} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500">No lists found. Go to the Search page to create a new list.</p>
                    <Link to="/search" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
                        Create New List
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ListsPage;
