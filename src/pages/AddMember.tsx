import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const AddMember = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    selectedPackage: "",
    paymentMethod: "",
    amount: 0,
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePackageSelect = (packageId: string) => {
    const selectedPkg = packages.find((pkg: any) => pkg.id === packageId);
    setFormData((prev) => ({
      ...prev,
      selectedPackage: packageId,
      amount: selectedPkg ? selectedPkg.selling_price : 0,
    }));
  };
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from("membership_packages")
        .select("*")
        .eq("status", "active");

      if (error) {
        throw error;
      }

      setPackages(data || []);
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

  const handleSubmit = async () => {
    try {
      // Add member
      const { data: memberData, error: memberError } = await supabase
        .from("members")
        .insert({
          member_id: crypto.randomUUID(),
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          date_of_birth: formData.dob,
          gender: formData.gender,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          status: "active",
        })
        .select()
        .single();

      if (memberError) {
        throw memberError;
      }

      // Add membership if package selected
      if (formData.selectedPackage) {
        const { error: membershipError } = await supabase
          .from("member_memberships")
          .insert({
            member_id: memberData.id,
            package_id: formData.selectedPackage,
            start_date: new Date().toISOString().split("T")[0],
            end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0], // 1 year
            amount_paid: formData.amount,
            status: "active",
            payment_status: "paid",
          });

        if (membershipError) {
          throw membershipError;
        }
      }

      toast({
        title: "Success",
        description: "Member added successfully",
      });

      navigate("/gym/members");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: "Failed to add member: " + errorMessage,
        variant: "destructive",
      });
    }
  };

  const steps = [
    { id: 1, title: "Customer Details", subtitle: "Setup Account Details" },
    { id: 2, title: "Membership Packages", subtitle: "Add Package Info" },
    { id: 3, title: "Payment Details", subtitle: "Add Payment Details" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Add Member</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                  currentStep === step.id
                    ? "bg-primary"
                    : currentStep > step.id
                    ? "bg-success"
                    : "bg-muted-foreground"
                }`}
              >
                {step.id}
              </div>
              <div className="mt-2 text-center">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.subtitle}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="w-20 h-0.5 bg-muted-foreground mx-4 mt-[-20px]" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer*</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Add New Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name*</Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name*</Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number*</Label>
              <Input
                id="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Enter address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="Enter state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  placeholder="Enter pincode"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Membership Packages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Package*</Label>
              <Select
                value={formData.selectedPackage}
                onValueChange={handlePackageSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a membership package" />
                </SelectTrigger>
                <SelectContent>
                  {packages.length === 0 ? (
                    <SelectItem value="no-packages" disabled>
                      No packages available
                    </SelectItem>
                  ) : (
                    packages.map((pkg: any) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.name} - ₹{pkg.selling_price} ({pkg.duration_days}{" "}
                        days)
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {formData.selectedPackage && (
              <div className="p-4 bg-muted rounded-lg">
                {(() => {
                  const selectedPkg = packages.find(
                    (pkg: any) => pkg.id === formData.selectedPackage
                  );
                  return selectedPkg ? (
                    <div className="space-y-2">
                      <h3 className="font-semibold">{selectedPkg.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedPkg.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">
                          Duration: {selectedPkg.duration_days} days (
                          {selectedPkg.type})
                        </span>
                        <span className="font-semibold text-lg">
                          ₹{selectedPkg.selling_price}
                        </span>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) =>
                  handleInputChange("amount", parseFloat(e.target.value) || 0)
                }
              />
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Payment Method*</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  handleInputChange("paymentMethod", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="net_banking">Net Banking</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="finalAmount">Final Amount*</Label>
              <Input
                id="finalAmount"
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  handleInputChange("amount", parseFloat(e.target.value) || 0)
                }
                placeholder="Enter final amount"
              />
            </div>

            {formData.selectedPackage && (
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Summary</h3>
                {(() => {
                  const selectedPkg = packages.find(
                    (pkg: any) => pkg.id === formData.selectedPackage
                  );
                  return selectedPkg ? (
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Package:</span>
                        <span>{selectedPkg.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>
                          {selectedPkg.duration_days} days ({selectedPkg.type})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Method:</span>
                        <span className="capitalize">
                          {formData.paymentMethod || "Not selected"}
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-1">
                        <span>Total Amount:</span>
                        <span>₹{formData.amount}</span>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            <Button
              onClick={handleSubmit}
              className="w-full bg-primary hover:bg-primary-hover"
              disabled={
                !formData.paymentMethod ||
                !formData.selectedPackage ||
                formData.amount <= 0
              }
            >
              Complete Registration
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between max-w-2xl mx-auto">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        {currentStep < 3 ? (
          <Button
            onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
            disabled={currentStep === 3}
            className="gap-2 bg-primary hover:bg-primary-hover"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default AddMember;
