import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
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
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/lib/api";

type AuthMode = "signin" | "signup";
type UserRole = "employee" | "admin";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [mode, setMode] = useState<AuthMode>(
    searchParams.get("mode") === "signin" ? "signin" : "signup"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("employee");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signin") {
        await authAPI.login(email, password);
        toast({
          title: "Welcome back!",
          description: "Redirecting to your dashboard...",
        });

        // Get user to check role
        const user = authAPI.getCurrentUser();
        navigate(user?.role === 'admin' ? "/admin" : "/dashboard");
      } else {
        await authAPI.register(email, password, name || email.split('@')[0], role);
        toast({
          title: "Account created!",
          description: "You have been successfully registered.",
        });
        navigate(role === 'admin' ? "/admin" : "/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-10 w-10 rounded-lg gradient-accent flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-xl">D</span>
              </div>
              <span className="font-bold text-2xl text-foreground">OdooFlow</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "signin"
                ? "Sign in to access your dashboard"
                : "Get started with OdooFlow today"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {mode === "signup" && (
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long
                </p>
              )}
            </div>

            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="role" className="text-foreground">Role</Label>
                <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Select your role" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="admin">HR / Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button
              type="submit"
              variant="hero"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading
                ? "Please wait..."
                : mode === "signin"
                  ? "Sign In"
                  : "Create Account"}
            </Button>
          </form>

          {/* Toggle mode */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="text-accent hover:underline font-medium"
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex flex-1 gradient-primary items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-accent/20 mb-6">
              <Briefcase className="h-10 w-10 text-accent" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Streamline your HR operations
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Manage attendance, leaves, payroll, and more—all in one powerful platform designed for modern workplaces.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12">
            <div>
              <div className="text-3xl font-bold text-accent">10k+</div>
              <div className="text-sm text-primary-foreground/60">Organizations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">500k+</div>
              <div className="text-sm text-primary-foreground/60">Employees</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">99.9%</div>
              <div className="text-sm text-primary-foreground/60">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}