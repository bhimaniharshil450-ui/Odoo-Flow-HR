import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Clock,
  Calendar,
  LogOut,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Bell,
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  UserPlus,
  FileText,
  BarChart3
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authAPI, employeeAPI, leaveAPI } from "@/lib/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<any[]>([]);
  const [stats, setStats] = useState([
    {
      title: "Total Employees",
      value: "0",
      change: "+0 this month",
      trend: "neutral",
      icon: Users,
      color: "bg-accent/10 text-accent"
    },
    {
      title: "Present Today",
      value: "0",
      change: "0% attendance",
      trend: "neutral",
      icon: Clock,
      color: "bg-success/10 text-success"
    },
    {
      title: "Pending Leaves",
      value: "0",
      change: "Needs approval",
      trend: "neutral",
      icon: Calendar,
      color: "bg-warning/10 text-warning"
    },
    {
      title: "Payroll Due",
      value: "$0",
      change: "For January",
      trend: "neutral",
      icon: CreditCard,
      color: "bg-info/10 text-info"
    },
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = authAPI.getCurrentUser();
        if (!user) {
          navigate('/auth');
          return;
        }

        // Fetch Employees
        const emps = await employeeAPI.getAll();
        setEmployees(emps);

        // Fetch Pending Leaves 
        let allLeaves: any[] = [];
        for (const e of emps) {
          try {
            const l = await leaveAPI.getRequests(e.id);
            allLeaves = [...allLeaves, ...l];
          } catch (ignore) { }
        }
        const pending = allLeaves.filter((l: any) => l.status === 'pending');
        setPendingLeaves(pending);

        // Update stats
        setStats(prev => [
          { ...prev[0], value: emps.length.toString() },
          { ...prev[1], value: Math.floor(emps.length * 0.9).toString() },
          { ...prev[2], value: pending.length.toString() },
          { ...prev[3], value: `$${emps.length * 4500}` }
        ]);

      } catch (error) {
        console.error("Failed to load admin data", error);
      }
    };
    loadData();
  }, [navigate]);

  const handleStatusUpdate = async (leaveId: number, status: 'approved' | 'rejected') => {
    try {
      await leaveAPI.updateStatus(leaveId, status);
      setPendingLeaves(prev => prev.filter(p => p.id !== leaveId));
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/');
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-accent flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-lg">D</span>
              </div>
              <span className="font-bold text-lg text-foreground">OdooFlow</span>
            </Link>
            <Badge variant="default" className="hidden sm:flex bg-accent text-accent-foreground">
              Admin
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                {pendingLeaves.length}
              </span>
            </Button>
            <Avatar className="h-9 w-9">
              <AvatarImage src="" alt="Admin" />
              <AvatarFallback className="bg-accent text-accent-foreground">
                HR
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              HR Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your workforce and track key metrics
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </Button>
            <Button variant="accent">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  {stat.trend === "up" && <TrendingUp className="h-4 w-4 text-success" />}
                  {stat.trend === "down" && <TrendingDown className="h-4 w-4 text-destructive" />}
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.title}</div>
                <div className="text-xs text-accent mt-2">{stat.change}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Employee List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Employees</CardTitle>
                    <CardDescription>Quick overview of your team</CardDescription>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search employees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredEmployees.map((employee, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {employee.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-foreground">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {employee.position} • {employee.department}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant="secondary"
                          className={
                            employee.status === 'present' ? 'bg-success/10 text-success' :
                              employee.status === 'leave' ? 'bg-warning/10 text-warning' :
                                'bg-destructive/10 text-destructive'
                          }
                        >
                          {(employee.status || 'present').charAt(0).toUpperCase() + (employee.status || 'present').slice(1)}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                            <DropdownMenuItem>View Attendance</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4">
                  View All Employees
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Pending Leave Approvals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Pending Approvals</span>
                  <Badge variant="destructive" className="text-xs">{pendingLeaves.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingLeaves.map((leave) => (
                  <div key={leave.id} className="p-4 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {(leave.employeeName || 'User').split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium text-foreground">{leave.employeeName}</div>
                        <div className="text-xs text-muted-foreground">{leave.type}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mb-3">
                      {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="accent" size="sm" className="flex-1" onClick={() => handleStatusUpdate(leave.id, 'approved')}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleStatusUpdate(leave.id, 'rejected')}>
                        <XCircle className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <BarChart3 className="h-5 w-5 text-accent" />
                  <span className="text-xs">Analytics</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <CreditCard className="h-5 w-5 text-info" />
                  <span className="text-xs">Payroll</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Calendar className="h-5 w-5 text-warning" />
                  <span className="text-xs">Leaves</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Clock className="h-5 w-5 text-success" />
                  <span className="text-xs">Attendance</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}