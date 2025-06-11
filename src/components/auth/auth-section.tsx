'use client'

import {useAuthStore} from "@/lib/auth-store";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {ArrowRight, KeyRound} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export function AuthSection() {
    const {isAuthenticated, isLoading, login, user} = useAuthStore();
    const router = useRouter()

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    if (isAuthenticated) {
        return (
            <section className="py-24 bg-gray-50">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            Welcome back, {user?.name || user?.preferred_username}!
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            You&#39;re already authenticated. Access your dashboard to continue.
                        </p>
                        <div className="mt-10">
                            <Button
                                onClick={() => router.push('/dashboard')}
                                size="lg"
                                className="bg-indigo-600 hover:bg-indigo-700"
                            >
                                Go to Dashboard
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        );
    } else if (!isAuthenticated) {
        login().then(r => {
            router.push('/dashboard');
        });
    }


    return (
        <section className="py-24 bg-gray-50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Ready to get started?
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Experience secure authentication with enterprise-grade features.
                    </p>
                </div>

                <div className="mx-auto mt-16 max-w-md">
                    <Card className="shadow-xl border-0">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">Sign In</CardTitle>
                            <CardDescription>
                                Access the secure dashboard with Keycloak authentication
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={login}
                                disabled={isLoading}
                                className="w-full h-12 text-base font-medium bg-indigo-600 hover:bg-indigo-700"
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                        <span>Signing in...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <KeyRound className="h-4 w-4" />
                                        <span>Sign in with Keycloak</span>
                                    </div>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}