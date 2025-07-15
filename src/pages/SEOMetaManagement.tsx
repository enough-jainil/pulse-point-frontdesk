import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SEOMetaManagement = () => {
  const [seoData, setSeoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const columns = [
    { key: "title", label: "TITLE", sortable: true },
    { key: "meta_title", label: "META TITLE", sortable: true },
    { key: "meta_description", label: "META DESCRIPTION" },
    { key: "meta_keywords", label: "META KEYWORDS" },
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
    fetchSEOData();
  }, []);

  const fetchSEOData = async () => {
    try {
      const { data, error } = await supabase
        .from("seo_meta")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setSeoData(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch SEO data: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (seo: any) => {
    toast({
      title: "Edit SEO Meta",
      description: `Editing ${seo.title}`,
    });
  };

  const handleDelete = (seo: any) => {
    toast({
      title: "Delete SEO Meta",
      description: `Deleting ${seo.title}`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">SEO Meta List</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Meta Management</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={seoData}
            columns={columns}
            searchPlaceholder="Search SEO meta..."
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SEOMetaManagement;