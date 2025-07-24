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
import { Search, Plus, Edit, Trash2 } from "lucide-react";
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

const MembershipPackages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [packagesData, setPackagesData] = useState([]);
  const [packageFormData, setPackageFormData] = useState({
    name: "",
    description: "",
    price: 0,
    duration_days: 0,
    type: "gym",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from("membership_packages")
        .select("*")
        .order("created_at", { ascending: false });

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

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("membership_packages").insert({
        name: packageFormData.name,
        description: packageFormData.description,
        price: packageFormData.price,
        selling_price: packageFormData.price,
        duration_days: packageFormData.duration_days,
        type: packageFormData.type,
        status: "active",
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Package created successfully",
      });

      setCreateDialogOpen(false);
      setPackageFormData({
        name: "",
        description: "",
        price: 0,
        duration_days: 0,
        type: "gym",
      });
      fetchPackages();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: "Failed to create package: " + errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (pkg: any) => {
    toast({
      title: "Edit Package",
      description: `Editing package ${pkg.name}`,
    });
  };

  const handleDelete = async (pkg: any) => {
    try {
      const { error } = await supabase
        .from("membership_packages")
        .delete()
        .eq("id", pkg.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Package deleted successfully",
      });

      fetchPackages();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: "Failed to delete package: " + errorMessage,
        variant: "destructive",
      });
    }
  };

  const filteredPackages = packagesData.filter(
    (pkg: any) =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Membership Packages</h1>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Create Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Package</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePackage} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="package_name">Package Name *</Label>
                <Input
                  id="package_name"
                  value={packageFormData.name}
                  onChange={(e) =>
                    setPackageFormData({
                      ...packageFormData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter package name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="package_description">Description</Label>
                <Input
                  id="package_description"
                  value={packageFormData.description}
                  onChange={(e) =>
                    setPackageFormData({
                      ...packageFormData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter package description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="package_price">Price *</Label>
                  <Input
                    id="package_price"
                    type="number"
                    value={packageFormData.price}
                    onChange={(e) =>
                      setPackageFormData({
                        ...packageFormData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="Enter price"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration_days">Duration (Days) *</Label>
                  <Input
                    id="duration_days"
                    type="number"
                    value={packageFormData.duration_days}
                    onChange={(e) =>
                      setPackageFormData({
                        ...packageFormData,
                        duration_days: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Enter duration in days"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Package Type *</Label>
                <Select
                  value={packageFormData.type}
                  onValueChange={(value) =>
                    setPackageFormData({ ...packageFormData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gym">Gym</SelectItem>
                    <SelectItem value="pt">Personal Training</SelectItem>
                    <SelectItem value="wellness">Wellness</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Package</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
                placeholder="Search packages..."
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
                <TableHead>NAME</TableHead>
                <TableHead>TYPE</TableHead>
                <TableHead>PRICE</TableHead>
                <TableHead>DURATION</TableHead>
                <TableHead>DESCRIPTION</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPackages.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No packages found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPackages.map((pkg: any, index: number) => (
                  <TableRow key={pkg.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{pkg.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{pkg.type.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell>₹{pkg.price}</TableCell>
                    <TableCell>{pkg.duration_days} days</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {pkg.description || "No description"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          pkg.status === "active" ? "default" : "destructive"
                        }
                      >
                        {pkg.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-warning"
                          onClick={() => handleEdit(pkg)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(pkg)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing 1 to{" "}
              {Math.min(parseInt(entriesPerPage), filteredPackages.length)} of{" "}
              {filteredPackages.length} entries
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button size="sm" className="bg-primary text-primary-foreground">
                1
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MembershipPackages;
