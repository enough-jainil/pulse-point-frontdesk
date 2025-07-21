import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Plus, MessageSquare, Mail, Phone, Clock } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInquiry, setEditingInquiry] = useState(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    source: "Walk In",
    status: "Open",
    convert_status: "Hot",
    notes: ""
  });

  const columns = [
    { key: "name", label: "NAME", sortable: true },
    { key: "mobile", label: "MOBILE", sortable: true },
    { key: "email", label: "EMAIL", sortable: true },
    {
      key: "source",
      label: "SOURCE",
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      render: (value: string) => (
        <Badge variant={value === "Open" ? "default" : "secondary"}>
          {value}
        </Badge>
      ),
    },
    {
      key: "convert_status",
      label: "CONVERT STATUS",
      render: (value: string) => (
        <Badge variant={value === "Hot" ? "destructive" : value === "Warm" ? "default" : "secondary"}>
          {value}
        </Badge>
      ),
    },
    { key: "inquiry_date", label: "DATE", sortable: true },
  ];

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch inquiries: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingInquiry) {
        const { error } = await supabase
          .from("inquiries")
          .update(formData)
          .eq("id", editingInquiry.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Inquiry updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("inquiries")
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "New inquiry added successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingInquiry(null);
      setFormData({
        name: "",
        email: "",
        mobile: "",
        source: "Walk In",
        status: "Open",
        convert_status: "Hot",
        notes: ""
      });
      fetchInquiries();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (inquiry: any) => {
    setEditingInquiry(inquiry);
    setFormData({
      name: inquiry.name || "",
      email: inquiry.email || "",
      mobile: inquiry.mobile || "",
      source: inquiry.source || "Walk In",
      status: inquiry.status || "Open",
      convert_status: inquiry.convert_status || "Hot",
      notes: inquiry.notes || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (inquiry: any) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      const { error } = await supabase
        .from("inquiries")
        .delete()
        .eq("id", inquiry.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Inquiry deleted successfully",
      });
      fetchInquiries();
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inquiries</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingInquiry(null);
              setFormData({
                name: "",
                email: "",
                mobile: "",
                source: "Walk In",
                status: "Open",
                convert_status: "Hot",
                notes: ""
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Inquiry
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background border">
            <DialogHeader>
              <DialogTitle>
                {editingInquiry ? "Edit Inquiry" : "Add New Inquiry"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile *</Label>
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border">
                      <SelectItem value="Walk In">Walk In</SelectItem>
                      <SelectItem value="Phone">Phone</SelectItem>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="Social Media">Social Media</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border">
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                      <SelectItem value="Follow Up">Follow Up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="convert_status">Convert Status</Label>
                  <Select value={formData.convert_status} onValueChange={(value) => setFormData({ ...formData, convert_status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border">
                      <SelectItem value="Hot">Hot</SelectItem>
                      <SelectItem value="Warm">Warm</SelectItem>
                      <SelectItem value="Cold">Cold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {editingInquiry ? "Update" : "Add"} Inquiry
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inquiries.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Inquiries</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inquiries.filter((inq: any) => inq.status === "Open").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
            <Mail className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inquiries.filter((inq: any) => inq.convert_status === "Hot").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follow-ups</CardTitle>
            <Phone className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inquiries.filter((inq: any) => inq.status === "Follow Up").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={inquiries}
            columns={columns}
            searchPlaceholder="Search inquiries..."
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Inquiries;