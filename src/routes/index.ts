import { Router } from 'express';
import { UserRoutes } from '../models/user/user.route';
import { WishlistRoutes } from '../models/wishlist/wishlist.route';
import { ReviewRoutes } from '../models/review/review.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/wishlist',
    route: WishlistRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
