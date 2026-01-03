/**
 * Admin dashboard
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@daleel/ui";
import Link from "next/link";
import { Button } from "@daleel/ui";

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/${locale}/admin/login`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Welcome, {session.user.email} ({session.user.role})
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Candidates</CardTitle>
              <CardDescription>Manage candidates</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/${locale}/admin/candidates`}>
                <Button variant="outline" className="w-full">
                  Manage Candidates
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lists</CardTitle>
              <CardDescription>Manage electoral lists</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/${locale}/admin/lists`}>
                <Button variant="outline" className="w-full">
                  Manage Lists
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sources</CardTitle>
              <CardDescription>Manage sources</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/${locale}/admin/sources`}>
                <Button variant="outline" className="w-full">
                  Manage Sources
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submissions</CardTitle>
              <CardDescription>Review candidate submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/${locale}/admin/submissions`}>
                <Button variant="outline" className="w-full">
                  Review Submissions
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>View audit logs</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/${locale}/admin/audit`}>
                <Button variant="outline" className="w-full">
                  View Audit Log
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

