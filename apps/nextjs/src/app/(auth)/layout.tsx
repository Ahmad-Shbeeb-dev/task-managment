interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="container flex h-screen items-center justify-center">
      {children}
    </main>
  );
}
