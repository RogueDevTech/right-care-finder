import { User } from "../modules/users/entities/user.entity";
import { Address } from "../modules/users/entities/address.entity";
import { Order } from "../modules/orders/entities/order.entity";
import { OrderItem } from "../modules/orders/entities/order-item.entity";
import { Product } from "../modules/products/entities/product.entity";
import { Category } from "../modules/products/entities/category.entity";
import { Brand } from "../modules/products/entities/brand.entity";
import { Payment } from "../modules/payments/entities/payment.entity";
import { Wishlist } from "../modules/wishlists/entities/wishlist.entity";
import { WishlistItem } from "../modules/wishlists/entities/wishlist-item.entity";

export const entities = {
  User,
  Address,
  Order,
  OrderItem,
  Product,
  Category,
  Brand,
  Payment,
  Wishlist,
  WishlistItem,
};

export {
  User,
  Address,
  Order,
  OrderItem,
  Product,
  Category,
  Brand,
  Payment,
  Wishlist,
  WishlistItem,
};
