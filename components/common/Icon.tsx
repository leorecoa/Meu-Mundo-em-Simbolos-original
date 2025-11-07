
import React from 'react';
import { LucideProps, Sun, Moon, Search, Plus, Trash2, Undo, Redo, Settings, X, UploadCloud, Camera, Volume2, VolumeX, Share2, Bookmark, Pencil, Smile, Zap, Users, MapPin, Box, Clock, MessageSquare, Palette, Type as TypeIcon, ClipboardList, Printer, CheckSquare, Square, Download } from 'lucide-react';

export const icons = {
  sun: Sun,
  moon: Moon,
  search: Search,
  plus: Plus,
  trash: Trash2,
  undo: Undo,
  redo: Redo,
  settings: Settings,
  close: X,
  upload: UploadCloud,
  camera: Camera,
  speak: Volume2,
  stopSpeak: VolumeX,
  share: Share2,
  bookmark: Bookmark,
  pencil: Pencil,
  // Category Icons
  smile: Smile,
  zap: Zap,
  users: Users,
  mapPin: MapPin,
  box: Box,
  clock: Clock,
  messageSquare: MessageSquare,
  palette: Palette,
  type: TypeIcon,
  // Therapist Module Icons
  clipboardList: ClipboardList,
  printer: Printer,
  checkSquare: CheckSquare,
  square: Square,
  download: Download,
};

// FIX: Change component definition to correctly infer props from LucideProps.
// This resolves issues where `size` and `className` were not being recognized.
const Icon = ({ name, ...props }: { name: keyof typeof icons } & LucideProps) => {
  const LucideIcon = icons[name];
  return <LucideIcon {...props} />;
};

export default Icon;
