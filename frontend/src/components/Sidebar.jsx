import React from 'react';
import { IoMdStar } from 'react-icons/io';
import { LuPencil } from 'react-icons/lu';
import {
  MdInbox,
  MdOutlineDrafts,
  MdOutlineKeyboardArrowDown,
  MdOutlineWatchLater,
  MdArchive,
} from 'react-icons/md';
import { IoMailUnreadOutline } from 'react-icons/io5';
import { FaMailBulk } from "react-icons/fa";
import { TbSend2 } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { setOpen } from '../redux/appSlice';
import { GoInbox } from 'react-icons/go';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate

const sidebarItems = [
  {
    icon: <GoInbox size={'20px'} />,
    text: 'Inbox',
    tooltip: 'Inbox',
    route: '/inbox', // Add a route
  },
  {
    icon: <IoMdStar size={'20px'} />,
    text: 'Starred',
    tooltip: 'Starred',
    route: '/starred', // Add a route
  },
  
  {
    icon: <TbSend2 size={'20px'} />,
    text: 'Sent',
    tooltip: 'Sent',
    route: '/sent', // Add a route
  },
  {
    icon: <IoMailUnreadOutline  size={'20px'} />,
    text: 'Unread Mails',
    tooltip: 'Unread Mails',
    route: '/unread', // Add a route
  },
  {
    icon: <MdArchive size={'20px'} />,
    text: 'Archive',
    tooltip: 'Archive',
    route: '/archive', // Add a route
  },
  {
    icon: <FaMailBulk size={'20px'} />,
    text: 'All Mails',
    tooltip: 'All Mails',
    route: '/allmails', // Add a route
  },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const { sidebaropen } = useSelector((store) => store.app);
  const navigate = useNavigate(); // Use useNavigate for programmatic navigation

  const handleSidebarItemClick = (route) => {
    navigate(route); // Navigate to the specified route
    window.location.reload();
    if (sidebaropen) {
      dispatch(setOpen(false)); // Close sidebar on mobile after clicking
    }
  };

  return (
    <>
      {sidebaropen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => dispatch(setOpen(false))}
        />
      )}

      <div
        className={`
          fixed md:relative
          z-20
          h-screen
          bg-[#F8FAFD]
          transition-all duration-300 ease-in-out
          ${sidebaropen ? 'w-64' : 'w-16'}
          ${sidebaropen ? 'left-0' : '-left-16 md:left-0'}
        `}
      >
        <div className="p-2">
          <button
            onClick={() => dispatch(setOpen(true))}
            className="flex items-center gap-1 bg-[#C2E7FF] p-4 rounded-2xl hover:shadow-md"
          >
            <LuPencil size="24px" />
            <p className={`${sidebaropen ? 'block' : 'hidden'}`}>Compose</p>
          </button>
        </div>
        <div className="text-gray-600">
          {sidebarItems.map((item, index) => (
            <Tippy content={item.tooltip} placement="right" key={index}>
              <div
                onClick={() => handleSidebarItemClick(item.route)} // Use onClick for navigation
                className="flex items-center pl-6 py-1 rounded-r-full gap-4 my-2 hover:cursor-pointer hover:bg-gray-200"
              >
                {item.icon}
                <p className={`${sidebaropen ? 'block' : 'hidden'}`}>{item.text}</p>
              </div>
            </Tippy>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
