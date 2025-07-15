import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const WellnessAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
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
        <Badge variant={value.toLowerCase() === "paid" ? "default" : "destructive"}>
          {value}
        </Badge>
      ),
    },
    {
      key: "appointment_status",
      label: "AP. STATUS",
      render: (value: string) => (
        <Badge variant={value.toLowerCase() === "scheduled" ? "default" : "secondary"}>
          {value}
        </Badge>
      ),
    },
  ];

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          wellness_packages (title)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Transform data to include package name
      const transformedData = data?.map(appointment => ({
        ...appointment,
        package_name: appointment.wellness_packages?.title || "No Package"
      })) || [];

      setAppointments(transformedData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch appointments: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (appointment: any) => {
    toast({
      title: "Edit Appointment",
      description: `Editing appointment ${appointment.appointment_id}`,
    });
  };

  const handleDelete = (appointment: any) => {
    toast({
      title: "Delete Appointment",
      description: `Deleting appointment ${appointment.appointment_id}`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Book Appointment
        </Button>
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
    </div>
  );
};

export default WellnessAppointments;