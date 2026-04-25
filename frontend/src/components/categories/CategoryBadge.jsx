import {
  ShoppingCart, Car, Home, Heart, Gamepad2, Wifi,
  Shirt, Book, Plane, Briefcase, CircleDollarSign,
} from "lucide-react";

const ICON_MAP = {
  "shopping-cart":      ShoppingCart,
  "car":                Car,
  "home":               Home,
  "heart":              Heart,
  "gamepad":            Gamepad2,
  "wifi":               Wifi,
  "shirt":              Shirt,
  "book":               Book,
  "plane":              Plane,
  "briefcase":          Briefcase,
  "circle-dollar-sign": CircleDollarSign,
};

export default function CategoryBadge({ category }) {
  const Icon = ICON_MAP[category?.icon] ?? CircleDollarSign;

  return (
    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-600 shrink-0">
      <Icon size={16} />
    </div>
  );
}
