'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Trophy, 
  Star, 
  Award, 
  TrendingUp, 
  Users, 
  Calendar,
  Zap,
  Target,
  Crown,
  Medal,
  Shield,
  Rocket,
  Gem,
  Lightbulb
} from 'lucide-react';
import { useStudentQueries } from '@/hooks/useStudentQueries';

export const GamificationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'leaderboard' | 'rewards'>('overview');
  const [showCongratulation, setShowCongratulation] = useState(false);
  const [newBadge, setNewBadge] = useState<any>(null);

  const { useGamificationData, useRedeemReward } = useStudentQueries();
  const { data: gamificationResponse, isLoading, error } = useGamificationData();
  const redeemRewardMutation = useRedeemReward();

  const gamificationData = gamificationResponse?.data;
  const { profile, badges, leaderboard, rewards, recentActivities } = gamificationData || {};

  // Simulate earning a new badge
  useEffect(() => {
    if (badges) {
      const unearnedBadges = badges.filter((badge: any) => !badge.earned);
      if (unearnedBadges.length > 0 && Math.random() > 0.7) {
        const randomBadge = unearnedBadges[Math.floor(Math.random() * unearnedBadges.length)];
        setTimeout(() => {
          setNewBadge(randomBadge);
          setShowCongratulation(true);
          toast.success(`Congratulations! You earned the ${randomBadge.name} badge!`);
        }, 2000);
      }
    }
  }, [badges]);

  const handleRedeemReward = (reward: any) => {
    if (profile && profile.points >= reward.cost) {
      redeemRewardMutation.mutate(reward.id);
    } else {
      toast.error(`Not enough points for ${reward.name}. Need ${reward.cost - (profile?.points || 0)} more points.`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div>Loading gamification data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12">
            <Trophy className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Data</h3>
            <p className="text-muted-foreground">Failed to load gamification data. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!gamificationData) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Data Available</h3>
            <p className="text-muted-foreground">No gamification data available at the moment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const earnedBadges = badges?.filter((badge: any) => badge.earned) || [];
  const pointsToNextLevel = (profile?.nextLevelPoints || 0) - (profile?.points || 0);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <Trophy className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Gamification Hub</h1>
          <p className="text-lg text-muted-foreground">Level up your learning journey with points, badges, and rewards!</p>
        </div>

        {/* Congratulation Popup */}
        {showCongratulation && newBadge && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="max-w-md mx-4">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                  {newBadge.icon}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Congratulations!</h3>
                <p className="text-muted-foreground mb-4">You earned a new badge!</p>
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg mb-4">
                  <div className="text-2xl font-bold">{newBadge.name}</div>
                  <div className="text-sm">{newBadge.description}</div>
                </div>
                <Button onClick={() => setShowCongratulation(false)} className="w-full">
                  Awesome! 🎉
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Level</p>
                  <p className="text-2xl font-bold text-foreground">#{profile?.level}</p>
                  <Progress value={((profile?.points || 0) / (profile?.nextLevelPoints || 1)) * 100} className="mt-2" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {pointsToNextLevel} points to next level
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                  <p className="text-2xl font-bold text-foreground">{profile?.points}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-muted-foreground">Active streak: {profile?.streak} days</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Badges Earned</p>
                  <p className="text-2xl font-bold text-foreground">{earnedBadges.length}/{badges?.length || 0}</p>
                  <div className="text-sm text-muted-foreground mt-1">Collection progress</div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Class Rank</p>
                  <p className="text-2xl font-bold text-foreground">#{profile?.rank}</p>
                  <div className="text-sm text-muted-foreground mt-1">Top {Math.round(((profile?.rank || 0) / (profile?.totalStudents || 1)) * 100)}%</div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <Crown className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center space-x-2">
              <Medal className="h-4 w-4" />
              <span>Badges</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Leaderboard</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center space-x-2">
              <Gem className="h-4 w-4" />
              <span>Rewards</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <GamificationOverview 
              profile={profile}
              badges={badges ?? []}
              leaderboard={leaderboard ?? []}
              recentActivities={recentActivities ?? []}
            />
          </TabsContent>

          <TabsContent value="badges">
            <BadgesView badges={badges ?? []} />
          </TabsContent>

          <TabsContent value="leaderboard">
            <LeaderboardView leaderboard={leaderboard ?? []} currentStudentName={profile?.name ?? ''} />
          </TabsContent>

          <TabsContent value="rewards">
            <RewardsView 
              rewards={rewards ?? []} 
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
}> = ({ profile, badges, leaderboard, recentActivities }) => {
  const earnedBadges = badges?.filter((badge: any) => badge.earned) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Tracking</CardTitle>
          <CardDescription>Your learning journey progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Level Progress</span>
              <span>{profile?.points}/{profile?.nextLevelPoints} points</span>
            </div>
            <Progress value={((profile?.points || 0) / (profile?.nextLevelPoints || 1)) * 100} className="h-3" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{earnedBadges.length}</div>
              <div className="text-sm text-muted-foreground">Badges Earned</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{profile?.streak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
          </div>

          <div className="text-center">
            <Button>
              <Rocket className="h-4 w-4 mr-2" />
              View Daily Challenges
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Points earned from recent activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities?.map((activity: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'badge' ? 'bg-yellow-100 text-yellow-600' :
                    activity.type === 'assignment' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'streak' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {activity.type === 'badge' && <Medal className="h-4 w-4" />}
                    {activity.type === 'assignment' && <Lightbulb className="h-4 w-4" />}
                    {activity.type === 'streak' && <Zap className="h-4 w-4" />}
                    {activity.type === 'quiz' && <Target className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{activity.title}</div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  +{activity.points}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Badges Component
const BadgesView: React.FC<{ badges: any[] }> = ({ badges }) => {
  const earnedBadges = badges?.filter((badge: any) => badge.earned) || [];
  const availableBadges = badges?.filter((badge: any) => !badge.earned) || [];

  return (
    <div className="space-y-6">
      {/* Earned Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Earned Badges ({earnedBadges.length})</CardTitle>
          <CardDescription>Badges you've unlocked through your achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {earnedBadges.map((badge: any) => (
              <div key={badge.id} className="text-center p-4 border-2 border-yellow-400 rounded-lg bg-yellow-50">
                <div className="text-4xl mb-2">{badge.icon}</div>
                <div className="font-semibold mb-1">{badge.name}</div>
                <div className="text-sm text-muted-foreground mb-2">{badge.description}</div>
                <Badge variant="default" className="bg-green-100 text-green-700">
                  +{badge.points} pts
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Available Badges ({availableBadges.length})</CardTitle>
          <CardDescription>Badges you can still earn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableBadges.map((badge: any) => (
              <div key={badge.id} className="text-center p-4 border-2 border-gray-200 rounded-lg bg-gray-50 opacity-60">
                <div className="text-4xl mb-2">{badge.icon}</div>
                <div className="font-semibold mb-1">{badge.name}</div>
                <div className="text-sm text-muted-foreground mb-2">{badge.description}</div>
                <Badge variant="outline">Locked</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Leaderboard Component
const LeaderboardView: React.FC<{ leaderboard: any[]; currentStudentName: string }> = ({ 
  leaderboard, 
  currentStudentName 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Leaderboard</CardTitle>
        <CardDescription>See how you rank among your classmates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboard?.map((student: any) => (
            <div key={student.rank} className={`flex items-center justify-between p-3 rounded-lg ${
              student.name === currentStudentName ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  student.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                  student.rank === 2 ? 'bg-gray-100 text-gray-600' :
                  student.rank === 3 ? 'bg-orange-100 text-orange-600' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {student.rank}
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{student.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{student.name}</div>
                  <div className="text-xs text-muted-foreground">Level {student.level}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{student.points} pts</div>
                <div className="text-xs text-muted-foreground">
                  {student.rank === 1 ? '🥇 Champion' : 
                   student.rank === 2 ? '🥈 Runner-up' : 
                   student.rank === 3 ? '🥉 Third' : `Rank #${student.rank}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Rewards Component
const RewardsView: React.FC<{ 
  rewards: any[]; 
  studentPoints: number; 
  onRedeem: (reward: any) => void 
}> = ({ rewards, studentPoints, onRedeem }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {rewards?.map((reward: any) => (
        <Card key={reward.id} className={reward.available ? '' : 'opacity-50'}>
          <CardHeader>
            <CardTitle className="text-lg">{reward.name}</CardTitle>
            <CardDescription>{reward.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-3">
              <div className="text-2xl font-bold text-primary">{reward.cost} points</div>
              <div className="text-sm text-muted-foreground">
                You have: {studentPoints} points
              </div>
              <Button 
                onClick={() => onRedeem(reward)}
                disabled={!reward.available || studentPoints < reward.cost}
                className="w-full"
              >
                {!reward.available ? 'Coming Soon' :
                 studentPoints < reward.cost ? 'Need More Points' : 'Redeem Reward'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GamificationPage;