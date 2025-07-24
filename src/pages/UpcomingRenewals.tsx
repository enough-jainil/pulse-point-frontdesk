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
import { Search, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const UpcomingRenewals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("gym");
  const { toast } = useToast();

  useEffect(() => {
    fetchRenewals();
  }, [activeTab]);

  const fetchRenewals = async () => {
    try {
      setLoading(true);

      // Calculate date range for upcoming renewals (next 30 days)
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      // Simply fetch all members and calculate renewals from their membership dates
      const { data: members, error } = await supabase
        .from("members")
        .select("*");

      if (error) {
        throw error;
      }

      // Calculate renewals from membership start dates
      const renewalsData = (members || [])
        .filter((member: any) => member.full_name || member.name) // Only include members with names
        .map((member: any) => {
          // Assume 30 days membership if no specific duration
          const membershipDurationDays = 30;
          const membershipStartDate = new Date(
            member.membership_start_date || member.created_at
          );
          const membershipEndDate = new Date(membershipStartDate);
          membershipEndDate.setDate(
            membershipStartDate.getDate() + membershipDurationDays
          );

          // Determine membership type based on activeTab
          let membershipType = "Gym Membership";
          if (activeTab === "pt") membershipType = "Personal Training";
          if (activeTab === "wellness") membershipType = "Wellness Center";

          return {
            id: member.id,
            member: {
              name: member.full_name || member.name || "Unknown Member",
              phone: member.phone_number || member.phone || "No phone",
              email: member.email_address || member.email || "No email",
            },
            membership: member.membership_type || membershipType,
            status: member.member_status || member.status || "active",
            start_date: membershipStartDate.toISOString().split("T")[0],
            end_date: membershipEndDate.toISOString().split("T")[0],
            calculated_end_date: membershipEndDate,
            amount: member.membership_amount || member.amount || 0,
          };
        });

      // Filter for memberships ending in the next 30 days
      const upcomingRenewals = renewalsData.filter((renewal: any) => {
        const endDate = renewal.calculated_end_date;
        return endDate >= today && endDate <= thirtyDaysFromNow;
      });

      // Sort by end date
      upcomingRenewals.sort(
        (a: any, b: any) =>
          a.calculated_end_date.getTime() - b.calculated_end_date.getTime()
      );

      setRenewals(upcomingRenewals);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: "Failed to fetch renewals: " + errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRenewals = renewals.filter(
    (renewal: any) =>
      renewal.member?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      renewal.member?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Upcoming Renewals</h1>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-fit grid-cols-3">
          <TabsTrigger
            value="gym"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Gym
          </TabsTrigger>
          <TabsTrigger value="pt">PT Service</TabsTrigger>
          <TabsTrigger value="wellness">Wellness Center</TabsTrigger>
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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                          <span className="ml-2">Loading renewals...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredRenewals.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No upcoming renewals found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRenewals.map((renewal: any, index: number) => (
                      <TableRow key={renewal.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {renewal.member?.name
                                  ?.charAt(0)
                                  .toUpperCase() || "M"}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">
                                {renewal.member?.name || "Unknown"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {renewal.member?.phone || "No phone"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {renewal.member?.email || "No email"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {renewal.membership || "Gym Membership"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              renewal.status === "active"
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }
                          >
                            {renewal.status?.toUpperCase() || "ACTIVE"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(renewal.start_date)}</TableCell>
                        <TableCell>{formatDate(renewal.end_date)}</TableCell>
                        <TableCell>₹{renewal.amount || 0}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing 1 to{" "}
                  {Math.min(parseInt(entriesPerPage), filteredRenewals.length)}{" "}
                  of {filteredRenewals.length} entries
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

        <TabsContent value="pt" className="space-y-4">
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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                          <span className="ml-2">Loading renewals...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredRenewals.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No upcoming PT Service renewals found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRenewals.map((renewal: any, index: number) => (
                      <TableRow key={renewal.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {renewal.member?.name
                                  ?.charAt(0)
                                  .toUpperCase() || "M"}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">
                                {renewal.member?.name || "Unknown"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {renewal.member?.phone || "No phone"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {renewal.member?.email || "No email"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {renewal.membership || "Personal Training"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              renewal.status === "active"
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }
                          >
                            {renewal.status?.toUpperCase() || "ACTIVE"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(renewal.start_date)}</TableCell>
                        <TableCell>{formatDate(renewal.end_date)}</TableCell>
                        <TableCell>₹{renewal.amount || 0}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing 1 to{" "}
                  {Math.min(parseInt(entriesPerPage), filteredRenewals.length)}{" "}
                  of {filteredRenewals.length} entries
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

        <TabsContent value="wellness" className="space-y-4">
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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                          <span className="ml-2">Loading renewals...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredRenewals.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No upcoming Wellness Center renewals found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRenewals.map((renewal: any, index: number) => (
                      <TableRow key={renewal.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {renewal.member?.name
                                  ?.charAt(0)
                                  .toUpperCase() || "M"}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">
                                {renewal.member?.name || "Unknown"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {renewal.member?.phone || "No phone"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {renewal.member?.email || "No email"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {renewal.membership || "Wellness Center"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              renewal.status === "active"
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }
                          >
                            {renewal.status?.toUpperCase() || "ACTIVE"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(renewal.start_date)}</TableCell>
                        <TableCell>{formatDate(renewal.end_date)}</TableCell>
                        <TableCell>₹{renewal.amount || 0}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing 1 to{" "}
                  {Math.min(parseInt(entriesPerPage), filteredRenewals.length)}{" "}
                  of {filteredRenewals.length} entries
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
      </Tabs>
    </div>
  );
};

export default UpcomingRenewals;
