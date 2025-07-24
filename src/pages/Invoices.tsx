import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Filter, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    invoice_no: "",
    amount: 0,
    due_date: "",
    description: "",
  });
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
        <Badge
          variant={value.toLowerCase() === "paid" ? "default" : "destructive"}
        >
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
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: "Failed to fetch invoices: " + errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("invoices").insert({
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_email: formData.customer_email,
        invoice_no: formData.invoice_no || `INV-${Date.now()}`,
        amount: formData.amount,
        due_date: formData.due_date,
        description: formData.description,
        status: "unpaid",
        balance_due: formData.amount,
        invoice_date: new Date().toISOString().split("T")[0],
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Invoice created successfully",
      });

      setCreateDialogOpen(false);
      setFormData({
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        invoice_no: "",
        amount: 0,
        due_date: "",
        description: "",
      });
      fetchInvoices();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: "Failed to create invoice: " + errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (invoice: Record<string, unknown>) => {
    // Implementation for edit
    toast({
      title: "Edit Invoice",
      description: `Editing invoice ${invoice.invoice_no}`,
    });
  };

  const handleDelete = (invoice: Record<string, unknown>) => {
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
