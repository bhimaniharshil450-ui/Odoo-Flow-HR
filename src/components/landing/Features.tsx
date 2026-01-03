import { 
  Users, 
  Clock, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  Shield,
  CheckCircle,
  Bell
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Employee Management",
    description: "Centralize all employee data with comprehensive profiles, document management, and organizational hierarchy.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Clock,
    title: "Attendance Tracking",
    description: "Automated check-in/check-out with real-time monitoring, overtime calculations, and detailed reports.",
    color: "bg-info/10 text-info",
  },
  {
    icon: Calendar,
    title: "Leave Management",
    description: "Streamlined leave requests with approval workflows, balance tracking, and team calendar visibility.",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: CreditCard,
    title: "Payroll Insights",
    description: "Transparent salary breakdowns, payment history, and automated payslip generation for employees.",
    color: "bg-success/10 text-success",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Powerful dashboards with attendance trends, leave patterns, and workforce analytics at a glance.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Secure RBAC ensures employees and admins see only what they need. Your data stays protected.",
    color: "bg-destructive/10 text-destructive",
  },
];

const benefits = [
  "Reduce administrative overhead by 60%",
  "Real-time workforce visibility",
  "Automated compliance tracking",
  "Seamless onboarding experience",
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need to manage your workforce
          </h2>
          <p className="text-lg text-muted-foreground">
            Dayflow brings together all your HR operations in one intuitive platform, 
            designed for both administrators and employees.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 bg-card rounded-xl border border-border/50 hover:border-accent/30 hover:shadow-lg transition-all duration-300"
            >
              <div className={`h-12 w-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Benefits bar */}
        <div className="bg-primary rounded-2xl p-8 md:p-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}