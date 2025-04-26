import React, { useEffect, useState } from 'react';
import {
  Archive,
  AlertCircle,
  Trash2,
  Mail,
  Clock,
  ListTodo,
  FolderUp,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Star,
  Reply,
  Forward,
  ArrowLeft,
} from 'lucide-react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useParams, useNavigate } from 'react-router-dom';
import Api from '../Api';
import { toast } from 'react-toastify';

function EmailDetail() {
  const [email, setEmail] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSnoozeMenu, setShowSnoozeMenu] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const res = await Api.get(`/api/v1/email/mail/${id}`);
        setEmail(res.data.email);
      } catch (error) {
        console.error('Error fetching email:', error);
        toast.error('Failed to load email');
      }
    };

    fetchEmail();
  }, [id]);

  const handleEmailAction = async (action, endpoint, data = {}) => {
    try {
      const res = await Api.put(`/api/v1/email/${endpoint}`, {
        emailId: id,
        ...data
      });
      setEmail(res.data.email);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(`Failed to ${action} email`);
      console.error(error);
    }
  };

  const toggleArchive = () => handleEmailAction(
    email.isArchived ? 'unarchive' : 'archive', 
    'archive'
  );

  const toggleRead = () => handleEmailAction(
    email.isRead ? 'mark as unread' : 'mark as read', 
    'mark-read'
  );

  const starEmail = () => handleEmailAction(
    email.isStarred ? 'unstar' : 'star', 
    'star'
  );

  const deleteEmail = async () => {
    try {
      await Api.delete('/api/v1/email/delete', {
        data: { emailId: id }
      });
      toast.success('Email deleted successfully');
      navigate(-1); // Go back after deletion
    } catch (error) {
      toast.error('Failed to delete email');
      console.error(error);
    }
  };

  const snoozeEmail = (hours) => {
    const snoozeUntil = new Date();
    snoozeUntil.setHours(snoozeUntil.getHours() + hours);
    handleEmailAction('snooze', 'snooze', { snoozeUntil });
    setShowSnoozeMenu(false);
  };

  if (!email) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>

                <button
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <MoreHorizontal className="w-5 h-5 text-gray-600" />
                </button>

                <div className={`${isMenuOpen ? 'absolute left-0 top-16 bg-white p-4 rounded-lg shadow-lg z-50 w-64' : 'hidden'} lg:flex lg:items-center lg:space-x-1`}>
                  <Tippy content={email.isArchived ? "Unarchive" : "Archive"}>
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      onClick={toggleArchive}
                    >
                      {email.isArchived ? (
                        <FolderUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <Archive className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </Tippy>
                  <Tippy content="Delete">
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      onClick={deleteEmail}
                    >
                      <Trash2 className="w-5 h-5 text-gray-600" />
                    </button>
                  </Tippy>
                  <Tippy content={email.isRead ? "Mark as unread" : "Mark as read"}>
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      onClick={toggleRead}
                    >
                      <Mail className="w-5 h-5 text-gray-600" />
                    </button>
                  </Tippy>
                  <Tippy content="Snooze">
                    <div className="relative">
                      <button 
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={() => setShowSnoozeMenu(!showSnoozeMenu)}
                      >
                        <Clock className="w-5 h-5 text-gray-600" />
                      </button>
                      {showSnoozeMenu && (
                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                          <div className="py-1">
                            <button 
                              onClick={() => snoozeEmail(1)} 
                              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            >
                              Snooze for 1 hour
                            </button>
                            <button 
                              onClick={() => snoozeEmail(24)} 
                              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            >
                              Snooze until tomorrow
                            </button>
                            <button 
                              onClick={() => snoozeEmail(168)} 
                              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            >
                              Snooze for 1 week
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </Tippy>
                </div>
              </div>

              <div className="hidden sm:flex items-center text-sm text-gray-600">
                <button className="p-2 hover:bg-gray-100 rounded-full ml-2">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200">
              <div className="flex items-start sm:items-center flex-col sm:flex-row sm:gap-4">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {email.subject}
                </h1>
                <span className="mt-2 sm:mt-0 text-sm bg-gray-100 text-gray-700 rounded-full px-3 py-1">
                  {email.category || 'Inbox'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-700 font-medium">
                    {email.from[0]}
                  </span>
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <h2 className="font-medium text-gray-900">{email.name || email.from.split('@')[0]}</h2>
                    <span className="text-gray-500 text-sm">&lt;{email.from}&gt;</span>
                  </div>
                  <p className="text-sm text-gray-500">to {email.to}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <span className="text-sm text-gray-500">
                  {new Date(email.createdAt).toLocaleDateString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                <Tippy content={email.isStarred ? "Unstar" : "Star"}>
                  <button 
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    onClick={starEmail}
                  >
                    <Star className={`w-5 h-5 ${email.isStarred ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
                  </button>
                </Tippy>
              </div>
            </div>

            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-800">
                {email.message}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
              <Tippy content="Reply">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                  <Reply className="w-4 h-4" />
                  <span className="text-sm font-medium">Reply</span>
                </button>
              </Tippy>
              <Tippy content="Forward">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                
                >
                  <Forward className="w-4 h-4" />
                  <span className="text-sm font-medium">Forward</span>
                </button>
              </Tippy>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailDetail;