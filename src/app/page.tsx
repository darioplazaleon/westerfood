import {Suspense} from "react";
import PageLoader from "@/components/ui/page-loader";
import {AuthSection} from "@/components/auth/auth-section";

export default function Home() {
    return (
        <div className="min-h-screen">
            <Suspense fallback={<PageLoader/>}>
                <AuthSection/>
            </Suspense>
        </div>

    );
}
