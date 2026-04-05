import Link from 'next/link';
import { FileText, Inbox, ListChecks, MessageSquare } from 'lucide-react';

type AdminConsoleSection = 'review' | 'articles' | 'comments' | 'inbox';

const items: Array<{
  key: AdminConsoleSection;
  href: string;
  title: string;
  description: string;
  icon: typeof ListChecks;
}> = [
  {
    key: 'review',
    href: '/admin/review',
    title: '待審核',
    description: '待審文章與待審留言',
    icon: ListChecks,
  },
  {
    key: 'articles',
    href: '/admin/articles',
    title: '文章管理',
    description: '全部文章與已上架內容',
    icon: FileText,
  },
  {
    key: 'comments',
    href: '/admin/comments',
    title: '留言管理',
    description: '全部留言與審核狀態',
    icon: MessageSquare,
  },
  {
    key: 'inbox',
    href: '/admin/inbox',
    title: '收件匣',
    description: '私密傳訊與聯絡表單',
    icon: Inbox,
  },
];

export default function AdminConsoleNav({ current }: { current: AdminConsoleSection }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.key === current;

        return (
          <Link
            key={item.key}
            href={item.href}
            className={`rounded-2xl border p-4 transition-all ${
              active
                ? 'border-[#CFE1AB] bg-[#F9FBE7] shadow-sm'
                : 'border-[#E8E0D4] bg-white hover:border-[#D6E3BA] hover:bg-[#FFFEFC] hover:shadow-sm'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                  active ? 'bg-[#E3EED3] text-[#3D5220]' : 'bg-[#F5F1E8] text-[#8A8078]'
                }`}
              >
                <Icon size={20} />
              </div>
              <div className="min-w-0 space-y-1">
                <p className="text-base font-black text-[#2D2A26]">{item.title}</p>
                <p className="text-sm font-medium leading-relaxed text-[#6B6358]">{item.description}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
