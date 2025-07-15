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
import { Search } from "lucide-react";

const OFCMemberships = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");

  const memberships = [
    {
      id: 1,
      member: {
        name: "azim imran bhaiji",
        phone: "9427158406",
        email: "azimpt268@gmail.com",
        avatar: "/placeholder.svg"
      },
      membership: "Gym Membership 12Months (Couple)",
      status: "Active",
      startDate: "2025-07-14",
      endDate: "2026-07-14",
      amount: "16107.00"
    },
    {
      id: 2,
      member: {
        name: "MOhammad oliya",
        phone: "740861612",
        email: "oliyaazim@gmail.com",
        avatar: "/placeholder.svg"
      },
      membership: "Gym Membership 12Months (Couple)",
      status: "Active",
      startDate: "2025-07-14",
      endDate: "2026-07-14",
      amount: "16107.00"
    },
    {
      id: 3,
      member: {
        name: "patel safvan",
        phone: "7016427720",
        email: "marhabapatel39@gmail.com",
        avatar: "/placeholder.svg"
      },
      membership: "Gym Membership 12Months (Couple)",
      status: "Active",
      startDate: "2025-07-12",
      endDate: "2026-07-12",
      amount: "16107.00"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Memberships</h1>
        <Button className="bg-primary hover:bg-primary-hover">
          Add New
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
                  {memberships.map((membership, index) => (
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
                            <p className="font-medium">{membership.member.name}</p>
                            <p className="text-sm text-muted-foreground">{membership.member.phone}</p>
                            <p className="text-sm text-muted-foreground">{membership.member.email}</p>
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
                      <TableCell>{membership.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing 1 to {Math.min(parseInt(entriesPerPage), memberships.length)} of {memberships.length} entries
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