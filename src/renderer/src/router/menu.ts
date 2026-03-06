import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  type LucideIcon
} from 'lucide-vue-next'

export interface ProjectItem {
  name: string
  url: string
  icon: LucideIcon
}

export interface TeamItem {
  name: string
  logo: LucideIcon
  plan: string
}

export interface UserItem {
  name: string
  email: string
  avatar: string
}

export interface SidebarData {
  user: UserItem
  teams: TeamItem[]
  projects: ProjectItem[]
}

export const sidebarData: SidebarData = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg'
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise'
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup'
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free'
    }
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map
    }
  ]
}
