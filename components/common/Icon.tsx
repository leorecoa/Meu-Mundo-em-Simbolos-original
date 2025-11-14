

import React from 'react';
import { LucideProps, Sun, Moon, Search, Plus, Trash2, Undo, Redo, Settings, X, UploadCloud, Camera, Volume2, VolumeX, Share2, Bookmark, Pencil, Smile, Zap, Users, MapPin, Box, Clock, MessageSquare, Palette, Type as TypeIcon, ClipboardList, Printer, CheckSquare, Square, Download, Delete, History, Mail, MessageCircle, CheckCircle, Star } from 'lucide-react';

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
  backspace: Delete,
  history: History,
  mail: Mail,
  messageCircle: MessageCircle,
  checkCircle: CheckCircle,
  star: Star,
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

const Icon = ({ name, ...props }: { name: keyof typeof icons } & LucideProps) => {
  if (!name) {
    console.warn('Icon name is missing');
    return <span {...props} style={{ display: 'inline-block', width: props.size || 24, height: props.size || 24, ...props.style }} />;
  }
  
  const LucideIcon = icons[name];
  if (!LucideIcon) {
    console.warn(`Icon "${String(name)}" not found, using fallback`);
    return <span {...props} style={{ display: 'inline-block', width: props.size || 24, height: props.size || 24, ...props.style }} />;
  }
  
  try {
    const iconElement = <LucideIcon {...props} />;
    if (!iconElement) {
      return <span {...props} style={{ display: 'inline-block', width: props.size || 24, height: props.size || 24, ...props.style }} />;
    }
    return iconElement;
  } catch (error) {
    console.error(`Error rendering icon "${String(name)}":`, error);
    return <span {...props} style={{ display: 'inline-block', width: props.size || 24, height: props.size || 24, ...props.style }} />;
  }
};

export default Icon;