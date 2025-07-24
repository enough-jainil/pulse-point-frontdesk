import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Users, UserCheck, UserX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MemberForm } from "@/components/forms/MemberForm";

const GymMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const { toast } = useToast();

  const columns = [
    { 
      key: "member_id", 
      label: "MEMBER ID", 
      sortable: true 
    },
    {
      key: "first_name",
      label: "NAME",
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-medium text-primary">
              {value.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium">{`${row.first_name} ${row.last_name}`}</p>
            <p className="text-sm text-muted-foreground">{row.member_id}</p>
          </div>
        </div>
      ),
    },
    { key: "email", label: "EMAIL", sortable: true },
    { key: "phone", label: "PHONE", sortable: true },
    { key: "date_of_birth", label: "DOB", sortable: true },
    { key: "gender", label: "GENDER" },
    {
      key: "status",
      label: "STATUS",
      render: (value: string) => (
        <Badge variant={value === "active" ? "default" : "secondary"}>
          {value}
        </Badge>
      ),
    },
  ];

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch members: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setDialogOpen(true);
  };

  const handleDelete = async (member: any) => {
    if (!confirm(`Are you sure you want to delete ${member.first_name} ${member.last_name}?`)) return;

    try {
      const { error } = await supabase
        .from("members")
        .delete()
        .eq("id", member.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Member deleted successfully",
      });
      fetchMembers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleView = (member: any) => {
    setEditingMember(member);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingMember(null);
    setDialogOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    setFormLoading(true);
    try {
      if (editingMember) {
        const { error } = await supabase
          .from("members")
          .update(data)
          .eq("id", editingMember.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Member updated successfully",
        });
      } else {
        // Generate member ID
        const memberCount = members.length + 1;
        const memberId = `MEM${memberCount.toString().padStart(4, '0')}`;
        
        const { error } = await supabase
          .from("members")
          .insert([{ ...data, member_id: memberId }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Member added successfully",
        });
      }

      setDialogOpen(false);
      setEditingMember(null);
      fetchMembers();
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

  const activeMembers = members.filter((member: any) => member.status === "active");
  const inactiveMembers = members.filter((member: any) => member.status === "inactive");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">GYM Members</h1>
        <div className="flex gap-2">
          <Badge variant="default" className="bg-success text-success-foreground">
            Active: {activeMembers.length}
          </Badge>
          <Badge variant="secondary">
            Inactive: {inactiveMembers.length}
          </Badge>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={handleAdd}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <UserCheck className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMembers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Members</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveMembers.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Members</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={members}
            columns={columns}
            searchPlaceholder="Search members..."
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "Edit Member" : "Add New Member"}
            </DialogTitle>
          </DialogHeader>
          <MemberForm
            member={editingMember}
            onSubmit={handleFormSubmit}
            onCancel={() => setDialogOpen(false)}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GymMembers;