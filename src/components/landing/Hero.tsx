import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Users, Clock, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  "Employee Management",
  "Attendance Tracking",
  "Leave Management",
  "Payroll Insights",
];

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden gradient-hero">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-accent/5 to-transparent rounded-full" />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left column - Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium animate-fade-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              HR Management Simplified
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Every workday,{" "}
              <span className="text-accent">perfectly aligned</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
              Streamline your HR operations with OdooFlow. From onboarding to payroll,
              manage your entire workforce in one powerful, intuitive platform.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <Button variant="hero" size="xl" asChild>
                <Link to="/auth">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/auth?mode=signin">
                  Sign In
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - Visual */}
          <div className="relative lg:h-[600px] animate-fade-up" style={{ animationDelay: "0.3s" }}>
            {/* Main card */}
            <div className="relative bg-card rounded-2xl shadow-xl border border-border/50 p-6 lg:absolute lg:right-0 lg:top-8 lg:w-[400px]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-foreground">Team Overview</h3>
                  <p className="text-sm text-muted-foreground">Today's attendance</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-accent" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <div className="text-2xl font-bold text-foreground">42</div>
                  <div className="text-xs text-muted-foreground">Present</div>
                </div>
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <div className="text-2xl font-bold text-warning">3</div>
                  <div className="text-xs text-muted-foreground">On Leave</div>
                </div>
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <div className="text-2xl font-bold text-destructive">2</div>
                  <div className="text-xs text-muted-foreground">Absent</div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { name: "Sarah Johnson", role: "Product Manager", status: "present" },
                  { name: "Mike Chen", role: "Developer", status: "present" },
                  { name: "Emily Davis", role: "Designer", status: "leave" },
                ].map((employee, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                        {employee.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{employee.name}</div>
                        <div className="text-xs text-muted-foreground">{employee.role}</div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${employee.status === "present"
                        ? "bg-success/10 text-success"
                        : "bg-warning/10 text-warning"
                      }`}>
                      {employee.status === "present" ? "Present" : "On Leave"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating card - Clock */}
            <div className="hidden lg:flex absolute left-0 top-0 bg-card rounded-xl shadow-lg border border-border/50 p-4 items-center gap-3 animate-slide-in" style={{ animationDelay: "0.5s" }}>
              <div className="h-10 w-10 rounded-full gradient-accent flex items-center justify-center">
                <Clock className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">Check-in Time</div>
                <div className="text-lg font-bold text-accent">09:00 AM</div>
              </div>
            </div>

            {/* Floating card - Calendar */}
            <div className="hidden lg:flex absolute left-4 bottom-20 bg-card rounded-xl shadow-lg border border-border/50 p-4 items-center gap-3 animate-slide-in" style={{ animationDelay: "0.6s" }}>
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">Leave Balance</div>
                <div className="text-lg font-bold text-foreground">18 <span className="text-sm font-normal text-muted-foreground">days left</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}