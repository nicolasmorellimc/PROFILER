/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { LucideIcon } from 'lucide-react';

export interface Artist {
  id: string;
  name: string;
  genre: string;
  icon: LucideIcon;
  day: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum Section {
  HERO = 'hero',
  LINEUP = 'lineup',
  EXPERIENCE = 'experience',
  TICKETS = 'tickets',
}