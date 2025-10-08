// Type definitions for Zorides

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  age?: number;
  gender?: string;
  state?: string;
  district?: string;
  locality?: string;
  createdAt: Date;
}

export interface Location {
  state: string;
  district: string;
  locality: string;
  venue?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  state: string;
  district: string;
  locality: string;
  venue?: string;
  date: Date;
  creatorId: string;
  creator?: User;
  status: 'OPEN' | 'FILLED' | 'CLOSED' | 'CANCELLED';
  mediaUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendantGroup {
  id: string;
  eventId: string;
  event?: Event;
  creatorId: string;
  creator?: User;
  planDescription: string;
  ageMin?: number;
  ageMax?: number;
  genderPreference?: string;
  rideMode?: string;
  maxPeople: number;
  customPreferences?: any;
  status: 'OPEN' | 'FILLED' | 'CLOSED';
  members?: GroupMember[];
  createdAt: Date;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  user?: User;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  joinedAt: Date;
}

export interface Post {
  id: string;
  userId: string;
  user?: User;
  eventId?: string;
  event?: Event;
  content: string;
  mediaUrls: string[];
  reactions?: Reaction[];
  comments?: Comment[];
  createdAt: Date;
}

export interface Reaction {
  id: string;
  postId: string;
  userId: string;
  user?: User;
  type: 'HELP_FIND_FRIEND' | 'HIT_ME_UP';
  createdAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user?: User;
  content: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  sender?: User;
  recipientId?: string;
  recipient?: User;
  groupId?: string;
  content: string;
  read: boolean;
  createdAt: Date;
}
