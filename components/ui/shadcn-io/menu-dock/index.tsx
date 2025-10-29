'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Home, Briefcase, Calendar, Shield, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import emblaStyles from '../../../shared/embla.module.css';

type IconComponentType = React.ElementType<{ className?: string }>;

export interface MenuDockSubItem {
  label: string;
  onClick: () => void;
}

export interface MenuDockItem {
  label: string;
  icon: IconComponentType;
  onClick?: () => void;
  subItems?: MenuDockSubItem[];
  noHighlight?: boolean; // If true, this item won't be highlighted when active
}

export interface MenuDockProps {
  items?: MenuDockItem[];
  className?: string;
  variant?: 'default' | 'compact' | 'large';
  orientation?: 'horizontal' | 'vertical';
  showLabels?: boolean;
  animated?: boolean;
  defaultActiveIndex?: number;
}

const defaultItems: MenuDockItem[] = [
    { label: 'home', icon: Home },
    { label: 'work', icon: Briefcase },
    { label: 'calendar', icon: Calendar },
    { label: 'security', icon: Shield },
    { label: 'settings', icon: Settings },
];

export const MenuDock: React.FC<MenuDockProps> = ({ 
  items, 
  className,
  variant = 'default',
  orientation = 'horizontal',
  showLabels = true,
  animated = true,
  defaultActiveIndex = 0
}) => {

  const finalItems = useMemo(() => {
     const isValid = items && Array.isArray(items) && items.length >= 2 && items.length <= 8;
     if (!isValid) {
        console.warn("MenuDock: 'items' prop is invalid or missing. Using default items.", items);
        return defaultItems;
     }
     return items;
  }, [items]);

  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const navRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
      if (activeIndex >= finalItems.length) {
          setActiveIndex(0);
      }
  }, [finalItems, activeIndex]);

  useEffect(() => {
    setActiveIndex(defaultActiveIndex);
  }, [defaultActiveIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedOutsideNav = navRef.current && !navRef.current.contains(target);
      const clickedOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);
      
      if (clickedOutsideNav && clickedOutsideDropdown) {
        setOpenDropdownIndex(null);
        setDropdownPosition(null);
      }
    };

    if (openDropdownIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openDropdownIndex]);

  const handleItemClick = (index: number, item: MenuDockItem) => {
    if (item.subItems && item.subItems.length > 0) {
      // Toggle dropdown for items with subItems (don't set as active)
      if (openDropdownIndex === index) {
        setOpenDropdownIndex(null);
        setDropdownPosition(null);
      } else {
        const buttonEl = itemRefs.current[index];
        if (buttonEl) {
          const rect = buttonEl.getBoundingClientRect();
          const dropdownWidth = 320; // min-w-[320px] from dropdown
          const viewportWidth = window.innerWidth;
          const padding = 16; // padding from edges
          
          // Calculate ideal centered position
          let left = rect.left + rect.width / 2;
          
          // Check if dropdown would overflow left edge
          if (left - dropdownWidth / 2 < padding) {
            left = padding + dropdownWidth / 2;
          }
          
          // Check if dropdown would overflow right edge
          if (left + dropdownWidth / 2 > viewportWidth - padding) {
            left = viewportWidth - padding - dropdownWidth / 2;
          }
          
          setDropdownPosition({
            top: rect.bottom + 12, // 12px gap
            left: left,
          });
        }
        setOpenDropdownIndex(index);
      }
    } else {
      // Set as active and execute onClick for items without subItems
      // Skip setting active index if item has noHighlight flag
      if (!item.noHighlight) {
        setActiveIndex(index);
      }
      setOpenDropdownIndex(null);
      setDropdownPosition(null);
      item.onClick?.();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          container: 'p-1',
          item: 'p-2 min-w-12',
          icon: 'h-4 w-4',
          text: 'text-xs'
        };
      case 'large':
        return {
          container: 'p-3',
          item: 'p-3 min-w-16',
          icon: 'h-6 w-6',
          text: 'text-base'
        };
      default:
        return {
          container: 'p-2',
          item: 'p-2 min-w-14',
          icon: 'h-5 w-5',
          text: 'text-sm'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <>
    <nav
      ref={navRef}
      className={cn(
        'relative inline-flex items-center rounded-2xl backdrop-blur-md shadow-xl',
        'bg-white/20 border border-white/30',
        orientation === 'horizontal' ? 'flex-row gap-0.2 md:gap-1' : 'flex-col gap-0.2 md:gap-1',
        styles.container,
        className
      )}
      role="navigation"
    >
      {finalItems.map((item, index) => {
        const isActive = index === activeIndex;
        const isDropdownOpen = openDropdownIndex === index;
        const IconComponent = item.icon;

        return (
          <div key={`${item.label}-${index}`} className="relative" style={{ position: 'relative' }}>
            <button
              ref={(el) => { itemRefs.current[index] = el; }}
              className={cn(
                'relative flex flex-col items-center justify-center rounded-xl transition-all duration-300',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
                styles.item,
                isActive && 'bg-white/30 text-white shadow-lg scale-105',
                !isActive && 'text-white/70 hover:bg-white/20 hover:text-white hover:scale-105'
              )}
              onClick={() => handleItemClick(index, item)}
              aria-label={item.label}
              type="button"
            >
              <div className={cn(
                'flex items-center justify-center transition-all duration-300',
                orientation === 'horizontal' && showLabels ? 'mb-1' : '',
                orientation === 'vertical' && showLabels ? 'mb-1' : ''
              )}>
                <IconComponent className={cn(styles.icon, 'transition-all duration-300', isActive && 'drop-shadow-lg')} />
              </div>
              
              {showLabels && (
                <span
                  className={cn(
                    'font-medium transition-colors duration-200 capitalize',
                    styles.text,
                    'whitespace-nowrap'
                  )}
                >
                  {item.label}
                </span>
              )}
            </button>

          </div>
        );
      })}
    </nav>
    {/* Render dropdown via portal */}
    {mounted && openDropdownIndex !== null && dropdownPosition && finalItems[openDropdownIndex]?.subItems && 
      createPortal(
        <div 
          ref={dropdownRef}
          className="fixed z-[9999] min-w-[320px] max-w-[400px] rounded-xl border border-white/30 shadow-2xl p-2 bg-white/20 backdrop-blur-md"
          style={{ 
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            transform: 'translateX(-50%)',
            pointerEvents: 'auto'
          }}
        >
          <div className="grid grid-cols-2 gap-1">
            {finalItems[openDropdownIndex].subItems!.map((subItem, subIndex) => (
              <button
                key={`${subItem.label}-${subIndex}`}
                onClick={() => {
                  subItem.onClick();
                  setOpenDropdownIndex(null);
                  setDropdownPosition(null);
                }}
                className="w-full text-left px-3 py-2.5 text-sm rounded-lg text-white font-medium hover:bg-white/30 hover:scale-105 transition-all duration-200 backdrop-blur-sm"
              >
                {subItem.label}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )
    }
    </>
  );
};