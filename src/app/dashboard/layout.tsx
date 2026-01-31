import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - NeuroSantulan',
  description: 'Patient dashboard for NeuroSantulan',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
