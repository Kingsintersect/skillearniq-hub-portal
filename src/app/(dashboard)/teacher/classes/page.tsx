'use client';

import { CoursesGridView } from './components/courses/CoursesGridView';
import { CoursesTableView } from './components/courses/CoursesTableView';
import { useCategories } from './hooks/use-categories';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid3x3, List } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function CoursesPage() {
  const { view, setView, courses } = useCategories();

  return (
    <div className="min-h-screen container space-y-6">
      {/* Header */}
      <Card className="bg-card text-card-foreground border-border">
        <CardContent className="pt-6 bg-card">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Assigned Courses</h1>
            <p className="text-muted-foreground">
              Browse Your asigned courses
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Courses Section */}
      <Card className="bg-card text-card-foreground border-border">
        <CardHeader className="border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-primary">Available Courses</CardTitle>
              <CardDescription className="text-muted-foreground">
                {courses.length > 0
                  ? <>{`${courses.length} courses assigned`}</>
                  : <span className='text-red'>'No courses assinged'</span>
                }
              </CardDescription>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <Tabs value={view} onValueChange={(v) => setView(v as 'grid' | 'list')}>
                  <TabsList className="bg-muted">
                    <TabsTrigger
                      value="grid"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <Grid3x3 className="h-4 w-4 mr-2" />
                      Grid
                    </TabsTrigger>
                    <TabsTrigger
                      value="list"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <List className="h-4 w-4 mr-2" />
                      List
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
        </CardHeader>

        <Separator className="bg-border" />

        <CardContent className="pt-6 bg-card">
          {view === 'grid' ? <CoursesGridView /> : <CoursesTableView />}
        </CardContent>
      </Card>

      {/* Mobile View Toggle */}
      <div className="fixed bottom-6 right-6 sm:hidden">
        <Button
          size="icon"
          onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
          className="rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {view === 'grid' ? (
            <List className="h-5 w-5" />
          ) : (
            <Grid3x3 className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}



