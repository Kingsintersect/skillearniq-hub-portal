'use client'
import React, { useState, useEffect } from 'react';
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
  BarChart3
} from 'lucide-react';
import { useStudentQueries } from '@/hooks/useStudentQueries';

export const GamificationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'leaderboard' | 'rewards'>('overview');
  
  const { useGamificationData, useRedeemReward } = useStudentQueries();
  const { data: gamificationResponse, isLoading, error, refetch } = useGamificationData();
  const redeemRewardMutation = useRedeemReward();

  const gamificationData = gamificationResponse?.data;
  const { profile, badges = [], leaderboard = [], rewards = [], recentActivities = [], analytics } = gamificationData || {};

  console.log('Gamification data:', gamificationData);
  console.log('Rewards data:', rewards);

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

  const handleRefresh = () => {
    refetch();
    toast.info('Refreshing leaderboard data...');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div className="text-lg font-medium">Loading gamification data...</div>
          <p className="text-sm text-muted-foreground">Fetching your achievements and rankings</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-12 space-y-4">
            <Trophy className="h-12 w-12 text-red-500 mx-auto" />
            <h3 className="text-lg font-semibold text-foreground">Error Loading Data</h3>
            <p className="text-muted-foreground">Failed to load gamification data. Please try again.</p>
            <Button onClick={handleRefresh} variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!gamificationData) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12 space-y-4">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-semibold text-foreground">No Data Available</h3>
            <p className="text-muted-foreground">Gamification data will be available soon.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const earnedBadges = badges.filter((badge: any) => badge.earned);
  const pointsToNextLevel = Math.max(0, (profile?.nextLevelPoints || 0) - (profile?.points || 0));
  const progressPercentage = profile?.nextLevelPoints 
    ? Math.min(100, ((profile?.points || 0) / profile.nextLevelPoints) * 100)
    : 0;

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        {/* Header with Refresh Button */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-2xl mb-4 shadow-lg">
              <Trophy className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Gamification Hub</h1>
            <p className="text-lg text-muted-foreground">Level up your learning journey with points, badges, and rewards!</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="gap-2">
            <Clock className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 border-primary/10 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Current Level</p>
                  <p className="text-2xl font-bold text-foreground">Level {profile?.level}</p>
                  <Progress 
                    value={progressPercentage} 
                    className="h-2 mt-3" 
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{profile?.points || 0} points</span>
                    <span>{pointsToNextLevel} to next level</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-500/10 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Points</p>
                  <p className="text-2xl font-bold text-foreground">{profile?.points?.toLocaleString() || 0}</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-muted-foreground">
                      {profile?.streak || 0} day streak
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-500/10 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Badges Earned</p>
                  <p className="text-2xl font-bold text-foreground">
                    {earnedBadges.length}/{badges.length || 0}
                  </p>
                  <div className="text-sm text-muted-foreground mt-2">
                    {analytics?.badgeSummary?.totalPointsFromBadges || 0} points from badges
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                  <Award className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-500/10 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Class Rank</p>
                  <p className="text-2xl font-bold text-foreground">#{profile?.rank}</p>
                  <div className="text-sm text-muted-foreground mt-2">
                    Top {profile?.totalStudents ? Math.round((profile.rank / profile.totalStudents) * 100) : 0}% of class
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                  <Crown className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Summary */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">7-Day Activity</p>
                      <p className="text-2xl font-bold text-blue-600">
                        +{analytics?.activityPoints?.last7Days || 0}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-400" />
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">30-Day Activity</p>
                      <p className="text-2xl font-bold text-green-600">
                        +{analytics?.activityPoints?.last30Days || 0}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-400" />
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">All-Time Points</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {analytics?.activityPoints?.allTime || 0}
                      </p>
                    </div>
                    <Trophy className="h-8 w-8 text-purple-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Medal className="h-4 w-4" />
              Badges
              {earnedBadges.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {earnedBadges.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Gem className="h-4 w-4" />
              Rewards
              {rewards.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {rewards.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <GamificationOverview 
              profile={profile}
              badges={badges}
              leaderboard={leaderboard}
              recentActivities={recentActivities}
              analytics={analytics}
            />
          </TabsContent>

          <TabsContent value="badges">
            <BadgesView badges={badges} />
          </TabsContent>

          <TabsContent value="leaderboard">
            <LeaderboardView 
              leaderboard={leaderboard} 
              currentStudentName={profile?.name ?? ''} 
            />
          </TabsContent>

          <TabsContent value="rewards">
            <RewardsView 
              rewards={rewards} 
              studentPoints={profile?.points || 0} 
              onRedeem={handleRedeemReward} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Overview Component
const GamificationOverview: React.FC<{ 
  profile: any; 
  badges: any[]; 
  leaderboard: any[];
  recentActivities: any[];
  analytics: any;
}> = ({ profile, badges, leaderboard, recentActivities, analytics }) => {
  const earnedBadges = badges.filter((badge: any) => badge.earned);
  const progressPercentage = profile?.nextLevelPoints 
    ? Math.min(100, ((profile?.points || 0) / profile.nextLevelPoints) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Progress Tracking
          </CardTitle>
          <CardDescription>Your learning journey progress and milestones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Level Progress</span>
              <span className="font-semibold text-primary">
                {profile?.points || 0}/{profile?.nextLevelPoints || 500} points
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="text-xs text-muted-foreground mt-2 flex justify-between">
              <span>Level {profile?.level || 1}</span>
              <span>Level {profile?.level ? profile.level + 1 : 2}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{earnedBadges.length}</div>
              <div className="text-sm text-muted-foreground">Badges</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{profile?.streak || 0}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{profile?.attendance || 0}%</div>
              <div className="text-sm text-muted-foreground">Attendance</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Quick Stats</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Average Grade</span>
                <span className="font-medium">{profile?.averageGrade || 0}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Class Rank</span>
                <span className="font-medium">#{profile?.rank || 1} of {profile?.totalStudents || 1}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Points Earned</span>
                <span className="font-medium">{analytics?.activityPoints?.allTime || 0}</span>
              </div>
            </div>
          </div>

          <Button className="w-full">
            <Rocket className="h-4 w-4 mr-2" />
            View Daily Challenges
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activities
          </CardTitle>
          <CardDescription>Your recent achievements and activities</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.slice(0, 5).map((activity: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'badge' ? 'bg-yellow-100 text-yellow-600' :
                      activity.type === 'assignment' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'streak' ? 'bg-green-100 text-green-600' :
                      activity.type === 'quiz' ? 'bg-purple-100 text-purple-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {activity.type === 'badge' && <Medal className="h-5 w-5" />}
                      {activity.type === 'assignment' && <Lightbulb className="h-5 w-5" />}
                      {activity.type === 'streak' && <Zap className="h-5 w-5" />}
                      {activity.type === 'quiz' && <Target className="h-5 w-5" />}
                      {activity.type === 'attendance' && <CheckCircle className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{activity.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {activity.description || 'Earned points'}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 font-semibold">
                    +{activity.points}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 space-y-2">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h4 className="font-medium">No Recent Activities</h4>
              <p className="text-sm text-muted-foreground">Complete assignments and participate to earn points!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Badges Component
const BadgesView: React.FC<{ badges: any[] }> = ({ badges }) => {
  const earnedBadges = badges.filter((badge: any) => badge.earned);
  const availableBadges = badges.filter((badge: any) => !badge.earned);

  return (
    <div className="space-y-6">
      {/* Earned Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Medal className="h-5 w-5" />
            Earned Badges ({earnedBadges.length})
          </CardTitle>
          <CardDescription>Badges you've unlocked through your achievements</CardDescription>
        </CardHeader>
        <CardContent>
          {earnedBadges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {earnedBadges.map((badge: any) => (
                <div key={badge.id} className="text-center p-5 border-2 border-yellow-400 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-5xl mb-3">{badge.icon || '🏆'}</div>
                  <div className="font-bold text-lg mb-1">{badge.name}</div>
                  <div className="text-sm text-muted-foreground mb-3 min-h-[40px]">{badge.description}</div>
                  <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-200">
                    +{badge.points} points
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Medal className="h-10 w-10 text-muted-foreground" />
              </div>
              <h4 className="font-medium">No Badges Yet</h4>
              <p className="text-sm text-muted-foreground">Earn badges by completing achievements and activities</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Badges */}
      {availableBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Available Badges ({availableBadges.length})
            </CardTitle>
            <CardDescription>Badges you can still earn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {availableBadges.map((badge: any) => (
                <div key={badge.id} className="text-center p-5 border-2 border-gray-200 rounded-xl bg-gray-50 opacity-70 hover:opacity-90 transition-opacity">
                  <div className="text-5xl mb-3 text-gray-400">{badge.icon || '🔒'}</div>
                  <div className="font-bold text-lg mb-1 text-gray-600">{badge.name}</div>
                  <div className="text-sm text-gray-500 mb-3 min-h-[40px]">{badge.description}</div>
                  <Badge variant="outline" className="bg-white text-gray-500">
                    Locked
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Leaderboard Component
const LeaderboardView: React.FC<{ 
  leaderboard: any[]; 
  currentStudentName: string 
}> = ({ leaderboard, currentStudentName }) => {
  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Class Leaderboard
        </CardTitle>
        <CardDescription>See how you rank among your classmates</CardDescription>
      </CardHeader>
      <CardContent>
        {leaderboard.length > 0 ? (
          <div className="space-y-6">
            {/* Top 3 Podium */}
            {topThree.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {topThree.map((student, index) => {
                  const isCurrent = student.name === currentStudentName;
                  const height = index === 0 ? 'h-48' : index === 1 ? 'h-40' : 'h-32';
                  const bgColor = index === 0 
                    ? 'bg-gradient-to-b from-yellow-400 to-yellow-500' 
                    : index === 1 
                    ? 'bg-gradient-to-b from-gray-400 to-gray-500' 
                    : 'bg-gradient-to-b from-orange-400 to-orange-500';
                  
                  return (
                    <div key={student.rank} className={`relative ${height} ${bgColor} rounded-t-2xl flex flex-col items-center justify-end p-4 text-white`}>
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-lg font-bold">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>
                      </div>
                      <Avatar className="h-16 w-16 mb-3 border-4 border-white/30">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback className="text-lg">
                          {student.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <div className="font-bold truncate max-w-full">{student.name}</div>
                        {isCurrent && (
                          <Badge className="mt-1 bg-white/20 hover:bg-white/30">You</Badge>
                        )}
                        <div className="text-sm opacity-90">{student.points.toLocaleString()} pts</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Rest of Leaderboard */}
            <div className="space-y-2">
              {rest.map((student: any) => {
                const isCurrent = student.name === currentStudentName;
                return (
                  <div key={student.rank} className={`flex items-center justify-between p-4 rounded-lg ${
                    isCurrent 
                      ? 'bg-primary/10 border-2 border-primary/30' 
                      : 'bg-muted/50 hover:bg-muted transition-colors'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        student.rank <= 3 ? 'hidden' :
                        isCurrent ? 'bg-primary text-primary-foreground' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        #{student.rank}
                      </div>
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>
                          {student.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          {student.name}
                          {isCurrent && (
                            <Badge variant="default" className="h-5 text-xs">You</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          Level {student.level}
                          <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                          {student.points.toLocaleString()} points
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{student.points.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 space-y-3">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Users className="h-10 w-10 text-muted-foreground" />
            </div>
            <h4 className="font-medium">No Leaderboard Data</h4>
            <p className="text-sm text-muted-foreground">Leaderboard data will be available soon</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Rewards Component

// Rewards Component - Updated to show ALL rewards
const RewardsView: React.FC<{ 
  rewards: any[]; 
  studentPoints: number; 
  onRedeem: (reward: any) => void 
}> = ({ rewards, studentPoints, onRedeem }) => {
  console.log('RewardsView - rewards:', rewards);
  console.log('RewardsView - studentPoints:', studentPoints);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Available Rewards</h3>
        <p className="text-muted-foreground mb-6">
          Redeem your points for exciting rewards! Earn more points by completing assignments, maintaining attendance, and achieving badges.
        </p>
      </div>

      {rewards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward: any) => {
            const canAfford = studentPoints >= reward.cost;
            const isAvailable = reward.available;
            
            return (
              <Card key={reward.id} className={`${!isAvailable ? 'opacity-80' : ''} border-2 ${canAfford && isAvailable ? 'border-green-500/20' : 'border-gray-200/50'} hover:shadow-lg transition-all`}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{reward.name}</span>
                    {!isAvailable && (
                      <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{reward.cost}</div>
                    <div className="text-sm text-muted-foreground">points required</div>
                  </div>
                  
                  <div className="text-center text-sm">
                    <div className="mb-2">
                      Your points: <span className={`font-bold ${canAfford ? 'text-green-600' : 'text-orange-600'}`}>
                        {studentPoints.toLocaleString()}
                      </span>
                    </div>
                    
                    {!canAfford && (
                      <div className="text-orange-600 font-medium">
                        Need {reward.cost - studentPoints} more points
                      </div>
                    )}
                    
                    {isAvailable && !canAfford && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Keep earning points to unlock this reward
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={() => isAvailable && onRedeem(reward)}
                    disabled={!isAvailable || !canAfford}
                    className={`w-full ${
                      isAvailable && canAfford 
                        ? 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600' 
                        : ''
                    }`}
                    size="lg"
                  >
                    {!isAvailable ? 'Coming Soon' :
                     !canAfford ? 'Need More Points' : 
                     'Redeem Now'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 space-y-3">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Gem className="h-10 w-10 text-muted-foreground" />
          </div>
          <h4 className="font-medium">No Rewards Available</h4>
          <p className="text-sm text-muted-foreground">Check back later for available rewards</p>
        </div>
      )}
      
      {/* Points Summary */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-lg mb-1">How to Earn Points</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Complete assignments: +10 points each</li>
                <li>• Perfect attendance: +50 points weekly</li>
                <li>• Achieve high grades: +5 points per A</li>
                <li>• Earn badges: +25-100 points each</li>
              </ul>
            </div>
            <div className="text-center md:text-right">
              <div className="text-2xl font-bold text-primary">{studentPoints.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Points Earned</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationPage;