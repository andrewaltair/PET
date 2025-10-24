'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Dog, Stethoscope } from 'lucide-react';
import { User } from 'petservice-marketplace-shared-types';

interface SeekerProfileExtrasProps {
  user: User;
}

export function SeekerProfileExtras({ user }: SeekerProfileExtrasProps) {
  const [pets, setPets] = useState<any[]>([]);
  const [veterinarians, setVeterinarians] = useState<any[]>([]);
  const [isPetDialogOpen, setIsPetDialogOpen] = useState(false);
  const [isVetDialogOpen, setIsVetDialogOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<any | null>(null);
  const [editingVet, setEditingVet] = useState<any | null>(null);

  const [petFormData, setPetFormData] = useState({
    name: '',
    petType: '',
    breed: '',
    age: '',
    weight: '',
    medicalNotes: '',
    photoUrl: '',
  });

  const [vetFormData, setVetFormData] = useState({
    name: '',
    clinicName: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });

  const handlePetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to create/update pet
    if (editingPet) {
      // Update pet
      setPets(pets.map(p => p.id === editingPet.id ? { ...p, ...petFormData } : p));
    } else {
      // Create new pet
      setPets([...pets, { id: Date.now().toString(), ...petFormData }]);
    }
    setIsPetDialogOpen(false);
    setEditingPet(null);
    setPetFormData({ name: '', petType: '', breed: '', age: '', weight: '', medicalNotes: '', photoUrl: '' });
  };

  const handleVetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to create/update veterinarian
    if (editingVet) {
      // Update vet
      setVeterinarians(veterinarians.map(v => v.id === editingVet.id ? { ...v, ...vetFormData } : v));
    } else {
      // Create new vet
      setVeterinarians([...veterinarians, { id: Date.now().toString(), ...vetFormData }]);
    }
    setIsVetDialogOpen(false);
    setEditingVet(null);
    setVetFormData({ name: '', clinicName: '', phone: '', email: '', address: '', notes: '' });
  };

  const handleEditPet = (pet: any) => {
    setEditingPet(pet);
    setPetFormData({
      name: pet.name,
      petType: pet.petType,
      breed: pet.breed || '',
      age: pet.age?.toString() || '',
      weight: pet.weight?.toString() || '',
      medicalNotes: pet.medicalNotes || '',
      photoUrl: pet.photoUrl || '',
    });
    setIsPetDialogOpen(true);
  };

  const handleEditVet = (vet: any) => {
    setEditingVet(vet);
    setVetFormData({
      name: vet.name,
      clinicName: vet.clinicName || '',
      phone: vet.phone || '',
      email: vet.email || '',
      address: vet.address || '',
      notes: vet.notes || '',
    });
    setIsVetDialogOpen(true);
  };

  const handleDeletePet = (petId: string) => {
    // TODO: Implement API call to delete pet
    setPets(pets.filter(p => p.id !== petId));
  };

  const handleDeleteVet = (vetId: string) => {
    // TODO: Implement API call to delete veterinarian
    setVeterinarians(veterinarians.filter(v => v.id !== vetId));
  };

  return (
    <div className="space-y-6 mt-6">
      {/* My Pets Section */}
      <Card className="hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Dog className="h-6 w-6 text-green-600" />
              My Pets
            </CardTitle>
            <Dialog open={isPetDialogOpen} onOpenChange={setIsPetDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => {
                    setEditingPet(null);
                    setPetFormData({ name: '', petType: '', breed: '', age: '', weight: '', medicalNotes: '', photoUrl: '' });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Pet
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingPet ? 'Edit Pet' : 'Add New Pet'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handlePetSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="petName">Pet Name *</Label>
                      <Input
                        id="petName"
                        value={petFormData.name}
                        onChange={(e) => setPetFormData({ ...petFormData, name: e.target.value })}
                        placeholder="Enter pet name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="petType">Pet Type *</Label>
                      <Input
                        id="petType"
                        value={petFormData.petType}
                        onChange={(e) => setPetFormData({ ...petFormData, petType: e.target.value })}
                        placeholder="e.g., Dog, Cat"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="breed">Breed</Label>
                      <Input
                        id="breed"
                        value={petFormData.breed}
                        onChange={(e) => setPetFormData({ ...petFormData, breed: e.target.value })}
                        placeholder="Enter breed"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={petFormData.age}
                        onChange={(e) => setPetFormData({ ...petFormData, age: e.target.value })}
                        placeholder="Enter age"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        value={petFormData.weight}
                        onChange={(e) => setPetFormData({ ...petFormData, weight: e.target.value })}
                        placeholder="Enter weight"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="photoUrl">Photo URL</Label>
                      <Input
                        id="photoUrl"
                        value={petFormData.photoUrl}
                        onChange={(e) => setPetFormData({ ...petFormData, photoUrl: e.target.value })}
                        placeholder="Enter photo URL"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicalNotes">Medical Notes</Label>
                    <Textarea
                      id="medicalNotes"
                      value={petFormData.medicalNotes}
                      onChange={(e) => setPetFormData({ ...petFormData, medicalNotes: e.target.value })}
                      placeholder="Enter any medical notes or special care instructions"
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsPetDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {pets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Dog className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No pets added yet. Click "Add Pet" to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pets.map((pet) => (
                <div key={pet.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{pet.name}</h4>
                      <p className="text-sm text-gray-600">{pet.petType} {pet.breed && `• ${pet.breed}`}</p>
                      {pet.age && <p className="text-sm text-gray-600">Age: {pet.age} years</p>}
                      {pet.weight && <p className="text-sm text-gray-600">Weight: {pet.weight} kg</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditPet(pet)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeletePet(pet.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Veterinarians Section */}
      <Card className="hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Stethoscope className="h-6 w-6 text-purple-600" />
              My Veterinarians
            </CardTitle>
            <Dialog open={isVetDialogOpen} onOpenChange={setIsVetDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => {
                    setEditingVet(null);
                    setVetFormData({ name: '', clinicName: '', phone: '', email: '', address: '', notes: '' });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Veterinarian
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingVet ? 'Edit Veterinarian' : 'Add New Veterinarian'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleVetSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vetName">Veterinarian Name *</Label>
                      <Input
                        id="vetName"
                        value={vetFormData.name}
                        onChange={(e) => setVetFormData({ ...vetFormData, name: e.target.value })}
                        placeholder="Enter veterinarian name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clinicName">Clinic Name</Label>
                      <Input
                        id="clinicName"
                        value={vetFormData.clinicName}
                        onChange={(e) => setVetFormData({ ...vetFormData, clinicName: e.target.value })}
                        placeholder="Enter clinic name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vetPhone">Phone</Label>
                      <Input
                        id="vetPhone"
                        value={vetFormData.phone}
                        onChange={(e) => setVetFormData({ ...vetFormData, phone: e.target.value })}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vetEmail">Email</Label>
                      <Input
                        id="vetEmail"
                        type="email"
                        value={vetFormData.email}
                        onChange={(e) => setVetFormData({ ...vetFormData, email: e.target.value })}
                        placeholder="Enter email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vetAddress">Address</Label>
                    <Input
                      id="vetAddress"
                      value={vetFormData.address}
                      onChange={(e) => setVetFormData({ ...vetFormData, address: e.target.value })}
                      placeholder="Enter address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vetNotes">Notes</Label>
                    <Textarea
                      id="vetNotes"
                      value={vetFormData.notes}
                      onChange={(e) => setVetFormData({ ...vetFormData, notes: e.target.value })}
                      placeholder="Enter any additional notes"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsVetDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {veterinarians.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Stethoscope className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No veterinarians added yet. Click "Add Veterinarian" to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {veterinarians.map((vet) => (
                <div key={vet.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{vet.name}</h4>
                      {vet.clinicName && <p className="text-sm text-gray-600">{vet.clinicName}</p>}
                      {vet.phone && <p className="text-sm text-gray-600">Phone: {vet.phone}</p>}
                      {vet.email && <p className="text-sm text-gray-600">Email: {vet.email}</p>}
                      {vet.address && <p className="text-sm text-gray-600">Address: {vet.address}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditVet(vet)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteVet(vet.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
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

