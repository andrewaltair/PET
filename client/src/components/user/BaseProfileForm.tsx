'use client';

import React, { useState, useEffect } from 'react';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { UpdateProfileRequest, UserRole } from 'petservice-marketplace-shared-types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Save, Upload, Facebook, Instagram, Phone, MapPin, User, UserCircle } from 'lucide-react';
import { FaWhatsapp, FaViber, FaTelegram, FaTiktok } from 'react-icons/fa';

interface BaseProfileFormProps {
  user: { role: UserRole };
}

export function BaseProfileForm({ user }: BaseProfileFormProps) {
  const { data: profile, isPending: profileLoading } = useProfile();
  const updateMutation = useUpdateProfile();

  const [formData, setFormData] = useState<UpdateProfileRequest>({
    firstName: '',
    lastName: '',
    avatarUrl: '',
    address: '',
    phone: '',
    facebookUrl: '',
    instagramUrl: '',
    tiktokUrl: '',
    telegramUrl: '',
    whatsappUrl: '',
    viberUrl: '',
    telegramUsername: '',
    whatsappNumber: '',
    viberNumber: '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when profile data loads
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        avatarUrl: profile.avatarUrl || '',
        address: profile.address || '',
        phone: profile.phone || '',
        facebookUrl: profile.facebookUrl || '',
        instagramUrl: profile.instagramUrl || '',
        tiktokUrl: profile.tiktokUrl || '',
        telegramUrl: profile.telegramUrl || '',
        whatsappUrl: profile.whatsappUrl || '',
        viberUrl: profile.viberUrl || '',
        telegramUsername: profile.telegramUsername || '',
        whatsappNumber: profile.whatsappNumber || '',
        viberNumber: profile.viberNumber || '',
      });
      setAvatarPreview(profile.avatarUrl || '');
      setAvatarFile(null);
    }
  }, [profile]);

  const handleInputChange = (field: keyof UpdateProfileRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, avatarUrl: 'Please upload an image file' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, avatarUrl: 'File size must be less than 5MB' }));
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let avatarUrl = formData.avatarUrl;
      if (avatarFile) {
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(avatarFile);
        });
        avatarUrl = dataUrl;
      }

      await updateMutation.mutateAsync({
        ...formData,
        avatarUrl,
      });
      
      setAvatarFile(null);
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="flex items-center gap-2 text-xl">
          <span className="text-2xl">📝</span>
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter your first name"
                leftIcon={<User className="h-4 w-4" />}
              />
              {errors.firstName && (
                <p className="text-destructive text-sm">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter your last name"
                leftIcon={<UserCircle className="h-4 w-4" />}
              />
              {errors.lastName && (
                <p className="text-destructive text-sm">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Avatar Upload */}
          <div className="space-y-2">
            <Label>Upload Avatar</Label>
            <div className="flex items-center gap-4">
              {avatarPreview && (
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300">
                  <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <Label htmlFor="avatar-upload" className="cursor-pointer w-full inline-block">
                  <div className="flex items-center justify-center gap-2 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors w-full">
                    <Upload className="h-4 w-4" />
                    <span>{avatarFile ? 'Change Image' : 'Upload Image'}</span>
                  </div>
                </Label>
              </div>
            </div>
            {errors.avatarUrl && (
              <p className="text-destructive text-sm">{errors.avatarUrl}</p>
            )}
            <p className="text-muted-foreground text-sm">
              Upload a profile picture (max 5MB)
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  leftIcon={<Phone className="h-4 w-4" />}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your address"
                  leftIcon={<MapPin className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-xl">📱</span>
              Social Media & Messaging
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="facebookUrl">Facebook URL</Label>
                <Input
                  type="url"
                  id="facebookUrl"
                  value={formData.facebookUrl}
                  onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
                  placeholder="https://facebook.com/yourprofile"
                  leftIcon={<Facebook className="h-4 w-4 text-blue-600" />}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagramUrl">Instagram URL</Label>
                <Input
                  type="url"
                  id="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                  placeholder="https://instagram.com/yourprofile"
                  leftIcon={<Instagram className="h-4 w-4 text-pink-600" />}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiktokUrl">TikTok URL</Label>
                <Input
                  type="url"
                  id="tiktokUrl"
                  value={formData.tiktokUrl}
                  onChange={(e) => handleInputChange('tiktokUrl', e.target.value)}
                  placeholder="https://tiktok.com/@yourprofile"
                  leftIcon={<FaTiktok className="h-4 w-4 text-black" />}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telegramUrl">Telegram URL</Label>
                <Input
                  type="text"
                  id="telegramUrl"
                  value={formData.telegramUrl}
                  onChange={(e) => handleInputChange('telegramUrl', e.target.value)}
                  placeholder="https://t.me/yourusername"
                  leftIcon={<FaTelegram className="h-4 w-4 text-blue-500" />}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telegramUsername">Telegram Username</Label>
                <Input
                  type="text"
                  id="telegramUsername"
                  value={formData.telegramUsername}
                  onChange={(e) => handleInputChange('telegramUsername', e.target.value)}
                  placeholder="@yourusername"
                  leftIcon={<FaTelegram className="h-4 w-4 text-blue-500" />}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsappUrl">WhatsApp URL</Label>
                <Input
                  type="tel"
                  id="whatsappUrl"
                  value={formData.whatsappUrl}
                  onChange={(e) => handleInputChange('whatsappUrl', e.target.value)}
                  placeholder="https://wa.me/1234567890"
                  leftIcon={<FaWhatsapp className="h-4 w-4 text-green-600" />}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                <Input
                  type="tel"
                  id="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                  placeholder="+1234567890"
                  leftIcon={<FaWhatsapp className="h-4 w-4 text-green-600" />}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="viberUrl">Viber URL</Label>
                <Input
                  type="tel"
                  id="viberUrl"
                  value={formData.viberUrl}
                  onChange={(e) => handleInputChange('viberUrl', e.target.value)}
                  placeholder="viber://chat?number=1234567890"
                  leftIcon={<FaViber className="h-4 w-4 text-purple-600" />}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="viberNumber">Viber Number</Label>
                <Input
                  type="tel"
                  id="viberNumber"
                  value={formData.viberNumber}
                  onChange={(e) => handleInputChange('viberNumber', e.target.value)}
                  placeholder="+1234567890"
                  leftIcon={<FaViber className="h-4 w-4 text-purple-600" />}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              variant="default"
              disabled={updateMutation.isPending}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Save className="mr-2 h-4 w-4" />
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

