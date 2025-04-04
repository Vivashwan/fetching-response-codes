import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginSignupPage from './components/loginSignup';
import SearchPage from './components/search';
import ListsPage from './components/listPages';
import ListDetailsPage from './components/detailsPage';
import EditListPage from './components/updatePage';
import Navbar from './components/headerTop';
import { db, ref, set, push, remove, update, get, child } from './firebase'; 

function App() {
  const [user, setUser] = useState(null);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) {
      setLists([]);
      return;
    }

    const fetchLists = async () => {
      setLoading(true);
      const referenceToUserLists = ref(db, `users/${user.uid}/lists`);

      try 
      {
        const value = await get(referenceToUserLists);
        if(value.exists()) 
        {
          const arrayList = value.val();
          const listArray = Object.entries(arrayList).map(([firebaseKey, listData]) => {
          
            return {
              ...listData,
              id: listData.id || firebaseKey
            };
          });

          const idCounts = {};
          listArray.forEach(list => {
            idCounts[list.id] = (idCounts[list.id] || 0) + 1;
          });

          const duplicates = Object.entries(idCounts).filter(([id, count]) => count > 1);
          if (duplicates.length > 0) {
            console.warn("Duplicate IDs found:", duplicates);
          }

          setLists(listArray);
        } 
        else 
        {
          setLists([]);
        }
      } 
      catch (error) 
      {
        console.error("Error fetching lists:", error);
      } 
      finally 
      {
        setLoading(false);
      }
    };

    fetchLists();
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleSignup = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setLists([]);
  };

  const handleSaveList = async (newList) => {
    if (!user) return;

    try{
      const referenceToUserLists = ref(db, `users/${user.uid}/lists`);
      const newListRef = push(referenceToUserLists);
      const uniqueId = newListRef.key; 

      const listWithId = {
        id: uniqueId,
        ...newList,
        createdAt: Date.now() 
      };

      await set(newListRef, listWithId);

      setLists(prevLists => [...prevLists, listWithId]);

      return listWithId; 
    }
    catch (error) 
    {
      console.error("Error saving list:", error);
      throw error;
    }
  };

  const handleDeleteList = async (listId) => {
    if (!user) return;

    try 
    {
      const referenceToUserLists = ref(db, `users/${user.uid}/lists`);
      const value = await get(referenceToUserLists);

      if(value.exists()) 
      {
        const arrayList = value.val();
        const firebaseKey = Object.keys(arrayList).find(key =>
          arrayList[key].id === listId
        );

        if(firebaseKey) 
        {
          const listRef = ref(db, `users/${user.uid}/lists/${firebaseKey}`);
          await remove(listRef);
          console.log(`Successfully deleted list from database: ${listId}`);

          setLists(prevLists => prevLists.filter(list => list.id !== listId));
        } 
        else 
        {
          console.warn(`List with ID ${listId} not found in Firebase.`);
        }
      }
    } 
    catch (error) 
    {
      console.error("Error deleting list:", error);
    }
  };

  const handleUpdateList = async (updatedList) => {
    if (!user) return;

    try 
    {
      const referenceToUserLists = ref(db, `users/${user.uid}/lists`);
      const value = await get(referenceToUserLists);

      if(value.exists()) 
      {
        const arrayList = value.val();
        const firebaseKey = Object.keys(arrayList).find(key =>
          arrayList[key].id === updatedList.id
        );

        if(firebaseKey) 
          {
          const listRef = ref(db, `users/${user.uid}/lists/${firebaseKey}`);
          await update(listRef, updatedList);

          
          setLists(prevLists =>
            prevLists.map(list => (list.id === updatedList.id ? updatedList : list))
          );
        } 
        else 
        {
          console.warn(`List with ID ${updatedList.id} not found in Firebase.`);
        }
      }
    } 
    catch (error) 
    {
      console.error("Error updating list:", error);
    }
  };

  if(loading && user) 
  {
    return <div className="min-h-screen bg-offwhite flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-offwhite">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={!user ? <LoginSignupPage onLogin={handleLogin} onSignup={handleSignup} /> : <Navigate to="/search" />} />
          <Route path="/search" element={user ? <SearchPage onSaveList={handleSaveList} user={user} /> : <Navigate to="/" />} />
          <Route path="/lists" element={user ? <ListsPage lists={lists} onDeleteList={handleDeleteList} /> : <Navigate to="/" />} />
          <Route path="/list/:id" element={user ? <ListDetailsPage lists={lists} /> : <Navigate to="/" />} />
          <Route path="/edit/:id" element={user ? <EditListPage lists={lists} onUpdateList={handleUpdateList} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;