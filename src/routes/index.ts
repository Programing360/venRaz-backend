import { Router } from 'express';
import { UserRoutes } from '../models/user/user.route';
import { WishlistRoutes } from '../models/wishlist/wishlist.route';
import { ReviewRoutes } from '../models/review/review.route';
import { AddressRoutes } from '../models/address/address.route';
import { RecentViewRoutes } from '../models/recentView/recentView.route';
import { AdminRoutes } from '../models/admin/admin.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/users/address',
    route: AddressRoutes,
  },
  {
    path: '/users/recent-views',
    route: RecentViewRoutes,
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
