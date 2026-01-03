import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Clock,
  Calendar,
  LogOut,
  CheckCircle,
  XCircle,
  TrendingUp,
  Bell,
  ChevronRight,
  Play,
  Square
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authAPI, attendanceAPI, leaveAPI } from "@/lib/api";

export default function EmployeeDashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // States
  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
    halfDay: 0,
    leave: 0,
  });

  const [leaveBalance, setLeaveBalance] = useState({
    paid: 12, // Default max
    sick: 5,  // Default max
    unpaid: 0,
  });

  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const currentUser = authAPI.getCurrentUser();
        if (!currentUser) {
          navigate('/auth');
          return;
        }
        setUser(currentUser);

        // Load attendance
        const records = await attendanceAPI.getRecords(currentUser.id);

        // Calculate stats
        const stats = { present: 0, absent: 0, halfDay: 0, leave: 0 };
        records.forEach((r: any) => {
          if (r.status === 'present') stats.present++;
          else if (r.status === 'absent') stats.absent++;
          else if (r.status === 'half-day') stats.halfDay++;
          else if (r.status === 'leave') stats.leave++;
        });
        setAttendanceStats(stats);

        // Check if checked in today
        const today = new Date().toISOString().split('T')[0];
        const todayRecord = records.find((r: any) => r.date === today);

        if (todayRecord && !todayRecord.checkOut) {
          setIsCheckedIn(true);
          setCheckInTime(todayRecord.checkIn);
        } else if (todayRecord && todayRecord.checkOut) {
          setCheckInTime(todayRecord.checkIn);
        }

        // Load Leaves to calc balance
        const leaveRequests = await leaveAPI.getRequests(currentUser.id);
        const usedPaid = leaveRequests
          .filter((r: any) => r.status === 'approved' && (r.type === 'paid' || r.type === 'Paid Leave'))
          .reduce((acc: number, curr: any) => acc + (curr.days || 1), 0);
        const usedSick = leaveRequests
          .filter((r: any) => r.status === 'approved' && (r.type === 'sick' || r.type === 'Sick Leave'))
          .reduce((acc: number, curr: any) => acc + (curr.days || 1), 0);

        setLeaveBalance({
          paid: Math.max(0, 12 - usedPaid),
          sick: Math.max(0, 5 - usedSick),
          unpaid: 0
        });

        // Generate Recent Activity from combined lists
        const activities = [];
        // Add recent attendance
        records.slice(0, 3).forEach((r: any) => {
          activities.push({
            type: 'attendance',
            message: `Attendance: ${r.status}`,
            time: r.date,
            sortTime: new Date(r.date).getTime()
          });
        });
        // Add recent leave updates
        leaveRequests.slice(0, 3).forEach((r: any) => {
          activities.push({
            type: 'leave',
            message: `Leave ${r.status}: ${r.type}`,
            time: r.appliedOn || r.startDate,
            sortTime: new Date(r.appliedOn || r.startDate).getTime()
          });
        });

        const sortedActivities = activities
          .sort((a, b) => b.sortTime - a.sortTime)
          .slice(0, 4);

        setRecentActivities(sortedActivities);

      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate]);

  const handleCheckIn = async () => {
    try {
      if (!isCheckedIn) {
        const record = await attendanceAPI.checkIn(user.id);
        setIsCheckedIn(true);
        setCheckInTime(record.checkIn);
        toast({
          title: "Checked In!",
          description: `You checked in at ${record.checkIn}`,
        });
        setAttendanceStats(prev => ({ ...prev, present: prev.present + 1 }));
      } else {
        const record = await attendanceAPI.checkOut(user.id);
        setIsCheckedIn(false);
        toast({
          title: "Checked Out!",
          description: `You checked out at ${record.checkOut}. Total hours: ${record.hoursWorked}`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Action failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/');
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

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
            <Badge variant="secondary" className="hidden sm:flex">Employee</Badge>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                2
              </span>
            </Button>
            <Avatar className="h-9 w-9">
              <AvatarImage src="" alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.name.split(' ').map((n: string) => n[0]).join('')}
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
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Good morning, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your workday
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link to="/profile">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
                  <User className="h-6 w-6 text-accent" />
                </div>
                <span className="font-medium text-foreground">My Profile</span>
              </CardContent>
            </Card>
          </Link>

          <Link to="/attendance">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-info/10 flex items-center justify-center mb-3 group-hover:bg-info/20 transition-colors">
                  <Clock className="h-6 w-6 text-info" />
                </div>
                <span className="font-medium text-foreground">Attendance</span>
              </CardContent>
            </Card>
          </Link>

          <Link to="/leaves">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center mb-3 group-hover:bg-warning/20 transition-colors">
                  <Calendar className="h-6 w-6 text-warning" />
                </div>
                <span className="font-medium text-foreground">Leave Requests</span>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full" onClick={handleLogout}>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-3 group-hover:bg-destructive/20 transition-colors">
                <LogOut className="h-6 w-6 text-destructive" />
              </div>
              <span className="font-medium text-foreground">Logout</span>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Check In/Out Card */}
            <Card className="overflow-hidden">
              <CardHeader className="gradient-primary text-primary-foreground pb-8">
                <CardTitle>Today's Attendance</CardTitle>
                <CardDescription className="text-primary-foreground/70">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="-mt-4">
                <div className="bg-card rounded-xl border border-border p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <p className="text-sm text-muted-foreground mb-1">
                      {isCheckedIn ? "Checked in at" : "You haven't checked in yet"}
                    </p>
                    {isCheckedIn && checkInTime && (
                      <p className="text-2xl font-bold text-foreground">{checkInTime}</p>
                    )}
                  </div>
                  <Button
                    variant={isCheckedIn ? "destructive" : "hero"}
                    size="lg"
                    onClick={handleCheckIn}
                    className="min-w-[140px]"
                  >
                    {isCheckedIn ? (
                      <>
                        <Square className="h-4 w-4 mr-2" />
                        Check Out
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Check In
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>This Month's Attendance</span>
                  <TrendingUp className="h-5 w-5 text-success" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-success/10 rounded-lg">
                    <div className="text-2xl font-bold text-success">{attendanceStats.present}</div>
                    <div className="text-xs text-muted-foreground">Present</div>
                  </div>
                  <div className="text-center p-4 bg-destructive/10 rounded-lg">
                    <div className="text-2xl font-bold text-destructive">{attendanceStats.absent}</div>
                    <div className="text-xs text-muted-foreground">Absent</div>
                  </div>
                  <div className="text-center p-4 bg-warning/10 rounded-lg">
                    <div className="text-2xl font-bold text-warning">{attendanceStats.halfDay}</div>
                    <div className="text-xs text-muted-foreground">Half Day</div>
                  </div>
                  <div className="text-center p-4 bg-info/10 rounded-lg">
                    <div className="text-2xl font-bold text-info">{attendanceStats.leave}</div>
                    <div className="text-xs text-muted-foreground">Leave</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Leave Balance */}
            <Card>
              <CardHeader>
                <CardTitle>Leave Balance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Paid Leave</span>
                  </div>
                  <span className="text-lg font-bold text-foreground">{leaveBalance.paid}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-warning/20 flex items-center justify-center">
                      <XCircle className="h-4 w-4 text-warning" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Sick Leave</span>
                  </div>
                  <span className="text-lg font-bold text-foreground">{leaveBalance.sick}</span>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/leaves">
                    Apply for Leave
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.length > 0 ? recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                    <div className={`h-2 w-2 rounded-full mt-2 ${activity.type === 'attendance' ? 'bg-success' :
                      activity.type === 'leave' ? 'bg-warning' : 'bg-info'
                      }`} />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                )) : <div className="text-sm text-muted-foreground">No recent activity</div>}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}