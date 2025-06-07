"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  CreditCard,
  Settings,
  Save,
  Camera,
  Globe,
  Shield,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  avatar: string;
  website: string;
  linkedin: string;
  twitter: string;
  specialization: string;
  experience: string;
  location: string;
  timezone: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  newEnrollments: boolean;
  courseReviews: boolean;
  studentMessages: boolean;
  marketingEmails: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
}

interface PayoutSettings {
  paypalEmail: string;
  stripeAccountId: string;
  preferredMethod: string;
  minimumPayout: number;
  currency: string;
}

export default function InstructorSettingsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profileForm, setProfileForm] = useState<ProfileData>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
    website: "",
    linkedin: "",
    twitter: "",
    specialization: "",
    experience: "",
    location: "",
    timezone: "UTC"
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    newEnrollments: true,
    courseReviews: true,
    studentMessages: true,
    marketingEmails: false,
    weeklyReports: true,
    monthlyReports: true
  });

  const [payoutSettings, setPayoutSettings] = useState<PayoutSettings>({
    paypalEmail: "",
    stripeAccountId: "",
    preferredMethod: "stripe",
    minimumPayout: 50,
    currency: "USD"
  });

  // Mock query for instructor settings
  const { data: instructorSettings, isLoading } = useQuery({
    queryKey: ["instructor-settings"],
    queryFn: async () => {
      // This would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        profile: profileForm,
        notifications,
        payouts: payoutSettings
      };
    },
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileData) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["instructor-settings"] });
    },
    onError: () => {
      toast.error("Failed to update profile. Please try again.");
    }
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: typeof passwordForm) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (data.newPassword !== data.confirmPassword) {
        throw new Error("Passwords don't match");
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Password updated successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update password. Please try again.");
    }
  });

  const updateNotificationsMutation = useMutation({
    mutationFn: async (data: NotificationSettings) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return data;
    },
    onSuccess: () => {
      toast.success("Notification preferences updated!");
    }
  });

  const updatePayoutsMutation = useMutation({
    mutationFn: async (data: PayoutSettings) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      toast.success("Payout settings updated!");
    },
    onError: () => {
      toast.error("Failed to update payout settings. Please try again.");
    }
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileForm);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePasswordMutation.mutate(passwordForm);
  };

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    const newNotifications = { ...notifications, [key]: value };
    setNotifications(newNotifications);
    updateNotificationsMutation.mutate(newNotifications);
  };

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePayoutsMutation.mutate(payoutSettings);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your instructor profile and account preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        {profileForm.avatar ? (
                          <img 
                            src={profileForm.avatar} 
                            alt="Profile" 
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-medium text-gray-600 dark:text-gray-300">
                            {profileForm.firstName[0]}{profileForm.lastName[0]}
                          </span>
                        )}
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        className="absolute bottom-0 right-0 rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Profile Photo</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Upload a professional photo that represents you well
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell students about yourself and your expertise..."
                      rows={4}
                    />
                  </div>

                  {/* Professional Information */}
                  <Separator />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Professional Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        value={profileForm.specialization}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, specialization: e.target.value }))}
                        placeholder="e.g., Web Development, Data Science"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Select 
                        value={profileForm.experience} 
                        onValueChange={(value) => setProfileForm(prev => ({ ...prev, experience: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2">1-2 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="6-10">6-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileForm.location}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="City, Country"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select 
                        value={profileForm.timezone} 
                        onValueChange={(value) => setProfileForm(prev => ({ ...prev, timezone: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="EST">Eastern Time</SelectItem>
                          <SelectItem value="PST">Pacific Time</SelectItem>
                          <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                          <SelectItem value="CET">Central European Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Social Links */}
                  <Separator />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Social Links</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={profileForm.website}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://your-website.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={profileForm.linkedin}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, linkedin: e.target.value }))}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        value={profileForm.twitter}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, twitter: e.target.value }))}
                        placeholder="https://twitter.com/yourusername"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={updateProfileMutation.isPending}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                          placeholder="Enter current password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                          placeholder="Enter new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="Confirm new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={updatePasswordMutation.isPending}
                      >
                        {updatePasswordMutation.isPending ? "Updating..." : "Update Password"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Account Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button variant="outline">
                        Enable 2FA
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Login Sessions</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Manage your active login sessions
                        </p>
                      </div>
                      <Button variant="outline">
                        View Sessions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Course Notifications</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Enrollments</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        When students enroll in your courses
                      </p>
                    </div>
                    <Switch
                      checked={notifications.newEnrollments}
                      onCheckedChange={(checked) => handleNotificationChange('newEnrollments', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Course Reviews</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        When students leave reviews on your courses
                      </p>
                    </div>
                    <Switch
                      checked={notifications.courseReviews}
                      onCheckedChange={(checked) => handleNotificationChange('courseReviews', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Student Messages</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        When students send you messages
                      </p>
                    </div>
                    <Switch
                      checked={notifications.studentMessages}
                      onCheckedChange={(checked) => handleNotificationChange('studentMessages', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Reports & Updates</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Weekly Reports</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Weekly summary of your course performance
                      </p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) => handleNotificationChange('weeklyReports', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Monthly Reports</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Monthly earnings and analytics reports
                      </p>
                    </div>
                    <Switch
                      checked={notifications.monthlyReports}
                      onCheckedChange={(checked) => handleNotificationChange('monthlyReports', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Tips, best practices, and platform updates
                      </p>
                    </div>
                    <Switch
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payout Settings */}
          <TabsContent value="payouts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payout Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayoutSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="preferredMethod">Preferred Payout Method</Label>
                    <Select 
                      value={payoutSettings.preferredMethod} 
                      onValueChange={(value) => setPayoutSettings(prev => ({ ...prev, preferredMethod: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payout method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {payoutSettings.preferredMethod === 'paypal' && (
                    <div className="space-y-2">
                      <Label htmlFor="paypalEmail">PayPal Email</Label>
                      <Input
                        id="paypalEmail"
                        type="email"
                        value={payoutSettings.paypalEmail}
                        onChange={(e) => setPayoutSettings(prev => ({ ...prev, paypalEmail: e.target.value }))}
                        placeholder="Enter your PayPal email"
                      />
                    </div>
                  )}

                  {payoutSettings.preferredMethod === 'stripe' && (
                    <div className="space-y-2">
                      <Label htmlFor="stripeAccount">Stripe Account</Label>
                      <div className="flex gap-2">
                        <Input
                          id="stripeAccount"
                          value={payoutSettings.stripeAccountId}
                          onChange={(e) => setPayoutSettings(prev => ({ ...prev, stripeAccountId: e.target.value }))}
                          placeholder="Stripe account ID"
                          disabled
                        />
                        <Button type="button" variant="outline">
                          Connect Stripe
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="minimumPayout">Minimum Payout Amount</Label>
                      <Input
                        id="minimumPayout"
                        type="number"
                        min="10"
                        value={payoutSettings.minimumPayout}
                        onChange={(e) => setPayoutSettings(prev => ({ ...prev, minimumPayout: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select 
                        value={payoutSettings.currency} 
                        onValueChange={(value) => setPayoutSettings(prev => ({ ...prev, currency: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Payout Information</h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• Payouts are processed weekly on Fridays</li>
                      <li>• You keep 85% of the course price after platform fees</li>
                      <li>• Minimum payout threshold must be met to receive payments</li>
                      <li>• Tax documents will be provided at year-end</li>
                    </ul>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={updatePayoutsMutation.isPending}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {updatePayoutsMutation.isPending ? "Saving..." : "Save Payout Settings"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
