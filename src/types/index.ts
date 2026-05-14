export type UserRole = "user" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: UserRole;
  created_at: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  subject: "alphabets" | "numbers" | "colours" | "shapes";
  type: "free" | "premium";
  price: number;
  thumbnail_url: string;
  storage_path: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  lesson_id: string;
  amount_paid: number;
  paid_at: string;
}

export interface Order {
  id: string;
  razorpay_order_id: string;
  amount: number;
  status: "pending" | "paid" | "failed";
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: "monthly" | "yearly";
  amount_paid: number;
  starts_at: string;
  expires_at: string;
  is_active: boolean;   // true while manually active; check expires_at > now() for real-time status
}
