'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Trophy, 
  Star, 
  Award, 
  TrendingUp, 
  Users, 
  Zap,
  Target,
  Crown,
  Medal,
  Shield,
  Rocket,
  Gem,
  Lightbulb,
  CheckCircle,
  Clock,
  BarChart3,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useStudentQueries } from '@/hooks/useStudentQueries';

export default function GamificationPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'leaderboard' | 'rewards'>('overview');
  
  const { useGamificationData, useRedeemReward } = useStudentQueries();
  const { data: gamificationResponse, isLoading, error, refetch } = useGamificationData();
  const redeemRewardMutation = useRedeemReward();

  const gamificationData = gamificationResponse?.data;
  const { profile, badges = [], leaderboard = [], rewards = [], recentActivities = [], analytics } = gamificationData || {};

  const handleRedeemReward = (reward: any) => {
    if (!reward.available) {
      toast.error('This reward is not currently available');
      return;
    }

    if (profile && profile.points >= reward.cost) {
      redeemRewardMutation.mutate(reward.id);
    } else {
      const pointsNeeded = reward.cost - (profile?.points || 0);
      toast.error(`Not enough points for ${reward.name}. Need ${pointsNeeded} more points.`);
    }
  };

  const earnedBadges = badges.filter((badge: any) => badge.earned);
  const pointsToNextLevel = Math.max(0, (profile?.nextLevelPoints || 0) - (profile?.points || 0));
  const progressPercentage = profile?.nextLevelPoints 
    ? Math.min(100, ((profile?.points || 0) / profile.nextLevelPoints) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <div className="text-lg text-muted-foreground">Loading gamification data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <div className="text-lg text-foreground">Error Loading Data</div>
            <p className="text-sm text-muted-foreground mt-2">Failed to load gamification data. Please try again.</p>
            <Button onClick={() => refetch()} variant="outline" className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!gamificationData) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-lg text-foreground">No Data Available</div>
            <p className="text-sm text-muted-foreground mt-2">Gamification data will be available soon.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl bg-primary p-6 text-white sm:p-8"
      >
        {/* Soft solid shapes (no gradients) */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/5" />
          <div className="absolute -bottom-24 -left-12 h-72 w-72 rounded-full bg-white/5" />
        </div>

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">Gamification Hub</span>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Level Up Your Learning</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/75">
              Earn points, unlock badges, and climb the leaderboard by completing assignments and staying active.
            </p>
          </div>
          <Button onClick={() => refetch()} variant="varsecondary" className="gap-2">
            <Clock size={16} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/60">Current Level</p>
                <p className="mt-1 text-2xl font-bold text-white">Level {profile?.level || 1}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white">
                <TrendingUp size={18} />
              </div>
            </div>
            <div className="mt-3">
              <Progress value={progressPercentage} className="h-1.5" />
              <div className="flex justify-between text-xs text-white/60 mt-1">
                <span>{profile?.points || 0} pts</span>
                <span>{pointsToNextLevel} to next level</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/60">Total Points</p>
                <p className="mt-1 text-2xl font-bold text-white">{profile?.points?.toLocaleString() || 0}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-white">
                <Star size={18} />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-white/60">
              <Zap size={12} className="text-accent-300" />
              <span>{profile?.streak || 0} day streak</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/60">Badges Earned</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {earnedBadges.length}/{badges.length || 0}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white">
                <Award size={18} />
              </div>
            </div>
            <div className="text-xs text-white/60 mt-2">
              {analytics?.badgeSummary?.totalPointsFromBadges || 0} pts from badges
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/60">Class Rank</p>
                <p className="mt-1 text-2xl font-bold text-white">#{profile?.rank || 1}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white">
                <Crown size={18} />
              </div>
            </div>
            <div className="text-xs text-white/60 mt-2">
              Top {profile?.totalStudents ? Math.round((profile.rank / profile.totalStudents) * 100) : 0}% of class
            </div>
          </div>
        </div>
      </motion.section>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-6">
        <TabsList className="bg-card/50 border border-border/70">
          <TabsTrigger value="overview" className="gap-2">
            <Target size={14} />
            Overview
          </TabsTrigger>
          <TabsTrigger value="badges" className="gap-2">
            <Medal size={14} />
            Badges
            {earnedBadges.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                {earnedBadges.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="gap-2">
            <Users size={14} />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="rewards" className="gap-2">
            <Gem size={14} />
            Rewards
            {rewards.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                {rewards.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress Overview */}
            <DashboardCard
              title="Progress Tracking"
              subtitle="Your learning journey progress and milestones"
              icon={<Target size={18} />}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-border/70 bg-background/60 p-3 text-center">
                    <p className="text-xl font-bold text-foreground">{earnedBadges.length}</p>
                    <p className="text-xs text-muted-foreground">Badges</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/60 p-3 text-center">
                    <p className="text-xl font-bold text-foreground">{profile?.streak || 0}</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/60 p-3 text-center">
                    <p className="text-xl font-bold text-foreground">{profile?.attendance || 0}%</p>
                    <p className="text-xs text-muted-foreground">Attendance</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Average Grade</span>
                    <span className="font-medium">{profile?.averageGrade || 0}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Class Rank</span>
                    <span className="font-medium">#{profile?.rank || 1} of {profile?.totalStudents || 1}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Points Earned</span>
                    <span className="font-medium">{analytics?.activityPoints?.allTime || 0}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="rounded-2xl bg-primary/10 p-3 text-center">
                    <p className="text-sm font-semibold text-primary">7-Day</p>
                    <p className="text-lg font-bold">+{analytics?.activityPoints?.last7Days || 0}</p>
                  </div>
                  <div className="rounded-2xl bg-accent/10 p-3 text-center">
                    <p className="text-sm font-semibold text-accent">30-Day</p>
                    <p className="text-lg font-bold">+{analytics?.activityPoints?.last30Days || 0}</p>
                  </div>
                </div>

                <Button className="w-full gap-2">
                  <Rocket size={16} />
                  View Daily Challenges
                </Button>
              </div>
            </DashboardCard>

            {/* Recent Activities */}
            <DashboardCard
              title="Recent Activities"
              subtitle="Your recent achievements and activities"
              icon={<Clock size={18} />}
            >
              <div className="space-y-2">
                {recentActivities.length > 0 ? (
                  recentActivities.slice(0, 5).map((activity: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                          activity.type === 'badge' ? 'bg-accent/15 text-accent' :
                          activity.type === 'assignment' ? 'bg-primary/10 text-primary' :
                          activity.type === 'streak' ? 'bg-emerald-500/10 text-emerald-600' :
                          'bg-secondary-200 text-secondary-800'
                        }`}>
                          {activity.type === 'badge' && <Medal size={14} />}
                          {activity.type === 'assignment' && <Lightbulb size={14} />}
                          {activity.type === 'streak' && <Zap size={14} />}
                          {activity.type === 'quiz' && <Target size={14} />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        +{activity.points}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No recent activities yet</p>
                  </div>
                )}
              </div>
            </DashboardCard>
          </div>
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          {/* Earned Badges */}
          <DashboardCard
            title={`Earned Badges (${earnedBadges.length})`}
            subtitle="Badges you've unlocked through your achievements"
            icon={<Medal size={18} />}
          >
            {earnedBadges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {earnedBadges.map((badge: any) => (
                  <div
                    key={badge.id}
                    className="text-center rounded-2xl border border-accent/20 bg-accent/5 p-4"
                  >
                    <div className="text-3xl mb-2">{badge.icon || '🏆'}</div>
                    <p className="text-sm font-semibold text-foreground">{badge.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                    <Badge variant="default" className="mt-2 bg-green-100 text-green-700">
                      +{badge.points} pts
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Medal className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No badges earned yet</p>
              </div>
            )}
          </DashboardCard>

          {/* Available Badges */}
          {badges.filter((b: any) => !b.earned).length > 0 && (
            <DashboardCard
              title={`Available Badges (${badges.filter((b: any) => !b.earned).length})`}
              subtitle="Badges you can still earn"
              icon={<Shield size={18} />}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {badges.filter((b: any) => !b.earned).map((badge: any) => (
                  <div
                    key={badge.id}
                    className="text-center rounded-2xl border border-border/70 bg-background/60 p-4 opacity-60"
                  >
                    <div className="text-3xl mb-2 text-muted-foreground">{badge.icon || '🔒'}</div>
                    <p className="text-sm font-semibold text-foreground">{badge.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                    <Badge variant="outline" className="mt-2">
                      Locked
                    </Badge>
                  </div>
                ))}
              </div>
            </DashboardCard>
          )}
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <DashboardCard
            title="Class Leaderboard"
            subtitle="See how you rank among your classmates"
            icon={<Crown size={18} />}
          >
            {leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.map((student: any, idx: number) => {
                  const isCurrent = student.name === profile?.name;
                  return (
                    <div
                      key={student.rank}
                      className={`flex items-center justify-between rounded-2xl p-4 ${
                        isCurrent
                          ? 'border-2 border-primary/30 bg-primary/5'
                          : 'border border-border/70 bg-background/60'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 text-center font-bold ${
                          idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-muted-foreground' : idx === 2 ? 'text-amber-600' : 'text-muted-foreground'
                        }`}>
                          #{student.rank}
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {student.name?.charAt(0) || 'S'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">
                            {student.name}
                            {isCurrent && <Badge variant="secondary" className="ml-2">You</Badge>}
                          </p>
                          <p className="text-xs text-muted-foreground">Level {student.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">{student.points.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No leaderboard data available</p>
              </div>
            )}
          </DashboardCard>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <DashboardCard
            title="Available Rewards"
            subtitle="Redeem your points for exciting rewards"
            icon={<Gem size={18} />}
          >
            {rewards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewards.map((reward: any) => {
                  const canAfford = (profile?.points || 0) >= reward.cost;
                  const isAvailable = reward.available;
                  
                  return (
                    <div
                      key={reward.id}
                      className={`rounded-2xl border p-5 ${
                        canAfford && isAvailable
                          ? 'border-emerald-500/30 bg-emerald-500/5'
                          : 'border-border/70 bg-background/60'
                      }`}
                    >
                      <div className="text-center mb-4">
                        <div className="text-4xl mb-2">🎁</div>
                        <h3 className="font-semibold text-foreground">{reward.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{reward.description}</p>
                      </div>
                      <div className="text-center mb-4">
                        <p className="text-2xl font-bold text-primary">{reward.cost}</p>
                        <p className="text-xs text-muted-foreground">points required</p>
                      </div>
                      <Button
                        onClick={() => isAvailable && handleRedeemReward(reward)}
                        disabled={!isAvailable || !canAfford}
                        className="w-full"
                        variant={canAfford && isAvailable ? "default" : "outline"}
                      >
                        {!isAvailable ? 'Coming Soon' : !canAfford ? 'Need More Points' : 'Redeem Now'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Gem className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No rewards available yet</p>
              </div>
            )}
          </DashboardCard>

          {/* How to Earn Points */}
          <DashboardCard
            title="How to Earn Points"
            subtitle="Ways to boost your score"
            icon={<Lightbulb size={18} />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 p-3">
                <span className="text-sm">Complete assignments</span>
                <Badge className="bg-green-100 text-green-700">+10 pts</Badge>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 p-3">
                <span className="text-sm">Perfect attendance</span>
                <Badge className="bg-green-100 text-green-700">+50 pts</Badge>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 p-3">
                <span className="text-sm">Achieve high grades</span>
                <Badge className="bg-green-100 text-green-700">+5 pts per A</Badge>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 p-3">
                <span className="text-sm">Earn badges</span>
                <Badge className="bg-green-100 text-green-700">+25-100 pts</Badge>
              </div>
            </div>
          </DashboardCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Dashboard Card Component
interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
}

function DashboardCard({ title, subtitle, icon, action, children }: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="rounded-3xl border border-border/70 bg-card/95 p-5 shadow-sm backdrop-blur-sm"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-card-foreground">{title}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      {children}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}