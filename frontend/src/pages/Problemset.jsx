import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { useDebounce } from '../hooks/useDebounce';

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

const ALL_TAGS = [
    'Array', 'String', 'Hash Table', 'Map', 'Dynamic Programming', 'Math', 
    'Bit Manipulation', 'Sorting', 'Searching', 'Binary Search', 'Two Pointers',
    'Sliding Window', 'Stack', 'Queue', 'Linked List', 'Tree', 'Binary Tree',
    'Binary Search Tree', 'Graph', 'Depth-First Search', 'Breadth-First Search',
    'Recursion', 'Backtracking', 'Greedy', 'Heap', 'Trie', 'Matrix', 'Geometry'
];

const Problemset = () => {
  const [problems, setProblems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [listType, setListType] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [selectedTags, setSelectedTags] = useState([]); 

  const [solvedProblemIds, setSolvedProblemIds] = useState(new Set());
  
  const { isAuthenticated } = useSelector((state) => state.auth);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (listType === 'all' || !isAuthenticated) {
          const params = {
            page: currentPage,
            difficulty: difficulty || undefined,
            tags: selectedTags.length > 0 ? selectedTags.join(',') : undefined,
            search: debouncedSearchTerm || undefined,
          };
          const response = await axiosClient.get('/problem', { params }); 

          setProblems(response.data.problems);
          setCurrentPage(response.data.currentPage);
          setTotalPages(response.data.totalPages);
        } else {
          const response = await axiosClient.get('/problem/solved-problems'); 
          setProblems(response.data);
          setCurrentPage(1);
          setTotalPages(1);
        }
      } catch (err) {
        if (err.response && err.response.status !== 404) {
           setError(err.response?.data?.message || 'Failed to fetch problems');
        }
        setProblems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [
    currentPage, 
    listType, 
    debouncedSearchTerm, 
    difficulty, 
    selectedTags, 
    isAuthenticated
  ]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchSolvedStatus = async () => {
        try {
          const response = await axiosClient.get('/problem/solved-problems');
          const idSet = new Set(response.data.map(problem => problem._id));
          setSolvedProblemIds(idSet);
        } catch (err) {
          console.error("Could not fetch solved problem status:", err);
        }
      };
      fetchSolvedStatus();
    } else {
      setSolvedProblemIds(new Set());
    }
  }, [isAuthenticated]);


  const getDifficultyColor = (diff) => {
    if (diff === 'Easy') return 'text-success';
    if (diff === 'Medium') return 'text-warning';
    if (diff === 'Hard') return 'text-error';
    return 'text-base-content';
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };
  
  const handleListTypeChange = (e) => {
    setListType(e.target.value);
    setSearchTerm('');
    setDifficulty('');
    setSelectedTags([]);
    setCurrentPage(1);
  };

  const handleTagClick = (tag) => {
    setSelectedTags((prevTags) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t) => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
    setCurrentPage(1); 
  };


  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="5" className="text-center h-48">
            <span className="loading loading-spinner loading-lg"></span>
          </td>
        </tr>
      );
    }
    if (error) {
      return (
        <tr><td colSpan="5"><div className="alert alert-error">{error}</div></td></tr>
      );
    }
    if (problems.length === 0) {
      return (
        <tr><td colSpan="5" className="text-center h-48">No problems found.</td></tr>
      );
    }
    return problems.map((problem) => (
      <tr key={problem._id} className="hover">
        <td className="w-[5%] text-center">
          {isAuthenticated && solvedProblemIds.has(problem._id) && <CheckIcon />}
        </td>
        <td className="w-[35%]">
          <Link to={`/problem/${problem._id}`} className="link link-hover">
            {problem.title}
          </Link>
        </td>
        <td className={`w-[15%] ${getDifficultyColor(problem.difficulty)}`}>
          {problem.difficulty}
        </td>
        <td className="w-[15%]">--%</td>
        <td className="w-[30%] text-xs">{problem.tags.join(', ')}</td>
      </tr>
    ));
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Problems</h1>

      {/* --- Filter Bar --- */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select 
          className="select select-bordered w-full sm:w-auto"
          value={listType}
          onChange={handleListTypeChange}
          disabled={!isAuthenticated}
        >
          <option value="all">All Problems</option>
          <option value="solved">Solved Problems</option>
        </select>

        {listType === 'all' && (
          <>
            <input 
              type="text" 
              placeholder="Search problems..." 
              className="input input-bordered w-full sm:w-auto sm:grow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className="select select-bordered w-full sm:w-auto"
              value={difficulty}
              onChange={handleFilterChange(setDifficulty)}
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </>
        )}
      </div>

      {/* This section is hidden if user selects "Solved Problems" */}
      {listType === 'all' && (
        <div className="flex flex-wrap gap-2 mb-6 p-4 bg-base-200 rounded-lg">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`btn btn-sm rounded-full ${selectedTags.includes(tag) ? 'btn-primary' : 'btn-ghost'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* --- Problems Table --- */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Status</th>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Acceptance</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {renderTableBody()}
          </tbody>
        </table>
      </div>

      {/* --- Pagination --- */}
      {listType === 'all' && (
        <div className="flex justify-center mt-8">
          <div className="join">
            <button 
              className="join-item btn" 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              «
            </button>
            <button className="join-item btn btn-disabled">
              Page {currentPage} of {totalPages}
            </button>
            <button 
              className="join-item btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Problemset;