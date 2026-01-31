import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Doctor Dashboard - NeuroSantulan',
  description: 'Doctor dashboard for NeuroSantulan',
}

export default function DoctorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
