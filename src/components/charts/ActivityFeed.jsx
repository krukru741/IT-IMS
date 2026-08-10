import React from 'react';
import { mockActivity } from '../../data/mockData';
import {
  UserCheck, Plus, AlertTriangle, Download, Archive, Wrench,
} from 'lucide-react';

const iconMap = {
  assign:  { Icon: UserCheck, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  add:     { Icon: Plus,       color: '#4F46E5', bg: 'rgba(79,70,229,0.1)' },
  repair:  { Icon: Wrench,     color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  warning: { Icon: AlertTriangle, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  import:  { Icon: Download,   color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  retire:  { Icon: Archive,    color: '#64748B', bg: 'rgba(100,116,139,0.1)' },
};

export default function ActivityFeed({ limit = 6 }) {
  const items = mockActivity.slice(0, limit);

  return (
    <div className="activity-feed" role="log" aria-label="Recent activity">
      {items.map((item, idx) => {
        const { Icon, color, bg } = iconMap[item.type] || iconMap.add;
        return (
          <div className="activity-item" key={item.id}
            style={{ animationDelay: `${idx * 40}ms` }}>
            <div
              className="activity-icon"
              style={{ background: bg, color }}
              aria-hidden="true"
            >
              <Icon size={13} />
            </div>
            <div className="activity-content">
              <div
                className="activity-text"
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
              <div className="activity-time">{item.time}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
