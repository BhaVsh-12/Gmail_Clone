import { Email } from "../models/email.model.js";
import Joi from 'joi';
import { User } from "../models/user.model.js";
export const createEmail = async (req, res) => {
    try {
        const senderUserId = req.user._id;
        const { to, subject, message, category } = req.body;
        const from = req.user.email;
        const profilePhoto = req.user.profilePhoto;

        const schema = Joi.object({
            to: Joi.string().email().required(),
            subject: Joi.string().required(),
            message: Joi.string().required(),
            from: Joi.string().email().required(),
            category: Joi.string().valid("primary", "social", "promotion").default("primary"),
        });

        const { error, value } = schema.validate({ to, subject, message, from, category });
        if (error) {
            return res.status(400).json({ message: error.details[0].message, success: false });
        }
        const receiver = await User.findOne({ email: value.to });
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found', success: false });
        }
        const receiverUserId = receiver._id;

        await Email.create({
            to: value.to,
            subject: value.subject,
            message: value.message,
            userId: senderUserId,
            from: value.from,
            profilePhoto,
            category: value.category,
        });

        await Email.create({
            to: value.to,
            subject: value.subject,
            message: value.message,
            userId: receiverUserId,
            from: value.from,
            profilePhoto,
            category: value.category,
        });

        return res.status(201).json({ success: true, message: 'Email sent successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

  
export const deleteEmail = async (req, res) => {
    try {
      const { emailId } = req.body; // Access emailId from req.body
  
      if (!emailId) {
        return res.status(400).json({ message: 'Email ID is required' });
      }
  
      const email = await Email.findByIdAndDelete(emailId);
  
      if (!email) {
        return res.status(404).json({ message: 'Email not found' });
      }
  
      return res.status(200).json({ message: 'Email deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
export const getAllEmailById = async (req,res)=>{
    try {
        const userId = req.user._id;
        const emails = await Email.find({userId});
        return res.status(200).json({emails});
    } catch (error) {
        console.log(error);
    }
};
export const archiveEmail = async (req, res) => {
    try {
        const { emailId } = req.body;

        if (!emailId) {
            return res.status(400).json({ message: 'Email ID is required' });
        }

        const email = await Email.findById(emailId);
        if (!email) {
            return res.status(404).json({ message: 'Email not found' });
        }

        const updatedEmail = await Email.findByIdAndUpdate(
            emailId,
            { $set: { isArchived: !email.isArchived } }, // Changed from archived to isArchived
            { new: true }
        );

        return res.status(200).json({ 
            message: `Email ${updatedEmail.isArchived ? 'archived' : 'unarchived'} successfully`,
            email: updatedEmail
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
export const snoozeEmail = async (req, res) => {
    try {
        const { emailId } = req.params;
        const { snoozeUntil } = req.body; 
        const userId = req.user._id;

        const email = await Email.findOne({ _id: emailId, userId });
        if (!email) {
            return res.status(404).json({ message: "Email not found", success: false });
        }

        email.snoozeInfo = {
            isSnoozed: true,
            snoozeUntil: new Date(snoozeUntil),
            originalCategory: email.category,
        };

        await email.save();

        res.status(200).json({ success: true, message: "Email snoozed successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const markEmailAsRead = async (req, res) => {
    try {
        const { emailId, markAsRead } = req.body; // Add markAsRead parameter

        if (!emailId) {
            return res.status(400).json({ message: 'Email ID is required' });
        }

        const email = await Email.findById(emailId);
        if (!email) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Allow toggling read status
        const updatedEmail = await Email.findByIdAndUpdate(
            emailId,
            { $set: { isRead: markAsRead !== undefined ? markAsRead : !email.isRead } },
            { new: true }
        );

        return res.status(200).json({ 
            message: `Email marked as ${updatedEmail.isRead ? 'read' : 'unread'} successfully`,
            email: updatedEmail
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
export const starEmail = async (req, res) => {
    try {
        const { emailId } = req.body;

        if (!emailId) {
            return res.status(400).json({ message: 'Email ID is required' });
        }

        const email = await Email.findById(emailId);
        if (!email) {
            return res.status(404).json({ message: 'Email not found' });
        }

        const updatedEmail = await Email.findByIdAndUpdate(
            emailId,
            { $set: { isStarred: !email.isStarred } }, // Changed from isStar to isStarred
            { new: true }
        );

        return res.status(200).json({ 
            message: `Email ${updatedEmail.isStarred ? 'starred' : 'unstarred'} successfully`,
            email: updatedEmail
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
export const emailDetail =async (req,res)=>{
    try{
    const emailId =req.params.id;
    const email =await Email.findById(emailId);
    if(!email) return res.status(404).json({message:"Email not found",success:false});
    return res.status(200).json({email,success:true});
  
    }
    catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', success: false });
    }
   };

   export const getAllEmailByCategory = async (req, res) => {
    try {
      const userId = req.user._id;
      const userEmail = req.user.email; 
      const { category, type } = req.params;
  
      console.log(`Category: ${category}, Type: ${type}`);
  
      let query = { userId };
  
      switch (type) {
        case 'allmails':
          
          break;
        case 'inbox':
          query.to = userEmail;
          if (!["primary", "social", "promotion"].includes(category)) {
            return res.status(400).json({ message: 'Invalid email category for inbox', success: false });
          }
          query.category = category;  // Only apply category filter in inbox
          break;
        case 'sent':
          query.from = userEmail;
          break;
        case 'starred':
          query.isStarred = true;
          break;
        
        case 'archive':
          query.isArchived = true;
          break;
        case 'unread':
          query.isRead = false;
          break;
        default:
          return res.status(400).json({ message: 'Invalid type', success: false });
      }
  
      const emails = await Email.find(query).sort({ createdAt: -1 }).lean();
      return res.status(200).json({ emails, success: true });
    } catch (error) {
      console.error('Error fetching emails:', error.message);
      return res.status(500).json({ message: 'Internal server error', success: false });
    }
  };
  
  
