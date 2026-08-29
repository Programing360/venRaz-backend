import express from "express";
import { CategoryControllers } from "../../models/category/category.controller";
import { auth } from "../../middlewares/sop/auth.middleware";
;

const router = express.Router();

// Public Route (যেকোনো ইউজার এক্সেস করতে পারবে)
router.get("/", CategoryControllers.getAllCategories);

// Protected Route (শুধুমাত্র লগইন করা ইউজার)
// router.get("/my-categories", auth(), CategoryControllers.getUserCategories);

// Admin Only Route (শুধুমাত্র Admin এক্সেস করতে পারবে)
router.post("/", auth("admin"), CategoryControllers.createCategory);
router.patch("/:id", auth("admin"), CategoryControllers.updateCategory);
router.delete("/:id", auth("admin"), CategoryControllers.deleteCategory);

export const CategoryRoutes = router;
