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
import { Search, Eye, Edit, Trash2 } from "lucide-react";

const GymMembers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");

  const members = [
    {
      id: 1,
      name: "azim imran bhaiji",
      memberId: "9427158406",
      email: "azimpt268@gmail.com",
      dob: "2007-10-03",
      age: 17,
      gender: "Male",
      goal: "--",
      otp: "--",
      created: "2025-07-14",
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      name: "MOhammad oliya",
      memberId: "740861612",
      email: "oliyaazim@gmail.com",
      dob: "1996-09-26",
      age: 28,
      gender: "Male",
      goal: "--",
      otp: "--",
      created: "2025-07-14",
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      name: "patel safvan",
      memberId: "7016427720",
      email: "marhabapatel39@gmail.com",
      dob: "2004-08-23",
      age: 20,
      gender: "Male",
      goal: "--",
      otp: "--",
      created: "2025-07-12",
      avatar: "/placeholder.svg"
    },
    {
      id: 4,
      name: "afzal abdul patel",
      memberId: "6356206795",
      email: "patzal682@gmail.com",
      dob: "2003-02-19",
      age: 22,
      gender: "Male",
      goal: "--",
      otp: "--",
      created: "2025-07-12",
      avatar: "/placeholder.svg"
    },
    {
      id: 5,
      name: "jitendra kumar",
      memberId: "9913207604",
      email: "jturajul11@gmail.com",
      dob: "1988-01-25",
      age: 37,
      gender: "Male",
      goal: "--",
      otp: "--",
      created: "2025-07-10",
      avatar: "/placeholder.svg"
    }
  ];

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">GYM Members</h1>
        <div className="flex gap-2">
          <Badge variant="secondary">Active</Badge>
          <Badge variant="outline">In Active</Badge>
          <Button className="bg-primary hover:bg-primary-hover">
            Add Now
          </Button>
        </div>
      </div>

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
                <TableHead>NAME</TableHead>
                <TableHead>EMAIL</TableHead>
                <TableHead>DOB</TableHead>
                <TableHead>AGE</TableHead>
                <TableHead>GENDER</TableHead>
                <TableHead>GOAL</TableHead>
                <TableHead>OTP</TableHead>
                <TableHead>CREATED</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member, index) => (
                <TableRow key={member.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.memberId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.dob}</TableCell>
                  <TableCell>{member.age}</TableCell>
                  <TableCell>{member.gender}</TableCell>
                  <TableCell>{member.goal}</TableCell>
                  <TableCell>{member.otp}</TableCell>
                  <TableCell>{member.created}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-warning">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing 1 to {Math.min(parseInt(entriesPerPage), filteredMembers.length)} of {filteredMembers.length} entries
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Previous</Button>
              <Button size="sm" className="bg-primary text-primary-foreground">1</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GymMembers;