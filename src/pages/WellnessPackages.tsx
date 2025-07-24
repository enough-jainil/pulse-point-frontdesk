import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PackageForm } from "@/components/forms/PackageForm";

const WellnessPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const { toast } = useToast();

  const columns = [
    { key: "title", label: "TITLE", sortable: true },
    { key: "service_id", label: "SERVICE", sortable: true },
    {
      key: "sessions",
      label: "NO OF SESSIONS",
      render: (value: number) => value.toString(),
    },
    {
      key: "duration_minutes",
      label: "SLOTS",
      render: (value: number) => `${value} Minutes`,
    },
    {
      key: "mrp",
      label: "MRP",
      render: (value: number) => `₹${value.toFixed(2)}`,
    },
    {
      key: "discount",
      label: "DISCOUNT",
      render: (value: number) => `${value}%`,
    },
    {
      key: "selling_price",
      label: "SELLING PRICE",
      render: (value: number) => `₹${value.toFixed(2)}`,
    },
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
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from("wellness_packages")
        .select(`
          *,
          services (title)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Transform data to include service name
      const transformedData = data?.map(pkg => ({
        ...pkg,
        service_id: pkg.services?.title || "No Service"
      })) || [];

      setPackages(transformedData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch packages: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg: any) => {
    setEditingPackage(pkg);
    setDialogOpen(true);
  };

  const handleDelete = async (pkg: any) => {
    if (!confirm(`Are you sure you want to delete ${pkg.title}?`)) return;

    try {
      const { error } = await supabase
        .from("wellness_packages")
        .delete()
        .eq("id", pkg.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Package deleted successfully",
      });
      fetchPackages();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAdd = () => {
    setEditingPackage(null);
    setDialogOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    setFormLoading(true);
    try {
      if (editingPackage) {
        const { error } = await supabase
          .from("wellness_packages")
          .update(data)
          .eq("id", editingPackage.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Package updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("wellness_packages")
          .insert([data]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Package added successfully",
        });
      }

      setDialogOpen(false);
      setEditingPackage(null);
      fetchPackages();
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
        <h1 className="text-3xl font-bold">Packages</h1>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Package
        </Button>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Package List</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={packages}
            columns={columns}
            searchPlaceholder="Search packages..."
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
              {editingPackage ? "Edit Package" : "Add New Package"}
            </DialogTitle>
          </DialogHeader>
          <PackageForm
            package={editingPackage}
            onSubmit={handleFormSubmit}
            onCancel={() => setDialogOpen(false)}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WellnessPackages;