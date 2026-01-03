import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Camera,
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  Calendar,
  CreditCard,
  FileText,
  Edit,
  Save,
  X,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authAPI, employeeAPI } from "@/lib/api";

export default function Profile() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initial state with some defaults/mocks for fields not in API
  const [profileData, setProfileData] = useState({
    personal: {
      name: "",
      email: "",
      phone: "+1 (555) 123-4567", // Mock
      address: "123 Main Street, New York, NY 10001", // Mock
      dateOfBirth: "1990-05-15", // Mock
    },
    job: {
      employeeId: "",
      department: "",
      position: "",
      manager: "Sarah Johnson", // Mock
      joinDate: "2021-03-15", // Mock
      employmentType: "Full-time", // Mock
      workLocation: "New York Office", // Mock
    },
    salary: {
      basic: 8500,
      hra: 2000,
      transport: 500,
      bonus: 1000,
      deductions: 1200,
      net: 10800,
    },
    documents: [
      { name: "Employment Contract", date: "2021-03-15", type: "PDF" },
      { name: "ID Proof", date: "2021-03-15", type: "PDF" },
      { name: "Tax Documents", date: "2024-01-01", type: "PDF" },
    ]
  });

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = authAPI.getCurrentUser();
        if (!user) {
          navigate('/auth');
          return;
        }

        // In a real app we would fetch full profile by ID. 
        // Our simple mock backend might not have a separate getById that returns MORE than getCurrentUser.
        // But let's assume we use the user data we have + potentially an API call if needed.
        // Since we don't have a 'getProfile' endpoint, we'll use the user object + mock mixes.

        let apiUser = user;
        try {
          // Try to fetch latest data if endpoint exists (it definitely does: getById)
          const freshUser = await employeeAPI.getById(user.id);
          if (freshUser) apiUser = freshUser;
        } catch (e) {
          console.log("Could not fetch fresh user data, using session data");
        }

        setProfileData(prev => ({
          ...prev,
          personal: {
            ...prev.personal,
            name: apiUser.name,
            email: apiUser.email,
          },
          job: {
            ...prev.job,
            employeeId: `EMP-${apiUser.id}`,
            department: apiUser.department || "Engineering",
            position: apiUser.role || "Employee", // using role as position proxy if position missing
          }
        }));

        setFormData({
          phone: "+1 (555) 123-4567",
          address: "123 Main Street, New York, NY 10001"
        });
        setLoading(false);

      } catch (error) {
        console.error("Failed to load profile", error);
        setLoading(false);
      }
    };
    loadData();
  }, [navigate]);

  const handleSave = async () => {
    try {
      // Here we would call API to update profile
      // await employeeAPI.update(user.id, { phone: formData.phone, address: formData.address });

      // Update local state
      setProfileData(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          phone: formData.phone,
          address: formData.address
        }
      }));

      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Could not update profile",
        variant: "destructive"
      });
    }
  };

  if (loading) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-accent flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-lg">D</span>
            </div>
            <span className="font-bold text-lg text-foreground">OdooFlow</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden">
          <div className="h-32 gradient-primary" />
          <CardContent className="relative pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-12">
              <div className="relative">
                <Avatar className="h-28 w-28 border-4 border-card">
                  <AvatarImage src="" alt={profileData.personal.name} />
                  <AvatarFallback className="text-3xl bg-accent text-accent-foreground">
                    {profileData.personal.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-foreground">{profileData.personal.name}</h1>
                <p className="text-muted-foreground">{profileData.job.position} • {profileData.job.department}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                  <Badge variant="secondary">{profileData.job.employeeId}</Badge>
                  <Badge variant="outline">{profileData.job.employmentType}</Badge>
                </div>
              </div>
              <Button
                variant={isEditing ? "outline" : "accent"}
                onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="job">Job Details</TabsTrigger>
            <TabsTrigger value="salary">Salary</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Personal Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Full Name</Label>
                    <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{profileData.personal.name}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Email</Label>
                    <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{profileData.personal.email}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Phone</Label>
                    {isEditing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{profileData.personal.phone}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Date of Birth</Label>
                    <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {new Date(profileData.personal.dateOfBirth).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Address</Label>
                  {isEditing ? (
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{profileData.personal.address}</span>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <Button variant="hero" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Job Details Tab */}
          <TabsContent value="job">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>Your employment information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Employee ID</Label>
                    <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                      <span className="text-foreground font-medium">{profileData.job.employeeId}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Department</Label>
                    <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{profileData.job.department}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Position</Label>
                    <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{profileData.job.position}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Reporting Manager</Label>
                    <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                      <span className="text-foreground">{profileData.job.manager}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Join Date</Label>
                    <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {new Date(profileData.job.joinDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Work Location</Label>
                    <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{profileData.job.workLocation}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Salary Tab */}
          <TabsContent value="salary">
            <Card>
              <CardHeader>
                <CardTitle>Salary Structure</CardTitle>
                <CardDescription>Your monthly salary breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-6 bg-secondary/50 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-foreground">Monthly Net Salary</span>
                      <span className="text-3xl font-bold text-accent">
                        ${profileData.salary.net.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">January 2024 Payslip</div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-success" />
                        Earnings
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between p-3 bg-secondary rounded-lg">
                          <span className="text-muted-foreground">Basic Salary</span>
                          <span className="text-foreground font-medium">${profileData.salary.basic.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-secondary rounded-lg">
                          <span className="text-muted-foreground">HRA</span>
                          <span className="text-foreground font-medium">${profileData.salary.hra.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-secondary rounded-lg">
                          <span className="text-muted-foreground">Transport</span>
                          <span className="text-foreground font-medium">${profileData.salary.transport.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-secondary rounded-lg">
                          <span className="text-muted-foreground">Bonus</span>
                          <span className="text-foreground font-medium">${profileData.salary.bonus.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-destructive" />
                        Deductions
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between p-3 bg-secondary rounded-lg">
                          <span className="text-muted-foreground">Tax & Other</span>
                          <span className="text-destructive font-medium">-${profileData.salary.deductions.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Your uploaded documents and files</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profileData.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{doc.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Uploaded on {new Date(doc.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{doc.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}