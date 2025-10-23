'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Plus, Check } from 'lucide-react';

export type Language = 'geo' | 'eng' | 'rus';

interface LanguageData {
  language: Language;
  title: string;
  description: string;
}

interface LanguageSelectorProps {
  languages: Language[];
  onLanguageToggle: (lang: Language) => void;
  languageData: Record<Language, LanguageData>;
  onLanguageDataChange: (lang: Language, field: 'title' | 'description', value: string) => void;
}

const languageLabels: Record<Language, string> = {
  geo: 'ქართული',
  eng: 'English',
  rus: 'Русский',
};

export function LanguageSelector({
  languages,
  onLanguageToggle,
  languageData,
  onLanguageDataChange,
}: LanguageSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Language Selection Buttons */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Languages *
        </label>
        <p className="text-sm text-gray-600">
          Select at least one language to add your service content
        </p>
        <div className="flex flex-wrap gap-2">
          {(['geo', 'eng', 'rus'] as Language[]).map((lang) => {
            const isSelected = languages.includes(lang);
            return (
              <Button
                key={lang}
                type="button"
                variant={isSelected ? 'default' : 'outline'}
                onClick={() => onLanguageToggle(lang)}
                className="relative"
              >
                {isSelected ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {languageLabels[lang]}
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add {languageLabels[lang]}
                  </>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Language Content Forms */}
      {languages.length > 0 && (
        <div className="space-y-4">
          {languages.map((lang) => (
            <Card key={lang} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="text-base">
                  {languageLabels[lang]}
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onLanguageToggle(lang)}
                >
                  Remove
                </Button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={languageData[lang].title}
                    onChange={(e) => onLanguageDataChange(lang, 'title', e.target.value)}
                    placeholder={`Enter title in ${languageLabels[lang]}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Description *
                  </label>
                  <textarea
                    value={languageData[lang].description}
                    onChange={(e) => onLanguageDataChange(lang, 'description', e.target.value)}
                    placeholder={`Enter description in ${languageLabels[lang]}`}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

