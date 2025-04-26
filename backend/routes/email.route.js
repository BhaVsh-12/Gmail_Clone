import express from "express"; 
import { 
  createEmail, 
  deleteEmail, 
  getAllEmailById,
  archiveEmail,
  snoozeEmail,
  markEmailAsRead,
  starEmail,
  emailDetail,
  getAllEmailByCategory
} from "../controllers/email.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

// Email creation and basic operations
router.route("/create").post(isAuthenticated, createEmail);
router.route("/delete").delete(isAuthenticated, deleteEmail);
router.route("/getallemails").get(isAuthenticated, getAllEmailById);

// Email status modification
router.route("/archive").put(isAuthenticated, archiveEmail);
router.route("/snooze").put(isAuthenticated, snoozeEmail);
router.route("/mark-read").put(isAuthenticated, markEmailAsRead);
router.route("/star").put(isAuthenticated, starEmail);

// Special email category routes
router.route("/mail/:id").get(isAuthenticated, emailDetail);

router.get('/:type/:category', isAuthenticated, getAllEmailByCategory);
export default router;