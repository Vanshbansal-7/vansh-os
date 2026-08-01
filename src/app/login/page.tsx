import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border/60 shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-4">
            <span className="font-bold text-2xl">V</span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Vansh OS</CardTitle>
          <CardDescription>Authentication placeholder for Phase 6</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-center text-muted-foreground mb-4">
            Connect your Supabase project in <code className="bg-secondary px-1 py-0.5 rounded">.env.local</code> to enable real authentication.
          </p>
          <form action="/auth/login" method="post">
            <Button className="w-full" type="submit" disabled>
              Sign In with GitHub
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
