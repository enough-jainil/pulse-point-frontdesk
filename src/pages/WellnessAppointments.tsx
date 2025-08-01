import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Appointment {
  id: string;
  appointment_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  appointment_date: string;
  appointment_time: string;
  package_id: string;
  amount: number;
  notes?: string;
  payment_status: string;
  appointment_status: string;
  wellness_packages?: {
    title: string;
  };
  package_name?: string;
}

interface Package {
  id: string;
  title: string;
  selling_price: number;
  mrp: number;
  discount: number;
  duration_minutes: number;
  sessions: number;
  status: string;
  service_id: string;
  created_at: string;
  updated_at: string;
}

const WellnessAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    appointment_date: "",
    appointment_time: "",
    package_id: "",
    notes: "",
    amount: 0,
  });
  const { toast } = useToast();

  const columns = [
    { key: "appointment_id", label: "#ID", sortable: true },
    { key: "package_name", label: "PACKAGE", sortable: true },
    { key: "customer_name", label: "CUSTOMER", sortable: true },
    { key: "customer_phone", label: "CONTACT", sortable: true },
    { key: "appointment_date", label: "DATE", sortable: true },
    { key: "appointment_time", label: "TIME", sortable: true },
    {
      key: "amount",
      label: "AMOUNT",
      render: (value: number) => `₹${value.toFixed(2)}`,
    },
    {
      key: "payment_status",
      label: "PAYMENT STATUS",
      render: (value: string) => (
        <Badge
          variant={value.toLowerCase() === "paid" ? "default" : "destructive"}
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "appointment_status",
      label: "AP. STATUS",
      render: (value: string) => (
        <Badge
          variant={
            value.toLowerCase() === "scheduled" ? "default" : "secondary"
          }
        >
          {value}
        </Badge>
      ),
    },
  ];

  useEffect(() => {
    fetchAppointments();
    fetchPackages();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
          *,
          wellness_packages (title)
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Transform data to include package name
      const transformedData =
        data?.map((appointment) => ({
          ...appointment,
          package_name: appointment.wellness_packages?.title || "No Package",
        })) || [];

      setAppointments(transformedData);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: "Failed to fetch appointments: " + errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from("wellness_packages")
        .select("*")
        .eq("status", "active");

      if (error) {
        throw error;
      }

      setPackages(data || []);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: "Failed to fetch packages: " + errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("appointments").insert({
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_email: formData.customer_email,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        package_id: formData.package_id,
        amount: formData.amount,
        payment_status: "pending",
        appointment_status: "scheduled",
        appointment_id: crypto.randomUUID(),
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Appointment booked successfully",
      });

      setBookingDialogOpen(false);
      setFormData({
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        appointment_date: "",
        appointment_time: "",
        package_id: "",
        notes: "",
        amount: 0,
      });
      fetchAppointments();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: "Failed to book appointment: " + errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      customer_name: appointment.customer_name,
      customer_phone: appointment.customer_phone,
      customer_email: appointment.customer_email || "",
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      package_id: appointment.package_id,
      notes: appointment.notes || "",
      amount: appointment.amount,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDeleteDialogOpen(true);
  };

  const handleUpdateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    try {
      const { error } = await supabase
        .from("appointments")
        .update({
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone,
          customer_email: formData.customer_email,
          appointment_date: formData.appointment_date,
          appointment_time: formData.appointment_time,
          package_id: formData.package_id,
          amount: formData.amount,
          notes: formData.notes,
        })
        .eq("id", selectedAppointment.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Appointment updated successfully",
      });

      setEditDialogOpen(false);
      setSelectedAppointment(null);
      setFormData({
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        appointment_date: "",
        appointment_time: "",
        package_id: "",
        notes: "",
        amount: 0,
      });
      fetchAppointments();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: "Failed to update appointment: " + errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedAppointment) return;

    try {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", selectedAppointment.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Appointment deleted successfully",
      });

      setDeleteDialogOpen(false);
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: "Failed to delete appointment: " + errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Book Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Book New Appointment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer_name">Customer Name *</Label>
                  <Input
                    id="customer_name"
                    value={formData.customer_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customer_name: e.target.value,
                      })
                    }
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer_phone">Phone *</Label>
                  <Input
                    id="customer_phone"
                    value={formData.customer_phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customer_phone: e.target.value,
                      })
                    }
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer_email">Email</Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_email: e.target.value })
                  }
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="package_id">Package *</Label>
                <Select
                  value={formData.package_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, package_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select package" />
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map((pkg: Package) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.title} - ₹{pkg.selling_price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appointment_date">Date *</Label>
                  <Input
                    id="appointment_date"
                    type="date"
                    value={formData.appointment_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        appointment_date: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointment_time">Time *</Label>
                  <Input
                    id="appointment_time"
                    type="time"
                    value={formData.appointment_time}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        appointment_time: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Additional notes"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setBookingDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Book Appointment</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment List</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={appointments}
            columns={columns}
            searchPlaceholder="Search appointments..."
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateAppointment} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_customer_name">Customer Name *</Label>
                <Input
                  id="edit_customer_name"
                  value={formData.customer_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customer_name: e.target.value,
                    })
                  }
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_customer_phone">Phone *</Label>
                <Input
                  id="edit_customer_phone"
                  value={formData.customer_phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customer_phone: e.target.value,
                    })
                  }
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_customer_email">Email</Label>
              <Input
                id="edit_customer_email"
                type="email"
                value={formData.customer_email}
                onChange={(e) =>
                  setFormData({ ...formData, customer_email: e.target.value })
                }
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_package_id">Package *</Label>
              <Select
                value={formData.package_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, package_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
                <SelectContent>
                  {packages.map((pkg: Package) => (
                    <SelectItem key={pkg.id} value={pkg.id}>
                      {pkg.title} - ₹{pkg.selling_price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_appointment_date">Date *</Label>
                <Input
                  id="edit_appointment_date"
                  type="date"
                  value={formData.appointment_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      appointment_date: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_appointment_time">Time *</Label>
                <Input
                  id="edit_appointment_time"
                  type="time"
                  value={formData.appointment_time}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      appointment_time: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_amount">Amount *</Label>
              <Input
                id="edit_amount"
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="Enter amount"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_notes">Notes</Label>
              <Textarea
                id="edit_notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Additional notes"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update Appointment</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              appointment for {selectedAppointment?.customer_name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WellnessAppointments;
