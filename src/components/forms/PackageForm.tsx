import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface PackageFormProps {
  package?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const PackageForm = ({ package: pkg, onSubmit, onCancel, loading }: PackageFormProps) => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    title: pkg?.title || "",
    service_id: pkg?.service_id || "",
    sessions: pkg?.sessions || 1,
    duration_minutes: pkg?.duration_minutes || 60,
    mrp: pkg?.mrp || 0,
    selling_price: pkg?.selling_price || 0,
    status: pkg?.status || "active",
  });

  const discount = formData.mrp > 0 ? Math.round(((formData.mrp - formData.selling_price) / formData.mrp) * 100) : 0;

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data } = await supabase.from("services").select("*").eq("status", "active");
    setServices(data || []);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, discount });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Package Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter package title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="service">Service</Label>
        <Select value={formData.service_id} onValueChange={(value) => setFormData({ ...formData, service_id: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service: any) => (
              <SelectItem key={service.id} value={service.id}>
                {service.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sessions">Number of Sessions *</Label>
          <Input
            id="sessions"
            type="number"
            min="1"
            value={formData.sessions}
            onChange={(e) => setFormData({ ...formData, sessions: parseInt(e.target.value) || 1 })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (Minutes) *</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={formData.duration_minutes}
            onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 60 })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mrp">MRP (₹) *</Label>
          <Input
            id="mrp"
            type="number"
            min="0"
            step="0.01"
            value={formData.mrp}
            onChange={(e) => setFormData({ ...formData, mrp: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="selling_price">Selling Price (₹) *</Label>
          <Input
            id="selling_price"
            type="number"
            min="0"
            step="0.01"
            value={formData.selling_price}
            onChange={(e) => setFormData({ ...formData, selling_price: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Calculated Discount: {discount}%
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
          {loading ? "Saving..." : pkg ? "Update Package" : "Add Package"}
        </Button>
      </div>
    </form>
  );
};