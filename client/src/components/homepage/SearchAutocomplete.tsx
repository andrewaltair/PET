'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, TrendingUp } from 'lucide-react';
import { Input } from '../ui/input';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'popular' | 'location';
}

const popularSearches: SearchSuggestion[] = [
  { id: '1', text: 'Dog walking near me', type: 'popular' },
  { id: '2', text: 'Pet sitting', type: 'popular' },
  { id: '3', text: 'Dog grooming', type: 'popular' },
  { id: '4', text: 'Pet taxi service', type: 'popular' },
];

export function SearchAutocomplete() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<SearchSuggestion[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const recent = localStorage.getItem('recentSearches');
    if (recent) {
      setRecentSearches(JSON.parse(recent));
    }
  }, []);

  useEffect(() => {
    // Handle clicks outside
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    if (value.trim().length > 2) {
      // Filter suggestions based on input
      const filtered = popularSearches.filter(item =>
        item.text.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    setInputValue(suggestion.text);
    setIsOpen(false);
    
    // Save to recent searches
    const updated = [suggestion, ...recentSearches.filter(s => s.id !== suggestion.id)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search for pet services..."
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-12 pr-4 h-12 border-2 border-gray-200 focus:border-green-500 rounded-lg"
        />
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          {/* Recent Searches */}
          {recentSearches.length > 0 && inputValue.length === 0 && (
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Recent Searches
              </div>
            </div>
          )}
          {recentSearches.length > 0 && inputValue.length === 0 && recentSearches.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <Search className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{suggestion.text}</span>
            </button>
          ))}

          {/* Popular Searches */}
          {suggestions.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                <TrendingUp className="w-3 h-3" />
                Popular Searches
              </div>
            </div>
          )}
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <MapPin className="w-4 h-4 text-green-500" />
              <span className="text-gray-700">{suggestion.text}</span>
            </button>
          ))}

          {/* Empty State */}
          {suggestions.length === 0 && recentSearches.length === 0 && inputValue.length > 2 && (
            <div className="px-4 py-6 text-center text-gray-500">
              No suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

