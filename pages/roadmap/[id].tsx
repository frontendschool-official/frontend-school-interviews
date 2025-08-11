import React, { useMemo, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ProgressBar";
import { useRoadmapView } from "@/hooks/useRoadmapView";
import { useRoadmapUI } from "@/hooks/useRoadmapUI";
import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";
import { RoadmapProblem } from "@/types/roadmap";


// Skeleton Components
const HeaderSkeleton = () => (
  <div className="mb-6 sm:mb-8">
    <div className="flex justify-between items-start mb-4 sm:mb-6 p-4 sm:p-6 bg-secondary rounded-2xl border border-border shadow-lg md:flex-row flex-col gap-4 text-center md:text-left">
      <div className="flex-1">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-border rounded-2xl animate-pulse"></div>
          <div className="w-48 h-8 bg-border rounded animate-pulse"></div>
        </div>
        <div className="w-96 h-4 bg-border rounded animate-pulse"></div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-32 h-10 bg-border rounded-xl animate-pulse"></div>
        <div className="w-32 h-10 bg-border rounded-xl animate-pulse"></div>
        <div className="w-32 h-10 bg-border rounded-xl animate-pulse"></div>
      </div>
    </div>

    {/* Roadmap Meta Skeleton */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {[1, 2, 3, 4].map((index) => (
        <div key={index} className="bg-secondary px-6 py-4 rounded-2xl border border-border text-center shadow-lg">
          <div className="w-16 h-8 bg-border rounded mb-2 animate-pulse mx-auto"></div>
          <div className="w-20 h-4 bg-border rounded animate-pulse mx-auto"></div>
        </div>
      ))}
    </div>

    {/* Progress Bar Skeleton */}
    <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
      <div className="w-full h-4 bg-border rounded-full animate-pulse"></div>
    </div>
  </div>
);

const DayNavigationSkeleton = () => (
  <Card className="shadow-xl border-2">
    <div className="p-6 sm:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-border rounded-xl animate-pulse"></div>
        <div className="w-24 h-6 bg-border rounded animate-pulse"></div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="p-4 sm:p-5 rounded-2xl border-2 border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="w-16 h-6 bg-border rounded animate-pulse"></div>
              <div className="w-8 h-4 bg-border rounded animate-pulse"></div>
            </div>
            <div className="w-full h-4 bg-border rounded mb-3 animate-pulse"></div>
            <div className="w-full h-4 bg-border rounded animate-pulse"></div>
            <div className="flex items-center justify-between mt-3">
              <div className="w-20 h-3 bg-border rounded animate-pulse"></div>
              <div className="w-16 h-3 bg-border rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Card>
);

const OverviewSkeleton = () => (
  <Card className="shadow-xl border-2">
    <div className="p-6 sm:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-border rounded-xl animate-pulse"></div>
        <div className="w-20 h-6 bg-border rounded animate-pulse"></div>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-primary/5 rounded-2xl border-2 border-primary/20">
            <div className="w-12 h-8 bg-border rounded mb-2 animate-pulse mx-auto"></div>
            <div className="w-20 h-3 bg-border rounded animate-pulse mx-auto"></div>
          </div>
          <div className="text-center p-4 bg-secondary rounded-2xl border-2 border-border">
            <div className="w-12 h-8 bg-border rounded mb-2 animate-pulse mx-auto"></div>
            <div className="w-16 h-3 bg-border rounded animate-pulse mx-auto"></div>
          </div>
        </div>
        <div>
          <div className="w-24 h-4 bg-border rounded mb-4 animate-pulse"></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="w-20 h-8 bg-border rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </Card>
);

const DayHeaderSkeleton = () => (
  <Card className="shadow-xl border-2">
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <div className="flex items-start space-x-6 mb-6">
          <div className="w-16 h-16 bg-border rounded-2xl animate-pulse flex-shrink-0"></div>
          <div className="flex-1">
            <div className="w-64 h-8 bg-border rounded mb-3 animate-pulse"></div>
            <div className="w-full h-4 bg-border rounded animate-pulse"></div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
          <div className="w-24 h-10 bg-border rounded-xl animate-pulse"></div>
          <div className="w-32 h-10 bg-border rounded-xl animate-pulse"></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((index) => (
              <div key={index} className="w-20 h-8 bg-border rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-6">
          <div className="flex gap-2">
            {[1, 2, 3].map((index) => (
              <div key={index} className="w-20 h-10 bg-border rounded-lg animate-pulse"></div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 h-10 bg-border rounded-xl animate-pulse"></div>
            <div className="w-24 h-10 bg-border rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </Card>
);

const ProblemCardSkeleton = () => (
  <Card className="hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/20 group">
    <div className="p-6 sm:p-8">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start space-x-6 flex-1">
          <div className="w-16 h-16 bg-border rounded-2xl animate-pulse flex-shrink-0"></div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="w-64 h-6 bg-border rounded animate-pulse"></div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-border rounded animate-pulse"></div>
                <div className="w-20 h-4 bg-border rounded animate-pulse"></div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="w-20 h-8 bg-border rounded-xl animate-pulse"></div>
              <div className="w-16 h-8 bg-border rounded-xl animate-pulse"></div>
              <div className="w-24 h-4 bg-border rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-4 bg-border rounded mb-8 animate-pulse"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="w-24 h-5 bg-border rounded mb-4 animate-pulse"></div>
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3].map((index) => (
              <div key={index} className="w-20 h-8 bg-border rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
        <div>
          <div className="w-32 h-5 bg-border rounded mb-4 animate-pulse"></div>
          <ul className="space-y-3">
            {[1, 2, 3].map((index) => (
              <li key={index} className="flex items-start">
                <div className="w-2 h-2 bg-border rounded-full mr-3 mt-2 animate-pulse"></div>
                <div className="w-full h-4 bg-border rounded animate-pulse"></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </Card>
);

const TipsSkeleton = () => (
  <div className="mt-8 sm:mt-12">
    <Card className="shadow-xl border-2">
      <div className="p-6 sm:p-8">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-border rounded-2xl animate-pulse"></div>
          <div className="w-48 h-8 bg-border rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex items-start space-x-4 p-6 bg-secondary/50 rounded-2xl border border-border shadow-lg">
              <div className="w-10 h-10 bg-border rounded-xl animate-pulse flex-shrink-0"></div>
              <div className="w-full h-4 bg-border rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  </div>
);



const RoadmapViewPage: NextPage = () => {
  const router = useRouter();
  const {
    roadmap,
    selectedDay,
    loading,
    updatingProgress,
    setSelectedDay,
    updateProgress,
    isProblemCompleted,
    getProgressPercentage,
    currentDay,
  } = useRoadmapView();

  const { getDifficultyColor, getTypeLabel, getTypeColor } = useRoadmapUI();



  // Derived UI state
  const totalDays = roadmap?.dailyPlan?.length ?? 0;

  // Problem filters
  const [problemFilter, setProblemFilter] = useState<"all" | "incomplete" | "completed">("all");

  const currentDayStats = useMemo(() => {
    if (!roadmap || !currentDay) {
      return { total: 0, completed: 0, incomplete: 0 };
    }
    const total = currentDay.problems?.length ?? 0;
    let completed = 0;
    currentDay.problems?.forEach((_: RoadmapProblem, index: number) => {
      if (isProblemCompleted(`${currentDay.day}-${index}`)) completed++;
    });
    const incomplete = Math.max(0, total - completed);
    return { total, completed, incomplete };
  }, [roadmap, currentDay, isProblemCompleted]);

  const filteredProblems = useMemo(() => {
    if (!currentDay) return [] as RoadmapProblem[];
    if (problemFilter === "all") return currentDay.problems as RoadmapProblem[];
    return (currentDay.problems as RoadmapProblem[]).filter((_: RoadmapProblem, index: number) => {
      const done = isProblemCompleted(`${currentDay.day}-${index}`);
      return problemFilter === "completed" ? done : !done;
    });
  }, [currentDay, problemFilter, isProblemCompleted]);

  // Find the first day with any incomplete problems to resume from
  const resumeDay = useMemo(() => {
    if (!roadmap?.dailyPlan?.length) return 1;
    for (const day of roadmap.dailyPlan) {
      const total = day.problems?.length ?? 0;
      const completed = day.problems?.filter((_: RoadmapProblem, index: number) =>
        isProblemCompleted(`${day.day}-${index}`)
      ).length ?? 0;
      if (completed < total) return day.day;
    }
    return 1;
  }, [roadmap, isProblemCompleted]);

  const canPrev = selectedDay > 1;
  const canNext = selectedDay < totalDays;
  const goPrevDay = () => canPrev && setSelectedDay(selectedDay - 1);
  const goNextDay = () => canNext && setSelectedDay(selectedDay + 1);
  const handleResume = () => setSelectedDay(resumeDay);

  // Show skeleton loading when roadmap is loading
  if (loading || !roadmap) {
    return (
      <Layout isLoading={false}>
        <div className="max-w-7xl mx-auto p-4 min-h-screen bg-bodyBg">
          <HeaderSkeleton />
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 lg:gap-12">
            <div className="xl:col-span-1">
              <div className="sticky top-8 space-y-6">
                <DayNavigationSkeleton />
                <OverviewSkeleton />
              </div>
            </div>
            <div className="xl:col-span-3">
              <div className="space-y-8">
                <DayHeaderSkeleton />
                <div className="space-y-6">
                  {[1, 2, 3].map((index) => (
                    <ProblemCardSkeleton key={index} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <TipsSkeleton />
        </div>
      </Layout>
    );
  }

  return (
    <Layout isLoading={false}>
      <div className="max-w-7xl mx-auto p-4 min-h-screen bg-bodyBg">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between items-start mb-4 sm:mb-6 p-4 sm:p-6 bg-secondary rounded-2xl border border-border shadow-lg md:flex-row flex-col gap-4 text-center md:text-left">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                {/* <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">🗺️</span>
                </div> */}
                <h1 className="text-2xl sm:text-3xl font-bold text-neutralDark">
                  {roadmap?.title}
                </h1>
              </div>
              <p className="text-text opacity-80 text-xs sm:text-sm">
                {roadmap?.description}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              {totalDays > 0 && (
                <Button variant="secondary" onClick={handleResume}>
                  Resume Day {resumeDay}
                </Button>
              )}
              <Button variant="secondary" onClick={() => router.push("/roadmap")}>
                ← Back to Roadmaps
              </Button>
              <Button onClick={() => router.push("/problems")}>
                Start Practicing →
              </Button>
            </div>
          </div>

          {/* Roadmap Meta */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-secondary px-6 py-4 rounded-2xl border border-border text-center shadow-lg">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                {roadmap?.designation}
              </div>
              <div className="text-sm text-text opacity-70 font-medium">Target Role</div>
            </div>
            <div className="bg-secondary px-6 py-4 rounded-2xl border border-border text-center shadow-lg">
              <div className="text-2xl sm:text-3xl font-bold text-neutralDark mb-2">
                {roadmap?.companies?.join(", ")}
              </div>
              <div className="text-sm text-text opacity-70 font-medium">Companies</div>
            </div>
            <div className="bg-secondary px-6 py-4 rounded-2xl border border-border text-center shadow-lg">
              <div className="text-2xl sm:text-3xl font-bold text-neutralDark mb-2">
                {roadmap?.duration} days
              </div>
              <div className="text-sm text-text opacity-70 font-medium">Duration</div>
            </div>
            <div className="bg-secondary px-6 py-4 rounded-2xl border border-border text-center shadow-lg">
              <div className="text-2xl sm:text-3xl font-bold text-neutralDark mb-2">
                {roadmap?.overview?.totalTime}
              </div>
              <div className="text-sm text-text opacity-70 font-medium">Total Time</div>
            </div>
          </div>

          {/* Progress Bar */}
          {roadmap?.progress && (
            <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
              <ProgressBar
                current={roadmap?.progress?.completedProblemsCount}
                total={roadmap?.overview?.totalProblems}
                label="Your Progress"
                showCount={true}
                showPercentage={true}
              />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 lg:gap-12">
          {/* Sidebar - Day Navigation */}
          <div className="xl:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Day Navigation */}
              <Card className="shadow-xl border-2">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                      <span className="text-primary font-bold">📅</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-neutralDark">
                      Daily Plan
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {roadmap?.dailyPlan?.map((day) => (
                      <div
                        key={day?.day}
                        className={`p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                          selectedDay === day?.day
                            ? "bg-primary/10 border-primary/30 shadow-xl scale-105"
                            : "hover:bg-secondary/50 border-transparent hover:border-border hover:scale-102"
                        }`}
                        onClick={() => setSelectedDay(day?.day)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-bold text-neutralDark text-lg">
                            Day {day?.day}
                          </div>
                          {roadmap?.progress && (
                            <div className="text-sm text-text opacity-60 font-medium">
                              {
                                day?.problems?.filter((_, index) =>
                                  isProblemCompleted(`${day.day}-${index}`)
                                ).length
                              }
                              /{day?.problems?.length}
                            </div>
                          )}
                        </div>
                        <div className="text-sm sm:text-base text-text opacity-80 font-medium mb-3 line-clamp-2 leading-relaxed">
                          {day.title}
                        </div>
                        <div className="flex items-center justify-between text-xs sm:text-sm text-text opacity-60">
                          <span className="font-medium">{day?.problems?.length} problems</span>
                          <span className="font-medium">{day.totalTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Overview */}
              <Card className="shadow-xl border-2">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-blue-500 font-bold">📊</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-neutralDark">
                      Overview
                    </h3>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-primary/5 rounded-2xl border-2 border-primary/20">
                        <div className="text-2xl sm:text-3xl font-bold text-primary">
                          {roadmap?.overview?.totalProblems}
                        </div>
                        <div className="text-xs sm:text-sm text-text opacity-70 font-medium">
                          Total Problems
                        </div>
                      </div>
                      <div className="text-center p-4 bg-secondary rounded-2xl border-2 border-border">
                        <div className="text-2xl sm:text-3xl font-bold text-neutralDark">
                          {roadmap?.overview?.totalTime}
                        </div>
                        <div className="text-xs sm:text-sm text-text opacity-70 font-medium">
                          Total Time
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm sm:text-base font-bold text-neutralDark mb-4">
                        Focus Areas
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {roadmap?.overview?.focusAreas?.map(
                          (area: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-2 bg-secondary text-xs sm:text-sm rounded-xl text-text opacity-80 font-medium border border-border"
                            >
                              {area}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3">
            {currentDay && (
              <div className="space-y-8">
                {/* Day Header */}
                <Card className="shadow-xl border-2">
                  <div className="p-6 sm:p-8">
                    <div className="mb-8">
                      <div className="flex items-start space-x-6 mb-6">
                        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary font-bold text-2xl sm:text-3xl flex-shrink-0">
                          {currentDay?.day}
                        </div>
                        <div className="flex-1">
                          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutralDark mb-3">
                            {currentDay?.title}
                          </h2>
                          <p className="text-text opacity-70 text-base sm:text-lg leading-relaxed">
                            {currentDay?.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
                        <div className="flex items-center space-x-3 bg-primary/10 px-4 py-3 rounded-xl border border-primary/20">
                          <span className="text-primary font-bold">⏱️</span>
                          <span className="font-semibold text-primary">
                            {currentDay?.totalTime}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 bg-secondary px-4 py-3 rounded-xl border border-border">
                          <span className="text-neutralDark font-bold">📝</span>
                          <span className="font-semibold text-neutralDark">
                            {currentDay?.problems?.length} problems
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {currentDay?.focusAreas?.map(
                            (area: string, index: number) => (
                              <span
                                key={index}
                                className="px-3 py-2 bg-primary/10 text-primary text-xs sm:text-sm rounded-xl font-medium border border-primary/20"
                              >
                                {area}
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      {/* Toolbar: Filters and Day Navigation */}
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-6">
                        <Tabs
                          items={[
                            { id: "all", label: "All", count: currentDayStats.total },
                            { id: "incomplete", label: "Incomplete", count: currentDayStats.incomplete },
                            { id: "completed", label: "Completed", count: currentDayStats.completed },
                          ]}
                          activeTab={problemFilter}
                          onTabChange={(tabId) => setProblemFilter(tabId as typeof problemFilter)}
                        />
                        <div className="flex items-center gap-2">
                          <Button variant="secondary" onClick={goPrevDay} disabled={!canPrev} leftIcon={<span>←</span>}>
                            Prev Day
                          </Button>
                          <Button onClick={goNextDay} disabled={!canNext} rightIcon={<span>→</span>}>
                            Next Day
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Problems */}
                <div className="space-y-6">
                  {filteredProblems.length === 0 && (
                    <Card className="border-2">
                      <div className="p-8 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary mb-4">
                          <span className="text-2xl">🎉</span>
                        </div>
                        <h4 className="text-xl font-bold text-neutralDark mb-2">Nothing to show here</h4>
                        <p className="text-text opacity-70">Try switching the filter or move to the next day.</p>
                      </div>
                    </Card>
                  )}
                  {filteredProblems.map((problem: RoadmapProblem, index: number) => {
                    // Map index from filtered array back to original array index for completion state
                    const originalIndex = currentDay?.problems?.indexOf(problem) ?? index;
                    const problemId = `${currentDay?.day}-${originalIndex}`;
                    const isCompleted = isProblemCompleted(problemId);

                    return (
                      <Card
                        key={index}
                        className={`${
                          isCompleted ? "border-green-500/30 bg-green-50/5" : ""
                        } hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/20 group`}
                      >
                        <div className="p-6 sm:p-8">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-start space-x-6 flex-1">
                              <div
                                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0 ${
                                  isCompleted
                                    ? "bg-green-500/20 text-green-600"
                                    : "bg-primary/10 text-primary"
                                }`}
                              >
                                {isCompleted
                                  ? "✓"
                                  : getTypeLabel(problem.type).charAt(0)}
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                                  <h3 className="text-xl sm:text-2xl font-bold text-neutralDark group-hover:text-primary transition-colors duration-300">
                                    {problem.title}
                                  </h3>
                                  {roadmap?.progress && (
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={isCompleted}
                                        onChange={(e) =>
                                          updateProgress(
                                            problemId,
                                            e.target.checked
                                          )
                                        }
                                        disabled={updatingProgress}
                                        className="w-6 h-6 text-primary bg-bodyBg border-2 border-border rounded-lg focus:ring-4 focus:ring-primary/20 transition-all duration-200"
                                      />
                                      <span className="text-sm sm:text-base font-semibold text-text opacity-70">
                                        {isCompleted
                                          ? "Completed"
                                          : "Mark Complete"}
                                      </span>
                                    </label>
                                  )}
                                </div>

                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                  <span
                                    className={`px-4 py-2 text-sm sm:text-base rounded-xl border-2 font-semibold ${getTypeColor(
                                      problem?.type
                                    )}`}
                                  >
                                    {getTypeLabel(problem?.type)}
                                  </span>
                                  <span
                                    className={`px-4 py-2 text-sm sm:text-base rounded-xl border-2 font-semibold ${getDifficultyColor(
                                      problem?.difficulty
                                    )}`}
                                  >
                                    {problem?.difficulty}
                                  </span>
                                  <span className="text-sm sm:text-base text-text opacity-70 font-medium">
                                    {problem?.estimatedTime}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <p className="text-text opacity-70 text-base sm:text-lg leading-relaxed mb-8">
                            {problem.description}
                          </p>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                              <div className="text-base sm:text-lg font-bold text-neutralDark mb-4">
                                Focus Areas
                              </div>
                              <div className="flex flex-wrap gap-3">
                                {problem?.focusAreas?.map(
                                  (area: string, areaIndex: number) => (
                                    <span
                                      key={areaIndex}
                                      className="px-4 py-2 bg-secondary text-sm rounded-xl text-text opacity-70 font-medium border border-border"
                                    >
                                      {area}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>

                            <div>
                              <div className="text-base sm:text-lg font-bold text-neutralDark mb-4">
                                Learning Objectives
                              </div>
                              <ul className="space-y-3">
                                {problem.learningObjectives.map(
                                  (objective: string, objIndex: number) => (
                                    <li
                                      key={objIndex}
                                      className="text-sm sm:text-base text-text opacity-70 flex items-start"
                                    >
                                      <span className="mr-3 text-primary font-bold text-lg mt-0.5">
                                        •
                                      </span>
                                      {objective}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        {roadmap?.tips?.length && roadmap?.tips?.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <Card className="shadow-xl border-2">
              <div className="p-6 sm:p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center">
                    <span className="text-yellow-500 font-bold text-xl">💡</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-neutralDark">
                    Tips for Success
                  </h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  {roadmap?.tips?.map((tip, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-6 bg-secondary/50 rounded-2xl border border-border shadow-lg"
                    >
                      <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-lg">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-base sm:text-lg text-text opacity-70 leading-relaxed">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RoadmapViewPage;
