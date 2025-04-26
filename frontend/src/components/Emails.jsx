import React, { useEffect, useState, useCallback } from 'react';
import Email from './Email';
import { useSelector, useDispatch } from 'react-redux';
import { setEmails } from '../redux/appSlice';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Api from '../Api';
const Emails = ({ category, refreshTrigger }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchText } = useSelector(store => store.app);
  const emails = useSelector(store => store.app.emails);
  const dispatch = useDispatch();
  const { type } = useParams();

  const fetchEmailsByCategory = useCallback(async (currentCategory) => {
    setLoading(true);
    setError(null);
    try {
      const response = await Api.get(`/api/v1/email/${type}/${currentCategory}`, {
        
      });
      dispatch(setEmails(response.data.emails));
    } catch (err) {
      console.error("Error fetching emails by category:", err);
      setError(err.response?.data?.message || "Failed to fetch emails");
      dispatch(setEmails([]));
    } finally {
      setLoading(false);
    }
  }, [dispatch, type]);

  useEffect(() => {
    fetchEmailsByCategory(category);
  }, [category, fetchEmailsByCategory, refreshTrigger]);

  const filteredEmails = (emails || [])
    .filter(email => {
      if (!email) return false; // 🔥 Protect against null email
      if (email?.snoozeInfo?.isSnoozed && new Date(email.snoozeInfo.snoozeUntil) > new Date()) {
        return false;
      }

      const lowerSearch = searchText.toLowerCase();
      return (
        email?.subject?.toLowerCase().includes(lowerSearch) ||
        email?.to?.toLowerCase().includes(lowerSearch) ||
        email?.message?.toLowerCase().includes(lowerSearch)
      );
    })
    .sort((a, b) => {
      if (a.isStarred !== b.isStarred) return b.isStarred - a.isStarred;
      if (a.isRead !== b.isRead) return a.isRead - b.isRead;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  if (loading) {
    return <div>Loading emails...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="divide-y divide-gray-200">
      {filteredEmails.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No emails found.</div>
      ) : (
        filteredEmails.map(email => (
          <Email
            key={email._id}
            email={email}
            refreshEmails={() => fetchEmailsByCategory(category)}
          />
        ))
      )}
    </div>
  );
};

export default Emails;
