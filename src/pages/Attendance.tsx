import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  TrendingUp,
  CheckCircle,
  XCircle,
  MinusCircle
} from "lucide-react";
import { authAPI, attendanceAPI } from "@/lib/api";

const getStatusStyles = (status: string) => {
  switch (status) {
    case "present":
      return "bg-success/10 text-success";
    case "absent":
      return "bg-destructive/10 text-destructive";
    case "leave":
      return "bg-info/10 text-info";
    case "half-day":
      return "bg-warning/10 text-warning";
    case "weekend":
      return "bg-secondary text-muted-foreground";
    default:
      return "bg-secondary text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "present":
      return <CheckCircle className="h-4 w-4" />;
    case "absent":
      return <XCircle className="h-4 w-4" />;
    case "leave":
      return <Calendar className="h-4 w-4" />;
    case "half-day":
      return <MinusCircle className="h-4 w-4" />;
    default:
      return null;
  }
};

export default function Attendance() {
  const navigate = useNavigate();
  const [currentMonth] = useState("January 2024");
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [monthlyStats, setMonthlyStats] = useState({
    totalWorkingDays: 22,
    present: 0,
    absent: 0,
    leaves: 0,
    halfDays: 0,
    averageHours: "0h 0m",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = authAPI.getCurrentUser();
        if (!user) {
          navigate('/auth');
          return;
        }

        const records = await attendanceAPI.getRecords(user.id);

        // Map backend records to UI format
        // Sort by date desc
        const formatted = records.map((r: any) => ({
          date: r.date,
          day: new Date(r.date).toLocaleDateString('en-US', { weekday: 'long' }),
          checkIn: r.checkIn || '-',
          checkOut: r.checkOut || '-',
          status: r.status,
          hours: r.hoursWorked || '-'
        })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setAttendanceData(formatted);

        // Calculate stats
        const present = formatted.filter((r: any) => r.status === 'present').length;
        const absent = formatted.filter((r: any) => r.status === 'absent').length;
        const leaves = formatted.filter((r: any) => r.status === 'leave').length;
        const halfDays = formatted.filter((r: any) => r.status === 'half-day').length;

        setMonthlyStats({
          totalWorkingDays: 22, // Static for now
          present,
          absent,
          leaves,
          halfDays,
          averageHours: "8h 45m" // Static for now or calc simple average
        });

      } catch (error) {
        console.error("Failed to load attendance", error);
      }
    };
    loadData();
  }, [navigate]);

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
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            My Attendance
          </h1>
          <p className="text-muted-foreground">
            Track your daily attendance and working hours
          </p>
        </div>

        {/* Month Navigation & Stats */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Present Days</p>
                  <p className="text-3xl font-bold text-success">{monthlyStats.present}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    out of {monthlyStats.totalWorkingDays} working days
                  </p>
                </div>
                <div className="h-14 w-14 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle className="h-7 w-7 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Working Hours</p>
                  <p className="text-3xl font-bold text-foreground">{monthlyStats.averageHours}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    per day this month
                  </p>
                </div>
                <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center">
                  <Clock className="h-7 w-7 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Attendance Rate</p>
                  <p className="text-3xl font-bold text-accent">
                    {Math.round((monthlyStats.present / monthlyStats.totalWorkingDays) * 100)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    Above average
                  </p>
                </div>
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-7 w-7 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>Your detailed attendance log</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="px-4 py-2 bg-secondary rounded-lg text-sm font-medium text-foreground min-w-[140px] text-center">
                  {currentMonth}
                </div>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-6 gap-4 px-4 py-2 bg-secondary rounded-lg text-sm font-medium text-muted-foreground">
                <div>Date</div>
                <div>Day</div>
                <div>Check In</div>
                <div>Check Out</div>
                <div>Total Hours</div>
                <div>Status</div>
              </div>

              {/* Table Rows */}
              {attendanceData.map((record, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 md:grid-cols-6 gap-4 p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="text-foreground font-medium">
                    {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-muted-foreground">{record.day}</div>
                  <div className="text-foreground">
                    <span className="md:hidden text-muted-foreground text-xs mr-2">In:</span>
                    {record.checkIn}
                  </div>
                  <div className="text-foreground">
                    <span className="md:hidden text-muted-foreground text-xs mr-2">Out:</span>
                    {record.checkOut}
                  </div>
                  <div className="text-foreground">
                    <span className="md:hidden text-muted-foreground text-xs mr-2">Hours:</span>
                    {record.hours}
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <Badge className={`${getStatusStyles(record.status)} capitalize gap-1`}>
                      {getStatusIcon(record.status)}
                      {record.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Footer */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-success/10 rounded-lg">
                  <div className="text-2xl font-bold text-success">{monthlyStats.present}</div>
                  <div className="text-xs text-muted-foreground">Present</div>
                </div>
                <div className="text-center p-3 bg-destructive/10 rounded-lg">
                  <div className="text-2xl font-bold text-destructive">{monthlyStats.absent}</div>
                  <div className="text-xs text-muted-foreground">Absent</div>
                </div>
                <div className="text-center p-3 bg-warning/10 rounded-lg">
                  <div className="text-2xl font-bold text-warning">{monthlyStats.halfDays}</div>
                  <div className="text-xs text-muted-foreground">Half Days</div>
                </div>
                <div className="text-center p-3 bg-info/10 rounded-lg">
                  <div className="text-2xl font-bold text-info">{monthlyStats.leaves}</div>
                  <div className="text-xs text-muted-foreground">Leaves</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}