import { Photo } from './Photo';

export interface member {
  id: number;
  username: string;
  photoUrl: string;
  age: number;
  firstName: string;
  lastName: string;
  created: Date;
  lastActive: Date;
  gender: string;
  city: string;
  country: string;
  photos: Photo[];
}
