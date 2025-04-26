import React, { useState, useCallback } from 'react';
 import { MdCropSquare, MdInbox, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
 import { FaCaretDown, FaUserFriends } from "react-icons/fa";
 import { IoMdMore, IoMdRefresh } from 'react-icons/io';
 import { GoTag } from "react-icons/go";
 import Emails from './Emails';
 import { useParams } from 'react-router-dom';
 const mailType = [
  {
   icon: <MdInbox size={'20px'} />,
   text: "Primary",
   category: "primary" // Add category
  },
  {
   icon: <GoTag size={'20px'} />,
   text: "Promotions",
   category: "promotion" // Add category
  },
  {
   icon: <FaUserFriends size={'20px'} />,
   text: "Social",
   category: "social" // Add category
  },
 ];

 const Inbox = () => {
  const [selectedCategory, setSelectedCategory] = useState("primary"); 
 
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCategoryChange = (index) => {
   setSelectedCategory(mailType[index].category);
   
   setRefreshTrigger(prev => prev + 1);
  };

  const handleRefresh = useCallback(() => {
   console.log(`Refreshing emails for category: ${selectedCategory}`);
   setRefreshTrigger(prev => prev + 1);
  }, [selectedCategory]);
  const {type}=useParams();
  return (
   <div className='flex-1 bg-white rounded-xl mx-5'>
    <div className='flex items-center justify-between px-4 my-2'>
     <div className='flex items-center gap-2'>
      <div className='flex items-center gap-1'>
       <MdCropSquare size={'20px'} />
       <FaCaretDown size={'20px'} />
      </div>
      <div className='p-2 rounded-full hover:bg-gray-200 cursor-pointer' onClick={handleRefresh}>
       <IoMdRefresh size={'20px'} />
      </div>
      <div className='p-2 rounded-full hover:bg-gray-200 cursor-pointer'>
       <IoMdMore size={'20px'} />
      </div>
     </div>
     <div className='flex items-center gap-2'>
      <span>1 to 50</span>
      <MdKeyboardArrowLeft size="24px" />
      <MdKeyboardArrowRight size="24px" />
     </div>
    </div>
    <div className='h-90vh overflow-y-auto'>
     {
      type==="inbox" && (
        <div className='flex items-center gap-1'>
      {
       mailType.map((item, index) => {
        return (
         <button
          key={index}
          onClick={() => handleCategoryChange(index)}
          className={` ${selectedCategory === item.category ? "border-b-4  border-b-blue-600  text-blue-600" : "border-b-4 border-b-transparent"} flex items-center gap-5 p-4 md:w-52 w-20 hover:bg-gray-100`}
         >
          {item.icon}
          <span className='hidden md:block'>{item.text}</span>
         </button>
        );
       })
      }
     </div>
      )
     }
     <Emails category={selectedCategory} refreshTrigger={refreshTrigger} />
    </div>
   </div>
  );
 };

 export default Inbox;