import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const WellnessPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
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
    toast({
      title: "Edit Package",
      description: `Editing ${pkg.title}`,
    });
  };

  const handleDelete = (pkg: any) => {
    toast({
      title: "Delete Package",
      description: `Deleting ${pkg.title}`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Packages</h1>
        <Button>
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
    </div>
  );
};

export default WellnessPackages;