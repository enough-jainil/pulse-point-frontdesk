import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const WellnessServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleEdit = async (service: any) => {
    // For now, show a simple prompt - you can replace with a proper modal
    const newTitle = prompt("Edit service title:", service.title);
    if (!newTitle) return;

    try {
      const { error } = await supabase
        .from("services")
        .update({ title: newTitle })
        .eq("id", service.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Service updated successfully",
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

  const handleAdd = async () => {
    const title = prompt("Enter service title:");
    if (!title) return;

    const description = prompt("Enter service description:");
    
    try {
      const { error } = await supabase
        .from("services")
        .insert([{
          title,
          description: description || "",
          status: "active"
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Service added successfully",
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
    </div>
  );
};

export default WellnessServices;