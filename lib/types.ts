export type UserRole = "buyer" | "lister";
export type SubscriptionStatus = "trial" | "active" | "expired";

export interface AppUser {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Talent {
  id: string;
  user_id: string;
  name: string;
  category: string;
  location: string;
  bio: string;
  price_range: string;
  portfolio_images: string[];
  contact_phone: string;
  subscription_status: SubscriptionStatus;
  trial_end_date: string;
  views_count: number;
  contacts_count: number;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: "monthly" | "annual";
  razorpay_subscription_id: string | null;
  status: "created" | "active" | "pending" | "halted" | "cancelled" | "completed";
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}
