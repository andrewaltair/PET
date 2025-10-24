'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Briefcase, Upload, X } from 'lucide-react';
import { User, ServiceType as ServiceTypeEnum } from 'petservice-marketplace-shared-types';

interface ProviderServiceManagementProps {
  user: User;
}

export function ProviderServiceManagement({ user }: ProviderServiceManagementProps) {
  const t = useTranslations('providerProfile');
  const [services, setServices] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    serviceType: ServiceTypeEnum.WALKING,
    title: '',
    description: '',
    priceFrom: '',
    priceTo: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, imageUrl: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to create/update service
    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? { ...s, ...formData } : s));
    } else {
      setServices([...services, { id: Date.now().toString(), ...formData }]);
    }
    setIsDialogOpen(false);
    setEditingService(null);
    setFormData({ serviceType: ServiceTypeEnum.WALKING, title: '', description: '', priceFrom: '', priceTo: '', imageUrl: '' });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setFormData({
      serviceType: service.serviceType,
      title: service.title,
      description: service.description,
      priceFrom: service.priceFrom?.toString() || '',
      priceTo: service.priceTo?.toString() || '',
      imageUrl: service.imageUrl || '',
    });
    if (service.imageUrl) {
      setImagePreview(service.imageUrl);
    }
    setIsDialogOpen(true);
  };

  const handleDelete = (serviceId: string) => {
    // TODO: Implement API call to delete service
    setServices(services.filter(s => s.id !== serviceId));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" onClick={() => {
              setEditingService(null);
              setFormData({ serviceType: ServiceTypeEnum.WALKING, title: '', description: '', priceFrom: '', priceTo: '', imageUrl: '' });
              setImageFile(null);
              setImagePreview(null);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              {t('addService')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingService ? t('editService') : t('addNewService')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serviceType">{t('serviceType')} *</Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) => setFormData({ ...formData, serviceType: value as ServiceTypeEnum })}
                  required
                >
                  <SelectTrigger id="serviceType" className="w-full">
                    <SelectValue placeholder={t('selectServiceType')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ServiceTypeEnum).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">{t('serviceTitle')} *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={t('titlePlaceholder')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t('description')} *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('descriptionPlaceholder')}
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priceFrom">{t('priceFrom')} *</Label>
                  <Input
                    id="priceFrom"
                    type="number"
                    step="0.01"
                    value={formData.priceFrom}
                    onChange={(e) => setFormData({ ...formData, priceFrom: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceTo">{t('priceTo')} *</Label>
                  <Input
                    id="priceTo"
                    type="number"
                    step="0.01"
                    value={formData.priceTo}
                    onChange={(e) => setFormData({ ...formData, priceTo: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('serviceImage')}</Label>
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-md p-6">
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="imageUpload" className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="rounded-full bg-gray-100 p-3">
                          <Upload className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="text-center">
                          <span className="text-sm font-medium text-gray-700">{t('clickToUpload')}</span>
                          <p className="text-xs text-gray-500 mt-1">{t('uploadInstructions')}</p>
                        </div>
                      </div>
                    </label>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button type="submit" variant="success">{t('save')}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>{t('noServicesYet')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{service.title}</h4>
                    <p className="text-sm text-gray-600">{service.serviceType}</p>
                    <p className="text-sm mt-2">{service.description}</p>
                    <p className="text-lg font-bold text-green-600 mt-2">
                      ${service.priceFrom || service.price} - ${service.priceTo || service.price}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(service.id)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

