export const metadata = {
  title: 'TaskFlow - Tingkatkan Produktivitas',
  description: 'Platform manajemen tugas terbaik',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}