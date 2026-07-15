import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { FetchBoards, Board } from "@/services/board_services";
import { FetchLists } from "@/services/list_services";
import { FetchTasksByFilter, FetchTaskCount } from "@/services/task_services";
import { FetchAllTags } from "@/services/tag_services";
import { Task } from "@/types/task";
import { List } from "@/types/list";
import { Tag } from "@/types/tag";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  ListTodo,
  CheckCircle2,
  Clock,
  Tags,
  ArrowRight,
  Layout,
  CircleDot,
} from "lucide-react";

export function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const [boards, setBoards] = useState<Board[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [boardsRes, listsRes, recentRes, upcomingRes, completedRes, tagsRes, countRes] =
          await Promise.all([
            FetchBoards(),
            FetchLists(),
            FetchTasksByFilter("recent"),
            FetchTasksByFilter("upcoming"),
            FetchTasksByFilter("completed"),
            FetchAllTags(),
            FetchTaskCount(),
          ]);

        setBoards(boardsRes || []);
        setLists(listsRes?.lists || []);
        setRecentTasks(recentRes?.tasks || []);
        setUpcomingTasks(upcomingRes?.tasks || []);
        setCompletedCount(completedRes?.tasks?.length || 0);
        setTotalTasks(countRes?.count || 0);
        setTags(tagsRes || []);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const stats = [
    {
      label: "Boards",
      value: boards.length,
      icon: LayoutDashboard,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Lists",
      value: lists.length,
      icon: ListTodo,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      label: "Total Tasks",
      value: totalTasks,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Completed",
      value: completedCount,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Buenos dias";
    if (h < 18) return "Buenas tardes";
    return "Buenas noches";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {getGreeting()}, {user?.username || "there"}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your workspace
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="py-4">
            <CardContent className="flex items-center gap-4">
              <div className={`${s.bg} p-3 rounded-lg`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Recent Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No recent tasks
                </p>
              ) : (
                recentTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <CircleDot
                      className={`h-4 w-4 flex-shrink-0 ${
                        task.is_completed
                          ? "text-emerald-500"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`flex-1 text-sm ${
                        task.is_completed
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {task.title}
                    </span>
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex gap-1">
                        {task.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0"
                            style={{ backgroundColor: tag.color + "20", color: tag.color }}
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                Upcoming Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcomingTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No upcoming tasks
                </p>
              ) : (
                upcomingTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <CircleDot className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span className="flex-1 text-sm text-foreground">
                      {task.title}
                    </span>
                    {task.due_date && (
                      <Badge variant="outline" className="text-[10px]">
                        {new Date(task.due_date).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Layout className="h-4 w-4 text-muted-foreground" />
                Boards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {boards.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No boards yet
                </p>
              ) : (
                boards.slice(0, 4).map((board) => (
                  <a
                    key={board.id}
                    href={`/board/${board.id}`}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-accent transition-colors group"
                  >
                    <span className="text-sm font-medium">{board.title}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Tags className="h-4 w-4 text-muted-foreground" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tags.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No tags yet
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 8).map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="text-xs"
                      style={{
                        backgroundColor: tag.color + "20",
                        color: tag.color,
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ListTodo className="h-4 w-4 text-muted-foreground" />
                Lists
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {lists.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No lists yet
                </p>
              ) : (
                lists.slice(0, 4).map((list) => (
                  <a
                    key={list.id}
                    href={`/list/${list.id}`}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-accent transition-colors group"
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: list.color }}
                    />
                    <span className="flex-1 text-sm font-medium truncate">
                      {list.title}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
