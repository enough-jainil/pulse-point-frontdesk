import { useState } from "react";
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

const UpcomingRenewals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");

  const renewals = [
    {
      id: 1,
      member: {
        name: "Akil Kazi",
        phone: "9106512230",
        email: "kaziaqil@gmail.com",
        avatar: "/placeholder.svg"
      },
      membership: "Gym Membership : 12Months",
      status: "Active",
      startDate: "2024-07-15",
      endDate: "2025-07-15",
      amount: "17700.00"
    },
    {
      id: 2,
      member: {
        name: "Shakil Sallu",
        phone: "7359579542",
        email: "bhajjuwaladata@gmail.com",
        avatar: "/placeholder.svg"
      },
      membership: "Gym Membership 12Months (Couple)",
      status: "Active",
      startDate: "2024-07-15",
      endDate: "2025-07-15",
      amount: "16107.00"
    },
    {
      id: 3,
      member: {
        name: "Shakil Sallu",
        phone: "7359579542",
        email: "bhajjuwaladata@gmail.com",
        avatar: "/placeholder.svg"
      },
      membership: "Gym Membership 12Months (Couple)",
      status: "Cancelled",
      startDate: "2024-07-15",
      endDate: "2025-07-15",
      amount: "16107.00"
    },
    {
      id: 4,
      member: {
        name: "Patel Hamid",
        phone: "9898427784",
        email: "hamidbajibhai35@gmail.com",
        avatar: "/placeholder.svg"
      },
      membership: "Gym Membership : 12Months",
      status: "Active",
      startDate: "2024-07-15",
      endDate: "2025-07-15",
      amount: "17700.00"
    }
  ];

  const filteredRenewals = renewals.filter(renewal =>
    renewal.member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    renewal.member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Upcoming Renewals</h1>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <Tabs defaultValue="gym" className="w-full">
        <TabsList className="grid w-fit grid-cols-3">
          <TabsTrigger value="gym" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
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
                    <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
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
                  {filteredRenewals.map((renewal, index) => (
                    <TableRow key={renewal.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {renewal.member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{renewal.member.name}</p>
                            <p className="text-sm text-muted-foreground">{renewal.member.phone}</p>
                            <p className="text-sm text-muted-foreground">{renewal.member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{renewal.membership}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            renewal.status === "Active" 
                              ? "bg-success text-success-foreground" 
                              : "bg-destructive text-destructive-foreground"
                          }
                        >
                          {renewal.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{renewal.startDate}</TableCell>
                      <TableCell>{renewal.endDate}</TableCell>
                      <TableCell>{renewal.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing 1 to 4 of 4 entries
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button size="sm" className="bg-primary text-primary-foreground">1</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pt-service">
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                No PT Service renewals found
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wellness-center">
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                No Wellness Center renewals found
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UpcomingRenewals;