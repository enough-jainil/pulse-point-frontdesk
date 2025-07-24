import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ServiceForm } from "@/components/forms/ServiceForm";

const WellnessServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const { toast } = useToast();

  const columns = [
    { key: "title", label: "TITLE", sortable: true },
    {
      key: "image_url",
      label: "IMAGE",
      render: (value: string) => (
        value ? (
          <img src={value} alt="Service" className="w-12 h-12 rounded object-cover" />
        ) : (
          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
            <span className="text-xs">No Image</span>
          </div>
        )
      ),
    },
    { key: "description", label: "DESCRIPTION" },
    {
      key: "status",
      label: "STATUS",
      render: (value: string) => (
        <Badge variant={value.toLowerCase() === "active" ? "default" : "secondary"}>
          {value}
        </Badge>
      ),
    },
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setServices(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch services: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setDialogOpen(true);
  };

  const handleDelete = async (service: any) => {
    if (!confirm(`Are you sure you want to delete ${service.title}?`)) return;

    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", service.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
      fetchServices();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAdd = () => {
    setEditingService(null);
    setDialogOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    setFormLoading(true);
    try {
      let imageUrl = data.image_url;

      // Handle image upload if there's a file
      if (data.imageFile) {
        const fileExt = data.imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `services/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('service-images')
          .upload(filePath, data.imageFile);

        if (uploadError) {
          // Create bucket if it doesn't exist
          const { error: bucketError } = await supabase.storage.createBucket('service-images', {
            public: true
          });
          
          if (!bucketError) {
            // Retry upload
            const { error: retryUploadError } = await supabase.storage
              .from('service-images')
              .upload(filePath, data.imageFile);
            
            if (!retryUploadError) {
              const { data: urlData } = supabase.storage
                .from('service-images')
                .getPublicUrl(filePath);
              imageUrl = urlData.publicUrl;
            }
          }
        } else {
          const { data: urlData } = supabase.storage
            .from('service-images')
            .getPublicUrl(filePath);
          imageUrl = urlData.publicUrl;
        }
      }

      const serviceData = {
        title: data.title,
        description: data.description,
        image_url: imageUrl,
        status: data.status,
      };

      if (editingService) {
        const { error } = await supabase
          .from("services")
          .update(serviceData)
          .eq("id", editingService.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Service updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("services")
          .insert([serviceData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Service added successfully",
        });
      }

      setDialogOpen(false);
      setEditingService(null);
      fetchServices();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Services</h1>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Service List</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={services}
            columns={columns}
            searchPlaceholder="Search services..."
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
          </DialogHeader>
          <ServiceForm
            service={editingService}
            onSubmit={handleFormSubmit}
            onCancel={() => setDialogOpen(false)}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WellnessServices;