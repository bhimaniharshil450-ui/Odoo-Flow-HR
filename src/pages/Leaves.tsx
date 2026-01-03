import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authAPI, leaveAPI } from "@/lib/api";

const getStatusStyles = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-success/10 text-success";
    case "pending":
      return "bg-warning/10 text-warning";
    case "rejected":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-secondary text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-4 w-4" />;
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "rejected":
      return <XCircle className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

export default function Leaves() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [leaveHistory, setLeaveHistory] = useState<any[]>([]);
  const [leaveBalance, setLeaveBalance] = useState({
    paid: { total: 20, used: 0, remaining: 20 },
    sick: { total: 10, used: 0, remaining: 10 },
    unpaid: { total: 0, used: 0, remaining: 0 },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = authAPI.getCurrentUser();
        if (!currentUser) {
          navigate('/auth');
          return;
        }
        setUser(currentUser);

        const requests = await leaveAPI.getRequests(currentUser.id);

        // Map API response to UI format (handle any field mismatches)
        const formattedRequests = requests.map((r: any) => ({
          ...r,
          appliedOn: r.createdAt || r.appliedOn // fallback
        })).sort((a: any, b: any) => new Date(b.appliedOn).getTime() - new Date(a.appliedOn).getTime());

        setLeaveHistory(formattedRequests);

        // Calculate balance based on approved requests
        const usedPaid = formattedRequests
          .filter((r: any) => r.status === 'approved' && (r.type === 'paid' || r.type === 'Paid Leave'))
          .reduce((acc: number, curr: any) => {
            const days = curr.days || 1;
            return acc + days;
          }, 0);

        const usedSick = formattedRequests
          .filter((r: any) => r.status === 'approved' && (r.type === 'sick' || r.type === 'Sick Leave'))
          .reduce((acc: number, curr: any) => acc + (curr.days || 1), 0);

        setLeaveBalance({
          paid: { total: 20, used: usedPaid, remaining: 20 - usedPaid },
          sick: { total: 10, used: usedSick, remaining: 10 - usedSick },
          unpaid: { total: 0, used: 0, remaining: 0 },
        });

      } catch (error) {
        console.error("Failed to load leave data", error);
      }
    };
    loadData();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await leaveAPI.createRequest({
        employeeId: user.id,
        employeeName: user.name,
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason
      });

      setIsDialogOpen(false);
      toast({
        title: "Leave request submitted",
        description: "Your leave request has been submitted for approval.",
      });
      setFormData({ type: "", startDate: "", endDate: "", reason: "" });

      // Reload data
      const requests = await leaveAPI.getRequests(user.id);
      const formattedRequests = requests.map((r: any) => ({
        ...r,
        appliedOn: r.createdAt || r.appliedOn
      })).sort((a: any, b: any) => new Date(b.appliedOn).getTime() - new Date(a.appliedOn).getTime());
      setLeaveHistory(formattedRequests);

    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "Could not submit request",
        variant: "destructive",
      });
    }
  };

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
            <span className="font-bold text-lg text-foreground">Dayflow</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Leave Management
            </h1>
            <p className="text-muted-foreground">
              Apply for leaves and track your leave balance
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero">
                <Plus className="h-4 w-4 mr-2" />
                Apply for Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
                <DialogDescription>
                  Submit a new leave request for approval
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label>Leave Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid Leave ({leaveBalance.paid.remaining} remaining)</SelectItem>
                      <SelectItem value="sick">Sick Leave ({leaveBalance.sick.remaining} remaining)</SelectItem>
                      <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Textarea
                    placeholder="Provide a reason for your leave request..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="hero">
                    Submit Request
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Leave Balance Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <Badge variant="secondary" className="bg-accent/10 text-accent">Paid</Badge>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Paid Leave</h3>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-bold text-foreground">{leaveBalance.paid.remaining}</span>
                <span className="text-muted-foreground mb-1">/ {leaveBalance.paid.total}</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all"
                  style={{ width: `${(leaveBalance.paid.remaining / leaveBalance.paid.total) * 100}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {leaveBalance.paid.used} days used this year
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-warning" />
                </div>
                <Badge variant="secondary" className="bg-warning/10 text-warning">Sick</Badge>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Sick Leave</h3>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-bold text-foreground">{leaveBalance.sick.remaining}</span>
                <span className="text-muted-foreground mb-1">/ {leaveBalance.sick.total}</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-warning rounded-full transition-all"
                  style={{ width: `${(leaveBalance.sick.remaining / leaveBalance.sick.total) * 100}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {leaveBalance.sick.used} days used this year
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <Badge variant="secondary">Unpaid</Badge>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Unpaid Leave</h3>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-bold text-foreground">∞</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full" />
              <p className="text-sm text-muted-foreground mt-2">
                Available as needed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Leave History */}
        <Card>
          <CardHeader>
            <CardTitle>Leave History</CardTitle>
            <CardDescription>Your past and upcoming leave requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaveHistory.map((leave) => (
                <div
                  key={leave.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-secondary/30 rounded-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">{leave.type}</span>
                        <Badge className={`${getStatusStyles(leave.status)} capitalize gap-1`}>
                          {getStatusIcon(leave.status)}
                          {leave.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {new Date(leave.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {leave.startDate !== leave.endDate && (
                          <> - {new Date(leave.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</>
                        )}
                        <span className="mx-2">•</span>
                        {leave.days} day{leave.days > 1 ? 's' : ''}
                      </p>
                      <p className="text-sm text-muted-foreground">{leave.reason}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground sm:text-right">
                    <span className="text-xs">Applied on</span>
                    <div>{new Date(leave.appliedOn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}