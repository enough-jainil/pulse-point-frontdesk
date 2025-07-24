import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const OFCMemberships = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [membershipData, setMembershipData] = useState([]);
  const [packagesData, setPackagesData] = useState([]);
  const [membersData, setMembersData] = useState([]);
  const [formData, setFormData] = useState({
    member_id: "",
    package_id: "",
    start_date: "",
    end_date: "",
    amount: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchMemberships();
    fetchPackages();
    fetchMembers();
  }, []);

  const fetchMemberships = async () => {
    try {
      const { data, error } = await supabase
        .from("member_memberships")
        .select(
          `
          *,
          members (first_name, last_name, phone, email),
          membership_packages (name, price)
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setMembershipData(data || []);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: "Failed to fetch memberships: " + errorMessage,
        variant: "destructive",
      });
    }
  };

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from("membership_packages")
        .select("*")
        .eq("status", "active");

      if (error) {
        throw error;
      }

      setPackagesData(data || []);
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

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("status", "active");

      if (error) {
        throw error;
      }

      setMembersData(data || []);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: "Failed to fetch members: " + errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleAddMembership = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("member_memberships").insert({
        member_id: formData.member_id,
        package_id: formData.package_id,
        start_date: formData.start_date,
        end_date: formData.end_date,
        amount_paid: formData.amount,
        status: "active",
        payment_status: "paid",
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Membership added successfully",
      });

      setAddDialogOpen(false);
      setFormData({
        member_id: "",
        package_id: "",
        start_date: "",
        end_date: "",
        amount: 0,
      });
      fetchMemberships();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: "Failed to add membership: " + errorMessage,
        variant: "destructive",
      });
    }
  };

  // Display both dynamic and static data
  const displayMemberships =
    membershipData.length > 0
      ? membershipData.map(
          (membership: {
            id: string;
            start_date: string;
            end_date: string;
            amount_paid: number;
            status: string;
            members?: {
              first_name: string;
              last_name: string;
              phone: string;
              email: string;
            };
            membership_packages?: {
              name: string;
              price: number;
            };
          }) => ({
            id: membership.id,
            member: {
              name: `${membership.members?.first_name || ""} ${
                membership.members?.last_name || ""
              }`,
              phone: membership.members?.phone || "",
              email: membership.members?.email || "",
            },
            membership:
              membership.membership_packages?.name || "Unknown Package",
            status: membership.status,
            startDate: membership.start_date,
            endDate: membership.end_date,
            amount: membership.amount_paid,
          })
        )
      : [
          {
            id: 1,
            member: {
              name: "azim imran bhaiji",
              phone: "9427158406",
              email: "azimpt268@gmail.com",
            },
            membership: "Gym Membership 12Months (Couple)",
            status: "Active",
            startDate: "2025-07-14",
            endDate: "2026-07-14",
            amount: "16107.00",
          },
          {
            id: 2,
            member: {
              name: "MOhammad oliya",
              phone: "740861612",
              email: "oliyaazim@gmail.com",
            },
            membership: "Gym Membership 12Months (Couple)",
            status: "Active",
            startDate: "2025-07-14",
            endDate: "2026-07-14",
            amount: "16107.00",
          },
        ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Memberships</h1>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-hover">
              Add Membership
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Membership</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMembership} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="member_id">Select Member *</Label>
                <Select
                  value={formData.member_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, member_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    {membersData.map(
                      (member: {
                        id: string;
                        first_name: string;
                        last_name: string;
                        phone: string;
                      }) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.first_name} {member.last_name} -{" "}
                          {member.phone}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="package_id">Select Package *</Label>
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
                    {packagesData.map(
                      (pkg: {
                        id: string;
                        name: string;
                        price: number;
                        duration_days: number;
                      }) => (
                        <SelectItem key={pkg.id} value={pkg.id}>
                          {pkg.name} - ₹{pkg.price} ({pkg.duration_days} days)
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date *</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount Paid *</Label>
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
                  placeholder="Enter amount paid"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Membership</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="gym" className="w-full">
        <TabsList className="grid w-fit grid-cols-3">
          <TabsTrigger
            value="gym"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Gym
          </TabsTrigger>
          <TabsTrigger value="pt-service">PT Service</TabsTrigger>
          <TabsTrigger value="wellness-center">Wellness Center</TabsTrigger>
        </TabsList>

        <TabsContent value="gym" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Show</span>
                    <Select
                      value={entriesPerPage}
                      onValueChange={setEntriesPerPage}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm">entries</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>MEMBER</TableHead>
                    <TableHead>MEMBERSHIP</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead>START AT</TableHead>
                    <TableHead>END AT</TableHead>
                    <TableHead>AMOUNT</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayMemberships.map((membership, index) => (
                    <TableRow key={membership.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {membership.member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {membership.member.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {membership.member.phone}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {membership.member.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{membership.membership}</TableCell>
                      <TableCell>
                        <Badge className="bg-success text-success-foreground">
                          {membership.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{membership.startDate}</TableCell>
                      <TableCell>{membership.endDate}</TableCell>
                      <TableCell>₹{membership.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing 1 to{" "}
                  {Math.min(
                    parseInt(entriesPerPage),
                    displayMemberships.length
                  )}{" "}
                  of {displayMemberships.length} entries
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground"
                  >
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pt-service">
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                No PT Service memberships found
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wellness-center">
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                No Wellness Center memberships found
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OFCMemberships;
