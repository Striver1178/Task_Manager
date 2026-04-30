import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderIcon, ClipboardDocumentListIcon, CheckCircleIcon,
  ExclamationTriangleIcon, ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { format, isPast, isToday } from 'date-fns';
import { dashboardAPI } from '../api/dashboard';
import useAuthStore from '../context/authStore';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import { PageSpinner } from '../components/ui/Spinner';

const STATUS_COLORS = {
  TODO: '#475569',
  IN_PROGRESS: '#3b82f6',
  IN_REVIEW: '#a855f7',
  DONE: '#10b981',
};

function StatCard({ icon: Icon, label, value, sub, color = 'emerald', trend }) {
  const colors = {
    emerald: 'text-emerald-400 bg-emerald-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    red: 'text-red-400 bg-red-500/10',
  };
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
      <p className="text-sm text-dark-400">{label}</p>
      {sub && <p className="text-xs text-dark-600 mt-1">{sub}</p>}
    </div>
  );
}

function DueDateLabel({ date }) {
  if (!date) return null;
  const d = new Date(date);
  if (isPast(d) && !isToday(d)) {
    return <span className="text-xs text-red-400 font-medium">Overdue</span>;
  }
  if (isToday(d)) {
    return <span className="text-xs text-yellow-400 font-medium">Due today</span>;
  }
  return <span className="text-xs text-dark-500">{format(d, 'MMM d')}</span>;
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    dashboardAPI.get()
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner />;
  if (!data) return null;

  const { stats, myTasks, recentTasks, upcomingTasks, topProjects } = data;

  const pieData = Object.entries(stats.tasksByStatus)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ name: k.replace('_', ' '), value: v, key: k }));

  const completionRate = stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-white">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
          <span className="text-emerald-400">{user?.name?.split(' ')[0]}</span> 👋
        </h2>
        <p className="text-dark-400 mt-1">Here's what's happening across your projects.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FolderIcon} label="Active Projects" value={stats.activeProjects} sub={`${stats.totalProjects} total`} color="blue" />
        <StatCard icon={ClipboardDocumentListIcon} label="Total Tasks" value={stats.totalTasks} color="purple" />
        <StatCard icon={CheckCircleIcon} label="Completed" value={stats.completedTasks} sub={`${completionRate}% completion rate`} color="emerald" />
        <StatCard icon={ExclamationTriangleIcon} label="Overdue" value={stats.overdueTasks} color="red" />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Task status chart */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-dark-300 mb-4 flex items-center gap-2">
            <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-400" />
            Task Overview
          </h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {Object.entries(stats.tasksByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLORS[status] }} />
                      <span className="text-dark-400">{status.replace('_', ' ')}</span>
                    </div>
                    <span className="text-dark-200 font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-dark-500 text-sm">No tasks yet</div>
          )}
        </div>

        {/* My tasks */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-dark-300">My Tasks</h3>
            <Link to="/tasks" className="text-xs text-emerald-400 hover:text-emerald-300">View all →</Link>
          </div>
          {myTasks.length === 0 ? (
            <div className="text-center py-8 text-dark-500 text-sm">No tasks assigned</div>
          ) : (
            <div className="space-y-3">
              {myTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 bg-dark-800/50 rounded-lg hover:bg-dark-800 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-dark-100 font-medium truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-dark-500" style={{ color: task.project?.color }}>
                        {task.project?.name}
                      </span>
                      <DueDateLabel date={task.dueDate} />
                    </div>
                  </div>
                  <PriorityBadge priority={task.priority} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming deadlines */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-dark-300">Due This Week</h3>
          </div>
          {upcomingTasks.length === 0 ? (
            <div className="text-center py-8 text-dark-500 text-sm">Nothing due this week 🎉</div>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-dark-100 truncate">{task.title}</p>
                    <p className="text-xs text-dark-500 mt-0.5">{task.project?.name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <DueDateLabel date={task.dueDate} />
                    {task.assignee && <Avatar name={task.assignee.name} size="xs" className="mt-1 ml-auto" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active projects */}
      {topProjects.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white">Active Projects</h3>
            <Link to="/projects" className="text-sm text-emerald-400 hover:text-emerald-300">View all →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="card-hover p-4 block"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: project.color }} />
                  <h4 className="text-sm font-semibold text-white truncate">{project.name}</h4>
                </div>
                <div className="progress-bar mb-2">
                  <div className="progress-fill" style={{ width: `${project.progress}%` }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-dark-500">{project.progress}% complete</span>
                  <div className="flex -space-x-1">
                    {project.members.slice(0, 3).map((m) => (
                      <Avatar key={m.userId} name={m.user.name} size="xs" className="ring-1 ring-dark-900" />
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent activity */}
      {recentTasks.length > 0 && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-dark-300 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentTasks.slice(0, 6).map((task) => (
              <div key={task.id} className="flex items-center gap-3">
                <Avatar name={task.creator?.name || task.assignee?.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-dark-200">
                    <span className="font-medium">{task.creator?.name}</span>
                    {' '}updated{' '}
                    <span className="text-white font-medium">{task.title}</span>
                  </p>
                  <p className="text-xs text-dark-500">{task.project?.name}</p>
                </div>
                <StatusBadge status={task.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
