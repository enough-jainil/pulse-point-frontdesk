import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search, Filter, IndianRupee, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [salesData, setSalesData] = useState<any[]>([]);
  const [totals, setTotals] = useState({
    baseAmount: 0,
    cgstAmount: 0,
    sgstAmount: 0,
    totalAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      setLoading(true);

      // Fetch invoices from existing structure
      const { data: invoices, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform data for display using existing structure
      const transformedData =
        invoices?.map((invoice, index) => {
          // Calculate GST amounts (assuming 18% total GST, 9% CGST + 9% SGST)
          const totalAmount = Number(invoice.amount);
          const baseAmount = totalAmount / 1.18; // Remove 18% GST to get base
          const cgstAmount = baseAmount * 0.09; // 9% CGST
          const sgstAmount = baseAmount * 0.09; // 9% SGST

          return {
            id: index + 1,
            date: new Date(invoice.created_at).toISOString().split("T")[0],
            customer: invoice.customer_name,
            invoice: invoice.invoice_no,
            package: "Gym Membership", // Default since we don't have package info
            base: baseAmount.toFixed(2),
            cgst: cgstAmount.toFixed(2),
            sgst: sgstAmount.toFixed(2),
            total: totalAmount.toFixed(2),
          };
        }) || [];

      setSalesData(transformedData);

      // Calculate totals
      const totalsData = invoices?.reduce(
        (acc, invoice) => {
          const totalAmount = Number(invoice.amount);
          const baseAmount = totalAmount / 1.18;
          const cgstAmount = baseAmount * 0.09;
          const sgstAmount = baseAmount * 0.09;

          return {
            baseAmount: acc.baseAmount + baseAmount,
            cgstAmount: acc.cgstAmount + cgstAmount,
            sgstAmount: acc.sgstAmount + sgstAmount,
            totalAmount: acc.totalAmount + totalAmount,
          };
        },
        { baseAmount: 0, cgstAmount: 0, sgstAmount: 0, totalAmount: 0 }
      ) || { baseAmount: 0, cgstAmount: 0, sgstAmount: 0, totalAmount: 0 };

      setTotals(totalsData);
    } catch (error: any) {
      console.error("Error fetching reports data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch reports data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on search term
  const filteredData = salesData.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports</h1>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Base Amount</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹ {totals.baseAmount.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CGST Amount</CardTitle>
            <IndianRupee className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹ {totals.cgstAmount.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SGST Amount</CardTitle>
            <IndianRupee className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹ {totals.sgstAmount.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <IndianRupee className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹ {totals.totalAmount.toFixed(2)}
            </div>
          </CardContent>
        </Card>
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
                <TableHead>#ID</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>CUSTOMER NAME</TableHead>
                <TableHead>INVOICE NO.</TableHead>
                <TableHead>PACKAGE NAME</TableHead>
                <TableHead>BASE AMOUNT</TableHead>
                <TableHead>CGST</TableHead>
                <TableHead>SGST</TableHead>
                <TableHead>TOTAL AMOUNT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {loading ? "Loading..." : "No data available in table"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.customer}</TableCell>
                    <TableCell>{item.invoice}</TableCell>
                    <TableCell>{item.package}</TableCell>
                    <TableCell>{item.base}</TableCell>
                    <TableCell>{item.cgst}</TableCell>
                    <TableCell>{item.sgst}</TableCell>
                    <TableCell>{item.total}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredData.length > 0 ? 1 : 0} to {filteredData.length}{" "}
              of {filteredData.length} entries
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
