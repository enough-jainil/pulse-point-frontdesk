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
import { Search, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const CMSManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");

  const stories = [
    {
      id: 1,
      image: "/placeholder.svg",
      title: "Mastering the Machines: A Beginner's Guide to Gym Equipment",
      description:
        "Mastering the Machines: A Beginner's Guide to Gym Equipment Mastering the Machines: A Beginner's Guide to Gym Equipment",
      priority: 2,
      isFeatured: "Yes",
      status: "Active",
    },
    {
      id: 2,
      image: "/placeholder.svg",
      title: "MMA : A Beginner's Guide to Gym Equipment",
      description:
        "MMA : A Beginner's Guide to Gym Equipment MMA : A Beginner's Guide to Gym Equipment",
      priority: 1,
      isFeatured: "Yes",
      status: "Active",
    },
  ];

  const team = [
    {
      id: 1,
      image: "/placeholder.svg",
      name: "Amelia Slive Robert",
      designation: "Product Owner",
      description: "Product Owner",
      status: "In Active",
    },
    {
      id: 2,
      image: "/placeholder.svg",
      name: "Michel Johnson",
      designation: "CEO/Founder",
      description: "CEO/Founder",
      status: "In Active",
    },
  ];

  const gallery = [
    {
      id: 1,
      image: "/placeholder.svg",
      title: "Title Here",
      priority: 10,
      status: "Active",
    },
    {
      id: 2,
      image: "/placeholder.svg",
      title: "Title Here",
      priority: 9,
      status: "Active",
    },
    {
      id: 3,
      image: "/placeholder.svg",
      title: "Title Here",
      priority: 8,
      status: "Active",
    },
  ];

  const testimonials = [
    {
      id: 1,
      image: "/placeholder.svg",
      name: "Octane fit city member",
      designation: "Business executive",
      description:
        "It has been almost one year and I have lost weight and increased my strength. I find the coaches so motivating and supportive. During the shred I worked with Dave and he was very motivating and held me accountable. The nutritional guidance and meal plans are easy to follow and realistic and plenty of food. Everyone is extremely - REAL - supportive, FUN, KNOWLEDGABLE and challenging.",
      status: "Active",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">CMS Management</h1>
      </div>

      <Tabs defaultValue="stories" className="w-full">
        <TabsList className="grid w-fit grid-cols-5">
          <TabsTrigger
            value="stories"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Stories
          </TabsTrigger>
          <TabsTrigger value="gallery">Our Gallery</TabsTrigger>
          <TabsTrigger value="team">Our Team</TabsTrigger>
          <TabsTrigger value="testimonial">Testimonial</TabsTrigger>
          <TabsTrigger value="seo">SEO Meta</TabsTrigger>
        </TabsList>

        <TabsContent value="stories" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Story List</h2>
            <Button className="bg-primary hover:bg-primary-hover">Add</Button>
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
                    <TableHead>IMAGE</TableHead>
                    <TableHead>TITLE</TableHead>
                    <TableHead>DESCRIPTION</TableHead>
                    <TableHead>PRIORITY</TableHead>
                    <TableHead>IS FEATURED</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stories.map((story, index) => (
                    <TableRow key={story.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <span className="text-xs">IMG</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="font-medium truncate">{story.title}</p>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm text-muted-foreground truncate">
                          {story.description}
                        </p>
                      </TableCell>
                      <TableCell>{story.priority}</TableCell>
                      <TableCell>
                        <Badge className="bg-info text-info-foreground">
                          {story.isFeatured}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-info text-info-foreground">
                          {story.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-warning"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                          >
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
                  Showing 1 to {stories.length} of {stories.length} entries
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

        <TabsContent value="gallery" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Gallery List</h2>
            <Button className="bg-primary hover:bg-primary-hover">Add</Button>
          </div>

          <Card>
            <CardContent className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>IMAGE</TableHead>
                    <TableHead>TITLE</TableHead>
                    <TableHead>PRIORITY</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gallery.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <span className="text-xs">IMG</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.priority}</TableCell>
                      <TableCell>
                        <Badge className="bg-info text-info-foreground">
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-warning"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Team List</h2>
            <Button className="bg-primary hover:bg-primary-hover">Add</Button>
          </div>

          <Card>
            <CardContent className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>IMAGE</TableHead>
                    <TableHead>NAME</TableHead>
                    <TableHead>DESIGNATION</TableHead>
                    <TableHead>DESCRIPTION</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.map((member, index) => (
                    <TableRow key={member.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs">IMG</span>
                        </div>
                      </TableCell>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.designation}</TableCell>
                      <TableCell>{member.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{member.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-warning"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonial" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Testimonial List</h2>
            <Button className="bg-primary hover:bg-primary-hover">Add</Button>
          </div>

          <Card>
            <CardContent className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>IMAGE</TableHead>
                    <TableHead>NAME</TableHead>
                    <TableHead>DESIGNATION</TableHead>
                    <TableHead>DESCRIPTION</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonials.map((testimonial, index) => (
                    <TableRow key={testimonial.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs">IMG</span>
                        </div>
                      </TableCell>
                      <TableCell>{testimonial.name}</TableCell>
                      <TableCell>{testimonial.designation}</TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm truncate">
                          {testimonial.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-info text-info-foreground">
                          {testimonial.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-warning"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                SEO Meta management coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CMSManagement;
