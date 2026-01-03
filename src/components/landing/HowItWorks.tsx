import { UserPlus, Settings, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Account",
    description: "Sign up as an HR admin or employee. Set up your organization profile and configure basic settings.",
  },
  {
    number: "02",
    icon: Settings,
    title: "Configure Your Workspace",
    description: "Add employees, set up departments, define leave policies, and customize workflows to match your organization.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Start Managing",
    description: "Track attendance, approve leaves, view payroll insights, and access powerful analytics—all from one dashboard.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Get started in minutes
          </h2>
          <p className="text-lg text-muted-foreground">
            Dayflow is designed for simplicity. No complex setup, no steep learning curve.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-accent via-primary to-accent opacity-20" />
          
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              {/* Step number badge */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-card border-2 border-accent/20 shadow-lg mb-6 relative z-10">
                <step.icon className="h-7 w-7 text-accent" />
              </div>
              
              {/* Number */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-bold text-accent/10 z-0">
                {step.number}
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}