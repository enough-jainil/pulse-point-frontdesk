import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Filter, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const columns = [
    { key: "invoice_no", label: "INVOICE NO", sortable: true },
    { key: "customer_name", label: "CUSTOMER", sortable: true },
    { key: "customer_phone", label: "MOBILE", sortable: true },
    { key: "payment_date", label: "PAYMENT DATE", sortable: true },
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
    {
      key: "payment_mode",
      label: "MODE",
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      ),
    },
    { key: "reference_no", label: "# REF NO", sortable: true },
    { key: "remark", label: "REMARK" },
  ];

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setPayments(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch payments: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (payment: any) => {
    toast({
      title: "Edit Payment",
      description: `Editing payment ${payment.reference_no}`,
    });
  };

  const handleDelete = (payment: any) => {
    toast({
      title: "Delete Payment",
      description: `Deleting payment ${payment.reference_no}`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payments</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Payment
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={payments}
            columns={columns}
            searchPlaceholder="Search payments..."
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;