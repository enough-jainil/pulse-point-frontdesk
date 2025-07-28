import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Filter, Plus, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
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
    {
      key: "actions",
      label: "ACTIONS",
      render: (_: unknown, row: Record<string, unknown>) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => generateInvoicePDF(row)}
          className="h-8"
        >
          <Download className="h-4 w-4 mr-1" />
          PDF
        </Button>
      ),
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

  const generateInvoicePDF = (invoice: any) => {
    try {
      // Create new PDF document
      const doc = new jsPDF();

      // Company/Header Information
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("O2 GYM", 20, 25);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Gym & Wellness Center", 20, 35);
      doc.text("Phone: +91-XXXXX-XXXXX", 20, 45);
      doc.text("Email: info@o2gym.com", 20, 55);

      // Invoice Title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE", 160, 25);

      // Invoice Details Box
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Invoice No: ${invoice.invoice_no}`, 160, 40);
      doc.text(
        `Date: ${new Date(invoice.invoice_date).toLocaleDateString()}`,
        160,
        50
      );
      doc.text(
        `Due Date: ${new Date(invoice.due_date).toLocaleDateString()}`,
        160,
        60
      );
      doc.text(`Status: ${invoice.status.toUpperCase()}`, 160, 70);

      // Customer Information
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Bill To:", 20, 85);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(invoice.customer_name, 20, 95);
      doc.text(`Phone: ${invoice.customer_phone}`, 20, 105);
      if (invoice.customer_email) {
        doc.text(`Email: ${invoice.customer_email}`, 20, 115);
      }

      // Invoice Items Table (Manual)
      const tableStartY = 130;
      const tableWidth = 170;
      const cellHeight = 10;
      const col1Width = 120;
      const col2Width = 50;

      // Table header
      doc.setFillColor(41, 128, 185);
      doc.rect(20, tableStartY, tableWidth, cellHeight, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Description", 25, tableStartY + 7);
      doc.text("Amount", 170, tableStartY + 7, { align: "right" });

      // Table body
      doc.setFillColor(240, 240, 240);
      doc.rect(20, tableStartY + cellHeight, tableWidth, cellHeight, "F");
      doc.rect(20, tableStartY, tableWidth, cellHeight * 2, "S");

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text(
        invoice.description || "Gym Membership",
        25,
        tableStartY + cellHeight + 7
      );
      doc.text(
        `₹${invoice.amount.toFixed(2)}`,
        185,
        tableStartY + cellHeight + 7,
        { align: "right" }
      );

      // Draw table lines
      doc.line(20, tableStartY, 190, tableStartY); // Top line
      doc.line(20, tableStartY + cellHeight, 190, tableStartY + cellHeight); // Middle line
      doc.line(
        20,
        tableStartY + cellHeight * 2,
        190,
        tableStartY + cellHeight * 2
      ); // Bottom line
      doc.line(20, tableStartY, 20, tableStartY + cellHeight * 2); // Left line
      doc.line(140, tableStartY, 140, tableStartY + cellHeight * 2); // Column separator
      doc.line(190, tableStartY, 190, tableStartY + cellHeight * 2); // Right line

      // Totals
      const finalY = tableStartY + cellHeight * 2 + 20;

      doc.setFontSize(10);
      doc.text("Subtotal:", 140, finalY);
      doc.text(`₹${invoice.amount.toFixed(2)}`, 180, finalY);

      doc.text("Tax (0%):", 140, finalY + 10);
      doc.text("₹0.00", 180, finalY + 10);

      // Total
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Total Amount:", 140, finalY + 25);
      doc.text(`₹${invoice.amount.toFixed(2)}`, 180, finalY + 25);

      if (invoice.balance_due > 0) {
        doc.setTextColor(255, 0, 0);
        doc.text("Balance Due:", 140, finalY + 40);
        doc.text(`₹${invoice.balance_due.toFixed(2)}`, 180, finalY + 40);
        doc.setTextColor(0, 0, 0);
      }

      // Footer
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("Thank you for choosing O2 GYM!", 20, 280);
      doc.text(
        "For any queries, please contact us at the above mentioned details.",
        20,
        290
      );

      // Save the PDF
      doc.save(`Invoice_${invoice.invoice_no}.pdf`);

      toast({
        title: "Success",
        description: `Invoice ${invoice.invoice_no} downloaded successfully`,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
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
