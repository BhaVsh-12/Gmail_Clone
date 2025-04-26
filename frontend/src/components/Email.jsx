import React, { useState } from 'react';
import { 
  MdCropSquare, 
  MdOutlineStarBorder, 
  MdStar, 
  MdArchive, 
  MdUnarchive,
  MdDelete, 
  MdMarkEmailRead,
  MdAccessTime 
} from 'react-icons/md';
import { IoMailUnreadOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedEmail } from '../redux/appSlice';
import Api from "../Api";
import { toast } from 'react-toastify';

const Email = ({ email, refreshEmails }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showSnoozeMenu, setShowSnoozeMenu] = useState(false);

  const openMail = () => {
    if (!email.isRead) {
      markAsRead(true);
    }
    dispatch(setSelectedEmail(email));
    navigate(`/mail/${email._id}`);
  };

  const onDeleteHandler = async () => {
    try {
      const res = await Api.delete('/api/v1/email/delete', {
        data: { emailId: email._id },
      });
      toast.success(res.data.message);
      refreshEmails();
    } catch (error) {
      toast.error('Failed to delete email');
      console.error(error);
    }
  };

  const handleEmailAction = async (action, endpoint, data = {}) => {
    try {
      const res = await Api.put(`/api/v1/email/${endpoint}`, {
        emailId: email._id,
        ...data
      });
      toast.success(res.data.message);
      refreshEmails();
    } catch (error) {
      toast.error(`Failed to ${action} email`);
      console.error(error);
    }
  };

  const toggleArchive = () => handleEmailAction(
    email.isArchived ? 'unarchive' : 'archive',
    email.isArchived ? 'unarchive' : 'archive'
  );

  const markAsRead = (readStatus) => handleEmailAction(
    readStatus ? 'mark as read' : 'mark as unread',
    'mark-read',
    { markAsRead: readStatus !== undefined ? readStatus : !email.isRead }
  );

  const starEmail = (e) => {
    e.stopPropagation();
    handleEmailAction(
      email.isStarred ? 'unstar' : 'star',
      'star'
    );
  };

  const snoozeEmail = (hours) => {
    const snoozeUntil = new Date();
    snoozeUntil.setHours(snoozeUntil.getHours() + hours);
    handleEmailAction('snooze', 'snooze', { snoozeUntil });
    setShowSnoozeMenu(false);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const timeOptions = { hour: 'numeric', minute: '2-digit' };
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };

    if (isToday) {
      return `Today, ${date.toLocaleTimeString('en-IN', timeOptions)}`;
    } else if (isYesterday) {
      return `Yesterday, ${date.toLocaleTimeString('en-IN', timeOptions)}`;
    } else {
      return `${date.toLocaleDateString('en-IN', dateOptions)}, ${date.toLocaleTimeString('en-IN', timeOptions)}`;
    }
  };

  const snoozeOptions = [
    { label: 'Snooze for 1 hour', hours: 1 },
    { label: 'Snooze until tomorrow', hours: 24 },
    { label: 'Snooze for 1 week', hours: 168 }
  ];

  return (
    <div className={`
      group flex items-center justify-between border-b border-gray-200 px-4 py-3 text-sm 
      hover:cursor-pointer hover:shadow-md relative
      ${!email.isRead ? 'font-semibold bg-blue-50' : ''}
    `}>
      <div className="flex items-center gap-3">
        <div className="text-gray-400">
          <MdCropSquare size={20} />
        </div>
        <div 
          className={`cursor-pointer ${email.isStarred ? 'text-yellow-400 filter drop-shadow-[0_0_4px_rgba(234,179,8,0.7)]' : 'text-gray-400 hover:text-yellow-400'}`} 
          onClick={starEmail}
          title={email.isStarred ? 'Unstar' : 'Star'}
        >
          {email.isStarred ? <MdStar size={20} /> : <MdOutlineStarBorder size={20} />}
        </div>
        <div onClick={openMail} className="flex-1 min-w-0">
          <h1 className="font-semibold truncate">{email?.subject}</h1>
        </div>
      </div>

      <div className="flex-1 ml-4 min-w-0" onClick={openMail}>
        <p className="truncate">{email?.message}</p>
      </div>

      <div className="flex-none text-gray-500 text-sm group-hover:hidden">
        <p>{formatDateTime(email?.createdAt)}</p>
      </div>

      <div className="hidden group-hover:flex items-center gap-3">
        {email.isArchived ? (
          <MdUnarchive 
            className="text-gray-500 hover:text-blue-600 cursor-pointer" 
            size={20} 
            onClick={(e) => { e.stopPropagation(); toggleArchive(); }}
            title="Unarchive"
          />
        ) : (
          <MdArchive 
            className="text-gray-500 hover:text-blue-600 cursor-pointer" 
            size={20} 
            onClick={(e) => { e.stopPropagation(); toggleArchive(); }}
            title="Archive"
          />
        )}
        <MdDelete 
          className="text-gray-500 hover:text-red-600 cursor-pointer" 
          size={20} 
          onClick={(e) => { e.stopPropagation(); onDeleteHandler(); }}
          title="Delete"
        />
        {email.isRead ? (
          <IoMailUnreadOutline 
            className="text-gray-500 hover:text-purple-600 cursor-pointer" 
            size={20} 
            onClick={(e) => { e.stopPropagation(); markAsRead(false); }}
            title="Mark as unread"
          />
        ) : (
          <MdMarkEmailRead 
            className="text-gray-500 hover:text-purple-600 cursor-pointer" 
            size={20} 
            onClick={(e) => { e.stopPropagation(); markAsRead(true); }}
            title="Mark as read"
          />
        )}
        <div className="relative">
          <MdAccessTime 
            className={`text-gray-500 hover:text-green-600 cursor-pointer ${email.snoozeInfo?.isSnoozed ? 'text-green-600' : ''}`}
            size={20} 
            onClick={(e) => { e.stopPropagation(); setShowSnoozeMenu(!showSnoozeMenu); }}
            title={email.snoozeInfo?.isSnoozed ? 'Snoozed' : 'Snooze'}
          />
          {showSnoozeMenu && (
            <div className="absolute right-0 z-20 mt-2 w-48 bg-white rounded-md shadow-xl overflow-hidden">
              <div className="py-1 max-h-60 overflow-y-auto">
                {snoozeOptions.map(opt => (
                  <button 
                    key={opt.label}
                    onClick={(e) => { e.stopPropagation(); snoozeEmail(opt.hours); }}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {email.snoozeInfo?.isSnoozed && (
        <span className="absolute top-1 right-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
          Snoozed
        </span>
      )}
    </div>
  );
};

export default Email;
