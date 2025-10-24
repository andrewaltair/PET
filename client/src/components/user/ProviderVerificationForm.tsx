'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DatePicker } from '@/components/ui/date-picker';
import { Upload, Shield, CheckCircle, XCircle } from 'lucide-react';
import { User } from 'petservice-marketplace-shared-types';

interface ProviderVerificationFormProps {
  user: User;
}

export function ProviderVerificationForm({ user }: ProviderVerificationFormProps) {
  const t = useTranslations('providerProfile');
  const [certifications, setCertifications] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    certificateUrl: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to create certification
    setCertifications([...certifications, { id: Date.now().toString(), ...formData, verified: false }]);
    setIsDialogOpen(false);
    setFormData({ title: '', issuer: '', issueDate: '', expiryDate: '', certificateUrl: '' });
  };

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Implement file upload
      console.log('Uploading certificate:', file);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">{t('trustTitle')}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            {t('trustSubtitle')}
          </p>

          <div className="flex justify-end mb-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="gradient">
                  <Upload className="h-4 w-4 mr-2" />
                  {t('addCertification')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('dialogTitle')}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="certTitle">{t('certTitle')} *</Label>
                    <Input
                      id="certTitle"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder={t('certTitlePlaceholder')}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issuer">{t('issuer')} *</Label>
                    <Input
                      id="issuer"
                      value={formData.issuer}
                      onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                      placeholder={t('issuerPlaceholder')}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="issueDate">{t('issueDate')} *</Label>
                      <DatePicker
                        value={formData.issueDate}
                        onChange={(value) => setFormData({ ...formData, issueDate: value })}
                        placeholder={t('issueDate')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">{t('expiryDate')}</Label>
                      <DatePicker
                        value={formData.expiryDate}
                        onChange={(value) => setFormData({ ...formData, expiryDate: value })}
                        placeholder={t('expiryDate')}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certificateFile">{t('uploadCertificate')}</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleCertificateUpload}
                        className="hidden"
                        id="certificateFile"
                      />
                      <label htmlFor="certificateFile">
                        <Button type="button" variant="outline" asChild>
                          <span className="cursor-pointer">
                            <Upload className="h-4 w-4 mr-2" />
                            {t('uploadCertificate')}
                          </span>
                        </Button>
                      </label>
                    </div>
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

          {certifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>{t('noCertsYet')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div key={cert.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{cert.title}</h4>
                        {cert.verified ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-yellow-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{t('issuedBy')}: {cert.issuer}</p>
                      <p className="text-sm text-gray-600">{t('issueDate')}: {cert.issueDate}</p>
                      {cert.expiryDate && (
                        <p className="text-sm text-gray-600">{t('expiryDate')}: {cert.expiryDate}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {t('status')}: {cert.verified ? t('verified') : t('pendingVerification')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

