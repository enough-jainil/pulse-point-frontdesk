import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MemberFormProps {
  member?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const MemberForm = ({ member, onSubmit, onCancel, loading }: MemberFormProps) => {
  const [formData, setFormData] = useState({
    first_name: member?.first_name || "",
    last_name: member?.last_name || "",
    email: member?.email || "",
    phone: member?.phone || "",
    date_of_birth: member?.date_of_birth || "",
    gender: member?.gender || "",
    address: member?.address || "",
    city: member?.city || "",
    state: member?.state || "",
    pincode: member?.pincode || "",
    emergency_contact_name: member?.emergency_contact_name || "",
    emergency_contact_phone: member?.emergency_contact_phone || "",
    goals: member?.goals || "",
    status: member?.status || "active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name *</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            placeholder="Enter first name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name *</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            placeholder="Enter last name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter email"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Enter phone number"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Enter address"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Enter city"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            placeholder="Enter state"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pincode">Pincode</Label>
          <Input
            id="pincode"
            value={formData.pincode}
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            placeholder="Enter pincode"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
          <Input
            id="emergency_contact_name"
            value={formData.emergency_contact_name}
            onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
            placeholder="Enter contact name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
          <Input
            id="emergency_contact_phone"
            value={formData.emergency_contact_phone}
            onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
            placeholder="Enter contact phone"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="goals">Goals</Label>
        <Textarea
          id="goals"
          value={formData.goals}
          onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
          placeholder="Enter fitness goals"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : member ? "Update Member" : "Add Member"}
        </Button>
      </div>
    </form>
  );
};