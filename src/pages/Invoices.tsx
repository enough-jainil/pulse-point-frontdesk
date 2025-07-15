import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Filter, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const columns = [
    { key: "invoice_date", label: "DATE", sortable: true },
    { key: "invoice_no", label: "INVOICE NO", sortable: true },
    { key: "customer_name", label: "CUSTOMER", sortable: true },
    { key: "customer_phone", label: "MOBILE", sortable: true },
    {
      key: "status",
      label: "STATUS",
      render: (value: string) => (
        <Badge variant={value.toLowerCase() === "paid" ? "default" : "destructive"}>
          {value}
        </Badge>
      ),
    },
    { key: "due_date", label: "DUE DATE", sortable: true },
    {
      key: "amount",
      label: "AMOUNT",
      render: (value: number) => `₹${value.toFixed(2)}`,
    },
    {
      key: "balance_due",
      label: "BALANCE DUE",
      render: (value: number) => `₹${value.toFixed(2)}`,
    },
  ];

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setInvoices(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch invoices: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (invoice: any) => {
    // Implementation for edit
    toast({
      title: "Edit Invoice",
      description: `Editing invoice ${invoice.invoice_no}`,
    });
  };

  const handleDelete = (invoice: any) => {
    // Implementation for delete
    toast({
      title: "Delete Invoice",
      description: `Deleting invoice ${invoice.invoice_no}`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={invoices}
            columns={columns}
            searchPlaceholder="Search invoices..."
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Invoices;